# 🏥 Hospital Management System

A full-stack web application for managing hospital operations — including patient records, appointments, doctor schedules, billing, and more — built with **React**, **Spring Boot**, **Hibernate**, and **SQL**.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Admin Panel](#admin-panel)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [License](#license)

---

## Overview

The Hospital Management System (HMS) is designed to digitize and streamline hospital workflows. It provides role-based access for administrators, doctors, and receptionists to manage day-to-day hospital operations efficiently.

---

## ✨ Features

- **Patient Management** — Register, update, and view patient records
- **Doctor Management** — Manage doctor profiles, specializations, and availability
- **Appointment Scheduling** — Book, reschedule, and cancel appointments
- **Billing & Invoicing** — Generate and track patient bills
- **Admin Panel** — Centralized dashboard for managing patients, doctors, appointments, and hospital revenue
- **Role-Based Access Control** — Admin, Doctor, and Receptionist roles
- **Dashboard & Reports** — Overview of daily operations and statistics
- **Medical Records** — Store and retrieve patient history and prescriptions

---

## 🔧 Admin Panel

The system includes a dedicated **Admin Panel** accessible only to users with the `ADMIN` role. It provides full control over the hospital's operations from a single dashboard.

### 👥 Manage Patients
- View the complete list of registered patients
- Add new patients directly from the admin panel
- Edit patient details (contact info, blood group, address, etc.)
- Delete patient records
- Search and filter patients by name, ID, or status

### 🩺 Manage Doctors
- Add, edit, or remove doctor profiles
- Assign specializations and departments
- View doctor availability and schedules
- Activate or deactivate doctor accounts

### 📅 Manage Appointments
- View all appointments across doctors and patients
- Book appointments on behalf of patients
- Reschedule or cancel any appointment
- Filter appointments by date, doctor, or status (Pending / Confirmed / Completed / Cancelled)

### 💹 Hospital Revenue
- View total revenue generated over a selected period
- Breakdown of revenue by department or doctor
- Track paid vs. unpaid bills
- Export revenue reports for accounting purposes

> The Admin Panel is accessible at `http://localhost:3000/admin` after logging in with an admin account.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Java, Spring Boot |
| ORM | Hibernate (JPA) |
| Database | SQL (MySQL / PostgreSQL) |
| Authentication | Spring Security / JWT |
| Build Tool | Maven |

---

## 📸 Screenshots

**Home**
<img width="1911" height="908" alt="image" src="https://github.com/user-attachments/assets/9c9cf467-3df5-4561-82be-baf60d517cfb" />


<img width="1920" height="910" alt="image" src="https://github.com/user-attachments/assets/2b53df8c-2ac1-49ab-bb22-74a2816206bd" />


<img width="1920" height="904" alt="image" src="https://github.com/user-attachments/assets/7c9a34d9-1b07-4c33-93d9-ae299e791852" />



### Appointment Booking
<img width="1920" height="919" alt="image" src="https://github.com/user-attachments/assets/449be542-f9d4-42ae-9280-e9c9679fbdac" />

### Dashboard
<img width="1920" height="904" alt="image" src="https://github.com/user-attachments/assets/05e0e87c-9ce7-4aa9-9970-d23f20a16d4d" />



### Admin Panel — Overview
<img width="1920" height="903" alt="image" src="https://github.com/user-attachments/assets/f55f4858-35cc-45da-a5ee-f1a74860281d" />

<img width="1920" height="907" alt="image" src="https://github.com/user-attachments/assets/5da75b4c-f45d-457f-b80e-a2936ffb9a28" />





### Admin Panel — Manage Patients
<img width="1920" height="894" alt="image" src="https://github.com/user-attachments/assets/5dd9d75f-bcf2-474a-90ca-fbb9a8d90c59" />


### Admin Panel — Manage Doctors
<img width="1920" height="888" alt="image" src="https://github.com/user-attachments/assets/3f4940b6-aea6-4442-b84e-37a8db1733bf" />


### Admin Panel — Appointments
<img width="1920" height="902" alt="image" src="https://github.com/user-attachments/assets/3a583610-f084-48b1-a2a1-798665f8a096" />





---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+ & npm
- MySQL or PostgreSQL
- Maven 3.8+

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/your-username/hospital-management-system.git
cd hospital-management-system/backend

# Configure your database in src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/hms_db
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update

# Build and run
mvn clean install
mvn spring-boot:run
```

The backend will start at `http://localhost:8080`.

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start at `http://localhost:3000`.

---

## 📡 API Documentation

Base URL: `http://localhost:8080/api`

All endpoints (except login/register) require a Bearer token in the `Authorization` header.

---

### 🔐 Authentication

#### `POST /auth/login`
Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "username": "admin@hospital.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ADMIN"
}
```

---

### 👤 Patients

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/patients` | Get all patients |
| `GET` | `/patients/{id}` | Get patient by ID |
| `POST` | `/patients` | Register a new patient |
| `PUT` | `/patients/{id}` | Update patient details |
| `DELETE` | `/patients/{id}` | Delete a patient record |

