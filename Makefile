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

re:
	make clean; make

re-front:
	docker compose -f docker-compose.yml down --remove-orphans frontend
	docker compose -f docker-compose.yml up -d --build frontend

up:
	docker compose -f docker-compose.yml up -d

down:
	docker compose -f docker-compose.yml down --remove-orphans


build:
	docker compose -f docker-compose.yml build


prod:
	docker compose -f docker-compose.yml up -d --build


clean:
	docker compose -f docker-compose.yml down --remove-orphans
	docker volume rm $(docker volume ls -qf dangling=true)
	docker rmi $(docker images -f "dangling=true" -q)

clean-certs:
	rm -f $(LOCAL_SSL_CERT_KEY_PATH) $(LOCAL_SSL_CERT_PATH)


restart:
	docker compose -f docker-compose.yml restart


logs:
	docker compose -f docker-compose.yml logs
