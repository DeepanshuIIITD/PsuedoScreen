# Project Context: PsuedoScreen (Streak App Frontend)

## 1. Overview & Purpose
**PsuedoScreen** is an Expo / React Native mobile application designed for attendance tracking, class management, and habit/streak monitoring. It features dual role-based access:
- **Admin (Teachers / Instructors):** Create classes, view class summaries, manage registered students, view detailed attendance reports, and mark/update attendance for students.
- **User (Students):** Enroll in classes via class codes, track personal daily attendance, view attendance streaks and personal statistics, self-report attendance, and manage profile/support options.

---

## 2. Tech Stack & Key Libraries
- **Framework:** Expo SDK `~54.0.10` with React Native `0.81.4`
- **Routing:** Expo Router `~6.0.8` (File-based navigation with typed routes enabled)
- **UI Engine & Animations:** `react-native-reanimated` (`~4.1.0`), `@expo/vector-icons`, `react-native-animatable`, Expo Symbols, `expo-blur`, `expo-haptics`
- **State Management:** React Context API (`AuthContext`, `ClassContext`)
- **Storage & Security:** `expo-secure-store` for encrypted local persistence of JWT access tokens, refresh tokens, and user credentials.
- **Form Controls & Pickers:** `@react-native-community/datetimepicker`, `@react-native-picker/picker`, `react-native-picker-select`
- **Backend Services:** Express/Node backend hosted at `https://streak-app-production.up.railway.app` (configurable via `app.json` / `Constants.expoConfig.extra.API_URL`).

---

## 3. Directory Structure Map

```text
Streak_App_Frontend/
├── app/                        # Expo Router file-based pages & layouts
│   ├── _layout.jsx             # Root layout & global AuthProvider wrapper; handles role redirects
│   ├── errorHandler.jsx        # Centralized error handler & classification
│   ├── (auth)/                 # Authentication Flow
│   │   ├── _layout.jsx         # Auth group layout
│   │   ├── index.jsx           # Login Screen (Admin / User toggle)
│   │   ├── signup.jsx          # Signup Screen with 2-step OTP verification
│   │   └── forgotPassword.jsx  # Password reset flow with OTP verification
│   ├── (app)/                  # Authenticated App Routes
│   │   ├── _layout.jsx         # Safe area wrapper
│   │   ├── (admin)/            # Admin Module (ClassProvider wrapped)
│   │   │   ├── _layout.jsx     # Admin stack navigator & role guard
│   │   │   ├── adminClassSelector.jsx    # Select active class to manage
│   │   │   ├── adminClassRegistration.jsx# Register/create a new class
│   │   │   ├── about.jsx                 # App information
│   │   │   ├── editProfile.jsx           # Profile & email/OTP update
│   │   │   └── (tabs)/                   # Admin Tab Navigator
│   │   │       ├── _layout.jsx           # Admin bottom tabs config
│   │   │       ├── adminHome.jsx         # Dashboard summary & stats
│   │   │       ├── adminStreak.jsx       # Calendar & attendance marking
│   │   │       └── adminStudents.jsx     # Student roster & student removal
│   │   └── (user)/             # User/Student Module (ClassProvider wrapped)
│   │       ├── _layout.jsx     # User stack navigator & role guard
│   │       ├── userClassEnrolled.jsx     # Select enrolled class
│   │       ├── userClassRegistration.jsx # Enroll in class via code
│   │       ├── about.jsx                 # App information
│   │       ├── editProfile.jsx           # Profile & email/OTP update
│   │       └── (tabs)/                   # User Tab Navigator
│   │           ├── _layout.jsx           # User bottom tabs config
│   │           ├── userHome.jsx          # Student dashboard & streak status
│   │           ├── userPersonal.jsx      # Personal calendar & report
│   │           └── userSupport.jsx       # Support & help center
│   ├── contexts/
│   │   ├── AuthContext.jsx     # Authentication state, login/logout, auto-refresh API client
│   │   └── ClassContext.jsx    # Active class selection & global refresh trigger state
│   └── utils/
│       ├── apiHelper.js        # API utilities
│       └── errorReporter.js    # Remote backend error reporter
├── components/                 # Reusable UI components & layouts
│   ├── ErrorBoundary.jsx       # React Error Boundary UI fallback
│   ├── ParallaxScrollView.tsx  # Dynamic header scrolling layout
│   ├── ThemedText.tsx          # Theme-aware text component
│   ├── ThemedView.tsx          # Theme-aware container component
│   └── ui/                     # Tab icons & iOS platform-specific symbols
├── constants/
│   └── Colors.ts               # Light/Dark design token color palettes
├── app.json                    # Expo configuration & env constants
└── package.json                # Project dependencies & npm scripts
```

