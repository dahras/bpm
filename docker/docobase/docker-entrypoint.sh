#!/bin/sh
set -e

echo "COMMIT_HASH: $(cat /app/commit_hash.txt)"

export NOCOBASE_RUNNING_IN_DOCKER=true

if [ -f /opt/libreoffice24.8.zip ] && [ ! -d /opt/libreoffice24.8 ]; then
  echo "Unzipping /opt/libreoffice24.8.zip..."
  unzip /opt/libreoffice24.8.zip -d /opt/
fi

if [ -f /opt/instantclient_19_25.zip ] && [ ! -d /opt/instantclient_19_25 ]; then
  echo "Unzipping /opt/instantclient_19_25.zip..."
  unzip /opt/instantclient_19_25.zip -d /opt/
  echo "/opt/instantclient_19_25" > /etc/ld.so.conf.d/oracle-instantclient.conf
  ldconfig
fi

if [ ! -d "/app/docobase" ]; then
  mkdir docobase
fi

if [ ! -f "/app/docobase/package.json" ]; then
  echo 'copying...'
  tar -zxf /app/docobase.tar.gz --absolute-names -C /app/docobase
  touch /app/docobase/node_modules/@docobase/app/dist/client/index.html
fi

cd /app/docobase && yarn docobase create-nginx-conf
cd /app/docobase && yarn docobase generate-instance-id
rm -rf /etc/nginx/sites-enabled/docobase.conf
ln -s /app/docobase/storage/docobase.conf /etc/nginx/sites-enabled/docobase.conf

nginx
echo 'nginx started';

# run scripts in storage/scripts
if [ -d "/app/docobase/storage/scripts" ]; then
  for f in /app/docobase/storage/scripts/*.sh; do
    echo "Running $f"
    sh "$f"
  done
fi

cd /app/docobase && yarn start --quickstart

# Run command with node if the first argument contains a "-" or is not a system command. The last
# part inside the "{}" is a workaround for the following bug in ash/dash:
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=874264
if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
  set -- node "$@"
fi

exec "$@"
