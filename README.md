# Location Management Service

- _Service name:_ Location Management Service
- _Framework:_ NestJS
- _DatabaseORM:_ TypeORM
- _Database:_ PostgreSQL
- _Language:_ TypeScript

## Project Structure

```
├── README.md
├── nest-cli.json
├── yarn.lock
├── package.json
├── src
│   ├── app.module.ts
│   ├── main.ts
│   ├── configurations
│       ├── configuration.interface.ts
│       ├── configuration.ts
│       ├── environment.validation.ts
│       └── validation.ts
│   ├── constants (for service constants)
│   ├── decorators (for some decorators)
│   ├── docs (for swagger docs configiration)
│   ├── exceptions (for custom exceptions)
│   ├── guard (guard to protect the routes)
│   ├── filters (middleware for error handler)
│   ├── interceptors (service interceptors)
│   ├── interfaces (for the service interfaces)
│   ├── middlewares (service middlewares)
│   ├── migrations (for the database migrations)
│   ├── models (some service common models)
│   ├── modules
│       ├── datanbases (common database configuration)
│       ├── health (health check module)
│       ├── location (location module)
│       ├── loggers (logger module)
│       └──... (domain modules)
│   ├── storage (async local storage for the service)
│   ├── types (for the global types)
│   ├── utils (common utils)
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── migrations.sh
├── Dockerfile
└── tsconfig.json
```

### Environment Variables Configuration

#### ENV(s)

# Application Configuration

| Name                   | Description                                           | Default Value    |
| ---------------------- | ----------------------------------------------------- | ---------------- |
| PORT                   | Application port number                               | 3000             |
| TZ                     | Timezone setting                                      | Asia/Ho_Chi_Minh |
| ENVIRONMENT            | Application environment                               | development      |
| LOG_LEVEL              | Logging level                                         | info             |
| DATABASE_HOST          | Database host address                                 | localhost        |
| DATABASE_PORT          | Database port number                                  | 5432             |
| DATABASE_USERNAME      | Database username                                     | postgres         |
| DATABASE_PASSWORD      | Database password                                     | postgres         |
| DATABASE_NAME          | Database name                                         | postgres         |
| RATE_LIMIT_ENABLED     | Enable/disable rate limiting                          | false            |
| RATE_LIMIT_TIME_WINDOW | Rate limit time window in milliseconds                | 60               |
| RATE_LIMIT_LIMIT       | Maximum number of requests allowed within time window | 100              |

# How to install dependencies

## For dev

```bash
$ yarn install
```

## For production

```bash
$ yarn install --frozen-lockfile
```

# How to create/ apply new migration

## Create new migration

```bash
$ yarn migrate:generate <<migration-name>>
```

## Apply the migration

```bash
$ yarn migrate:run
```

Note: Please setup the environment variables before running the migration.

# How to run the service

- Copy the `.env.example` to `.env` and config the env environment
- Install the dependencies

```bash
$ yarn install --frozen-lockfile
```

- Run the command to run the service

```bash
$ yarn start:dev
```

# How to run the unit test / coverage test

## Unit test

- Currently, I don't have time to write unit test yet.

```bash
$ yarn test
```

## Coverage test

- Currently, I don't have time to write coverage test yet.

```bash
$ yarn test:cov
```

### Building and running your application with Docker

#### Build the image

```bash
$ docker build -t myapp.
```

### Run the container

```bash
$ docker run -p 3000:3000 myapp.
```

When you're ready, start your application by running:
`docker compose up --build`.

Your application will be available at http://localhost:8900.

### Deploying your application to the cloud

First, build your image, e.g.: `docker build -t myapp .`.
If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
`docker build --platform=linux/amd64 -t myapp .`.

Then, push it to your registry, e.g. `docker push myregistry.com/myapp`.

## API Test

### Swagger Docs

- Open the link hest
- Open the link http://[::1]:<<port>>/api/docs to see the API docs.

### API Examples

#### Create location

```bash
curl --location --globoff 'http://[::1]:4000/api/v1.0/locations' \
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Parking Lot 1",
    "building": "HMA",
    "description": "HMA-PL1",
    "area": 351,
    "parentId": 7
}'
```

##### Request Query Params

