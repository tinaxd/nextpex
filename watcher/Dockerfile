FROM golang:1.18.0-alpine

WORKDIR /usr/src/app
COPY go.mod go.sum ./
RUN go mod download && go mod verify

CMD ["go", "run", "main.go"]