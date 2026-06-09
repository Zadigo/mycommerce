ARG GO_VERSION=1

FROM golang:${GO_VERSION}-alpine AS build-stage

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o server .

FROM alpine:latest AS builder

WORKDIR /app

COPY --from=build-stage /app/server .
COPY --from=build-stage /app/.env .

EXPOSE 9000

CMD [ "./server" ]