NONE

##### Request Body

| Name        | Description          | Required |
| ----------- | -------------------- | -------- |
| name        | Location name        | YES      |
| building    | Location building    | YES      |
| description | Location description | YES      |
| area        | Location area        | YES      |
| parentId    | Location parent id   | NO       |

##### Response

201 - Created

#### Pagination location

```bash
curl --location --globoff 'http://[::1]:4000/api/v1.0/locations?level=1&cursor=&limit=10&search=' \
--header 'accept: */*'
```

##### Request Query Params

| Name   | Description                             | Default Value |
| ------ | --------------------------------------- | ------------- |
| level  | Location level                          | 0             |
| cursor | Cursor for pagination                   | ""            |
| limit  | Limit for pagination                    | 10            |
| search | Search for location name or description | ""            |

##### Response

```json
{
  "timestamp": 1745427299008,
  "responseTime": "33ms",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Building A",
        "building": "A",
        "area": 0,
        "parent": null,
        "children": [
          {
            "id": 2,
            "name": "A CarPark",
            "description": "A-CarPark",
            "locationNumber": "101",
            "building": "A",
            "area": 80620,
            "parentId": 1,
            "level": 1
          },
          {
            "id": 3,
            "name": "Level 1",
            "description": "A-01",
            "locationNumber": "102",
            "building": "A",
            "area": 100920,
            "parentId": 1,
            "level": 1
          },
          {
            "id": 19,
            "name": "Level 2",
            "description": "A-02",
            "locationNumber": "103",
            "building": "A",
            "area": 123456,
            "parentId": 1,
            "level": 1
          }
        ],
        "description": "Building A",
        "locationNumber": "1",
        "parentId": null,
        "level": 0
      },
      {
        "id": 11,
        "name": "Building B",
        "building": "B",
        "area": 0,
        "parent": null,
        "children": [
          {
            "id": 12,
            "name": "Level 5",
            "description": "B-05",
            "locationNumber": "201",
            "building": "B",
            "area": 1500000,
            "parentId": 11,
            "level": 1
          }
        ],
        "description": "Building B",
        "locationNumber": "2",
        "parentId": null,
        "level": 0
      }
    ],
    "total": 2,
    "limit": 10,
    "nextCursor": 11,
    "prevCursor": 1
  }
}
```

#### Get location detail

```bash
curl --location --globoff 'http://[::1]:4000/api/v1.0/locations/:id?depth=1' \
--header 'accept: */*'
```

##### Request Query Params

| Name  | Description    | Default Value |
| ----- | -------------- | ------------- |
| depth | Children depth | 0             |

##### Request Path Params

| Name | Description | Required |
| ---- | ----------- | -------- |
| id   | Location id | YES      |

##### Response

```json
{
  "timestamp": 1745427737212,
  "responseTime": "14ms",
  "data": {
    "id": 2,
    "name": "A CarPark",
    "description": "A-CarPark",
    "locationNumber": "101",
    "building": "A",
    "area": 80620,
    "parentId": 1,
    "parent": {
      "id": 1,
      "name": "Building A",
      "description": "Building A",
      "locationNumber": "1",
      "building": "A",
      "area": 0,
      "parentId": null,
      "level": 0
    },
    "children": [],
    "level": 1
  }
}
```

#### Update location

```bash
curl --location --globoff --request PUT 'http://[::1]:4000/api/v1.0/locations/25' \
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--data '{
    "name": "bus",
    "building": "string",
    "area": 0,
    "parentId": 14
}'
```

##### Request Query Params

NONE

##### Request Body

| Name        | Description          | Required |
| ----------- | -------------------- | -------- |
| name        | Location name        | YES      |
| building    | Location building    | YES      |
| description | Location description | YES      |
| area        | Location area        | YES      |
| parentId    | Location parent id   | NO       |

##### Response

200 - OK

#### Delete location

```bash
curl --location --globoff --request DELETE 'http://[::1]:4000/api/v1.0/locations/1' \
--header 'accept: */*'
```

##### Request Query Params

NONE

##### Request Path Params

| Name | Description | Required |
| ---- | ----------- | -------- |
| id   | Location id | YES      |

##### Response

200 - OK
