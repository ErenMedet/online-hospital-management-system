# Software Requirements Specification

**Online Hospital Management System**
TED University — CMPE 313 / SENG 214 Software Engineering · Section 3, Team 6 · Spring 2026

> This is the technical content of the team's SRS document, reproduced without the cover page, signatures or any personal data. The document was produced during the Waterfall requirements phase, **before** the prototype in this repository was written — so it describes the intended full system, not the prototype. See [ARCHITECTURE.md](ARCHITECTURE.md) for what actually exists in the code.
>
> Revision history: v1.0 (2026-03-20, initial draft) · v1.1 (2026-04-03, use-case scenarios and functional requirements added) · v1.2 (2026-04-10, use-case scenarios and UI design revised).

---

## 1. Introduction

### 1.1 Purpose

This SRS describes the Online Hospital Management System: a web-based platform developed to make hospital operations more efficient and to provide a centralized digital environment for both patients and healthcare staff.

Through this system, hospital staff can manage appointments, access patient records and organise their daily workflows more easily. Patients can book appointments, check their test results and prescriptions, and receive notifications in a simple and secure way.

The document explains the main features of the system, how it handles data, how its parts interact, and what performance is expected. Hardware and external services such as SMS systems are considered outside the core system.

### 1.2 Document conventions

Each requirement carries a unique identifier such as `REQ-1` or `UC-1`, so requirements can be tracked individually rather than through higher-level descriptions. System messages appear in quotation marks. The terms **Patient**, **Doctor**, **Nurse** and **Front Desk Staff** are used consistently throughout. Use cases are written as clear, numbered steps.

### 1.3 Product scope

The system is a centralized web-based platform connecting patients and hospital staff, aimed at simplifying appointment handling, medical record management and daily hospital operations.

Patients can book, cancel or reschedule appointments without contacting the hospital directly, and can access, download or print their test results and prescriptions. Prescription details such as dosage and duration are presented clearly. For staff, the system simplifies schedule management, patient information access and administrative tasks.

**Key benefits**

- Reduces front-desk workload by minimising phone-based operations
- Improves patient experience by making services easily accessible
- Reduces interruptions for doctors and nurses
- Provides secure, organised access to medical data
- Supports better management of hospital workflows

**Objectives**

- Allow patients to book, cancel and reschedule appointments online
- Provide secure login using ID number and SMS verification
- Enable access to medical records and prescriptions
- Support different user roles with controlled access
- Ensure data privacy and system reliability

**Goals**

- Increase hospital efficiency by reducing manual processes
- Prevent scheduling conflicts and missed appointments
- Improve patient satisfaction through digital services
- Ensure safe handling of sensitive health data
- Support future scalability

### 1.4 References

- ISO/IEC/IEEE 29148:2018 — *Systems and software engineering — Life cycle processes — Requirements engineering*
- Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson.
- Object Management Group (2017). *Unified Modeling Language (UML)*, version 2.5.1.
- Project Charter — Online Hospital Management System (2026), internal document
- Requirements Elicitation Dialogue (NotebookLM, 2026), internal document

---

## 2. Overall description

### 2.1 Product perspective

A web-based platform where patients and hospital staff interact in a centralized environment, designed to replace manual processes and reduce dependency on phone communication. It works together with external services such as SMS verification for login and notifications, and is designed to allow future improvements such as medication reminders or chatbot support.

Interfaces described in the SRS: **Login**, **Appointment Booking**, **Appointment Management** (with cancellation time restrictions), **Medical Records** (role-scoped), **Test Results** (view, download, print), **Prescriptions** (with clear dosage and duration), **Family / Dependent Accounts** (profile switching within one session) and an **FAQ Section**. Hardware interface: servers plus web browsers on any device. Software interfaces: a database system and an SMS service.

### 2.2 Product functions

| Group | Functions |
| --- | --- |
| **User account** | Sign up, log in, log out, two-step authentication using ID number and SMS verification, account recovery, automatic logout after inactivity |
| **Appointment management** | Book appointments, cancel or reschedule with time restrictions, view schedules, manual entry by front desk staff |
| **Medical records and prescriptions** | Role-based record access, view test results and prescriptions, download and print documents |
| **Family and dependents** | Manage dependent accounts and switch between profiles |
| **Notification and information** | SMS reminders and an FAQ section |

