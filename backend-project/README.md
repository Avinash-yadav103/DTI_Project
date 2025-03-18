# Backend Project

## Overview
This project is a backend application built with TypeScript and Express. It provides functionality for saving various types of data and booking appointments. The application connects to a database and exposes RESTful API endpoints for managing appointments and data.

## Project Structure
```
backend-project
├── src
│   ├── controllers
│   │   ├── appointmentController.ts
│   │   └── dataController.ts
│   ├── models
│   │   ├── appointmentModel.ts
│   │   └── dataModel.ts
│   ├── routes
│   │   ├── appointmentRoutes.ts
│   │   └── dataRoutes.ts
│   ├── services
│   │   ├── appointmentService.ts
│   │   └── dataService.ts
│   ├── app.ts
│   └── database.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd backend-project
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Configure the database connection in `src/database.ts`.

5. Start the application:
   ```
   npm start
   ```

## API Endpoints

### Appointments
- **POST /appointments**: Create a new appointment.
- **GET /appointments**: Retrieve all appointments.
- **DELETE /appointments/:id**: Delete an appointment by ID.

### Data
- **POST /data**: Save new data.
- **GET /data**: Retrieve all saved data.
- **DELETE /data/:id**: Delete data by ID.

## Usage Examples
- To create an appointment, send a POST request to `/appointments` with the appointment details in the request body.
- To save data, send a POST request to `/data` with the data details in the request body.

## License
This project is licensed under the MIT License.