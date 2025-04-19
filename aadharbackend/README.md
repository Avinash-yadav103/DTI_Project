Rashtriya Swasthya Sanrakshan Auth Server

A secure authentication server built with Flask that provides Aadhaar-based authentication and user management.

## Features

- **Aadhaar Authentication**: Secure verification using Sandbox Aadhaar API
- **OTP Verification**: Two-factor authentication with OTP
- **User Management**: Registration, login, and profile management
- **Role-Based Access**: Supports patients, doctors, and government roles
- **Session Management**: Secure session handling
- **Environment-based Configuration**: Secure credential management

## Setup

### Prerequisites

- Python 3.7+
- pip
- Firebase account with Firestore enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rss-auth-server.git
   cd rss-auth-server
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a .env file in the root directory with the following:
   ```
   # API Credentials
   API_KEY=your_sandbox_api_key
   API_SECRET=your_sandbox_api_secret
   ACCESS_TOKEN=your_sandbox_access_token

   # Flask Configuration
   FLASK_SECRET_KEY=your_random_secure_key
   FLASK_ENV=development

   # Firebase Configuration
   FIREBASE_CREDENTIALS_PATH=./your-firebase-credentials-file.json
   ```

4. Place your Firebase service account credentials JSON file in the root directory

### Running the Server

```bash
python server.py
```

The server will start at http://0.0.0.0:4505

## API Endpoints

### Authentication

#### Send OTP
- **URL**: `/send-otp`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "aadharNumberMain": "123456789012",
    "password": "your_password"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "reference_id": "ref_id_from_aadhaar"
  }
  ```

#### Verify OTP
- **URL**: `/verify-otp`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "otp": "123456",
    "reference_id": "ref_id_from_previous_step"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "OTP verified successfully",
    "data": {
      "user_details": "..."
    }
  }
  ```

#### Register User
- **URL**: `/register_user`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "blood_group": "O+",
    "allergies": ["Peanuts", "Dust"]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user_id": "generated_user_id"
  }
  ```

#### Login
- **URL**: `/login` or `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "userID": "user_id",
    "password": "user_password",
    "role": "patients"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user_details": "..."
    }
  }
  ```

#### Logout
- **URL**: `/logout`
- **Method**: `POST`
- **Response**:
  ```json
  {
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
rss-auth-server/
│
├── server.py                     # Main server code
├── .env                          # Environment variables (not in version control)
├── project-xyz-firebase-xxx.json # Firebase credentials (not in version control)
├── requirements.txt              # Python dependencies
└── .gitignore                    # Git ignore file
```

### Requirements

```
flask==2.0.1
flask_cors==3.0.10
requests==2.26.0
firebase-admin==5.0.3
python-dotenv==0.19.0
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
- [Flask](https://flask.palletsprojects.com) web framework

---

**Note**: This server is designed for development and testing purposes. Additional security measures should be implemented for production use.

Similar code found with 1 license type

codeRisshi25: generate all this in markdown format to copy paste

GitHub Copilot: # RSS Auth Server

A secure authentication server built with Flask that provides Aadhaar-based authentication and user management.

## Features

- **Aadhaar Authentication**: Secure verification using Sandbox Aadhaar API
- **OTP Verification**: Two-factor authentication with OTP
- **User Management**: Registration, login, and profile management
- **Role-Based Access**: Supports patients, doctors, and government roles
- **Session Management**: Secure session handling
- **Environment-based Configuration**: Secure credential management

## Setup

### Prerequisites

- Python 3.7+
- pip
- Firebase account with Firestore enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rss-auth-server.git
   cd rss-auth-server
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a .env file in the root directory with the following:
   ```
   # API Credentials
   API_KEY=your_sandbox_api_key
   API_SECRET=your_sandbox_api_secret
   ACCESS_TOKEN=your_sandbox_access_token

   # Flask Configuration
   FLASK_SECRET_KEY=your_random_secure_key
   FLASK_ENV=development

   # Firebase Configuration
   FIREBASE_CREDENTIALS_PATH=./your-firebase-credentials-file.json
   ```

4. Place your Firebase service account credentials JSON file in the root directory

### Running the Server

```bash
python server.py
```

The server will start at http://0.0.0.0:4505

## API Endpoints

### Authentication

#### Send OTP
- **URL**: `/send-otp`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "aadharNumberMain": "123456789012",
    "password": "your_password"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "reference_id": "ref_id_from_aadhaar"
  }
  ```

#### Verify OTP
- **URL**: `/verify-otp`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "otp": "123456",
    "reference_id": "ref_id_from_previous_step"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "OTP verified successfully",
    "data": {
      "user_details": "..."
    }
  }
  ```

#### Register User
- **URL**: `/register_user`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "blood_group": "O+",
    "allergies": ["Peanuts", "Dust"]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user_id": "generated_user_id"
  }
  ```

#### Login
- **URL**: `/login` or `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "userID": "user_id",
    "password": "user_password",
    "role": "patients"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user_details": "..."
    }
  }
  ```

#### Logout
- **URL**: `/logout`
- **Method**: `POST`
- **Response**:
  ```json
  {
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
rss-auth-server/
│
├── server.py                     # Main server code
├── .env                          # Environment variables (not in version control)
├── project-xyz-firebase-xxx.json # Firebase credentials (not in version control)
├── requirements.txt              # Python dependencies
└── .gitignore                    # Git ignore file
```

### Requirements

```
flask==2.0.1
flask_cors==3.0.10
requests==2.26.0
firebase-admin==5.0.3
python-dotenv==0.19.0
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
- [Flask](https://flask.palletsprojects.com) web framework

---

**Note**: This server is designed for development and testing purposes. Additional security measures should be implemented for production use.

Similar code found with 1 license type