#!/bin/bash

echo "Setting up Security Management Platform..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file from .env.example"
fi

echo "Installing dependencies..."
pnpm install

echo "Starting infrastructure services..."
docker-compose up -d postgres redis kafka zookeeper

echo "Waiting for services to be ready..."
sleep 15

echo "Setting up databases..."
pnpm run db:generate
pnpm run db:migrate

echo "Setup complete! Run 'pnpm run start:dev' to start all services"
