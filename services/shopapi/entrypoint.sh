#!/bin/sh
set -e

echo "Running collectstatic..."
# python manage.py collectstatic --noinput

echo "Running migrations..."
# python manage.py migrate --noinput

echo "Starting server..."
exec gunicorn shopapi.wsgi:application --bind 0.0.0.0:8000 --workers 4 --threads 2 --timeout 120 --access-logfile - --error-logfile -
