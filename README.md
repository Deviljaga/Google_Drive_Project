# ☁️ Google Drive Clone — Microservices Architecture

A cloud-based file storage application inspired by Google Drive, built using **Java, Spring Boot, Microservices, and MySQL**.

The goal of this project is to develop a scalable and maintainable file management system where users can upload, download, retrieve, and delete files. The project is being developed incrementally, with plans to introduce secure authentication, file sharing, and a modern user interface.

> 🚀 **Project Status:** In Development  
> 🛠️ This project is actively evolving, with new features, bug fixes, and architectural improvements planned for future releases.

---

## 📌 Project Overview

This project follows a microservices architecture to separate file metadata management from physical file storage.

The application is designed to provide a centralized platform for managing files, with future support for user authentication, file sharing, access control, and an improved frontend experience.

### 🎯 Main Objectives

- Build a file management system using Spring Boot.
- Implement microservices communication using OpenFeign.
- Store file metadata in MySQL.
- Manage physical files using local storage.
- Improve application reliability through bug fixes and testing.
- Introduce authentication, authorization, and file-sharing capabilities.
- Build a clean, responsive, and modern user interface.

---

## 🏗️ Architecture

The application is being developed using a microservices-based architecture.

```text
                  Client / Frontend
                         |
                         v
                  Drive Service
                         |
                         | OpenFeign
                         v
                 Storage Service
                         |
                         v
                   Local Storage

                  Drive Service
                         |
                         v
                       MySQL
```

### 1. Drive Service

Responsible for managing file metadata and handling client-facing file operations.

Responsibilities:
- File metadata management.
- File upload and download coordination.
- File information retrieval.
- File deletion requests.
- Communication with the Storage Service.

### 2. Storage Service

Responsible for managing the physical files stored on the server.

Responsibilities:
- Store uploaded files.
- Retrieve stored files.
- Delete stored files.
- Handle storage-related operations.

### 3. Database

MySQL is used to persist file metadata, such as file identifiers, filenames, content types, and other relevant information.

*Note: The exact database schema and supported operations depend on the current implementation.*

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Java | Backend programming |
| Spring Boot | Backend application development |
| Spring Web | REST API development |
| Spring Data JPA | Database operations |
| MySQL | Metadata persistence |
| OpenFeign | Inter-service communication |
| Maven | Dependency and build management |
| REST APIs | Communication between clients and services |
| HTML, CSS, JavaScript | Planned frontend development |
| Spring Security | Planned authentication and authorization |
| JWT | Planned token-based authentication |

---

## ✨ Current Features

The following capabilities are part of the project's development scope. Their availability depends on the current implementation.

- 📤 **File Upload:** Upload files through the application.
- 📥 **File Download:** Retrieve files using their identifiers.
- 🔍 **File Retrieval:** Fetch stored file data and metadata.
- 🗑️ **File Deletion:** Remove files from storage.
- 🔗 **Microservices Communication:** Connect Drive Service and Storage Service using OpenFeign.
- 🗄️ **Metadata Persistence:** Store file information in MySQL.
- 📁 **Local File Storage:** Manage physical files on the local filesystem.

---

## 🔐 Future Enhancement Roadmap

This project will be enhanced step by step to make it more secure, reliable, and user-friendly.

### Phase 1: Bug Fixes and Backend Improvements

- Fix existing API errors and unexpected exceptions.
- Resolve inter-service communication issues.
- Improve file upload and download reliability.
- Handle missing files and invalid requests correctly.
- Improve exception handling and API response consistency.
- Validate file metadata and request parameters.
- Add unit and integration tests.
- Improve logging and debugging.

### Phase 2: Spring Security and JWT Authentication

Implement authentication and authorization using Spring Security.

Planned features:
- User registration and login.
- Secure password storage using BCrypt.
- JWT-based authentication.
- Access and refresh token management.
- Role-based authorization.
- Protected REST endpoints.
- User-specific file access.
- Unauthorized and forbidden request handling.

**Security goal:** Each user should be able to access only the files they own or have explicitly been granted permission to access.

### Phase 3: Sharing Service

Develop a separate **Sharing Service** to support secure file and folder sharing.

Planned features:
- Share files with registered users.
- Share files using email addresses.
- Generate shareable links.
- Set file permissions.
- Support viewer and editor roles.
- Revoke sharing permissions.
- Set link expiration dates.
- Validate access before allowing downloads.
- Track sharing activity.

The Sharing Service will communicate with the relevant services through well-defined APIs.

> Sharing permissions must be enforced on the backend. Hiding a file or button in the frontend is not sufficient to protect private data.

