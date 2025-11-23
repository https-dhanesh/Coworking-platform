# CoWork Platform: Workspace Marketplace (Full-Stack MERN)

**Live Application :** [Co-working Platform](https://co-working-platform.vercel.app/)

---

## 🚀 Project Overview

The CoWork Platform is a professional, full-stack application designed to connect space owners with users seeking niche, flexible workspaces.

### Key Features Implemented:

* ✅ **Complete Authentication:** Secure user registration/login via JWT and `bcrypt` password hashing.
* 🔒 **Role-Based Access Control:** Middleware enforces security, ensuring only authenticated owners can create, update, or delete spaces.
* 💼 **Owner Management:** Full CRUD (Create, Read, Update, Delete) functionality for managing listings, including image updates.
* 💰 **Transactional Booking System (Phase 2):** Implemented a full booking flow that includes date conflict checking and a no-self-booking business rule.
* 💳 **Real-World Payment Flow:** Integrated **Razorpay** (in test mode) to handle payment order creation and secure signature verification on the backend.
* 🔍 **Advanced Discovery:** Text-based search and amenity filtering (e.g., Wi-Fi, Parking) across all listings.
* ⚡ **Performance & UX:** Frontend refactored with **TanStack Query** for client-side caching, eliminating slow loading spinners and unnecessary data re-fetching.
* 📸 **Cloud Media Handling:** Integrated **Cloudinary** for scalable image storage and serving.

---

## 🛠️ Tech Stack

This project is structured as a Monorepo (Client and Server in one repository) and utilizes a multi-cloud deployment strategy.

### Frontend (Client)
| Component | Technology | Role |
| :--- | :--- | :--- |
| **Framework** | React.js | UI development (SPA) |
| **Language** | TypeScript | Type safety and robust code |
| **Routing** | React Router | Client-side navigation |
| **Styling** | Tailwind CSS | Utility-first styling and responsiveness |
| **State/Caching** | **TanStack Query** | High-performance data synchronization and caching |
| **Requests** | Axios | API communication |

### Backend (Server)
| Component | Technology | Role |
| :--- | :--- | :--- |
| **Runtime** | Node.js | Server runtime |
| **Framework** | Express.js | REST API definition |
| **Database** | **MongoDB** (via Mongoose) | Flexible, NoSQL data persistence |
| **Security** | JWT, bcrypt | Token-based authentication and hashing |
| **Payment** | Razorpay SDK | Payment order creation and signature verification |
| **File Handling** | Multer | File upload parsing |

### Deployment & DevOps
| Component | Platform/Tool | Role |
| :--- | :--- | :--- |
| **Code Hosting** | Git / GitHub | Version Control |
| **Database Host** | **MongoDB Atlas** | Always-on cloud database hosting |
| **Frontend Host** | Vercel | Static hosting (Client) |
| **Backend Host** | Render | Managed Node.js service (API) |

---

## ⚙️ Local Development Setup

To get a local version of this project , please follow these steps:

### **Prerequisites**
* Node.js (LTS version)
* npm
* A running instance of **MongoDB** (local or Atlas)

# Clone the repository

```
git clone [https://github.com/https-dhanesh/Coworking-platform.git](https://github.com/https-dhanesh/Coworking-platform.git)
```

### Configure Environment variables

Create a file named .env inside the server directory. Populate it with your development secrets (these keys are sensitive and should not be shared or committed):

```
# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://dhanesh:<YOUR_DB_PASSWORD>@cluster.mongodb.net/coworking-db-v2?retryWrites=true&w=majority

#### Security Keys
JWT_SECRET=YOUR_SECURE_RANDOM_STRING
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET

####  Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Start the Backend API (Server)
```
# Navigate to the server folder
cd server
npm install
npm run dev
```

### Start the Frontend Application (Client) :
```
# Navigate back to the client folder
cd ../client
npm install
npm run dev
```

(The application will open in your browser at http://localhost:5173)
