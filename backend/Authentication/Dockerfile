FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y build-essential libpq-dev \
    libdbus-1-dev libdbus-glib-1-dev pkg-config libcairo2-dev vim && \
    apt-get clean

COPY ./requirments.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirments.txt

COPY . /app/

RUN chmod 744 /app/start.sh

CMD [ "/app/start.sh" ]
