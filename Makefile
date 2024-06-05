IMG = $(shell docker images -a -q)
all : up

# creat dokcer images and run them in detached mode
up : create_data_dir
	docker compose -f docker-compose.yml up --build --force-recreate

# take down all the containers runing that defined in the docker-compose file
# and remove them
down : 
	docker compose -f docker-compose.yml down

# stop the containers
stop : 
	docker compose -f docker-compose.yml stop

# start the containers
start : 
	docker compose -f docker-compose.yml start

# display the runing containers
ps : 
	docker ps

ls :
	docker images

create_data_dir:
	[ -d ${HOME}/data/www ] || mkdir -p ${HOME}/data/www
	[ -d ${HOME}/data/postgres_db ] || mkdir -p ${HOME}/data/mariadb
	[ -d ${HOME}/data/test ] || mkdir -p ${HOME}/data/test

clean : down
	docker container prune --force
	docker rmi $(IMG)
