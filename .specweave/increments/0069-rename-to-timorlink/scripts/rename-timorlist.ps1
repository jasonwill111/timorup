# Rename TimorList to TimorLink
# Usage: .\rename.ps1

$ErrorActionPreference = "Continue"

Write-Host "Starting rename: TimorList -> TimorLink" -ForegroundColor Cyan

# Files to process (source only, exclude node_modules, .git, dist)
$IncludeExtensions = @("*.ts", "*.tsx", "*.astro", "*.js", "*.mjs", "*.cjs", "*.json", "*.yml", "*.yaml", "*.md")
$ExcludeDirs = @("node_modules", ".git", "dist", ".astro", "test-results", ".wrangler")

# Patterns to replace (case insensitive where noted)
$Replacements = @(
    @{ Pattern = "TimorList"; Replace = "TimorLink"; CaseSensitive = $true },
    @{ Pattern = "timorlist"; Replace = "timorlink"; CaseSensitive = $true }
)

# Directories to skip entirely
$SkipDirs = @("node_modules", ".git", "dist", ".wrangler", "test-results")

Write-Host "`nFinding files to process..." -ForegroundColor Yellow

$Files = Get-ChildItem -Path . -Recurse -File -Include $IncludeExtensions | Where-Object {
    $FullPath = $_.FullName
    $Skip = $false
    foreach ($Dir in $SkipDirs) {
        if ($FullPath -match [regex]::Escape($Dir)) {
            $Skip = $true
            break
        }
    }
    !$Skip
}

Write-Host "Found $($Files.Count) files to process" -ForegroundColor Green

$ChangedFiles = @()
$Errors = @()

foreach ($File in $Files) {
    try {
        $Content = Get-Content $File.FullName -Raw -ErrorAction SilentlyContinue
        if (-not $Content) { continue }

        $Modified = $false
        $NewContent = $Content

        foreach ($Replacement in $Replacements) {
            if ($Replacement.CaseSensitive) {
                if ($NewContent -match $Replacement.Pattern) {
                    $NewContent = $NewContent -replace $Replacement.Pattern, $Replacement.Replace
                    $Modified = $true
                }
            } else {
                if ($NewContent -imatch $Replacement.Pattern) {
                    $NewContent = $NewContent -ireplace $Replacement.Pattern, $Replacement.Replace
                    $Modified = $true
                }
            }
        }

        if ($Modified) {
            Set-Content -Path $File.FullName -Value $NewContent -ErrorAction Stop
            $ChangedFiles += $File.FullName
        }
    }
    catch {
        $Errors += "$($File.FullName): $($_.Exception.Message)"
    }
}

Write-Host "`n======================================" -ForegroundColor Cyan
Write-Host "Rename Complete!" -ForegroundColor Green
Write-Host "Files changed: $($ChangedFiles.Count)" -ForegroundColor White

if ($ChangedFiles.Count -gt 0) {
    Write-Host "`nChanged files:" -ForegroundColor Yellow
    $ChangedFiles | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
}

if ($Errors.Count -gt 0) {
    Write-Host "`nErrors:" -ForegroundColor Red
    $Errors | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
}

Write-Host "`n======================================" -ForegroundColor Cyan