const lock = 'https://raw.githubusercontent.com/h16nning/skola/f8d89dafb3878192f53da02f827aa55e00b83e01/pnpm-lock.yaml';

export const preloadMac = `mkdir -p ~/skola-prefetch && cd ~/skola-prefetch && curl -fsSLO ${lock} && npx --yes pnpm@10.28.2 fetch && cd ~ && rm -rf ~/skola-prefetch`;

export const preloadWindows = `$d = Join-Path $HOME 'skola-prefetch'; New-Item -ItemType Directory -Force $d | Out-Null; Set-Location $d; Invoke-WebRequest -UseBasicParsing -Uri '${lock}' -OutFile 'pnpm-lock.yaml'; npx.cmd --yes pnpm@10.28.2 fetch; Set-Location $HOME; Remove-Item -Recurse -Force $d`;
