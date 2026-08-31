# Islamic App Backend 🕌

Custom REST API Backend for the Islamic App Flutter Application.

## 🛠️ Technologies

- Node.js
- Express.js
- TypeScript
- Dio (Flutter API Client)
- CORS
- Helmet
- Dotenv
- Adhan

## 🌐 Base URL

https://islamic-app-backend.vercel.app

## 🔗 API Endpoints

### Quran

**Get all Surahs**
http
GET /api/v1/quran/surahs

Get Surah details

GET /api/v1/quran/surahs/:id

Azkar

Get all Azkar

GET /api/v1/azkar

Get Azkar by category

GET /api/v1/azkar/category/:category
Prayer Times

Get Prayer Times + Hijri Date

GET /api/v1/prayers/timings

Query Parameters:

latitude
longitude
date
method
Health Check
GET /health
📦 Response Format

All API responses follow a unified structure:

{
  "status": "success",
  "message": "Descriptive message",
  "data": {}
}

Error response:

{
  "status": "error",
  "message": "Error message",
  "data": null
}
📱 Flutter Integration

The Flutter application consumes these APIs using:

Dio → Custom Backend REST API

The backend provides:

Quran
Azkar
Prayer Times
Hijri Date

