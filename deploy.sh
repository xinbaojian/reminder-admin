#强制推送
#!/usr/bin/env bash
set -e
npm run build
scp -r dist root@8.140.17.32:/root/compose/subscription
