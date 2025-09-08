# Service Booking Application

This is a full-stack service booking application with a React frontend and a Node.js/Express backend. It supports user authentication, role-based access control (User, Manager, Admin), and booking management.

## Features

### User Features
- User registration and login
- Create new bookings
- View personal booking history
- User dashboard

### Manager Features
- Manager login
- View all bookings
- Manager bookings status

### Admin Features
- Admin login
- User management (CRUD)
- Manager management (CRUD)
- Admin dashboard

## Technologies Used

### Frontend (Client)
- **React**: A JavaScript library for building user interfaces.
- **React Router DOM**: For declarative routing in React applications.
- **Redux Toolkit**: For efficient state management.
- **Axios**: For making HTTP requests to the backend API.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Vite**: A fast build tool for modern web projects.
- **date-fns**: A modern JavaScript date utility library.
- **lucide-react**: A collection of beautiful open-source icons.
- **react-toastify**: For displaying toast notifications.

### Backend (Server)
- **Node.js**: JavaScript runtime environment.
- **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: A NoSQL database for storing application data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **bcryptjs**: For hashing passwords.
- **jsonwebtoken**: For creating and verifying JSON Web Tokens for authentication.
- **cors**: Middleware to enable Cross-Origin Resource Sharing.
- **dotenv**: To load environment variables from a `.env` file.
- **helmet**: Helps secure Express apps by setting various HTTP headers.
- **morgan**: HTTP request logger middleware for Node.js.
- **express-validator**: For server-side input validation.
- **nodemon**: A tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

## Project Structure

The project is divided into two main directories: `client` and `server`.

### `client/`
- **`public/`**: Static assets.
- **`src/`**:
    - **`assets/`**: Images and other static assets.
    - **`components/`**: Reusable React components (e.g., `Button.jsx`, `Card.jsx`, `BookingForm.jsx`).
        - **`bookings/`**: Components related to booking functionality.
        - **`common/`**: Generic UI components.
        - **`layout/`**: Layout components (e.g., `Navbar.jsx`, `SideBar.jsx`).
    - **`context/`**: React Context API for global state (e.g., `ThemeContext.jsx`).
    - **`pages/`**: Application pages (e.g., `Login.jsx`, `UserDashboard.jsx`, `CreateBooking.jsx`).
        - **`admin/`**: Admin-specific pages.
        - **`auth/`**: Authentication pages.
        - **`bookings/`**: Booking-related pages.
        - **`dashboard/`**: Dashboard pages for different roles.
        - **`profile/`**: User profile page.
    - **`services/`**: API service calls (e.g., `api.js`, `authService.js`).
    - **`store/`**: Redux store configuration and slices.
        - **`slices/`**: Redux slices for different features (e.g., `authSlice.js`, `bookingSlice.js`).
    - **`styles/`**: Global CSS styles.
    - **`utils/`**: Utility functions and constants (e.g., `constants.js`, `helpers.js`, `history.js`, `validators.js`).
    - **`App.jsx`**: Main application component, defining routes and protected routes.
    - **`main.jsx`**: Entry point for the React application, setting up Redux, ThemeProvider, and HistoryRouter.
    - **`index.css`**: Main CSS file.

### `server/`
- **`app.js`**: Configures Express app, middlewares, and API routes.
- **`server.js`**: Entry point for the backend, connects to MongoDB, seeds admin user, and starts the server.
- **`src/`**:
    - **`config/`**: Database connection configuration (`database.js`).
    - **`controllers/`**: Handles request logic for different routes (e.g., `auth.js`, `bookings.js`).
    - **`middleware/`**: Custom middleware (e.g., `auth.js` for JWT verification, `validation.js`).
    - **`models/`**: Mongoose schemas for data models (e.g., `Booking.js`, `User.js`).
    - **`routes/`**: Defines API endpoints (e.g., `auth.js`, `bookings.js`, `users.js`).
    - **`seed/`**: Script to seed initial admin user data (`adminSeed.js`).
    - **`services/`**: Business logic and database interactions (e.g., `authService.js`, `bookingService.js`).

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB instance (local or cloud-based like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/alihassan1221/Service-Booking-Platform.git
    cd service-booking
    ```

2.  **Backend Setup:**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server/` directory with the following variables:
    ```
    NODE_ENV=development
    PORT=5000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRE=7d
    ```
    Replace `your_mongodb_connection_string`, `your_jwt_secret`, and `JWT_EXPIRE`.

3.  **Frontend Setup:**
    ```bash
    cd ../client
    npm install
    ```
    Create a `.env` file in the `client/` directory with the following variable:
    ```
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
    (Adjust the URL if your backend runs on a different port or domain).

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd server
    npm run dev
    ```
    The server will start on `http://localhost:5000` (or your specified PORT).

2.  **Start the Frontend Development Server:**
    ```bash
    cd ../client
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173` (or a different port if 5173 is in use).
