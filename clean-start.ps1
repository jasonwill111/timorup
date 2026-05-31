# clean-start.ps1 - Start wrangler with completely clean environment
# Clear ALL proxy-related environment variables including Machine-level

# Get current Machine-level proxy (read-only, we can't modify it here)
$machineProxy = [Environment]::GetEnvironmentVariable('HTTP_PROXY', 'Machine')
Write-Host "Machine-level HTTP_PROXY: $machineProxy"

# We need to use env: prefix for Process-level to override Machine-level
$env:HTTP_PROXY = ''
$env:HTTPS_PROXY = ''
$env:http_proxy = ''
$env:https_proxy = ''
$env:NO_PROXY = '*'

# Also try unsetting at registry level (requires admin, will fail silently)
# [Environment]::SetEnvironmentVariable('HTTP_PROXY', '', 'Machine')  # Won't work without admin

Write-Host "Process-level HTTP_PROXY: '$($env:HTTP_PROXY)'"

# Now spawn wrangler in a new process with this clean environment
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = 'node.exe'
$psi.Arguments = 'node_modules/wrangler/bin/wrangler.js dev dist/server/entry.mjs --port 4326 --remote'
$psi.WorkingDirectory = 'D:\Dev Projects\timorup'
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true

# Build environment without proxy
$cleanEnv = @{}
$cleanEnv['PATH'] = [Environment]::GetEnvironmentVariable('PATH', 'Machine')
$cleanEnv['PATHEXT'] = [Environment]::GetEnvironmentVariable('PATHEXT', 'Machine')
$cleanEnv['SystemRoot'] = [Environment]::GetEnvironmentVariable('SystemRoot', 'Machine')
$cleanEnv['TEMP'] = [Environment]::GetEnvironmentVariable('TEMP', 'Machine')
$cleanEnv['TMP'] = [Environment]::GetEnvironmentVariable('TMP', 'Machine')
$cleanEnv['USERPROFILE'] = [Environment]::GetEnvironmentVariable('USERPROFILE', 'Machine')
$cleanEnv['USERNAME'] = [Environment]::GetEnvironmentVariable('USERNAME', 'Machine')
$cleanEnv['NODE_PATH'] = [Environment]::GetEnvironmentVariable('NODE_PATH', 'Machine')
$cleanEnv['HOME'] = $env:USERPROFILE

# These MUST be empty to bypass proxy
$cleanEnv['HTTP_PROXY'] = ''
$cleanEnv['HTTPS_PROXY'] = ''
$cleanEnv['http_proxy'] = ''
$cleanEnv['https_proxy'] = ''
$cleanEnv['NO_PROXY'] = '*'

# Apply to process start info
$psi.EnvironmentVariables.Clear()
foreach ($k in $cleanEnv.Keys) {
    $psi.EnvironmentVariables[$k] = $cleanEnv[$k]
}

Write-Host "Starting wrangler with clean environment..."
$proc = [System.Diagnostics.Process]::Start($psi)

# Wait for wrangler to start
Start-Sleep 75

# Check if listening
$listening = Get-NetTCPConnection -LocalPort 4326 -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' }
Write-Host "`nListening on 4326: $($listening.Count)"

if ($listening.Count -gt 0) {
    Write-Host "SUCCESS! Server is listening!"
    
    # Test connection
    try {
        $wc = New-Object System.Net.WebClient
        $wc.Proxy = $null  # Explicitly set no proxy for WebClient
        $html = $wc.DownloadString('http://127.0.0.1:4326/')
        Write-Host "Content length: $($html.Length)"
        Write-Host "Preview: $($html.Substring(0, [Math]::Min(300, $html.Length)) -replace '`n', ' ')"
    } catch {
        Write-Host "Download error: $($_.Exception.Message)"
    }
} else {
    Write-Host "Server not listening"
    
    # Check process output
    $stdout = ''
    $stderr = ''
    if (-not $proc.HasExited) {
        $stdout = $proc.StandardOutput.ReadToEnd()
        $stderr = $proc.StandardError.ReadToEnd()
    }
    Write-Host "Process exited: $($proc.HasExited), Exit code: $($proc.ExitCode)"
    if ($stdout) { Write-Host "STDOUT: $($stdout.Substring(0, [Math]::Min(1000, $stdout.Length)))" }
    if ($stderr) { Write-Host "STDERR: $($stderr.Substring(0, [Math]::Min(500, $stderr.Length)))" }
}