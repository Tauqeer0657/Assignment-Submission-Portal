
# Assignment Submission Portal

This project is a backend system for an Assignment Submission Portal where users can upload assignments, and admins can accept or reject them.

## Features

- User registration and login(user)
- Admin registration and login(admin)
- Retrieve admins (user)
- Upload assignments (user)
- Retrieve assignments tagged to that admin(admin)
- Accept/Reject assignments (admin)
- Role-based access control
- JWT-based authentication


## Requirements

- Node.js
- MongoDB (Local or Cloud)
- Git


## Installation

1. Clone the repository:
```bash
git clone https://github.com/Tauqeer0657/Assignment-Submission-Portal.git
```
2. Navigate into the project directory:
```bash
cd Assignment-Submission-Portal
```
3. Install the required dependencies:
```bash
npm install
```

    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file or you can refer .env.sample file for reference.

`MONGO_URI`

`JWT_SECRET`

`PORT`



## Running The Application

We can connect the database and start the server by using the following command:

```bash
  npm run dev
```


## API Reference

## User Endpoints:

#### Register a new user

```http
  POST /api/user/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Username for registration |
| `password` | `string` | **Required**. Password for registration |
| `confirmPassword` | `string` | **Required**. confirmPassword for validation  |


#### User login

```http
  POST /api/user/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. User's username |
| `password` | `string` | **Required**. User's password |

#### Get list of all admins (user)

```http
  GET /api/user/admins
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authToken` | `string` | **Required**. JWT Token must be stored in a cookies |

#### Upload an assignment (user)

```http
  POST /api/user/upload
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authToken` | `string` | **Required**. JWT Token must be stored in cookies |
| `task` | `string` | **Required**. Task's description|
| `admin` | `string` | **Required**. Admin's username |

## Admin Endpoints:

#### Register a new admin

```http
  POST /api/admin/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Username for registration |
| `password` | `string` | **Required**. Password for registration |
| `confirmPassword` | `string` | **Required**. confirmPassword for validation  |


#### Admin login

```http
  POST /api/admin/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Admin's username |
| `password` | `string` | **Required**. Admin's password |

#### Fetch all tagged assignments whose status is pending for the logged-in admin

```http
  GET /api/admin/assignments
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authToken` | `string` | **Required**. Admin's JWT Token must be stored in cookies |

#### Accept an assignment by its ID

```http
  POST /api/admin/assignments/${id}/accept
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authToken` | `string` | **Required**. Admin's JWT Token must be stored in cookies |
| `id` | `string` | **Required**. ID of the assignment to accept|

#### Reject an assignment by its ID

```http
  POST /api/admin/assignments/${id}/reject
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authToken` | `string` | **Required**. Admin's JWT Token must be stored in cookies |
| `id` | `string` | **Required**. ID of the assignment to accept|

## Technologies Used

- Node.js with Express for building the - backend server
- MongoDB for the database
- JWT for authentication
- bcrypt for password hashing



