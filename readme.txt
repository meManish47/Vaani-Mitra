# Misarticulation Project (lingoleap-ux & sih_backend)

This project consists of two main parts:
1. Frontend (Next.js application)
2. Backend (Node.js/Express application)

Follow the steps below to set up, run, and explore the application on your local machine.

## Prerequisites
- Node.js installed on your machine.
- A MongoDB instance (local or MongoDB Atlas).

---

## 1. Setting up the Backend

The backend is located in the `Backend` folder and runs on port 5000 by default.

### Steps:
1. Open your terminal and navigate to the backend directory:
   cd Backend

2. Install the necessary dependencies:
   npm install

3. Configure Environment Variables:
   Create a `.env` file in the `Backend` directory with the following variables:
   MONGO_URI="your_mongodb_connection_string"
   JWT_SECRET="your_jwt_secret_key"
   PORT=5000

4. Start the backend server:
   npm start
   
   You should see a message like "Server is listening on port 5000...".
   The backend API will be running at http://localhost:5000.

---

## 2. Setting up the Frontend

The frontend is a Next.js application located in the root directory of the project.

### Steps:
1. Open a new terminal tab/window and navigate to the project's root directory:
   cd /Users/manishkumar/Project/Misarticulation-Project

2. Install the frontend dependencies:
   npm install

3. Configure Environment Variables:
   Ensure you have a `.env` file in the root directory with the following required variables (some are already set in the project):
   MONGO_URI="your_mongodb_connection_string"
   TOKEN_SECRET="your_token_secret"
   DOMAIN="http://localhost:3000"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   GEMINI_API_KEY="your_gemini_api_key"

4. Start the frontend development server:
   npm run dev

   The console will output that the application has started and is ready.

---

## 3. How to Surf the App

Once both the backend and frontend servers are successfully running:

1. Open your preferred web browser.
2. Navigate to the frontend URL:
   http://localhost:3000
3. You can now explore the web app, test out the components (like the Hindi Speaking Quiz), and interact with the UI. The frontend will communicate with the backend APIs under the hood.
