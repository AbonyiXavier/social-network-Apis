# social-network-Apis
API for imaginary social network

[![npm version](https://badge.fury.io/js/nestjs.svg)](https://badge.fury.io/js/nestjs)
[![npm version](https://badge.fury.io/js/graphql.svg)](https://badge.fury.io/js/graphql)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#features-implemented)
- [Working Routes](#working-routes)
- [Improvements](#improvements)
- [License](#license)


# Introduction

This is a RESTful API for an imaginary social network.

### Project Structure

```bash
├── src
├── test
├── .env.sample
├── .eslintrc
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── Makefile
├── nest-cli.json
├── package.json
├── README.md
└── tsconfig.build.json
└── tsconfig.json
```

### Project Database Architecture

User Model
- id
- userName
- fullName
- email
- password
- refreshToken
- dateOfBirth
- profilePictureUrl
- createdAt
- updatedAt
- posts (Post model)

Post Model
- id
- title
- content
- picture
- author (User model)
- authorId (Foreign key from User model)
- createdAt
- updatedAt
- deletedAt

The diagramatic representaion of the models can be found here 

![ER-Diagram](https://github.com/AbonyiXavier/social-network-Apis/assets/49367987/db7452c8-47f4-4f0d-b3a9-fa694678b45d)
### Features Implemented

- Sign up
- Sign in
- Create tokens ( A refresh token when access token get expired) 
- Logout
- Get a single user (userMe)
- Fetch users with pagination
- Change of password
- Update user information
- Upload user profile picture
- Create post with either with picture upload or not
- Fetch posts with pagination
- Fetch single post
- Fetch posts by author
- Soft delete post bt author
- Update post by author with either with picture upload or not
- SearchBy implementation for post and user



# Getting Started

### Dependencies

This project uses [Nest.js](https://docs.nestjs.com/) It has the following dependencies:

- [GraphQl](https://graphql.org/)
- [Postgres Database](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- ESLint & Prettier

#### _Prerequisites_

- Ensure you have **NodeJS** installed by entering `node -v` on your terminal
  If you don't have **NodeJS** installed, go to the [NodeJS Website](http://nodejs.org), and follow the download instructions

### Getting the Source

You can clone this project directly using this command:

```sh
git clone https://github.com/AbonyiXavier/social-network-Apis
```

### Installation & Usage

- After cloning the repository, create a `.env` file from `.env.sample` and set your local `.env.` variable(s).

```sh
cp .env.sample .env
```

- Install the dependencies

```sh
yarn install
```

- You can run the server using

```sh
yarn run start:dev
```

### Using the Makefile to Testing
How to run all tests locally

1. `make install` - Installs dependencies.
2. `make dev` - Run the server
3. `make build` 
4. `make gen-migrate` - Generate migration.
5. `make lint` - Lint code.
6. `make studio` - Opens up a prisma virtual interface for your database
6. `make up` - Start up your app from docker-compose.yml file
# Working Routes

## _API Endpoints_

- Public API documentation of this project is available on [postman docs](https://documenter.getpostman.com/view/7775892/2s93sc5CvS)

# Improvements

- The authentication flow could have email notification sent to users upon signing up for verification to avoid bot users registering to our system.

- Forget and reset password should be considered as part of the authentication flow.

- The cloudStorageService such as (e.g., AWS S3, Google Cloud Storage, cloudinary) should be responsible for handling the file upload (The post picture or user profilePictureUrl) to a cloud storage system instead of saving them into a local directory (./src/upload).

- Implement Role and Permission privileges.

- We could have more models such Comment, Like, Follower or Friendship with extended feature of implementing mentions, hashTags, liking a post and comments and been able to follow a user.
     
# License :boom:

This project is under the MIT LICENSE