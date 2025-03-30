# Authentication API

## Description
This project provides authentication and user management functionality using Node.js, Express.js, and MongoDB. It includes secure password storage with bcrypt and authentication using JWT tokens.

## Features
- User signup with password hashing (bcrypt)
- Secure login with JWT authentication
- Logout functionality
- User profile retrieval
- Password reset with token verification
- User deletion
- User profile update

## API Endpoints
### **User Routes** (`/user/`)

| Endpoint                 | Method | Description |
|--------------------------|--------|-------------|
| `/user/signup`          | POST   | Registers a new user and stores a hashed password. |
| `/user/login`           | POST   | Authenticates user and returns a JWT token. |
| `/user/logout`          | POST   | Logs out the user by invalidating the token. |
| `/user/delUser`        | DELETE | Deletes the user account. |
| `/user/verify`         | GET    | Verifies a user's authentication status. |
| `/user/profile`        | GET    | Retrieves user profile details. |
| `/user/updateUser`     | PUT    | Updates user profile information. |
| `/user/forgetpassword` | POST   | Sends a password reset link to the user's email. |
| `/user/resetpassword`  | POST   | Resets the password using a token. |


## Technologies Used
- Node.js
- Express.js
- MongoDB
- bcrypt for password hashing
- JWT for authentication

## License
This project is licensed under the MIT License.

