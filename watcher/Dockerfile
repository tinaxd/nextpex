FROM golang:1.18.0-alpine

RUN apk add --no-cache gcc musl-dev
RUN apk add curl

WORKDIR /usr/src/app
COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN go build -o /usr/local/bin/nextpex-watcher

COPY cronjob.sh crontab.txt entry.sh ./
RUN chmod 755 cronjob.sh entry.sh
RUN /usr/bin/crontab crontab.txt
CMD ["./entry.sh"]