const upstream = 'https://raw.githubusercontent.com/h16nning/skola/f8d89dafb3878192f53da02f827aa55e00b83e01';

export const preloadMac = `u=${upstream}; d="$(mktemp -d)" && cd "$d" && curl -fsSL --remote-name-all "$u/package.json" "$u/pnpm-lock.yaml" && npx --yes pnpm@10.28.2 fetch; cd ~ && rm -rf "$d"`;

export const preloadWindows = `$u = '${upstream}'; $d = Join-Path ([IO.Path]::GetTempPath()) ('skola-prefetch-' + [guid]::NewGuid()); New-Item -ItemType Directory $d | Out-Null; Set-Location $d; Invoke-WebRequest -UseBasicParsing "$u/package.json" -OutFile package.json; Invoke-WebRequest -UseBasicParsing "$u/pnpm-lock.yaml" -OutFile pnpm-lock.yaml; npx.cmd --yes pnpm@10.28.2 fetch; Set-Location $HOME; Remove-Item -Recurse -Force $d`;
