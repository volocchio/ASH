param(
    [string]$m = "Update ASH site",
    [switch]$NoPush
)

$repo = Split-Path -Leaf (Get-Location)
$sshKey = "/home/honeybadger/.ssh/id_ed25519"
$vpsUser = "root"
$vpsHost = "185.164.110.65"
$vpsPath = "/var/www/ash"

# Git add, commit, push
git add -A
git commit -m $m
if (-not $NoPush) {
    git push
}

# SSH to VPS: pull latest
wsl ssh -i $sshKey "$vpsUser@$vpsHost" "cd $vpsPath && git pull origin master && echo 'Deployed to $vpsPath'"

# Update apps portal
wsl ssh -i $sshKey "$vpsUser@$vpsHost" "if [ -x /usr/local/bin/sync-and-update-portal.sh ]; then /usr/local/bin/sync-and-update-portal.sh; fi"

$deployedAt = Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'
Write-Host "`nDeployed to /var/www/ash at $deployedAt" -ForegroundColor Green
