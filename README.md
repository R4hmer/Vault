# Vault

## Idea Management & Development Platform

Vault is a digital idea-management platform designed for people who constantly generate ideas but struggle to organize, evaluate, and develop them.

Instead of allowing ideas to remain scattered across notes, conversations, screenshots, and unfinished documents, Vault provides a structured space where users can capture ideas, organize them, track their development, and turn them into actionable work.

The project began as a React-based frontend application and was subsequently extended into a full-stack application with a Flask backend, relational data models, authentication, and user-owned data.

### Live Application

[Vault — Live Demo](https://vault-three-eta.vercel.app/)

---

## Problem

People often have more ideas than they have systems for managing them.

Ideas can be forgotten, duplicated, abandoned, or remain undeveloped because there is no structured process for moving from:

**Idea → Evaluation → Planning → Action**

Vault was created to address this problem by giving users a dedicated place to capture ideas and progressively develop them.

---

## Solution

Vault allows users to:

* Create and store ideas
* Add descriptions and categorize ideas
* Mark ideas as public or private
* Track an idea's development status
* Open an idea to view additional details
* Break ideas into actionable roadmap tasks
* Create, edit, and delete tasks
* Explore publicly shared ideas
* Interact with public ideas through feedback and engagement features
* Create an account and log in
* Access user-specific content through ownership controls

The application is designed around the idea that an idea should not simply be stored — it should have a path toward becoming something actionable.

---

## Core Features

### Idea Management

Users can create ideas with information such as:

* Title
* Description
* Category
* Privacy
* Development status

Ideas can move through different stages such as:

* Draft
* Building
* Completed

### Quick Add

The Quick Add interface allows users to capture a new idea without navigating through a complicated workflow.

### Idea Details

Opening an idea provides a more detailed view where users can interact with the idea and manage its development.

Private ideas can be developed through roadmap tasks, allowing a larger idea to be broken down into smaller actionable steps.

Public ideas can be shared with other users and can receive feedback and engagement.

### Explore

The Explore view allows users to discover publicly available ideas and interact with shared content.

### Authentication

Vault includes user registration and login functionality.

Authenticated users can access their own content and perform actions on resources they own.

### User Ownership

User-owned resources are associated with the account that created them. Backend ownership checks are used to restrict modification and deletion of user-owned resources.

### Notifications

The application includes a notification view for user activity and interactions.

### Profile

Users can view and manage their account information through their profile.

---

## Technology Stack

### Frontend

* React
* JavaScript 
* JSX
* React Router
* Vite
* CSS
* Fetch API

### Backend

* Python
* Flask
* SQLAlchemy
* RESTful API architecture

### Database

* SQLite for development
* Relational data models designed for the application's resources

### Development Tools

* Git
* GitHub
* Vite
* Node.js
* Python virtual environments
* Vercel

---

## Project Structure

```text
Vault/
├── backend/
│   ├── app/
│   │   ├── models.py
│   │   ├── ownership.py
│   │   └── routes/
│   │       ├── auth.py
│   │       ├── comments.py
│   │       ├── favourites.py
│   │       ├── ideas.py
│   │       ├── likes.py
│   │       ├── misc.py
│   │       ├── notifications.py
│   │       └── tasks.py
│   ├── config.py
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Comments.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── IdeaCard.jsx
│   │   │   ├── IdeaDetails.jsx
│   │   │   ├── QuickAdd.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── VaultCard.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Vault.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── api/
├── vercel.json
└── README.md
```

---

# API

Vault communicates with a custom REST API built with Flask.

The backend is responsible for handling application data and business logic rather than relying entirely on frontend state.

## Main API Resources

### Authentication

```text
POST /auth/register
POST /auth/login
```

Used to create accounts and authenticate users.

### Ideas

```text
GET    /ideas
GET    /ideas/:id
POST   /ideas
PUT    /ideas/:id
DELETE /ideas/:id
```

These endpoints provide CRUD functionality for user ideas.

### Tasks

```text
GET    /tasks
POST   /tasks
PUT    /tasks/:id
DELETE /tasks/:id
```

Tasks are related to ideas and provide the roadmap/action layer of Vault.

### Comments

```text
GET    /comments
POST   /comments
DELETE /comments/:id
```

Comments provide feedback and interaction around shared ideas.

Additional API resources handle likes, favourites, notifications, and related application functionality.

---

# Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Python 3
* Git

---

## Clone the Repository

```bash
git clone https://github.com/R4hmer/Vault.git
cd Vault
```

---

# Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the required environment configuration for the API URL.

For example:

```text
VITE_API_URL=http://127.0.0.1:5000
```

Start the development server:

```bash
npm run dev
```

The frontend will then be available through the local Vite development URL.

---

# Backend Setup

From the project root:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python3 -m venv venv
```

Activate it on Linux/macOS:

```bash
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask application:

```bash
python run.py
```

The frontend can then communicate with the Flask API running locally.

---

# Environment Variables

Environment variables are used for configuration such as the frontend API URL and deployment configuration.

Sensitive environment files are intentionally excluded from version control.

Create the appropriate `.env` files locally when running Vault in development.

Do not commit API keys, database credentials, or other secrets to GitHub.

---

# Development Process

Vault was developed incrementally rather than as a single application.

### Phase 1 — React Application

The initial version focused on:

* React component architecture
* React Router
* Dynamic data fetching
* State management
* Loading and error states
* Interactive UI
* Responsive page structure
* Public idea exploration

### Phase 2 — Full-Stack Extension

The application was then extended with:

* Flask backend
* Relational data models
* REST API endpoints
* CRUD operations
* User accounts
* Authentication
* User-owned data
* Ownership enforcement
* Tasks and roadmap functionality
* Comments and engagement
* Notifications

The project is structured so that the frontend communicates with the backend through API requests rather than directly managing persistent application data.

---

# Challenges & Known Issues

Developing Vault introduced several challenges, particularly around connecting the React frontend to a deployed backend.

### Frontend–Backend Integration

One of the main challenges was connecting the React frontend to the Flask API across development and production environments.

Local development and Vercel deployment require different API configuration, which made environment-variable management an important part of the deployment process.

### Deployment

The application is deployed through Vercel. Deployment introduced additional debugging challenges involving API routes, environment configuration, and production requests.

The live deployment is available for demonstration, but some production functionality may require further refinement.

### Authentication State

The frontend currently maintains authentication-related state on the client and synchronizes authentication changes across components.

This area is planned for further improvement as the authentication architecture is refined.

### Future Improvements

Potential future improvements include:

* More robust authentication/session handling
* PostgreSQL production database configuration
* Improved deployment architecture
* Better validation and error messages
* Additional idea discovery and filtering
* More advanced notifications
* Idea analytics and progress tracking
* Improved mobile responsiveness
* Additional testing coverage

---

# What I Learned

Building Vault provided practical experience with the transition from a frontend-only React application to a full-stack system.

Key areas of learning included:

* Structuring React applications into reusable components
* Managing state with React hooks
* Using React Router for navigation
* Working with asynchronous JavaScript and Fetch
* Designing REST API endpoints
* Connecting a React frontend to a Flask backend
* Designing relational data models
* Implementing CRUD operations
* Implementing authentication
* Enforcing ownership of user-created resources
* Debugging frontend/backend integration problems
* Managing environment variables
* Using Git branches and commits during development
* Deploying a full-stack application

---

# Future Direction

Vault is designed to continue beyond the current implementation.

The long-term goal is to develop Vault into a complete idea-to-execution platform where users can capture ideas, evaluate them, receive feedback, develop structured roadmaps, and track progress toward execution.

Future versions can expand into features such as:

* Idea scoring and evaluation
* Collaboration
* Advanced search
* Idea recommendations
* Progress analytics
* AI-assisted idea development
* Richer project planning tools

---

## Author

**R4hmer**

GitHub: https://github.com/R4hmer/Vault
