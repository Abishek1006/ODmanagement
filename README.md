```markdown
# 🚀 E-OD: Events and OD Management Platform

A **comprehensive platform** to streamline On-Duty (OD) management and event organization for educational institutions.

---

## 🌟 Overview

The **E-OD System** revolutionizes the traditional paper-based OD approval process by providing a **digital platform** that connects students, teachers, and administrators. It simplifies event participation tracking and OD approvals while maintaining proper hierarchical authorization.

---

## ✨ Features

### **For Students**
- Digital OD request submission
- Event registration and participation
- Real-time OD approval status tracking
- Personal dashboard with event history
- Profile management
- Immediate OD requests for urgent situations

### **For Teachers/Staff**
- Course management dashboard
- OD approval interface
- Student attendance tracking
- Profile and course updates
- Automated notifications

### **For Administrators**
- User management
- Event oversight
- System monitoring
- Role assignment

---

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

---

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/e-od-system.git
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

5. Start the backend server:
```bash
cd backend
npm start
```

6. Start the frontend development server:
```bash
cd frontend
npm run dev
```

---

## 📂 Project Structure

```
E-ODSYSTEM/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🔗 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### **Events**
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get specific event

### **OD Management**
- `POST /api/od` - Create OD request
- `GET /api/od/history` - Get OD history
- `PUT /api/od/:id` - Update OD status

### **User Management**
- `GET /api/user-details` - Get user profile
- `PUT /api/user-details` - Update user profile
- `GET /api/user-details/courses/enrolled` - Get enrolled courses

---

## 👥 User Roles

- **Students**: Request ODs, register for events
- **Tutors**: First level OD approval
- **Academic Coordinators**: Second level OD approval
- **HODs**: Final level OD approval
- **Teachers**: View student ODs for their courses
- **Event Organizers**: Create and manage events
- **Admins**: System administration

---

## 📞 Contact

Your Name - [@Abishek](https://github.com/Abishek1006)  
Your Name - [@Arjun](https://github.com/Arjun-Debugs)  
Your Name - [@Dulal Roy](https://github.com/DulalRoy12022005)
```
