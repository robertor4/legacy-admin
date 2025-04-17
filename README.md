# Legacy Admin Portal

A modern, responsive admin interface built with React and Material-UI for managing quests and collectibles.

## Features

- 🔐 Secure authentication system
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
- React Router v7
- React Hook Form
- Day.js for date handling
- Vite for build tooling

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

3. Start the development server:
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
  ├── api/          # API service layer
  ├── components/   # Reusable UI components
  ├── contexts/     # React contexts (auth, etc.)
  ├── pages/        # Page components
  └── main.jsx      # Application entry point
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication

For demo purposes, use:
- Username: `admin`
- Password: `password`

In production, replace the authentication implementation in `src/api/apiService.js` with your actual backend integration.

## API Integration

The application is designed to work with a RESTful API. Current endpoints are mocked in `src/api/apiService.js`. Replace these with your actual API endpoints.

Base API URL configuration is in `src/api/apiService.js`:
```javascript
const API_BASE_URL = '/api/admin/v1';
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Proprietary
