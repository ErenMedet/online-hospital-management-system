# Final Project Presentation

**Online Hospital Management System**
TED University — CMPE 313 / SENG 214 Software Engineering · Section 3, Team 6 · Spring 2026

> Content of the team's final presentation, reproduced without the title slide, team-member names or any personal data.

---

## 1. Project description and scope

**What is the project?** The Online Hospital Management System is a web-based platform that centralizes hospital operations for patients and hospital staff.

**Main goals**

- Reduce manual and phone-based appointment handling
- Provide secure access to hospital services
- Support patients, doctors, nurses and front desk staff

**Scope:** appointments, login, test results, prescriptions, dependent profiles, staff workflows and notifications.

---

## 2. Team organisation

A five-person team. Roles were assigned according to the Project Charter and covered project management, development, design, testing and analysis. Every member contributed to requirements, design, documentation, mock-up preparation and presentation development, and the role split supported the production of the SRS, SDD, mock-up, acceptance tests and final presentation.

---

## 3. Development methodology — Waterfall

The **Waterfall model** was chosen: a structured approach where each phase is completed before the next begins. The project required clear documentation, requirement analysis, design, testing and a final presentation.

| Phase | Output |
| --- | --- |
| Requirements | Defined in the [SRS](SRS.md) |
| Design | Documented in the [SDD](SDD.md) |
| Mock-up | Screens prepared against the requirements |
| Testing | Test scenarios created to check requirement coverage |

**Why Waterfall fit:** clear phases, easy traceability, and suitability for a documentation-heavy project. It kept the SRS, SDD, mock-up and acceptance tests consistent with one another.

---

## 4. AI elicitation experience

**NotebookLM** was used to simulate a requirements elicitation meeting with Hospital Administration, turning vague customer needs into clear system requirements.

What the simulation produced:

- A simulated customer–software team dialogue
- Clarification of vague hospital problems and needs
- Identification of functional and non-functional requirements
- Separation of Phase 1 scope from future features
- Support for SRS/SDD consistency checks

**Example questions put to the simulated customer:**

- "What information should front desk staff access?"
- "How should dependent profile management work?"
- "Should appointment cancellation have time restrictions?"
- "How should role-based access be implemented?"

This session is the direct source of several non-functional requirements — the 400–500 daily patient load, 24/7 availability, the status-only front-desk view, consent-based caregiver access and the 10–15 minute session timeout.

---

## 5. Key functional requirements

| # | Area | Summary |
| --- | --- | --- |
| 1 | **Secure login** | ID information plus SMS verification for two-step authentication |
| 2 | **Appointment management** | Patients book, cancel and reschedule appointments |
| 3 | **Medical information** | Patients view and download test results and prescriptions; doctors update prescriptions |
| 4 | **Staff operations** | Front desk staff enter manual appointments, manage schedules and view limited test status |

---

## 6. UML models

| Diagram | What it shows |
| --- | --- |
| **Use case** | Interaction between the four roles — Patient, Doctor, Nurse, Front Desk Staff — and system functions |
| **Class / package** | System structure, entities, modules and relationships (User, Patient, Doctor, Appointment, MedicalRecord, Prescription…) |
| **Sequence** | Step-by-step communication between user, browser, system and database. Main scenarios: login with SMS verification, book appointment, view test results and prescriptions, update prescription |
| **Activity** | The workflow of the main process — actions, decisions and alternative paths |

The use-case diagram is reproduced as Mermaid in [USE-CASES.md](USE-CASES.md).

### Use-case coverage by role

| Role | Use cases |
| --- | --- |
| **Patient** | Register and log in · book, cancel, reschedule appointments · view test results and prescriptions · manage dependent profiles · receive notifications · view FAQ |
| **Doctor** | View schedule · access medical records · update prescriptions |
| **Nurse** | View schedule · access relevant patient data |
| **Front Desk Staff** | Enter manual appointments · register caregiver consent · view limited test status · manage doctor schedule and coverage |

---

## 7. Software architecture

A layered client-server architecture with modular design.

| Layer | Contents |
| --- | --- |
| **Presentation** | Web UI for Patient, Doctor, Nurse and Front Desk Staff |
| **Application** | Controllers, services, business rules, RBAC |
| **Data access** | Repositories and database operations |
| **Database** | Users, appointments, schedules, medical records, prescriptions, test results |
| **External services** | SMS verification and appointment reminders |

**Benefits:** clear separation of responsibilities · easier maintenance and testing · secure role-based access control · consistent database operations · the SMS provider can be changed later · supports future modules.

