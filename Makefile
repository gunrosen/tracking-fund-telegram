## COMMAND
deploy-all:
	docker compose -f docker-compose.yml up -d --build

deploy-alert:
	docker compose -f docker-compose.alert-balance.yml up -d --build

deploy-faucet:
	docker compose -f docker-compose.faucet.yml up -d --build