up:
	docker-compose up -d

down:
	docker-compose down

dev:
	docker-compose -f docker-compose.dev.yml up -d --build

prod:
	docker-compose -f docker-compose.prod.yml up -d --build

logs:
	docker-compose logs
