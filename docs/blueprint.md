# **App Name**: Vedi

## Core Features:

- Dashboard Layout: Responsive Dashboard Layout: Adapts to desktop, tablet, and mobile devices with a collapsible sidebar navigation.
- Patient Profiles: Patient Management: Displays a table of patients with key information and a button to register appointments. Clicking on a patient displays a detailed profile with personal data, appointments, and editable therapist notes.
- Service Registry: Service Management: Allows therapists to register new services/therapies with a name and description using a simple form.
- Appointment Scheduling: Appointment Scheduling: Lists appointments with service details, patient information, and dates. Enables creation/editing of appointments with a date picker, service dropdown, and a detailed session description.
- Secure Login: User Authentication: Secure login route (/login) with email and password, using argon2 encryption for password and token management.
- Access Control: Role-Based Access Control: Restricts access to certain routes (e.g., /therapists) based on user roles (admin or therapist).
- AI Session Summary: AI-Powered Session Summary: After a therapist completes writing a note, provide a tool to summarize the session in markdown format using a LLM.
- Data base o postgresSQL with prisma ORM: Data base o postgresSQL with prisma ORM using this DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza193ck5xZkJjTlB1MHF1RHZrb0IwY0IiLCJhcGlfa2V5IjoiMDFKWlhQOEsyRFExOFFYQ1RWNDdGMUhQR0UiLCJ0ZW5hbnRfaWQiOiI2NjdhM2YyM2Q2OTZkZGEzZDUzMzMxZDUzOWFiMjM3NTBmZWQxMTEwMjViMzU5NDA2NjI0NjkxODY3MDg2YTM1IiwiaW50ZXJuYWxfc2VjcmV0IjoiNDEwM2EyMDktOWNlZC00ZTdmLThiYzYtZjY5YTRhZTk5NjM0In0.N2xP3XVS1jUK4UZDmWbX_ssgYVz98krCyw-DKg423_k"
- CSS variables: CSS variables for colors, fonts, padding, margin, font size

## Style Guidelines:

- Primary color: Teal (#0A6073) for a calm and professional feel.
- Background color: Light teal (#FFFFFF), a desaturated version of the primary color, for a clean backdrop.
- Accent color: Turquoise (#4AC0C0), an analogous color, to highlight interactive elements and calls to action.
- Font: 'Inter' (sans-serif) for a professional and accessible look.
- Modern dashboard layout with CSS variables for theming and responsive design.
- Minimalist icons representing patients, services, and appointments.
- Subtle transition animations for a smooth user experience.