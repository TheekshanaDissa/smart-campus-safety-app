# Smart Campus Safety App

A ready-to-run final assessment project for **Mobile Application Development**.

This project includes:

- **React Native + Expo mobile app** for Expo Go QR testing
- **Node.js + Express backend API**
- **Firebase Authentication + Firestore database** integration
- Device features: **GPS, map, camera, accelerometer, gyroscope, battery, notifications**
- Jest test examples for both mobile and backend
- Sprint plan, user manual, testing report, Firebase setup notes, and pitch outline

> No real Firebase keys or service account credentials are included. Add your own Firebase config before submission.

---

## Folder structure

```text
smart-campus-safety-app/
├─ mobile/        # Expo React Native app
├─ backend/       # Node.js Express API
├─ firebase/      # Firestore security rules + indexes
└─ docs/          # Assessment documentation
```

---

## 1. Firebase setup

Create a Firebase project and enable:

1. **Authentication** → Email/Password provider
2. **Firestore Database** → production or test mode, then apply `firebase/firestore.rules`
3. Optional for backend: create a **service account key** and save it as `backend/serviceAccountKey.json`

Mobile uses the Firebase Web SDK. Backend uses Firebase Admin SDK.

---

## 2. Run the mobile app with Expo Go

```bash
cd mobile
npm install
cp .env.example .env
```

Open `mobile/.env` and add your Firebase web config.

Then run:

```bash
npm start
```

Scan the QR code using **Expo Go**.

For LAN testing, set this in `mobile/.env`:

```bash
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_LAN_IP:4000
```

Example:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.10:4000
```

---

## 3. Run the backend API

```bash
cd backend
npm install
cp .env.example .env
```

For Firebase Admin, put your service account file here:

```text
backend/serviceAccountKey.json
```

Then run:

```bash
npm run dev
```

Health check:

```text
GET http://localhost:4000/health
```

---

## 4. Run tests

Mobile:

```bash
cd mobile
npm test
```

Backend:

```bash
cd backend
npm test
```

---

## 5. App features

### User features

- Register/login using Firebase Authentication
- Report safety incidents
- Capture photo evidence using camera
- Attach GPS location to report
- View incident map
- View incident history and details
- Monitor device sensors
- Receive local notification after submitting a report
- View battery status

### Backend features

- Health check API
- Incident creation API
- Incident listing API
- Incident status update API
- Firebase token verification middleware
- Firestore repository with local fallback for development/testing

---

## 6. Useful submission notes

For GitHub submission, commit source code only. Do **not** commit:

- `node_modules/`
- `.env`
- `serviceAccountKey.json`
- generated build files

Use `.env.example` as evidence that environment variables are handled properly.

---

## 7. Build APK later

Install EAS CLI:

```bash
npm install -g eas-cli
```

Then inside `mobile/`:

```bash
eas login
eas build:configure
eas build -p android --profile preview
```

For this assessment, Expo Go QR testing is enough for local development/demo.