### 2.3 User classes and characteristics

| Class | Description | Characteristics |
| --- | --- | --- |
| **Patients** | Individuals receiving healthcare services | Book appointments and view their own medical data |
| **Doctors** | Medical professionals | Manage schedules and patient records |
| **Nurses** | Healthcare assistants | Access relevant patient data |
| **Front Desk Staff** | Administrative staff | Manage appointments with limited access to medical content |

### 2.4 Operating environment

Servers plus user devices (computers, smartphones); web browsers as the client platform; a database system and an SMS service as software components; a secure internet connection over HTTPS.

### 2.5 Design and implementation constraints

1. **Regulatory compliance** — must follow healthcare data protection regulations
2. **Data storage** — data must be stored within the country
3. **Security** — secure authentication and role-based access are mandatory
4. **Performance** — must handle a high number of users efficiently
5. **Technologies** — tooling includes Figma, GitHub, Draw.io
6. **Standards** — code must follow accepted best practices

### 2.6 Assumptions and dependencies

**Assumptions.** Users have internet access and basic web literacy. Server capacity meets expected traffic. SMS services remain available and reliable. The chosen development technologies remain supported. Hospital staff and stakeholders cooperate through requirements gathering, design and testing.

**Dependencies.** External SMS services for verification and notifications; database systems for storage; reliable server infrastructure and network conditions for performance and security; healthcare data protection regulations, whose changes may force system updates.

---

## 3. External interface requirements

### 3.1 User interfaces

A web-based GUI accessible through modern browsers with no additional software to install. The interface targets users with limited technical experience, and all pages follow a consistent layout so users adapt quickly.

**General UI structure.** Every page carries a navigation bar at the top and a footer at the bottom. The navigation bar moves users between the main sections — appointments, medical records, prescriptions, profile settings. Standard buttons ("Book Appointment", "Cancel Appointment", "View Appointment Details", "View Results", "Update Profile") are clearly labelled and consistently placed.

### 3.2–3.4 Hardware, software and communications interfaces

Hosted on servers, reachable from browsers on any device. Integrates with a relational database system and an external SMS provider. All communication runs over HTTPS/TLS.

---

## 4. System features — use cases

Eighteen use cases were specified. Each has a full scenario (actors, preconditions, main flow, alternative flows, exceptions) plus its own functional requirements (`REQ-n`) and use-case-level non-functional requirements (`UC-nn-NF-n`).

| ID | Use case | Primary actor(s) |
| --- | --- | --- |
| UC-01 | Register | Patient |
| UC-02 | Login | All roles |
| UC-03 | Book Appointment | Patient |
| UC-04 | Cancel Appointment | Patient |
| UC-05 | Reschedule Appointment | Patient |
| UC-06 | View Schedule | Patient, Doctor, Nurse, Front Desk |
| UC-07 | View Medical Records | Doctor, Nurse |
| UC-08 | View Test Results | Patient |
| UC-09 | View Prescriptions | Patient, Doctor |
| UC-10 | Update Prescription | Doctor |
| UC-11 | Manage Dependent Profiles | Patient |
| UC-12 | Register Caregiver Consent | Front Desk |
| UC-13 | View FAQ | Patient |
| UC-14 | View Test Status | Front Desk |
| UC-15 | Enter Manual Appointment | Front Desk |
| UC-16 | Manage Staff and Roles | Front Desk / administrative |
| UC-17 | Manage Doctor Schedule | Front Desk |
| UC-18 | Reassign Doctor Coverage | Front Desk |

For the mapping from these use cases to the implemented routes and functions, see [USE-CASES.md](USE-CASES.md).

### Functional requirements by use case

**UC-01 Register**
1. Provide a registration form for new patients.
2. Validate required fields before account creation.
3. Prevent duplicate account creation.
4. Create and store the patient account after successful validation.
5. Display a success or error message depending on the result.

*NF:* registration completes in under 3 seconds under normal load; personal data is transmitted securely over HTTPS.

**UC-02 Login**
1. Allow users to enter ID information for authentication.
2. Verify the entered credentials against stored records.
3. Send a one-time SMS verification code.
4. Validate the SMS verification code before access is granted.
5. Create a session after successful authentication.
6. Display an error message for failed login attempts.

