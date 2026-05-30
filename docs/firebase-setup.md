# Firebase Setup Guide

## Firebase services used

This app uses three Firebase assessment technologies:

1. **Firebase Authentication**
   - Email/password login and registration.
   - Used to identify each student/user.

2. **Cloud Firestore**
   - Stores incident reports.
   - Each incident includes title, description, category, severity, GPS location, photo URI, status, reporter and timestamps.

3. **Firebase Test Lab**
   - Used for automated device testing evidence during submission.
   - The app can be uploaded as an APK/AAB after building with EAS.

## Steps

1. Go to Firebase Console.
2. Create a project named `smart-campus-safety`.
3. Enable Authentication → Email/Password.
4. Create Firestore Database.
5. Copy Firebase Web App config into `mobile/.env`.
6. Apply `firebase/firestore.rules`.
7. Optional backend: create Service Account key and save as `backend/serviceAccountKey.json`.

## Firestore collection

Collection: `incidents`

Example document:

```json
{
  "title": "Broken light near library",
  "description": "The walkway light near the library entrance is broken.",
  "category": "Infrastructure",
  "severity": "medium",
  "status": "submitted",
  "userId": "firebase-user-id",
  "reporterName": "Student User",
  "location": {
    "latitude": -37.7209,
    "longitude": 145.0485,
    "accuracy": 10
  },
  "photoUri": "file://local-device-image.jpg",
  "createdAt": "server timestamp",
  "updatedAt": "server timestamp"
}
```
