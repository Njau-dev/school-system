# 🏫 School-System  
**Role-Based Assignment Management Platform for Educational Institutions**  
✨ Built with React, Node.js, MySQL, and Backblaze  

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)  
![Hosted on Vercel](https://img.shields.io/badge/Frontend-Vercel-%23000000?logo=vercel)  
![Hosted on Render](https://img.shields.io/badge/Backend-Render-%2300B5E2?logo=render)  
![MySQL on Railway](https://img.shields.io/badge/Database-Railway-%230B0D0E?logo=railway)  

---

## 🖥️ **Preview**  
<div align="center">
  <strong>Role-Specific Dashboards</strong><br><br>
  <img src="https://github.com/user-attachments/assets/cf42428d-57f9-4fe5-b1d3-178241f64c0b" width="30%" alt="Admin Dashboard" />
  <img src="https://github.com/user-attachments/assets/c8cd9322-9eb0-4f59-bac2-6ce6d75c589c" width="30%" alt="Lecturer Dashboard" />  
  <img src="https://github.com/user-attachments/assets/3479623a-d925-4759-9702-80cd78a5bf4d" width="30%" alt="Student Dashboard" />
</div> 

---

## 🚀 **Features**  
### Role-Based Access Control  
- **🎓 Students**:  
  - View active assignments  
  - Submit files/documents (stored on Backblaze)  
  - Check grades  
- **👨🏫 Lecturers**:  
  - Create/delete assignments  
  - Grade student submissions  
- **👑 Admins**:  
  - Manage users & roles  
  - Monitor all assignments/submissions  
  - Audit system activity  

### Tech Highlights  
- 🔐 **Secure Authentication**: JWT-based access control  
- 📁 **File Handling**: Backblaze B2 cloud storage integration  
- 🎨 **Role-Tailored UI**: Unique layouts for each role (Material UI + Tailwind)  

---

## ⚡ **Live Demo**  
Experience the platform: [Live Demo](https://school-system-beta.vercel.app)  

---

## 🛠️ **Local Setup**  
### Prerequisites  
- Node.js v18+  
- MySQL 8.0+  

### Steps  
1. Clone the repository:  
   ```bash
   git clone https://github.com/Njau-dev/school-system.git

    Backend Setup:
    bash
    Copy

    cd school-system/back-end
    npm install
    # Configure .env with your MySQL/Backblaze credentials
    npm run dev

    Frontend Setup:
    bash
    Copy

    cd school-system/front-end
    npm install
    npm run dev

🔧 Tech Stack
Layer	Technologies
Frontend	React 18, Tailwind CSS, Material UI, Axios
Backend	Node.js, Express, JWT, Multer (file uploads)
Database	MySQL (hosted on Railway)
Storage	Backblaze B2 Cloud
🌟 Future Plans

    📚 Course management system

    🚨 Custom error pages for invalid routes

    📊 Analytics dashboard for admins

📜 License

Distributed under the MIT License. See LICENSE for details.

<div align="center"> <sub>Built with ❤️ by Jeff Njau</sub> <br> ![GitHub](https://img.shields.io/badge/View%20Code-GitHub-black?logo=github)](https://github.com/Njau-dev/school-system)*Special thanks to Vercel, Render, and Railway for hosting support* </div>
