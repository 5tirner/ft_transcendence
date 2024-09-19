# Stage 1: Build stage
FROM python:3.12-slim as builder

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y build-essential libpq-dev netcat-traditional \
    libdbus-1-dev libdbus-glib-1-dev pkg-config libcairo2-dev && \
    apt-get clean

COPY ./requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Final stage
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app


RUN apt-get update && \
    apt-get install -y netcat-traditional && \
    apt-get clean

COPY --from=builder /root/.local /root/.local
COPY . /app/

ENV PATH=/root/.local/bin:$PATH

CMD [ "/app/start.sh" ]