### Phase 4: Modern UI Development

Build a professional and responsive interface inspired by modern cloud storage applications.

Planned UI features:
- Clean dashboard.
- Drag-and-drop file uploads.
- File and folder views.
- File search and filtering.
- Upload progress indicators.
- File type icons and previews.
- Rename and delete actions.
- File-sharing dialogs.
- User profile and account settings.
- Responsive layouts for desktop, tablet, and mobile.
- Loading states, error messages, and success notifications.
- Dark mode.

The objective is to provide a smooth and intuitive experience rather than just a collection of API endpoints.

### Phase 5: Advanced Features

Potential future enhancements include:

- Folder creation and management.
- File versioning.
- Recycle bin and file recovery.
- Storage usage dashboard.
- Pagination and sorting.
- File size limits.
- Duplicate file detection.
- Audit logs.
- Rate limiting.
- Docker-based deployment.
- Cloud object storage integration.
- CI/CD pipeline.
- Production deployment and monitoring.

---

## 🔄 Development Strategy

The project will be developed incrementally.

1. Stabilize the existing Drive and Storage services.
2. Fix bugs and improve API error handling.
3. Add automated tests.
4. Implement Spring Security and JWT authentication.
5. Introduce user-specific file ownership.
6. Develop the Sharing Service.
7. Build and integrate the frontend.
8. Improve performance and security.
9. Containerize and deploy the application.

Each phase will be tested before moving to the next stage.

---

## 🧪 Testing

The application will be tested using tools such as Postman and automated testing frameworks.

Planned test scenarios include:

- Successful file upload and download.
- Requests for nonexistent files.
- File deletion and retrieval after deletion.
- Invalid request handling.
- Drive Service and Storage Service communication.
- Unauthorized access attempts.
- File ownership validation.
- Sharing permission validation.
- Concurrent file operations.

---

## 🚀 Getting Started

### Prerequisites

Install the following tools:

- Java JDK
- Maven
- MySQL
- Git
- Postman
- An IDE such as IntelliJ IDEA, Eclipse, or VS Code

### Setup Instructions

**1. Clone the repository**

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

**2. Open the project**

Open the project in your preferred IDE.

**3. Configure MySQL**

Create the required database and configure the connection settings in the relevant service's `application.properties` or `application.yml` file.

**4. Configure service ports**

Check each service's configuration and ensure that its port, database connection, and storage directory are correct.

**5. Build the services**

Run the following command from each Spring Boot service directory:

```bash
mvn clean install
```

**6. Start the services**

Start the required services in the correct order, based on their dependencies and configuration.

**7. Test the APIs**

Use Postman to test the implemented endpoints.

> The exact database name, port numbers, API endpoints, and environment variables should be documented according to the current source code.

---

## 🔒 Security Considerations

Security is an important part of the planned development.

Future security improvements will include:

- Secure password hashing.
- JWT authentication.
- Authorization checks for file operations.
- Ownership validation.
- Permission checks for shared files.
- File upload validation.
- Protection against unauthorized file access.
- Secure handling of secrets and configuration.

Until these protections are implemented and verified, the application should be treated as a development project rather than a production-ready cloud storage service.

---

## 📈 Project Status

| Component | Status |
|---|---|
| Drive Service | Under development |
| Storage Service | Under development |
| MySQL integration | Under development |
| OpenFeign communication | Under development |
| Bug fixing and testing | Ongoing |
| Spring Security and JWT | Planned |
| Sharing Service | Planned |
| Modern frontend UI | Planned |
| Docker deployment | Future enhancement |

---

## 🎯 Learning Outcomes

This project provides practical experience with:

- Java and Spring Boot.
- REST API development.
- Microservices architecture.
- Inter-service communication using OpenFeign.
- MySQL and Spring Data JPA.
- File handling and local storage.
- API testing and debugging.
- Authentication and authorization concepts.
- Software maintenance and incremental development.

---

## 🤝 Contributions

Suggestions, bug reports, and improvement ideas are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the changes.
5. Submit a pull request.

---

## 👨‍💻 Author

**Jagannath**

Java Backend Developer | Spring Boot | Microservices

Interested in backend development, scalable applications, API design, and secure software systems.

---

## ⭐ Project Vision

The long-term vision is to transform this project into a secure and user-friendly cloud storage platform with authentication, file sharing, access control, and a modern interface.

**Build → Test → Secure → Share → Improve → Deploy**

This is a learning project focused on continuously improving backend engineering skills and building a more complete, production-oriented application.
