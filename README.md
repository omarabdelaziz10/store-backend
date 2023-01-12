# Storefront Backend Project

## Introduction ##

This is a REST API simulating the store functionalities designed with models and handlers tied with endpoints for specific behaviours. A detailed list of actions, schema and endpoint is available in [REQUIREMENTS.md] file.

## Add env
- add a `.env` file in the root directory and set the missing `###` environment parameters

```
POSTGRES_HOST=localhost
POSTGRES_PORT=8000
POSTGRES_DB=store
POSTGRES_TEST_DB=store_test
POSTGRES_USER=###
POSTGRES_PASSWORD=###
ENV=dev
BCRYPT_PASSWORD=###
SALT_ROUNDS=10
TOKEN_SECRET=###
```

## Set up

```
- `npm install` to install all dependencies
- `npm run create-dev-db` to set up the dev database (This script assumes you have installed postgres)
- `npm run create-test-db` to set up the dev database (This script assumes you have installed postgres)
- `npm run lint` to run the lint
- `npm run prettier` to run prettier
- `npm run start` to start the server
- `npm run start:prod` to build and start the server
- `npm run test` to build and run the test
```

## Start the app
- `npm run start` to start the app and get access via http://localhost:3000

## Database Port
- The Database will start on http://localhost:8000


## Test the app
- `npm run test` to run all tests