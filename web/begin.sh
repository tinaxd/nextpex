#!/bin/sh
sleep 10 && python manage.py migrate --noinput && python manage.py collectstatic --noinput && gunicorn -b 0.0.0.0:8000 oneapex.wsgi
