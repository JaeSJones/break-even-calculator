# Break-Even Calculator

## Overview

A web-based Break-Even Calculator designed to help service providers (particularly beauty professionals) calculate their minimum daily income needed to cover business expenses. The application features a modern dark theme with pastel accents and provides an intuitive two-step process for inputting expenses and viewing results.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and build processes
- **Styling**: Tailwind CSS with custom dark theme and pastel color scheme
- **Component Library**: Radix UI components with custom styling (shadcn/ui)
- **State Management**: React hooks for local state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and micro-interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API**: RESTful endpoints for PDF generation and email functionality
- **PDF Generation**: PDFKit for creating downloadable calculation reports
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)

### Database Layer
- **Database**: PostgreSQL (configured via Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Defined in shared/schema.ts with Zod validation
- **Migration**: Drizzle Kit for database schema management

## Key Components

### Core Features
1. **Input Screen**: Multi-category expense input with validation
   - Rent/Booth Fee, Supplies, Insurance, Marketing, Taxes, Education, Miscellaneous
   - Work days per week selection
   - Real-time validation and formatting

2. **Results Screen**: Comprehensive calculation display
   - Monthly total expenses
   - Minimum daily earnings required
   - Detailed breakdown by category
   - Animated number counters

3. **Export Options**: 
   - PDF download functionality
   - Email results capability (endpoint ready)

### UI/UX Design
- **Dark Theme**: Comfortable charcoal/gray background (not pure black)
- **Pastel Accents**: Soft pink, mint green, orange, purple for visual elements
- **Typography**: Clean, modern fonts with proper spacing
- **Responsive Design**: Mobile-first approach with single-column layout
- **Animations**: Smooth transitions, hover effects, and progress indicators

### Data Storage
- **Local Storage**: Automatic saving of calculations for user convenience
- **Database Tables**: 
  - `users` - User authentication (prepared but not implemented)
  - `calculations` - Stored calculation history with timestamps

## Data Flow

1. **User Input**: Expenses entered through validated form inputs
2. **Real-time Calculation**: Break-even calculations performed client-side
3. **Data Persistence**: Calculations saved to localStorage and optionally to database
4. **Results Display**: Formatted results with animated counters
5. **Export**: PDF generation server-side or email delivery

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Animations**: Framer Motion for smooth interactions
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React for consistent iconography

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: Drizzle ORM for database operations
- **PDF**: PDFKit for report generation
- **Validation**: Zod for schema validation

### Development Tools
- **TypeScript**: Full type safety across the stack
- **Vite**: Fast development server and build tool
- **ESBuild**: Fast bundling for production builds

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React application to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle Kit manages schema migrations

### Environment Configuration
- **Development**: Uses `tsx` for TypeScript execution
- **Production**: Compiled JavaScript with Node.js
- **Database**: PostgreSQL URL from environment variables

### Scripts
- `npm run dev` - Development server with hot reload
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run db:push` - Database schema deployment

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 04, 2025. Initial setup