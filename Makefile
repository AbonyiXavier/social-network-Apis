install:
	yarn install

dev:
	yarn start:dev

build:
	yarn build

lint:
	yarn run lint

gen-migrate:
	yarn run generate:migration	

studio:
	npx prisma studio

up:
	docker compose up
