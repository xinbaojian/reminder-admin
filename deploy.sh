#强制推送
#!/usr/bin/env bash
set -e
pnpm run build
scp -r dist root@100.91.153.120:/usr/share/nginx/reminder/