*NF:* login completes in under 3 seconds; authentication data is transmitted securely.

**UC-03 Book Appointment**
1. Allow patients to select a department.
2. Display doctors for the selected department.
3. Display available time slots for the selected doctor.
4. Create an appointment record after valid selection.
5. Display a confirmation message when the booking succeeds.
6. Show an appropriate error message if booking fails.

*NF:* booking completes in under 2 seconds after confirmation; appointment data remains consistent under concurrent access.

**UC-04 Cancel Appointment**
1. Allow patients to select an appointment for cancellation.
2. Check whether the cancellation is within the allowed time restriction.
3. Cancel the appointment if the restriction rule is satisfied.
4. Display an error message if cancellation is not allowed.
5. Display a confirmation message when cancellation succeeds.

*NF:* cancellation processed in under 2 seconds; schedule consistency preserved after cancellation.

**UC-05 Reschedule Appointment**
1. Allow patients to select an existing appointment for rescheduling.
2. Display available alternative time slots.
3. Update the appointment after a valid new slot is chosen.
4. Confirm successful rescheduling.
5. Show an error message if rescheduling fails.

*NF:* completes within 2 seconds; updated schedule information is visible immediately.

**UC-06 View Schedule**
1. Display schedule information according to the user's role.
2. Retrieve current schedule data from the database.
3. Display an empty-schedule message if no records are found.
4. Show an error message if schedule data cannot be loaded.

*NF:* loads in under 2 seconds; always reflects the latest updates.

**UC-07 View Medical Records**
1. Verify access permission before displaying medical records.
2. Retrieve and display medical records for authorized users only.
3. Deny access to unauthorized users.
4. Display an error message if records cannot be retrieved.

*NF:* access control rules enforced on every request; records load in under 2 seconds.

**UC-08 View Test Results**
1. Display only the logged-in patient's own test results.
2. Allow patients to download or print available test results.
3. Show a message if no results are found.
4. Display an error message if result data cannot be retrieved.

*NF:* results load in under 2 seconds; documents are downloadable in a readable format.

**UC-09 View Prescriptions**
1. Retrieve prescription records for authorized users.
2. Display dosage and treatment duration details.
3. Display a message if no prescription record is found.
4. Show an error message if prescription data cannot be loaded.

*NF:* prescription data displayed clearly and accurately; loads in under 2 seconds.

**UC-10 Update Prescription**
1. Allow doctors to edit prescription information.
2. Validate updated prescription fields before saving.
3. Save valid prescription updates.
4. Display a success or error message depending on the result.

*NF:* updates saved accurately and consistently; operation completes within 2 seconds.

**UC-11 Manage Dependent Profiles**
1. Display all dependent profiles linked to the logged-in patient.
2. Allow the patient to switch between linked profiles in the same authenticated session.
3. Enforce authorization rules for dependent access.
4. Show a message if no linked dependent profiles exist.

*NF:* profile switching requires no second SMS verification; linked profile data stays secure and role-restricted.

**UC-12 Register Caregiver Consent**
1. Allow front desk staff to record caregiver consent information.
2. Validate required consent data before saving.
3. Store caregiver authorization records securely.
4. Display a success or error message after submission.

*NF:* consent records stored securely and traceably; authorization updates reflected immediately after saving.

**UC-13 View FAQ**
1. Display FAQ content in a readable format.
2. Provide answers to common questions about hospital services and procedures.
3. Display an informative message if FAQ content is unavailable.

*NF:* content loads quickly and stays readable; understandable for non-technical users.

**UC-14 View Test Status**
1. Allow front desk staff to search and retrieve limited test status information.
2. Restrict this feature to status-only information.
3. Block access to full medical test content from this function.
4. Display an error message if status data cannot be loaded.

*NF:* front desk staff must not be able to view full test results from this screen; status loads in under 2 seconds.

**UC-15 Enter Manual Appointment**
1. Allow front desk staff to manually create appointments.
2. Validate availability before saving the appointment.
3. Store the appointment after successful validation.
4. Display a confirmation or error message depending on the outcome.

*NF:* processed within 2 seconds after confirmation; the schedule updates immediately.

**UC-16 Manage Staff and Roles**
1. Display staff records for authorized administrative users.
2. Allow authorized users to update roles and permissions.
3. Validate role and permission changes before saving.
4. Block unauthorized access to staff management.
5. Display a success or error message after update attempts.

