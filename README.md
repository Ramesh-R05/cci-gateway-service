# Gateway service

[![Run Status](https://api.shippable.com/projects/5d1a99c410f8010007feb75c/badge?branch=master)]()
[![Coverage Badge](https://api.shippable.com/projects/5d1a99c410f8010007feb75c/coverageBadge?branch=master)]()

## Introduction

This API service acts as a proxy to pipe request through to internal services.

## Prerequisite

Make sure you have the necessary dependencies:

```
bash
npm install
```

## Running app

Starts the service on a port specified through the environment variable, otherwise default is port 3000:

```
npm run dev
```

## Running tests

- Unit tests

```
npm run test
```

- with coverage

```
bash
npm run test:cover
```

- Lint

```
npm run lint
```

## Endpoints

There are no endpoints, this service will take your path and forward onto `http://services.sit.bxm.internal/<YOUR PATH>`, it accepts all HTTP methods and will also forward query strings.

_example_
- To get an entity, a request will be made to `https://services.<sit or prod>.bxm.net.au/entity/v1/homes/HOMES-16224`
- gateway service will check the `x-service-access-key` is valid
- if the key is valid then it takes the path  `/entity/v1/homes/HOMES-16224`and forwards it onto either `http://services.sit.bxm.internal/entity/v1/homes/HOMES-16224` or `http://services.sit.bxm.internal/entity/v1/homes/HOMES-16224`.
