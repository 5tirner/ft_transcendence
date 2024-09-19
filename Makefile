DC = docker compose -f docker-compose.yml

# IMG = $(shell docker images -a -q)

.PHONY:  up upd start down stop re  ps clean fclean

upd: down create_data_dir build
	@$(DC) up --no-attach server --build --force-recreate -d

up : down create_data_dir build
	@$(DC) up --no-attach server --build --force-recreate

build:
	@$(DC) build --force-rm --parallel

down : stop
	@$(DC) down --remove-orphans -v

stop : 
	@$(DC) stop

start : 
	@$(DC) start

re: down upd

create_data_dir:
	[ -d ${HOME}/data/www ] || mkdir -p ${HOME}/data/www
	[ -d ${HOME}/data/postgres_db ] || mkdir -p ${HOME}/data/postgres_db

clean : down
	docker container prune --force

fclean: clean
	docker system prune -af
