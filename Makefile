all:
	docker-compose up --build
clean:
	docker system prune -a

# BUILD	= docker-compose build

# UP		= docker-compose up

# STOP	= docker-compose stop

# DOWN	= docker-compose down

# WORKDIR	= cd srcs

# SHOW	= docker system df

# INFO	= @echo "Running Containers:" && docker ps && echo "Images:" && docker images && echo "Volumes:" && docker volume ls && echo "Networks:" && docker network ls 

# all:
# 	$(WORKDIR) && $(BUILD) && $(UP)

# build:
# 	$(WORKDIR) && $(BUILD)

# up :
# 	$(WORKDIR) && $(UP)

# stop :
# 	$(WORKDIR) && $(STOP)

# down :
# 	$(WORKDIR) && $(DOWN)

# info:
# 	$(INFO)

# show:
# 	$(SHOW)

# clean:
# 	docker system prune -a

# fclean: down clean

# re : down all