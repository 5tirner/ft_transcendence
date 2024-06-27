DC = docker compose -f docker-compose.yml

IMG = $(shell docker images -a -q)

all : up

# creat dokcer images and run them in detached mode

upd:
	$(DC) up -d

up : create_data_dir
	$(DC) up --build --force-recreate

# take down all the containers runing that defined in the docker-compose file
# and remove them
down : stop
	$(DC) down

# stop the containers
stop : 
	$(DC) stop

# start the containers
start : 
	$(DC) start

# display the runing containers
ps : 
	docker ps

ls :
	docker images

re: down up

create_data_dir:
	[ -d ${HOME}/data/www ] || mkdir -p ${HOME}/data/www
	[ -d ${HOME}/data/postgres_db ] || mkdir -p ${HOME}/data/postgres_db

clean : down
	docker container prune --force
	docker rmi $(IMG)
