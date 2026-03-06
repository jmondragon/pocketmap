# Build stage
FROM node:22-alpine AS builder

WORKDIR /build

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

# Go build stage
FROM golang:1.24-alpine AS go-builder

WORKDIR /build

COPY go.mod go.sum ./
RUN go mod download

COPY . .
COPY --from=builder /build/dist ./frontend/dist

RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o pocketmap .

# Runtime stage
FROM alpine:3.21

WORKDIR /app

COPY --from=go-builder /build/pocketmap ./

RUN mkdir -p tiles pb_data

EXPOSE 8090

ENV PB_HTTP_PORT=8090
ENV PB_FILES_DIR=/app/pb_data

CMD ["./pocketmap", "serve", "--http=0.0.0.0:8090"]
