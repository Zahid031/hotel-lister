#!/bin/sh

# Run migrations
python manage.py migrate

# Start Django dev server
python manage.py runserver 0.0.0.0:8001
