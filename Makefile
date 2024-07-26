up-dev:
	docker-compose -f docker-compose.dev.yml up -d

up-prod:
	docker-compose -f docker-compose.prod.yml up -d

down-dev:
	docker-compose -f docker-compose.dev.yml down --remove-orphans

down-prod:
	docker-compose -f docker-compose.prod.yml down --remove-orphans

build-dev:
	docker-compose -f docker-compose.dev.yml build

build-prod:
	docker-compose -f docker-compose.prod.yml build

dev:
	docker-compose -f docker-compose.dev.yml up -d --build

prod:
	docker-compose -f docker-compose.prod.yml up -d --build

clean-dev:
	docker-compose -f docker-compose.dev.yml down --remove-orphans
	docker volume rm $(docker volume ls -qf dangling=true)
	docker rmi $(docker images -f "dangling=true" -q)

clean-prod:
	docker-compose -f docker-compose.prod.yml down --remove-orphans
	docker volume rm $(docker volume ls -qf dangling=true)
	docker rmi $(docker images -f "dangling=true" -q)

restart-dev:
	docker-compose -f docker-compose.dev.yml restart

restart-prod:
	docker-compose -f docker-compose.prod.yml restart

logs-dev:
	docker-compose -f docker-compose.dev.yml logs

logs-prod:
	docker-compose -f docker-compose.prod.yml logs
