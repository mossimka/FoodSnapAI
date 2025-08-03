# Rate Limiting Implementation Guide

## Overview

This document outlines the comprehensive rate limiting strategy implemented for FoodSnap AI to protect against abuse and ensure fair resource usage.

## Rate Limiting Strategy

### 1. Endpoint Categories

#### High Resource Operations (Most Restrictive)
- **AI Analysis** (`/dish/` POST): `5/minute`
  - Most expensive operation using AI models
  - File upload + image processing + AI inference
  
- **Recipe Saving** (`/dish/save/` POST): `10/minute`
  - File upload to cloud storage
  - Database writes with multiple tables
  - Cache invalidation

#### Medium Resource Operations
- **Recipe Updates** (`/dish/recipes/{slug}/` PATCH): `10/minute`
  - Database writes with validation
  - Cache invalidation
  
- **Recipe Deletion** (`/dish/{recipe_id}/` DELETE): `5/minute`
  - Destructive operations (more restrictive)
  - Cascade deletions
  
- **Favorites Management**: `20/minute`
  - Add/remove favorites
  - Lightweight database operations

#### Low Resource Operations (Most Permissive)
- **Recipe Reads** (`/dish/recipes/{slug}/` GET): `100/minute`
  - Cached responses
  - Read-only operations
  
- **Recipe Lists** (various GET endpoints): `50/minute`
  - Paginated responses
  - Cached results
  
- **Metadata** (categories, health info): `200/minute`
  - Static or rarely-changing data
  - Heavily cached

### 2. Implementation Details

#### Libraries Used
- **slowapi**: FastAPI port of Flask-Limiter
- **Redis**: Backend storage for rate limiting data (already in your stack)

#### Installation
```bash
pip install slowapi==0.1.9
```

#### Basic Setup
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Create limiter
limiter = Limiter(key_func=get_remote_address)

# Add to FastAPI app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
```

### 3. Advanced Features

#### User-Based vs IP-Based Limiting
```python
def get_user_id_or_ip(request: Request) -> str:
    """Use user ID for authenticated users, IP for anonymous"""
    # Try to extract user ID from JWT token
    # Fall back to IP address
    return f"user:{user_id}" or f"ip:{ip_address}"
```

#### Differentiated Limits
- **Authenticated Users**: Higher limits (2x multiplier)
- **Anonymous Users**: Standard IP-based limits
- **Premium Users**: Could implement even higher limits

### 4. Rate Limit Configuration

#### Current Limits (per minute)
```python
# High Resource
AI_ANALYSIS_LIMIT = "5/minute"
RECIPE_SAVE_LIMIT = "10/minute"

# Medium Resource  
RECIPE_UPDATE_LIMIT = "10/minute"
RECIPE_DELETE_LIMIT = "5/minute"
FAVORITES_WRITE_LIMIT = "20/minute"

# Low Resource
RECIPE_READ_LIMIT = "100/minute"
LIST_READ_LIMIT = "50/minute"
METADATA_READ_LIMIT = "200/minute"
```

### 5. Error Handling

#### Rate Limit Exceeded Response
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retry_after": "60 seconds"
}
```

#### HTTP Status Code: `429 Too Many Requests`

### 6. Monitoring and Adjustments

#### Key Metrics to Monitor
- Rate limit hit rates by endpoint
- User behavior patterns
- Resource utilization during peak times
- False positive rate (legitimate users being blocked)

#### Adjustment Guidelines
- **If AI costs are high**: Reduce AI analysis limits
- **If users complain**: Increase read operation limits
- **If abuse detected**: Implement stricter limits temporarily

### 7. Future Enhancements

#### Possible Improvements
1. **Redis Integration**: Use Redis for distributed rate limiting
2. **User Tiers**: Different limits for free/premium users
3. **Dynamic Limits**: Adjust based on system load
4. **Whitelist/Blacklist**: Special handling for known IPs
5. **Burst Allowance**: Short-term higher limits for legitimate bursts

#### Redis-Based Implementation
```python
from slowapi.middleware import SlowAPIMiddleware

# Use Redis as backend
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri="redis://localhost:6379"
)
```

### 8. Testing Rate Limits

#### Test Commands
```bash
# Test AI analysis limit (should block after 5 requests/minute)
for i in {1..10}; do
  curl -X POST "http://localhost:8000/dish/" \
    -H "Authorization: Bearer $TOKEN" \
    -F "file=@test_image.jpg"
  sleep 5
done

# Test read limits (should allow 100/minute)
for i in {1..150}; do
  curl "http://localhost:8000/dish/recipes/test-recipe-1/"
done
```

### 9. Production Considerations

#### Deployment Checklist
- [ ] Redis backend configured
- [ ] Rate limits tested under load
- [ ] Monitoring alerts set up
- [ ] Documentation updated for API consumers
- [ ] Rate limit headers included in responses

#### Rate Limit Headers
Consider adding these headers to responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### 10. API Consumer Guidelines

#### Best Practices for Frontend
- Implement exponential backoff on 429 responses
- Cache responses when possible
- Batch operations where feasible
- Show user-friendly error messages for rate limits

#### Example Frontend Handling
```javascript
const handleRateLimit = async (response) => {
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After') || 60;
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    // Retry the request
  }
};
```

This comprehensive rate limiting implementation will protect your API from abuse while ensuring legitimate users have a smooth experience. 