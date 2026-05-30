# Testing and Deployment Report

## 1. Testing strategy

The application was tested using:

- Unit testing
- Integration/API testing
- Manual end-to-end testing
- Firebase Test Lab plan

## 2. Unit testing

### Mobile unit test

File: `mobile/src/utils/validation.test.js`

Tested:

- Empty/invalid incident reports are rejected.
- Complete incident reports are accepted.
- Severity labels are returned correctly.

Run command:

```bash
cd mobile
npm test
```

### Backend unit/API test

File: `backend/__tests__/health.test.js`

Tested:

- Health endpoint returns status `ok`.
- Backend rejects incomplete incident submission.

Run command:

```bash
cd backend
npm test
```

## 3. Integration testing

| Test case | Expected result | Status |
|---|---|---|
| Register new user | Firebase creates account | Pass |
| Login user | User enters dashboard | Pass |
| Submit incident | Incident saved in Firestore | Pass |
| Attach GPS | Latitude and longitude saved | Pass |
| Capture camera photo | Local photo URI attached | Pass |
| View map | Incident marker appears | Pass |
| Update incident status | Status changes to resolved | Pass |

## 4. End-to-end test scenario

1. Start backend with `npm run dev`.
2. Start mobile app with `npm start`.
3. Scan QR code with Expo Go.
4. Register/login.
5. Submit a new incident with GPS and camera evidence.
6. View the incident in History.
7. Open Map and confirm marker is shown.
8. Open incident details and mark as resolved.

## 5. Firebase Test Lab plan

For final submission:

1. Build Android APK/AAB with EAS.
2. Upload the APK/AAB to Firebase Test Lab.
3. Run robo test on at least one Android device.
4. Capture screenshots/logs as evidence.
5. Discuss limitations, such as camera/GPS permissions needing real-device validation.

## 6. Deployment approach

### Mobile

- Development testing through Expo Go QR code.
- Final APK build through EAS Build.

### Backend

- Local Node.js Express API during development.
- Can be deployed later to Render, Railway, Firebase Cloud Functions, or AWS.

## 7. Reflection

### What worked well

- Expo simplified cross-platform mobile development.
- Firebase reduced backend complexity for authentication and database storage.
- Device APIs allowed strong assessment coverage.

### Issues discovered

- Real phone backend access requires LAN IP, not localhost.
- Firebase rules must match app data structure.
- Camera and GPS need physical device testing.

### Improvements

- Add admin dashboard for security staff.
- Add Firebase Storage for permanent image uploads.
- Add push notifications from backend.
- Add role-based access control for staff/admin users.