---

## 8. Design patterns and rationale

1. **Layered architecture** — separate layers handle UI, business logic, database and external services independently
2. **Modular design** — Appointment, Medical Record, Prescription and Notification modules operate separately for maintainability
3. **Role-based access control** — patients, doctors, nurses and staff reach only their authorized features
4. **Security decisions** — OTP-based SMS verification, HTTPS/TLS encryption and audit logging

---

## 9. Non-functional requirements

| Attribute | Summary |
| --- | --- |
| **Performance** | Supports roughly 400–500 daily patients with responsive appointment and medical data operations |
| **Security** | OTP-based SMS verification, RBAC authorization, HTTPS/TLS encryption and audit logging protect sensitive healthcare data |
| **Reliability** | Designed for 24/7 availability, schedule consistency and database backup/recovery |
| **Usability** | Simple, user-friendly interfaces reduce manual workload and simplify appointment operations |
| **Scalability** | The modular architecture allows future expansion and easy external service integration |
| **Legal and privacy** | Patient data complies with Turkish KVKK regulations and is accessible only to authorized users |

---

## 10. Mock-up demo flows

| Flow | What it demonstrates |
| --- | --- |
| **Secure authentication** | Users log in with ID information and SMS-based OTP verification |
| **Appointment management** | Patients book, cancel and reschedule by selecting department, doctor and available time slot |
| **Medical information** | Patients access prescriptions and test results; doctors update medical records and prescriptions |
| **Dependent profile** | Authorized users manage and switch between linked dependent profiles within one session |
| **Staff workflow** | Front desk staff create appointments manually, manage schedules and register caregiver consent |
| **Notification** | The system sends SMS reminders and verification messages through external SMS services |

Every flow above except the notification flow is implemented and clickable in this repository.

---

## 11. Acceptance testing

Nineteen acceptance test scenarios, one per use case plus a combined non-functional scenario.

| ID | Scenario |
| --- | --- |
| UC-1 | **User registration** — patient creates a new account with valid personal information |
| UC-2 | **Login and authentication** — user logs in with ID information and SMS OTP verification |
| UC-3 | **Book appointment** — patient selects department, doctor and available time slot |
| UC-4 | **Cancel appointment** — patient cancels outside the restricted cancellation period |
| UC-5 | **Reschedule appointment** — patient moves an appointment to another available slot |
| UC-6 | **View schedule** — patients and doctors view schedules according to their roles |
| UC-7 | **View medical records** — authorized healthcare staff access assigned patient records |
| UC-8 | **View test results** — patients view, download or print laboratory results |
| UC-9 | **View prescriptions** — patients and doctors access prescription information |
| UC-10 | **Update prescription** — doctor updates medication, dosage and treatment duration |
| UC-11 | **Manage dependent profiles** — patients switch between linked profiles in one session |
| UC-12 | **Register caregiver consent** — front desk staff register caregiver authorization records |
| UC-13 | **View FAQ** — patients access frequently asked questions |
| UC-14 | **View test status** — front desk staff view limited test completion status |
| UC-15 | **Enter manual appointment** — front desk staff create appointments for patients |
| UC-16 | **Manage staff and roles** — authorized staff update user roles and permissions |
| UC-17 | **Manage doctor schedule** — front desk staff update doctor availability and schedules |
| UC-18 | **Reassign doctor coverage** — authorized staff assign replacement doctors |
| UC-19 | **Security and performance tests** — verify security, performance, availability and KVKK compliance |

---

## 12. Requirement coverage

| Dimension | Coverage |
| --- | --- |
| **Functional** | Authentication, appointment management, medical records, prescriptions, test results and dependent profiles each have a dedicated system module |
| **User role** | Patients, doctors, nurses and front desk staff have separate role-based interfaces and authorized permissions |
| **Security** | OTP verification, RBAC authorization, HTTPS/TLS encryption and audit logging |
| **Non-functional** | Performance, usability, reliability, scalability and privacy supported through the selected architecture and security mechanisms |
| **Architecture** | The layered, modular architecture supports maintainability, scalability and reliability |
| **Overall** | The design covers the major functional and non-functional requirements defined in the SRS |

---

## 13. Conclusion

**Centralized hospital operations** — a web-based platform for patients and staff that reduces manual appointment handling and supports the key hospital workflows.

**Secure and role-based** — SMS-based authentication, role-based access control and protection of sensitive medical data.

**Consistent design, ready for the future** — SRS requirements are reflected in the SDD, UML diagrams and mock-up screens support the design, and the modular architecture supports future improvements.
