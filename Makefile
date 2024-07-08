DC = docker compose -f docker-compose.yml

IMG = $(shell docker images -a -q)

.PHONY:  up upd start down stop re  ps clean fclean

upd:
	@$(DC) up -d

up : 
	@$(DC) up --build --force-recreate


down : stop
	@$(DC) down --remove-orphans -v

stop : 
	@$(DC) stop

start : 
	@$(DC) start

ps : 
	@docker ps

ls :
	@docker images

re: down
	@$(DC) up --build -d

create_data_dir:
	[ -d ${HOME}/data/www ] || mkdir -p ${HOME}/data/www
	[ -d ${HOME}/data/postgres_db ] || mkdir -p ${HOME}/data/postgres_db

clean : down
	docker container prune --force
	docker rmi $(IMG)

fclean: down clean
	docker system prune -af

