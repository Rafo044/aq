.PHONY: up down logs start stop main

up:
	docker compose up -d --build

down:
	docker compose down --volumes

logs:
	docker compose logs

start:
	docker compose start


stop:
	docker compose stop

init:
	sudo chmod +x init.sh
	./init.sh

main:
	sudo mkdir -p logs
	sudo chmod 777 logs/
	docker exec -it parser python main.py

activate_log:
	sudo chmod 777 acivate_log.sh
	./acivate_log.sh

ps:
	docker compose ps

run:
	docker exec -it datalineage npm run dev
