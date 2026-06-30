# 🏎️ AutoNova - Premium E-Commerce Platform for Automotive Components

AutoNova is a modern, high-performance, and secure e-commerce web platform engineered for sourcing certified automotive components tailored to precise vehicle factory specifications. Built using a decoupled (headless) architecture, the platform pairs a robust **Spring Boot (Java)** backend with a highly reactive **React (TypeScript)** frontend, backed by a **PostgreSQL** relational database.

---

## 🌟 Key Features

* **Virtual Garage & Dynamic Filtering:** Users can select their vehicle's exact Make, Model, Generation, and Engine. The catalog instantly filters and displays only 100% compatible parts by performing optimized database `JOIN` operations.
* **Reactive Catalog with Live Search:** Instant client-side filtering by product name or unique SKU, delivering lightning-fast results without database overload.
* **Stateless JWT Security (Dual-Token System):** Fully secure authentication using short-lived `accessToken` and database-backed `refreshToken` structures to ensure persistent sessions without straining server memory.
* **Secure Stripe Payment Integration:** Implements Stripe's *PaymentIntents* API. Sensitive credit card details are handled directly through standard secure Stripe iframes (PCI-DSS compliant).
* **Transactional Order Management:** Guarantees absolute data consistency across relational tables via Spring's `@Transactional` annotation. Automatically decrements inventory stocks upon successful tranzaction.
* **Historical Order Tracking:** A safe, URL-manipulation-proof order history view that decodes the user's identity securely from the HTTP Authorization Header.

---

## 📐 Architecture & Tech Stack

### Frontend
* **React 18** & **TypeScript** - Core UI development with strict static typing.
* **Redux Toolkit** - Global state management for shopping cart reactive calculations and auth contexts.
* **Tailwind CSS** - Modern, responsive styling following a premium design system.
* **Axios** - Intercepting and forwarding secure HTTP requests.

### Backend
* **Java 17** & **Spring Boot 3** - RESTful API architecture.
* **Spring Security** & **JWT** - Custom state-interception filter pipelines.
* **Spring Data JPA / Hibernate** - Object-Relational Mapping (ORM).
* **PostgreSQL** - Production-ready relational storage with native table constraints (e.g., `chk_order_status`).

---

## 📸 Application Preview

| Login & Authentication | Virtual Garage & Catalog |
| :---: | :---: |
| <img alt="Login & Authentication" src="https://github.com/user-attachments/assets/7c6e8a7a-48f8-4d23-9ee8-a8c076c80fb1" /> | <img alt="Virtual Garage & Catalog" src="https://github.com/user-attachments/assets/dc71b0d6-383c-4103-a873-945993b02414" /> |

| Reactive Shopping Cart | Secure Stripe Checkout |
| :---: | :---: |
| <img alt="Reactive Shopping Cart" src="https://github.com/user-attachments/assets/89a39fcb-a471-48b0-94ba-d6b31183c72e" /> | <img alt="Secure Stripe Checkout" src="https://github.com/user-attachments/assets/ae1950da-d73b-4cc0-b071-359824b88eff" /> |

---

## 🛠️ Installation & Local Setup

### Prerequisites
* **Java JDK 17** or higher
* **Node.js** (v18+) & **npm**
* **PostgreSQL** instance running locally

### 1. Database Configuration
Create a empty database named `autonova` in PostgreSQL, then update the backend configurations:

```properties
# Location: backend/src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5123/autonova
spring.datasource.username=YOUR_POSTGRES_USERNAME
spring.datasource.password=YOUR_POSTGRES_PASSWORD

# Stripe & JWT Keys
stripe.api.key=your_stripe_secret_key
application.security.jwt.secret-key=your_super_secret_64_character_hex_key
```
### 2. Run the Spring Boot Backend
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```
The server will boot up and bind to **http://localhost:8000**

### 3. Run the React Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will open up in your local browser at **http://localhost:5173**

