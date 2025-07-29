# Book Management System

A comprehensive full-stack book management system built with React, TypeScript, Node.js, and MongoDB. This application provides complete library management functionality including book cataloging, user management, lending operations, and administrative features.

## 🚀 Features

### 📚 Book Management
- Add, edit, and delete books
- Track book availability and copies
- Search and filter functionality
- ISBN-based book identification
- Genre categorization
- Book cover image support

### 👥 User Management
- User authentication and authorization
- Role-based access control (Admin/Librarian/Member)
- User profiles and preferences
- Reader registration and management

### 📋 Lending System
- Book borrowing and returning
- Due date tracking
- Overdue notifications
- Lending history and audit logs

### 📊 Dashboard & Analytics
- Real-time statistics and metrics
- Visual charts and reports
- Inventory tracking
- User activity monitoring

### 🔔 Notifications
- Email notifications for due dates
- Overdue book alerts
- System notifications

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **ApexCharts** - Data visualization
- **FullCalendar** - Calendar functionality

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email handling

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- MongoDB
- Git

## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Warushika-Wijayarathna/book-management-system-(react).git
cd book-management-system-(react)
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/book-management
JWT_SECRET=your-jwt-secret-key
EMAIL_FROM=your-email@domain.com
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 📁 Project Structure

```
book-management-system-(react)/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── middlewares/       # Custom middlewares
│   │   ├── services/          # Business logic services
│   │   ├── db/               # Database configuration
│   │   └── errors/           # Error handling
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service functions
│   │   ├── types/            # TypeScript type definitions
│   │   ├── layout/           # Layout components
│   │   └── icons/            # SVG icons
│   ├── public/               # Static assets
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔧 Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features Explained

### Authentication System
- JWT-based authentication
- Secure password hashing with bcrypt
- Role-based access control
- Session management with cookies

### Book Catalog
- Complete CRUD operations for books
- ISBN validation and uniqueness
- Genre-based categorization
- Inventory tracking (total vs available copies)
- Image upload and management

### Lending Management
- Borrowing and return workflows
- Due date calculations
- Overdue tracking and notifications
- Comprehensive lending history
- Audit logging for all transactions

### Dashboard Analytics
- Real-time statistics
- Interactive charts and graphs
- Inventory reports
- User activity metrics

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 👨‍💻 Author

**Warushika Wijayarathna**
- GitHub: [@Warushika-Wijayarathna](https://github.com/Warushika-Wijayarathna)

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this project
- Special thanks to the open-source community for the amazing tools and libraries

---

*For detailed API documentation, please refer to the backend documentation or contact the maintainer.*
