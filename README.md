# Blue Collar Cloud Assessment - Frontend

This is a React application built with Vite for managing certification requests as part of the Blue Collar Cloud assessment. The system supports both employees and supervisors, with clear role separation and workflows.

## Backend API Used
Please clone and run this Node Express API to fully test this frontend - https://github.com/alexCevi/bcc-test-be

## Features

* **Role-Based Access Control**: Distinct interfaces and permissions for employees and supervisors, enforced at both UI and routing levels.
* **Certification Request Workflow**: Employees can submit certification requests with budget, justification, and required dates.
* **Supervisor Dashboard**: Supervisors can view, filter, sort, and manage incoming requests with full status control.
* **Form Validation**: Strong client-side validation including required fields, min/max constraints, character limits, and date rules.
* **Responsive UI**: Built using a hybrid stack of Shadcn, Tailwind CSS, and Ant Design components — demonstrating flexibility in integrating multiple UI libraries while keeping everything Tailwind-compatible and responsive across breakpoints.

## Testing

The application includes a robust set of automated tests covering all core workflows and edge cases.

### Coverage Overview

#### 1. **Login Flow**

* Email/password validation rules
* Role-based routing (`/employee` vs `/supervisor`)
* Handling of incorrect login credentials
* Persistent auth state management

#### 2. **Certification Request Form**

* Validation of all required fields (description, budget, expected date)
* Budget input constraints (must be > 0)
* Past date prevention
* Input formatting and character limits
* Submit, reset, and draft state behavior

#### 3. **Supervisor Dashboard**

* Filtering by request status (Draft, Submitted, Approved, Rejected)
* Full-text search by employee name
* Sorting by budget, submission date, and employee name
* Status change actions (with confirmation logic)
* Display formatting for currency and date fields

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:ui

# Run tests once
npm run test:run
```

### Test Types and Structure

* **Unit Tests**: Cover individual utilities, input validations, and component behavior
* **Integration Tests**: Simulate end-to-end user flows (e.g., login, form submission, status update)
* **Business Logic Tests**: Validate sorting, filtering, and form logic

Test files are organized under:

* `src/__tests__/` – Core application tests
* `src/components/**/__tests__/` – Component-specific coverage
* `src/pages/**/__tests__/` – Page-level interaction tests

## Development Setup

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Create optimized production build
npm run build

# Run lint checks
npm run lint
```
