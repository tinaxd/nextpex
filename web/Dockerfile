FROM python:3.8-alpine

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN apk add -u gcc musl-dev mariadb-dev
RUN pip install -r requirements.txt
COPY . ./
# RUN rm -f db.sqlite3

ENV PRODUCTION=1
CMD ["sh", "begin.sh"]
