include .env

all:
# make 하면 dist 폴더 만드는 과정 추가해야함. << 파일 없어서 도커 빌드 실패함
	# make generate-certs
	make certs;
	make prod;

certs: frontend/certs
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $(LOCAL_SSL_CERT_KEY_PATH) -out $(LOCAL_SSL_CERT_PATH) -subj "/C=US/ST=State/L=City/O=Organization/CN=$(DOMAIN_NAME)"

frontend/certs:
	mkdir frontend/certs

re-prod:
	make clean-prod; make prod

re-prod-front:
	docker compose -f docker-compose.prod.yml down --remove-orphans frontend
	docker compose -f docker-compose.prod.yml up -d --build frontend

re-dev:
	make clean-dev; make dev

up-dev:
	docker compose -f docker-compose.dev.yml up -d

up-prod:
	docker compose -f docker-compose.prod.yml up -d

down-dev:
	docker compose -f docker-compose.dev.yml down --remove-orphans

down-prod:
	docker compose -f docker-compose.prod.yml down --remove-orphans

build-dev:
	docker compose -f docker-compose.dev.yml build

build-prod:
	docker compose -f docker-compose.prod.yml build

dev:
	docker compose -f docker-compose.dev.yml up -d --build

prod:
	docker compose -f docker-compose.prod.yml up -d --build

clean-dev:
	docker compose -f docker-compose.dev.yml down --remove-orphans
	docker volume rm $(docker volume ls -qf dangling=true)
	docker rmi $(docker images -f "dangling=true" -q)

clean-prod:
	docker compose -f docker-compose.prod.yml down --remove-orphans
	docker volume rm $(docker volume ls -qf dangling=true)
	docker rmi $(docker images -f "dangling=true" -q)

clean-certs:
	rm -f $(LOCAL_SSL_CERT_KEY_PATH) $(LOCAL_SSL_CERT_PATH)

restart-dev:
	docker compose -f docker-compose.dev.yml restart

restart-prod:
	docker compose -f docker-compose.prod.yml restart

logs-dev:
	docker compose -f docker-compose.dev.yml logs

logs-prod:
	docker compose -f docker-compose.prod.yml logs
