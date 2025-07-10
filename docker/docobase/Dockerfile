FROM node:20-bookworm-slim as builder

ARG CNA_VERSION

WORKDIR /app

RUN cd /app \
  && yarn config set network-timeout 600000 -g \
  && npx -y create-docobase-app@${CNA_VERSION} my-docobase-app --skip-dev-dependencies -a -e APP_ENV=production \
  && cd /app/my-docobase-app \
  && yarn install --production \
  && rm -rf yarn.lock \
  && find node_modules -type f -name "yarn.lock" -delete \
  && find node_modules -type f -name "bower.json" -delete \
  && find node_modules -type f -name "composer.json" -delete

RUN cd /app \
  && rm -rf docobase.tar.gz \
  && tar -zcf ./docobase.tar.gz -C /app/my-docobase-app .

FROM node:20-bookworm-slim

# COPY ./sources.list /etc/apt/sources.list
RUN ARCH= && dpkgArch="$(dpkg --print-architecture)" \
  && case "${dpkgArch##*-}" in \
  amd64) ARCH='x64';; \
  ppc64el) ARCH='ppc64le';; \
  s390x) ARCH='s390x';; \
  arm64) ARCH='arm64';; \
  armhf) ARCH='armv7l';; \
  i386) ARCH='x86';; \
  *) echo "unsupported architecture"; exit 1 ;; \
  esac \
  && set -ex \
  # libatomic1 for arm
  && apt-get update && apt-get install -y nginx libaio1

RUN rm -rf /etc/nginx/sites-enabled/default
COPY --from=builder /app/docobase.tar.gz /app/docobase.tar.gz

WORKDIR /app/docobase

COPY docker-entrypoint.sh /app/
# COPY docker-entrypoint.sh /usr/local/bin/
# ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 80/tcp

CMD ["/app/docker-entrypoint.sh"]