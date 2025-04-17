# Legacy Admin Portal

A modern, responsive admin interface built with React and Material-UI for managing quests and collectibles.

## Features

- 🔐 Secure authentication system with Firebase integration
- 📊 Dashboard with key metrics
- 🎯 Quest management
  - Create, edit, and manage quests
  - Set difficulty levels and date ranges
  - Assign collectible rewards
- 🏆 Collectibles management
  - Upload and manage collectible items
  - Image upload support
  - Track collectible assignments
- 📱 Responsive design for desktop and mobile
- 🎨 Material Design UI components
- 🔄 Real-time status updates

## Tech Stack

- React 19
- Material-UI (MUI) v7
  - @mui/material
  - @mui/icons-material
  - @mui/x-data-grid
  - @mui/x-date-pickers
- React Router v7
- React Hook Form v7
- Firebase v11
- Google OAuth integration
- Day.js for date handling
- Vite v6 for build tooling

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd legacy-admin
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Firebase and other configuration settings.

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Development

### Project Structure

```
src/
  ├── api/          # API service layer and Firebase configuration
  ├── assets/       # Static assets and images
  ├── components/   # Reusable UI components
  ├── contexts/     # React contexts (auth, etc.)
  ├── pages/        # Page components
  ├── App.jsx       # Main application component
  ├── main.jsx      # Application entry point
  └── index.css     # Global styles
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication

The application uses Firebase Authentication with Google OAuth integration. Configure your Firebase credentials in the `.env` file:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Proprietary