**Example — Create Patient:**

`POST /patients`

```json
{
  "name": "John Doe",
  "age": 35,
  "gender": "Male",
  "phone": "9876543210",
  "address": "123 Main Street",
  "bloodGroup": "O+"
}
```

---

### 🩺 Doctors

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/doctors` | Get all doctors |
| `GET` | `/doctors/{id}` | Get doctor by ID |
| `POST` | `/doctors` | Add a new doctor |
| `PUT` | `/doctors/{id}` | Update doctor info |
| `DELETE` | `/doctors/{id}` | Remove a doctor |

---

### 📅 Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/appointments` | List all appointments |
| `GET` | `/appointments/{id}` | Get appointment by ID |
| `POST` | `/appointments` | Book an appointment |
| `PUT` | `/appointments/{id}` | Update / reschedule |
| `DELETE` | `/appointments/{id}` | Cancel an appointment |

**Example — Book Appointment:**

`POST /appointments`

```json
{
  "patientId": 1,
  "doctorId": 3,
  "date": "2024-12-15",
  "time": "10:30",
  "reason": "General Checkup"
}
```

---

### 💰 Billing

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/billing/{patientId}` | Get bills for a patient |
| `POST` | `/billing` | Create a new bill |
| `PUT` | `/billing/{id}` | Update payment status |

### 🔧 Admin

> All `/admin` endpoints require the `ADMIN` role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/dashboard` | Get dashboard summary (patients, doctors, revenue) |
| `GET` | `/admin/patients` | Get all patients (with filters) |
| `GET` | `/admin/doctors` | Get all doctors (with filters) |
| `GET` | `/admin/appointments` | Get all appointments (with filters) |
| `GET` | `/admin/revenue` | Get total revenue summary |
| `GET` | `/admin/revenue?from=2024-01-01&to=2024-12-31` | Get revenue for a date range |
| `PUT` | `/admin/patients/{id}` | Edit a patient record |
| `DELETE` | `/admin/patients/{id}` | Delete a patient |
| `PUT` | `/admin/doctors/{id}` | Edit a doctor profile |
| `DELETE` | `/admin/doctors/{id}` | Remove a doctor |
| `PUT` | `/admin/appointments/{id}` | Update appointment status |

**Example — Revenue Summary Response:**

`GET /admin/revenue`

```json
{
  "totalRevenue": 250000.00,
  "paidAmount": 210000.00,
  "pendingAmount": 40000.00,
  "byDepartment": [
    { "department": "Cardiology", "revenue": 85000.00 },
    { "department": "Orthopedics", "revenue": 65000.00 },
    { "department": "General", "revenue": 100000.00 }
  ]
}
```

---

## 🗄 Database Schema

Key tables in the system:

```
patients        — id, name, age, gender, phone, address, blood_group
doctors         — id, name, specialization, phone, department_id
appointments    — id, patient_id, doctor_id, date, time, status
billing         — id, patient_id, amount, payment_status, created_at
users           — id, username, password, role
```

> Hibernate auto-generates the schema on startup based on your entity definitions.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.
