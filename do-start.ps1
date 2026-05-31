# Start wrangler with clean environment
$env:HTTP_PROXY = ''
$env:HTTPS_PROXY = ''
$env:NO_PROXY = '*'

Write-Host "HTTP_PROXY set to empty"

# Start wrangler
$proc = Start-Process -FilePath 'node' -ArgumentList 'node_modules/wrangler/bin/wrangler.js','dev','dist/server/entry.mjs','--port','4328','--remote' -PassThru -RedirectStandardOutput wrangler_out.txt -RedirectStandardError wrangler_err.txt -NoNewWindow

Write-Host "Wrangler PID:" $proc.Id

# Wait 80 seconds
Start-Sleep 80

# Check if running
if (-not $proc.HasExited) {
    Write-Host "Still running after 80s"
    $listening = Get-NetTCPConnection -LocalPort 4328 -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' }
    Write-Host "Listening:" $listening.Count
    
    if ($listening.Count -gt 0) {
        Write-Host "SUCCESS!"
        $wc = New-Object System.Net.WebClient
        $wc.Proxy = $null
        $html = $wc.DownloadString('http://127.0.0.1:4328/')
        Write-Host "Length:" $html.Length
        Write-Host "Preview:" $html.Substring(0, 300)
    }
} else {
    Write-Host "Process exited with code:" $proc.ExitCode
}

# Read output files
Write-Host "=== STDOUT ==="
Get-Content wrangler_out.txt -Tail 50
Write-Host "=== STDERR ==="
Get-Content wrangler_err.txt -Tail 30