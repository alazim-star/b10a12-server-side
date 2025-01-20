# Scholarship Management Web Application (Server-Side)

This is the server-side API for the Scholarship Management Web Application, built using **Node.js** and **Express**. The backend handles scholarship data, reviews, user authentication, and other necessary operations to support the client-side application.

## Features

- **Scholarship Data Management**: Manages the creation, reading, updating, and deletion (CRUD) of scholarship data.
- **User Reviews**: Allows users to submit and fetch reviews for scholarships.
- **User Authentication**: Manages user login and registration using JWT (JSON Web Token) for secure authentication.
- **CRUD Operations**: Provides endpoints for managing scholarships and reviews.
- **Database**: MongoDB is used to store user information, scholarship details, and reviews.

## Technologies Used

- **Node.js**: A JavaScript runtime for building scalable server-side applications.
- **Express.js**: A minimal web framework for building RESTful APIs.
- **MongoDB**: A NoSQL database for storing scholarship data and user reviews.
- **Mongoose**: An ODM (Object Data Modeling) library to interact with MongoDB.
- **JWT (JSON Web Token)**: Used for securing routes and authenticating users.
- **Bcrypt.js**: A library for hashing passwords before saving them to the database.
- **Cors**: For enabling cross-origin resource sharing between the client and server.
- **dotenv**: For managing environment variables in the application.

## Installation

### Prerequisites

- Node.js (v14 or above)
- npm (v6 or above)
- MongoDB (either locally or a cloud-based solution like MongoDB Atlas)

### Clone the Repository

To get started with the project locally, clone the repository:

```bash
git clone https://github.com/yourusername/scholarship-management-web-server.git
