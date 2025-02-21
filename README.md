# BabySteps Appointment Booking System

## Overview

BabySteps is a full-stack appointment booking system for a prenatal care service. Users can view a doctor's available time slots and book appointments accordingly. The system ensures that appointment scheduling prevents double bookings by computing available slots based on the doctor’s predefined working hours and existing bookings.
## Tech Stack

**Backend:** Node.js, Express.js, MongoDB

**Frontend:** React.js


## Features

### Backend (Node.js + Express + MongoDB)

Doctor Management:
- Create, retrieve, and manage doctors and their working hours.
- Compute available appointment slots dynamically.

Appointment Management:
- Book, update, delete, and retrieve appointments.
- Ensure no overlapping appointments.
- Validate input data and time slot availability.

Error Handling:
- Proper validation for API requests.
- Graceful error handling with appropriate status codes.

### Frontend (React)

- Doctor Selection Page: List of available doctors.
- Calendar & Slot Selection: Users select a doctor and choose an available time slot.
- Appointment Booking Form: Users enter details to confirm a booking.
- Appointment Management: View, edit, or cancel upcoming appointments.
- Responsive Design: Works across all devices.

Error Handling:
- Proper validation for API requests.
- Graceful error handling with appropriate status codes.


## Installation and Setup

### Backend Setup

1. Clone the Repository
```bash
  git clone https://github.com/abhash-tiwari/baby-steps.git
cd backend
```
2. Install dependencies:
```bash
  npm install
```
3. Configure the .env file with MongoDB URI and other environment variables.

4. Start the server:

```bash
npm start
The backend runs on http://localhost:5000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
  npm install
```
3. Configure the .env file with MongoDB URI and other environment variables.

4. Start the frontend application:

```bash
npm start
```
## API Reference

### Doctor Routes

```http
  GET /api/doctors
```

#### Get a specific doctor by ID

```http
  GET /api/doctors/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Doctor ID to fetch |

#### Get available slots for a doctor on a given date

```http
  GET /api/doctors/${id}/slots?date=YYYY-MM-DD
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Doctor ID |
| `date` | `string` | **Required**. Date in YYYY-MM-DD format |


### Appointment Routes


#### Get all appointments

```http
  GET /api/appointments
```
#### Get a specific appointment by ID
```http
  GET /api/appointments/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Appointment ID to fetch |


#### Create an appointment
```http
  POST /api/appointments
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `doctorId` | `string` | **Required**. ID of the doctor |
| `patientName` | `string` | **Required**. Name of the patient |
| `date` | `string` | **Required**. Date of appointment (YYYY-MM-DD) |
| `time` | `string` | **Required**. Time slot of appointment |

#### Update an appointment

```http
  PUT /api/appointments/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Appointment id to update |

#### Delete an appointment

```http
  DELETE /api/appointments/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Appointment id to Delete |



## Conclusion

This system provides a simple yet efficient solution for managing doctor appointments, ensuring no slot overlaps, and offering a user-friendly interface. The structured API and modular React components make it easy to extend and improve in future iterations.
