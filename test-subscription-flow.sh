#!/bin/bash
# Full subscription flow test
BASE="http://localhost:4321"
COOKIE_JAR="/tmp/timorlist-test-cookies.txt"

echo "=== 1. Register a test user ==="
# Register
RESPONSE=$(curl -s -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
  -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test-$(date +%s)@test.com","password":"Test123456"}')
echo "Register response: $RESPONSE"

echo -e "\n=== 2. Login ==="
LOGIN_RESPONSE=$(curl -s -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
  -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123456"}')
echo "Login response: $LOGIN_RESPONSE"

echo -e "\n=== 3. Check session ==="
SESSION=$(curl -s -b "$COOKIE_JAR" "$BASE/api/auth/session")
echo "Session: $SESSION"

echo -e "\n=== 4. Visit /listing/create (should show type selection) ==="
curl -s -b "$COOKIE_JAR" "$BASE/listing/create" | grep -o "What type of listing" || echo "Not found"

echo -e "\n=== 5. Visit /pricing ==="
curl -s "$BASE/pricing" | grep -o "Basic\|Pro\|Max" | sort -u

echo -e "\n=== 6. Visit /subscribe?plan=basic-monthly (should create order) ==="
SUBSCRIBE=$(curl -s -b "$COOKIE_JAR" -w "%{http_code}" -o /dev/null "$BASE/subscribe?plan=basic-monthly")
echo "Subscribe HTTP status: $SUBSCRIBE"

echo -e "\n=== 7. Check orders ==="
ORDERS=$(curl -s -b "$COOKIE_JAR" "$BASE/api/admin/orders")
echo "Orders: $ORDERS"

echo -e "\n=== 8. Check products API (with no business) ==="
PRODUCTS=$(curl -s "$BASE/api/products")
echo "Products: $PRODUCTS"

# Cleanup
rm -f "$COOKIE_JAR"
