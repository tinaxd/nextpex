FROM python:3-alpine

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . ./
# RUN rm -f db.sqlite3

CMD ["sh", "begin.sh"]
