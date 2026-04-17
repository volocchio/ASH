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

# SSH to VPS: pull latest and copy to static site dir
wsl ssh -i $sshKey "$vpsUser@$vpsHost" "cd /tmp && rm -rf ASH && git clone https://github.com/volocchio/ASH.git && rsync -av --delete --exclude='.git' --exclude='deploy.ps1' ASH/ $vpsPath/ && rm -rf /tmp/ASH && echo 'Deployed to $vpsPath'"
