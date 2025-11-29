#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "Testing Security Management Platform API..."

echo "1. Registering admin user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@security.com",
    "password": "password123",
    "role": "ADMIN"
  }')

echo "Register Response: $REGISTER_RESPONSE"

echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@security.com",
    "password": "password123"
  }')

echo "Login Response: $LOGIN_RESPONSE"

if command -v jq &> /dev/null; then
  TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.access_token')
  
  if [ "$TOKEN" != "null" ]; then
    echo "Token extracted: $TOKEN"

    echo "3. Creating employee..."
    EMPLOYEE_RESPONSE=$(curl -s -X POST $BASE_URL/employees \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "userId": "test-user-id",
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "+1234567890",
        "position": "Security Guard",
        "status": "ACTIVE"
      }')
    
    echo "Employee Response: $EMPLOYEE_RESPONSE"
    
    echo "4. Getting all employees..."
    ALL_EMPLOYEES=$(curl -s -X GET $BASE_URL/employees \
      -H "Authorization: Bearer $TOKEN")
    
    echo "All Employees: $ALL_EMPLOYEES"
  else
    echo "Failed to extract token"
  fi
else
  echo "jq not installed, cannot extract token for further tests"
fi

echo "API testing completed!"
