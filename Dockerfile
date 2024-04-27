FROM python:3.10-bullseye

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		postgresql-client \
	&& rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
RUN pip install djangorestframework
RUN pip install requests
RUN pip install django-allauth
COPY . .

EXPOSE 8000
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

# sudo systemctl restart docker.socket docker.service ------------> for force the container to stop
# sudo fuser -k 8000/tcp --------> case of bind address already used