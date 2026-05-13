FROM golang:1.26.3-alpine3.23 AS build-stage

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o server .

FROM alpine:latest

WORKDIR /app

COPY --from=build-stage /app/server .
COPY --from=build-stage /app/.env .

EXPOSE 9000

CMD ["./server"]
