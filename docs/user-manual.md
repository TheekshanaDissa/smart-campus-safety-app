# User Manual — Smart Campus Safety App

## 1. Getting started

### Requirements

- Node.js installed
- Expo Go app installed on Android/iOS phone
- Firebase project configured
- Backend running locally if backend API testing is required

### Installation

Mobile app:

```bash
cd mobile
npm install
cp .env.example .env
npm start
```

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## 2. Login and registration

1. Open the app through Expo Go.
2. Create a new account using email and password.
3. Login using the same account.

The app uses Firebase Authentication for account handling.

## 3. Dashboard

The home dashboard shows:

- Active reports
- High severity reports
- Battery status
- Recent reports
- Quick action buttons

## 4. Reporting an incident

1. Tap **Report**.
2. Enter title and description.
3. Select category.
4. Select severity.
5. Tap **Open camera** to capture photo evidence.
6. Tap **Attach GPS location** to attach current location.
7. Tap **Submit report**.

A local notification confirms successful submission.

## 5. Viewing incidents

Tap **History** to view all submitted incidents.

Tap any incident to view:

- Full description
- Severity
- Category
- Status
- Location
- Photo evidence

## 6. Viewing map

Tap **Map** to view incident markers on a map.

The map uses GPS and shows the user location when permission is granted.

## 7. Device sensors

Go to **Settings → View sensors**.

The app displays:

- Accelerometer readings
- Gyroscope readings

These demonstrate mobile sensor capability usage.

## 8. Common issues and fixes

| Issue | Cause | Fix |
|---|---|---|
| Firebase login fails | Incorrect `.env` config | Recheck Firebase Web App config |
| Phone cannot connect to backend | Using `localhost` on phone | Use computer LAN IP in `EXPO_PUBLIC_API_URL` |
| Location not working | Permission denied | Enable location permission in phone settings |
| Map does not show user | GPS disabled | Turn on phone location services |
| Camera not opening | Camera permission denied | Allow camera permission |
| Firestore permission error | Rules mismatch | Apply the provided Firestore rules |
