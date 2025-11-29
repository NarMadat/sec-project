#!/bin/bash

echo "Starting Security Management Platform in development mode..."

docker-compose up -d postgres redis kafka zookeeper

echo "Starting microservices..."
pnpm run start:dev
