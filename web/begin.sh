#!/bin/sh
sleep 5 && python manage.py migrate && python manage.py collectstatic && gunicorn oneapex.wsgi
