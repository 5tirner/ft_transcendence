FROM python:3

#Python will no longer write these files to disk
ENV PYTHONDONTWRITEBYTECODE=1

#ensures that the python output i.e. the stdout and stderr streams are sent straight to terminal (e.g. your container log)
#without being first buffered and that you can see the output of your application
ENV PYTHONUNBUFFERED=1

WORKDIR /code

COPY requirements.txt /code/

RUN pip install -r requirements.txt

COPY ./gaming /code/

# COPY ./script.sh /bin

# RUN chmod +x /bin/script.sh

# CMD [ "script.sh" ]