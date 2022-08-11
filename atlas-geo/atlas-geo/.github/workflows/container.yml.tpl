serviceName: ${SERVICE_NAME}
containers:
  tileserver:
    environment:
      DATABASE_URL: "postgres://${DATABASE_USER}:${DATABASE_PASSWORD_ENCODED}@${DATABASE_HOST}/${DATABASE_NAME}"
      TS_HTTPPORT: "${TILESERVER_PORT}"
      TS_HTTPHOST: "127.0.0.1"
    image: "pramsey/pg_tileserv"
    ports:
      "${TILESERVER_PORT}": HTTP
publicEndpoint:
  containerName: tileserver
  containerPort: ${TILESERVER_PORT}
  healthCheck:
    path: /
    timeoutSeconds: 15
    healthyThreshold: 2
    unhealthyThreshold: 3
    intervalSeconds: 20
    successCodes: 200-499