*NF:* role and permission updates must be audit-traceable; unauthorized users must not reach this function.

**UC-17 Manage Doctor Schedule**
1. Display doctor schedule information for authorized staff.
2. Allow schedule modifications by authorized staff.
3. Validate updated schedule data before saving.
4. Save doctor schedule changes in the system.
5. Display a success or error message depending on the result.

*NF:* schedule changes visible immediately after saving; consistency preserved between doctor schedules and appointments.

**UC-18 Reassign Doctor Coverage**
1. Allow authorized staff to select an unavailable doctor for reassignment.
2. Display available replacement doctors.
3. Update the doctor coverage assignment after valid selection.
4. Reflect the new assignment in the schedule immediately.
5. Display a warning or error message if reassignment cannot be completed.

*NF:* reassignment updates visible schedules immediately; authorization and record integrity preserved during transfer.

---

## 5. Non-functional requirements

These were derived from a requirements elicitation session with Hospital Administration, which established that the facility serves roughly **400–500 patients daily** and expects the system to be available at all hours.

### 5.1 Performance

| ID | Requirement | Priority |
| --- | --- | --- |
| NFR-PERF-01 | **System throughput** — support concurrent usage by a minimum of 400–500 daily active users without response-time degradation | High |
| NFR-PERF-02 | **Response time** — all standard user-facing operations (booking, schedule viewing, test result retrieval) complete and display within 3 seconds under normal load | High |
| NFR-PERF-03 | **System availability** — 24/7 including weekends and public holidays, with planned downtime not exceeding 1% per month (≈7 hours) | High |
| NFR-PERF-04 | **Database query performance** — standard read operations for records, appointments, prescriptions and test results respond within 2 seconds | High |
| NFR-PERF-05 | **SMS delivery time** — verification codes delivered within 60 seconds of the login or registration request | Medium |
| NFR-PERF-06 | **File generation time** — test result download and print render within 5 seconds for standard-size reports | Medium |

### 5.2 Safety

| ID | Requirement | Priority |
| --- | --- | --- |
| NFR-SAFE-01 | **Role-based access enforcement** — no user can reach medical records, prescriptions or test results beyond the scope of their role | High |
| NFR-SAFE-02 | **Limited test status visibility** — front desk staff see only a completion indicator ("ready" / "pending"), never medical content | High |
| NFR-SAFE-03 | **Consent-based caregiver access** — third-party access to an elderly or incapacitated patient's records activates only after a written consent form is registered at the front desk and confirmed in the system | High |
| NFR-SAFE-04 | **Data backup and recovery** — backup mechanisms prevent permanent loss of patient, appointment or medical record data after failure or outage | High |
| NFR-SAFE-05 | **Controlled cross-doctor access** — when a doctor accesses a patient not assigned to them, an explicit authorisation or elevated-access workflow is required first, scoped to the reassigned patients only | High |
| NFR-SAFE-06 | **Prescription clarity** — medication name, dosage and treatment duration presented in formatted plain text with no ambiguity in units or instructions | High |

### 5.3 Security

| ID | Requirement | Priority |
| --- | --- | --- |
| NFR-SEC-01 | **Two-step authentication** — first factor a national ID number or date of birth, second factor a one-time SMS code to the registered mobile number | High |
| NFR-SEC-02 | **Data sovereignty** — all patient data stored exclusively on servers physically located within the country | High |
| NFR-SEC-03 | **Automatic session timeout** — active sessions terminate after a configurable inactivity period (recommended 10–15 minutes for clinical workstations) | High |
| NFR-SEC-04 | **Regulatory compliance** — complies with national healthcare data protection regulations and Ministry of Health standards | High |
| NFR-SEC-05 | **Ethical data management** — prohibits misuse, unauthorised sharing or non-clinical access; bulk export beyond individual records requires documented authorisation | High |
| NFR-SEC-06 | **Single-session dependent access** — a verified account holder switches between their own and linked dependent profiles without a separate SMS verification per profile | High |
| NFR-SEC-07 | **Encrypted data transmission** — all browser–server communication over HTTPS/TLS | High |
| NFR-SEC-08 | **Registration identity verification** — self-registration includes identity checks to prevent fraudulent accounts | Medium |

