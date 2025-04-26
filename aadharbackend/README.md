# Rashtriya Swasthya Sanrakshan Auth Server

A secure authentication server built with Node.js and Express that provides Aadhaar-based authentication and user management.

## Features

- **Aadhaar Authentication**: Secure verification using Sandbox Aadhaar API
- **OTP Verification**: Two-factor authentication with OTP
- **User Management**: Registration, login, and profile management
- **Role-Based Access**: Supports patients, doctors, and government roles
- **Session Management**: Secure session handling with JWT
- **Environment-based Configuration**: Secure credential management

## Setup

### Prerequisites

- Node.js 14+
- npm or yarn
- Firebase account with Firestore enabled
- Sandbox API credentials

### Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/codeRisshi25/rss-auth-server.git
  cd rss-auth-server
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. Create a `.env` file in the root directory with the following:
  ```
  # API Credentials
  API_KEY=your_sandbox_api_key
  API_SECRET=your_sandbox_api_secret
  ACCESS_TOKEN=your_sandbox_access_token

  # Node.js Configuration
  NODE_ENV=development
  PORT=6420

  # Firebase Configuration
  FIREBASE_CREDENTIALS_PATH=./your-firebase-credentials-file.json
  ```

4. Place your Firebase service account credentials JSON file in the root directory.

### Running the Server

```bash
npm start
```

The server will start at http://localhost:6420

## API Endpoints

### Authentication

#### Send OTP
- **URL**: `/api/auth/send-otp`
- **Method**: `POST`
- **Body**:
  ```json
  {
   "aadharNumber": "123456789012",
   "password": "your_password"
  }
  ```
- **Response**:
  ```json
  {
   "success": true,
   "referenceId": "ref_id_from_aadhaar"
  }
  ```

#### Verify OTP
- **URL**: `/api/auth/verify-otp`
- **Method**: `POST`
- **Body**:
  ```json
  {
   "otp": "123456",
   "referenceId": "ref_id_from_previous_step"
  }
  ```
- **Response**:
  ```json
  {
   "success": true,
   "message": "OTP verified successfully",
   "data": {
    "userDetails": "..."
   }
  }
  ```

#### Register User
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
   "bloodGroup": "O+",
   "allergies": ["Peanuts", "Dust"]
  }
  ```
- **Response**:
  ```json
  {
   "success": true,
   "message": "User registered successfully",
   "userId": "generated_user_id"
  }
  ```

#### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
   "userId": "user_id",
   "password": "user_password",
   "role": "patients"
  }
  ```
- **Response**:
  ```json
  {
   "success": true,
   "message": "Login successful",
   "token": "jwt_token"
  }
  ```

#### Logout
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Response**:
  ```json
  {
   "success": true,
    "success": true,
    "message": "Logged out successfully"
  }
  ```

## Security Features

1. **Environment Variables**: Sensitive data stored in environment variables
2. **Password Hashing**: Secure storage of user passwords
3. **Session Management**: Flask's built-in session for state management
4. **CORS Support**: Controlled cross-origin resource sharing
5. **Input Validation**: Validation of all request data

## Development

### Directory Structure

```
rss-backend-server/
```
rss-auth-server/
├── app.js                        # Main server code
├── .env                          # Environment variables (not in version control)
├── firebase-credentials.json     # Firebase credentials (not in version control)
├── package.json                  # Node.js dependencies and scripts
├── package-lock.json             # Lockfile for npm dependencies
├── README.md                     # Project documentation
├── .gitignore                    # Git ignore file
└── src/                          # Source code directory
  ├── routes/                   # API route handlers
  ├── controllers/              # Business logic and controllers
  ├── models/                   # Database models
  ├── middlewares/              # Middleware functions
  └── utils/                    # Utility functions
```
```

### Requirements

```
```
- express: ^4.18.2
- cors: ^2.8.5
- axios: ^1.4.0
- firebase-admin: ^11.10.1
- dotenv: ^16.3.1
```
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `201`: Resource created
- `400`: Bad request (client error)
- `401`: Unauthorized
- `500`: Server error

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Sandbox Aadhaar API](https://api.sandbox.co.in) for Aadhaar verification
- [Firebase](https://firebase.google.com) for database services

---

**Note**: This server is designed for development and testing purposes. Additional security measures should be implemented for production use.
