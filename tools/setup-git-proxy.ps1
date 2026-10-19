# Lets GitHub Desktop push through the organization's proxy using your Windows login
# (the same way the browser does). Run once via setup-git-proxy.bat.
# To undo: run this script with the word  undo  (setup-git-proxy.bat undo)
param([string]$Mode)
$ErrorActionPreference = 'Stop'

# Find the git that ships with GitHub Desktop (or any git on PATH)
$git = $null
$c = Get-ChildItem "$env:LOCALAPPDATA\GitHubDesktop\app-*\resources\app\git\cmd\git.exe" -ErrorAction SilentlyContinue |
     Sort-Object FullName -Descending | Select-Object -First 1
if ($c) { $git = $c.FullName }
if (-not $git) { $g = Get-Command git -ErrorAction SilentlyContinue; if ($g) { $git = $g.Source } }
if (-not $git) { throw 'Could not find git. Is GitHub Desktop installed?' }
Write-Host "Using git: $git"

if ($Mode -eq 'undo') {
  & $git config --global --unset http.proxy 2>$null
  & $git config --global --unset http.proxyAuthMethod 2>$null
  & $git config --global --unset http.postBuffer 2>$null
  & $git config --global --unset http.version 2>$null
  Write-Host 'Proxy settings removed.'
  exit 0
}

# Large uploads through a proxy break less often with a big buffer and plain HTTP/1.1.
& $git config --global http.postBuffer 524288000
& $git config --global http.version HTTP/1.1

$p = [Net.WebRequest]::GetSystemWebProxy().GetProxy([Uri]'https://github.com')
if ($p.Host -eq 'github.com') {
  Write-Host 'Upload settings updated. Windows reports no proxy for github.com, so no proxy was set.'
  exit 0
}
# Empty user and password (":@") tell git to log in to the proxy with your current Windows account.
$proxy = "http://:@$($p.Host):$($p.Port)"
& $git config --global http.proxy $proxy
& $git config --global http.proxyAuthMethod anyauth
Write-Host ''
Write-Host "Proxy set to $($p.Host):$($p.Port) using your Windows login."
Write-Host 'Now go back to GitHub Desktop and press Push origin (or Publish repository) again.'
