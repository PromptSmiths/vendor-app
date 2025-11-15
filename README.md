# Vendor Onboarding UI

A complete Angular 17 application for vendor onboarding and procurement management.

## Features

### Procurement Portal (Internal Users)
- Login authentication with JWT tokens
- Dashboard with vendor statistics
- New vendor request form
- Vendor list with AG Grid (sorting, filtering, pagination)
- Vendor detail view with activity timeline
- Manual follow-up functionality
- PDF download capabilities

### Vendor Portal (External Users)
- Email-based OTP authentication
- Multi-step onboarding wizard with Angular Material Stepper
- Business details form
- Contact information form
- Banking details form
- Compliance and certifications form
- File upload capabilities
- Progress tracking

## Technology Stack

- **Angular 17** - Latest Angular framework with standalone components
- **Angular Material** - Modern UI components and theming
- **AG Grid** - Advanced data grid for vendor list and timeline
- **RxJS** - Reactive programming and HTTP handling
- **TypeScript** - Strong typing and modern JavaScript features
- **SCSS** - Advanced styling capabilities

## Project Structure

```
src/app/
├── core/                     # Core functionality (singleton services, guards, interceptors)
│   ├── components/main-layout/
│   ├── guards/
│   ├── interceptors/
│   ├── services/
│   └── core.module.ts
├── shared/                   # Shared components and modules
│   ├── components/page-header/
│   └── shared.module.ts
├── features/                 # Feature modules (lazy-loaded)
│   ├── auth/                # Authentication module
│   │   ├── login/
│   │   └── auth.module.ts
│   ├── procurement/         # Procurement portal module
│   │   ├── pages/dashboard/
│   │   ├── pages/vendor-request/
│   │   ├── pages/vendor-detail/
│   │   └── procurement.module.ts
│   └── vendor/              # Vendor portal module
│       ├── pages/otp/
│       ├── pages/onboarding-wizard/
│       └── vendor.module.ts
├── app-routing.module.ts     # Main application routing
└── app.module.ts            # Root application module
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 17+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vendor-onboarding-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
# or
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
# or
ng build --configuration production
```

## Usage

### Procurement Portal

1. **Login**: Navigate to `/login` and use demo credentials:
   - Email: `admin@company.com`
   - Password: `password123`

2. **Dashboard**: View vendor statistics and quick actions

3. **Create Vendor Request**: Add new vendors to the system

4. **Manage Vendors**: View, filter, and manage vendor information with AG Grid

### Vendor Portal

1. **OTP Authentication**: Navigate to `/vendor/otp`
   - Enter your email address
   - Receive and enter the 6-digit OTP code

2. **Onboarding Wizard**: Complete the multi-step process:
   - Business Details
   - Contact Information
   - Banking Details
   - Compliance & Certifications
   - Review & Submit

## Key Components

### AG Grid Integration

- **Vendor List**: Advanced data table with custom cell renderers
- **Status Renderer**: Colored status chips for vendor states
- **Action Renderer**: Interactive buttons for vendor actions
- **Timeline Grid**: Activity history with icons and formatting

### Angular Material Stepper

- **Linear Stepper**: Guided multi-step onboarding process
- **Form Validation**: Real-time validation with error messages
- **Progress Tracking**: Visual progress indication
- **Step Navigation**: Previous/Next navigation with form state management

### Security Features

- **JWT Authentication**: Secure token-based authentication
- **Route Guards**: Protected procurement routes
- **HTTP Interceptors**: Automatic token attachment and error handling
- **Form Validation**: Client-side validation for all forms

## API Integration

### Services

- **AuthService**: Authentication and token management
- **VendorService**: Procurement-related API calls
- **OnboardingService**: Vendor onboarding API calls

### Interceptors

- **API Interceptor**: Adds authentication headers and handles errors

## Development Notes

### Code Style
- Angular 17 best practices
- Standalone components where applicable
- Reactive forms throughout
- Strong TypeScript typing
- Modern Angular patterns

### Testing
```bash
npm test
# or
ng test
```

### Linting
```bash
npm run lint
# or
ng lint
```

## Contributing

1. Follow Angular style guide
2. Use reactive forms for all form implementations
3. Implement proper error handling
4. Add unit tests for new features
5. Follow the existing project structure

## License

MIT License - see LICENSE file for details