---

## 4. Architecture & Data Flow

### A. Authentication & Session Lifecycle (`AuthContext.jsx`)
1. **Startup Check:** On app launch, `loadStoredAuth()` reads `access_token`, `refresh_token`, and `user` object from `SecureStore`.
2. **Redirection Logic (`app/_layout.jsx`):**
   - Unauthenticated users are routed to `/(auth)`.
   - Admin users are routed to `/(admin)/adminClassSelector`.
   - Student users are routed to `/(user)/userClassEnrolled`.
3. **Unified API Wrapper (`apiCall`):**
   - Automatically attaches `Authorization: Bearer <token>` and `credentials: "include"`.
   - Catches `401 Unauthorized` responses and automatically attempts token refresh via `/admin/refreshToken` or `/user/refreshToken`.
   - On refresh failure, automatically clears `SecureStore` and redirects to login.

### B. Class State Management (`ClassContext.jsx`)
- Stores `selectedClass` details (id, name, code, working days per week).
- Shares `attendanceData` across tabs.
- Exposes `refreshTrigger` and `triggerRefresh()` to allow cross-screen re-fetching when attendance data changes.

### C. Centralized Error Handling (`errorHandler.jsx` & `errorReporter.js`)
- Categorizes runtime errors: `NETWORK`, `API`, `AUTH`, `VALIDATION`, and `UNKNOWN`.
- Displays user-friendly modal alerts (`Alert.alert`).
- Asynchronously logs error tracebacks to backend endpoints (`/user/logError` or `/admin/logError`) without disrupting user experience.

---

## 5. Summary of REST API Endpoints

### Authentication & Account
| Action | Admin Endpoint | User Endpoint |
|---|---|---|
| Sign In | `POST /admin/signIn` | `POST /user/signIn` |
| Sign Up | `POST /admin/signUp` | `POST /user/signUp` |
| Log Out | `POST /admin/logOutAdmin/` | `POST /user/logOutUser` |
| Refresh Token | `POST /admin/refreshToken` | `POST /user/refreshToken` |
| Send OTP | `POST /admin/sendOTP` | `POST /user/sendOTP` |
| Verify OTP | `POST /admin/verifyOTP` | `POST /user/verifyOTP` |
| Reset Password | — | `POST /user/resetPassword` |
| Profile Operations | `POST/GET /admin/profile` | `POST/GET /user/profile` |

### Class & Attendance Operations
| Action | Admin Endpoint | User Endpoint |
|---|---|---|
| Class List | `GET /admin/classList` | `GET /user/classList` |
| Create / Enroll Class | `POST /admin/createClass` | `POST /user/enrollClass` |
| Quick Summary | `GET /admin/quickSummary/:classId` | `GET /user/quickSummary/:classId` |
| Today Summary | `GET /admin/todaySummary/:classId` | — |
| Calendar Attendance | `GET /admin/calendar/:classId` | `GET /user/calendar/:classId` |
| Streak Stats | `GET /admin/streak/:classId` | `GET /user/streak/:classId` |
| Performance Report | `GET /admin/report/:classId` | `GET /user/report/:classId` |
| Mark Attendance | `POST /admin/markAttendance/:classId` | `POST /user/markAttendance/:classId` |
| Manage Students | `GET /admin/studentsList/:classId` | — |
| Kick Student | `DELETE /admin/kickStudent/:classId` | — |
| Error Logging | `POST /admin/logError` | `POST /user/logError` |

---

## 6. How to Run & Develop

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Start Development Server:**
   ```bash
   npx expo start
   ```
3. **Run on Emulator / Device:**
   - Press `a` for Android Emulator
   - Press `i` for iOS Simulator
   - Scan QR code via Expo Go / Development Build
