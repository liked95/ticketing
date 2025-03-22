# Ticketing System Project

This project is a **Node.js/NATS streaming microservice app** designed for managing tickets. It includes several services like authentication, orders, payments, and reviews, all built using a **microservices architecture**. The project utilizes technologies such as Node.js, TypeScript, MongoDB, and NATS for messaging.

Each service has its own **unit tests** to ensure the stability and correctness of the application. The project is deployed using **Kubernetes (K8s)** with **Kustomize**, and the Continuous Integration and Continuous Deployment (CI/CD) pipeline is set up using **GitHub Actions**. It is deployed on **DigitalOcean Droplets** for production.

## Main Function Points
- **Ticket management**: Users can create, update, and toggle the status of tickets
- **Authentication**: Users can authenticate and access the system
- **Orders**: Users can manage orders related to tickets
- **Payments**: Users can make payments for tickets
- **Reviews**: Users can leave reviews for tickets

## Technology Stack
- **Node.js**: Core technology for building the microservices
- **TypeScript**: Used for static typing and development efficiency
- **MongoDB**: Database for storing ticket data
- **NATS (message broker)**: Used for communication between microservices
- **Kubernetes**: For deployment and orchestration of services
- **Kustomize**: For managing Kubernetes configurations
- **GitHub Actions**: For setting up CI/CD pipelines
- **DigitalOcean Droplets**: For hosting the application in production

## Number of Services
- **5 Core Services**: Authentication, Orders, Payments, Reviews, and Ticket Management
