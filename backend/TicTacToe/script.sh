#!/bin/sh

# Function to check if the auth service is up
wait_for_auth() {
  while ! nc -z auth 8000; do
    echo "Waiting for auth service to be available..."
    sleep 1
  done
}

# Wait for the auth service to be available
wait_for_auth

python3 manage.py makemigrations && python3 manage.py migrate && python3 manage.py runserver 0.0.0.0:8000
