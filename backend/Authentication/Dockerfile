FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y build-essential libpq-dev \
    libdbus-1-dev libdbus-glib-1-dev pkg-config libcairo2-dev && \
    apt-get clean

COPY ./requirments.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirments.txt

COPY . /app/

# RUN python manage.py migrate
# RUN python manage.py collectstatic --noinput
#
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
