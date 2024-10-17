
# 🖥️ Online Coding Compiler

An innovative **Online Coding Compiler** that offers a versatile platform for programmers to code, compile, and execute code directly in their web browsers! Designed to provide a fully functional coding environment, our platform aims to empower developers by eliminating the need for local setup and enabling seamless file management, code execution, and collaboration.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Features
- **Multi-language Support:** Write, compile, and execute code in multiple languages including **JavaScript**, **Python**, and **Dart**.
- **User Authentication:** Secure user login and registration to manage user sessions.
- **File Management System:**
  - Create, delete, and organize files and folders.
  - Access files from anywhere.
- **Robust Security:** Secure code execution sandbox using Docker for isolated and safe code execution.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## 🛠️ Tech Stack
- **Frontend:** Next.js, React.js, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (NoSQL for flexible data storage)
- **Code Execution Sandbox:** Docker with Dockerode for isolated code execution
- **API Endpoints**: RESTful APIs for file operations, user authentication, and code execution

## 🏗️ Architecture
The application uses a **client-server architecture** with the frontend built on **Next.js** for a seamless user experience, and a **Node.js** server to handle user requests, authentication, and code execution.

### Application Flow:
1. **User Authentication** - Register, login, and manage sessions.
2. **File Operations** - Create, view, edit, delete, and organize files and folders.
3. **Code Execution** - Securely execute user-submitted code using Docker in isolated environments.

## 🚀 Getting Started
### Prerequisites
- **Node.js** and **npm** installed
- **Docker** installed for code execution

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/online-coding-compiler.git
   cd online-coding-compiler
2. Install the dependencies.
	```bash
	npm install
3. Setting up Docker.
The code execution is handled within Docker containers. To build and run containers
The following docker images have been used to provide runtime for multiple languages
| Language | Docker Image | Description |
|--|--|--|
| Node.js | node:14 | Provides Node.js runtime environment for JavaScript code execution.|
|Python| python:3.9.18-alpine3.18|Provides Python runtime environment for Python code execution.|
4. Run the server.
	```bash
	npm start