### 5.4 Software quality attributes

| ID | Attribute | Priority |
| --- | --- | --- |
| NFR-QA-01 | **Usability** — navigation, login and booking flows completable without assistance by users of any technical ability, including elderly patients | High |
| NFR-QA-02 | **Reliability** — role-based access rules, booking constraints and dependent authorisation logic behave as specified at all times, with no intermittent failures | High |
| NFR-QA-03 | **Maintainability** — modular architecture allows future-phase features (medication reminders, chatbot) without significant refactoring of the Phase 1 core | Medium |
| NFR-QA-04 | **Scalability** — database and application layer scale beyond the initial 400–500 daily workload without architectural redesign | Medium |
| NFR-QA-05 | **Accessibility** — full functionality on desktop, tablet and mobile | Medium |
| NFR-QA-06 | **Testability** — all functional and non-functional requirements validatable through reproducible test cases; the inactivity threshold is configurable for testing | Medium |
| NFR-QA-07 | **Portability** — deployable on standard web server infrastructure, not tied to a single commercial cloud provider | Low |

---

## 6. Other requirements

### 6.1 Database

| ID | Requirement |
| --- | --- |
| REQ-DB-01 | Use a relational DBMS for patient records, appointments, prescriptions, test results and user accounts |
| REQ-DB-02 | Enforce referential integrity across all related entities |
| REQ-DB-03 | Retain records for the minimum period defined by applicable healthcare regulations |
| REQ-DB-04 | Deletion of a medical record requires explicit administrative authorization and must be recorded in the audit log |
| REQ-DB-05 | Support concurrent read and write operations without inconsistency or loss under normal load |

### 6.2 Audit and logging

| ID | Requirement |
| --- | --- |
| REQ-LOG-01 | Maintain an audit log for all sensitive operations — login attempts, medical record access, prescription updates, role changes |
| REQ-LOG-02 | Each entry records user identity, timestamp and the nature of the action |
| REQ-LOG-03 | Logs stored securely and protected from modification by any user, including administrators |
| REQ-LOG-04 | Logs accessible to authorized administrators for compliance review and investigation |

### 6.3 Internationalisation and localisation

| ID | Requirement |
| --- | --- |
| REQ-L10N-01 | Support Turkish as the primary interface language for all messages, labels, buttons and error notifications |
| REQ-L10N-02 | Follow Turkish date, time and numeric formatting conventions |
| REQ-L10N-03 | Medical units and terminology conform to Turkish healthcare conventions |

### 6.4 Legal and regulatory

| ID | Requirement |
| --- | --- |
| REQ-LEG-01 | Comply with the Turkish Personal Data Protection Law (KVKK) in collection, storage, processing and sharing |
| REQ-LEG-02 | Comply with Turkish Ministry of Health standards for electronic health record systems |
| REQ-LEG-03 | Complete and document regulatory compliance verification before clinical deployment |

### 6.5 Documentation

| ID | Requirement |
| --- | --- |
| REQ-DOC-01 | Deliver an administrator manual covering configuration, role management and audit log access |
| REQ-DOC-02 | Prepare a user guide in Turkish covering all role-specific workflows |
| REQ-DOC-03 | Maintain technical documentation for architecture, database schema and API interfaces, updated with each version |

### 6.6 Training

| ID | Requirement |
| --- | --- |
| REQ-TRN-01 | All hospital staff receive structured orientation before go-live |
| REQ-TRN-02 | Training materials prepared in Turkish, covering role-specific workflows |
| REQ-TRN-03 | An in-system help or FAQ section assists users unfamiliar with the platform |

### 6.7 Reuse and future phases

| ID | Requirement |
| --- | --- |
| REQ-REUSE-01 | Modular architecture allows future-phase features (medication reminder service, patient support chatbot) without structural changes to Phase 1 modules |
| REQ-REUSE-02 | Common components — authentication, notification, RBAC — designed for reuse across future extensions |

---

## Appendices

The original document includes **Appendix A: Glossary** (terms such as Appointment, Audit Log, Authentication, RBAC, KVKK, OTP) and **Appendix B: Analysis Models** (use-case, class, sequence and activity diagrams). The use-case model is reproduced as a Mermaid diagram in [USE-CASES.md](USE-CASES.md).
