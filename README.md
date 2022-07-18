# Store app

## Implemented all routes from test case, added routes for trading system

## Do not forget to create .env file

### Run

```
npm run start:dev
```

### Run in docker

```
docker build -t store-app:latest . && docker-compose up -d
```

### Generate migration

```
npm run migration:generate NAME
```

### Generate Seed

```
npm run seed:create NAME
```
