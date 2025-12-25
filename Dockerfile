###############################################
#                 Base Stage                  #
###############################################
FROM cgr.dev/chainguard/wolfi-base:latest AS bun_wolfi_base

ENV CONTAINER_USER="nobin"
ENV BUN_INSTALL="/${CONTAINER_USER}/.bun"
ENV PATH="/${CONTAINER_USER}/.bun/bin:$PATH"

RUN \
    apk update --no-cache ;\
    apk upgrade --no-cache ;\
    apk add --no-cache libstdc++ ;\
    addgroup --system --gid 1001 ${CONTAINER_USER} ;\
    adduser --system --uid 1001 ${CONTAINER_USER} ;\
    mkdir -p /${CONTAINER_USER} ;\
    chown -R ${CONTAINER_USER}:${CONTAINER_USER} /${CONTAINER_USER}


###############################################
#                 Build Stage                 #
###############################################
FROM bun_wolfi_base AS bun_wolfi_build

WORKDIR /app
COPY . .

RUN \
    chown -R ${CONTAINER_USER}:${CONTAINER_USER} /app ;\
    apk add --no-cache bash curl ;\
    rm -rf .env.*

USER ${CONTAINER_USER}
RUN \
    curl -fsSL https://bun.sh/install | bash ;\
    bun -v ;\
    bun install ;\
    bun run build


###############################################
#                 Final Stage                 #
###############################################
FROM bun_wolfi_base AS bun_wolfi_run

WORKDIR /app

RUN apk add --no-cache curl

COPY --from=bun_wolfi_build /${CONTAINER_USER}/.bun /${CONTAINER_USER}/.bun
# Copy the standalone output from the build stage
COPY --from=bun_wolfi_build /app/.next/standalone ./
# Copy public assets and the static build
COPY --from=bun_wolfi_build /app/public ./public
COPY --from=bun_wolfi_build /app/.next/static ./.next/static

USER ${CONTAINER_USER}
EXPOSE 3000

CMD [ "sh", "-c", "bun server.js" ]
