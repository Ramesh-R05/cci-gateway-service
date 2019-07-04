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
bash
npm  run dev
```

## Running tests

- Unit tests

```
bash
npm run test
```

- with coverage

```
bash
npm run test:cover
```

- Lint

```
bash
npm run lint
```

## Endpoints

There are no endpoints, this service will take your path and forward onto `http://services.sit.bxm.internal/<YOUR PATH>`, it accepts all HTTP methods and will also forward query strings.

_example_
To get an entity, a request will be made to `https://services.<sit or prod>.bxm.net.au/entity/v1/homes/HOMES-16224`

this service will check the `x-services-access-key` is valid then take the path: `/entity/v1/homes/HOMES-16224` and forwared it onto either `http://services.sit.bxm.internal/entity/v1/homes/HOMES-16224` or `http://services.sit.bxm.internal/entity/v1/homes/HOMES-16224` depending on if `https://services.sit.bxm.net.au/` or `https://services.prod.bxm.net.au/` are the target.
