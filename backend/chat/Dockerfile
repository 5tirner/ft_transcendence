FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y build-essential libpq-dev \
    libdbus-1-dev libdbus-glib-1-dev pkg-config libcairo2-dev vim netcat-traditional && \
    apt-get clean

COPY ./requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt


COPY . /app/

CMD [ "/app/start.sh" ]
