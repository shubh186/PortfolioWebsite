# Portfolio Website

A modern portfolio website built with React frontend and Node.js backend, featuring Spotify integration and contact form functionality.

## 🏗️ Project Structure

```
PortfolioWebsite/
├── Frontend/          # React application
│   ├── src/          # React source code
│   ├── public/       # Static assets
│   ├── build/        # Production build
│   └── package.json  # Frontend dependencies
├── Backend/           # Node.js server
│   ├── server.js     # Express server
│   ├── vercel.json   # Vercel deployment config
│   └── package.json  # Backend dependencies
└── package.json      # Root project configuration
```

## 🚀 Features

- **React Frontend**: Modern, responsive portfolio website
- **Spotify Integration**: Display current playing track and recently played music
- **Contact Form**: Store submissions in Azure SQL Database
- **3D Graphics**: Three.js integration for visual effects
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 18
- Three.js (3D graphics)
- React Router (navigation)
- Tailwind CSS (styling)
- FontAwesome (icons)
- Spotify Web API

### Backend
- Node.js
- Express.js
- Azure SQL Database
- Spotify API integration
- CORS support

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shubh186/PortfolioWebsite.git
   cd PortfolioWebsite
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

## 🏃‍♂️ Development

### Run both frontend and backend
```bash
npm run dev
```

### Run frontend only
```bash
npm run frontend
```

### Run backend only
```bash
npm run backend
```

## 🌐 Production Deployment

### Frontend (GitHub Pages)
```bash
npm run deploy
```

### Backend (Vercel)
The backend is configured for Vercel deployment with environment variables:
- `DB_HOST`: Azure SQL Server host
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `SPOTIFY_CLIENT_ID`: Spotify API client ID
- `SPOTIFY_CLIENT_SECRET`: Spotify API client secret

## 📁 Environment Variables

Create a `.env` file in the Backend directory for local development:

```env
DB_HOST=your_azure_sql_server.database.windows.net
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
DB_PORT=1433
DB_SSL=true
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/callback
```

## 🔧 Available Scripts

- `npm run dev`: Start both frontend and backend in development mode
- `npm run frontend`: Start only the React frontend
- `npm run backend`: Start only the Node.js backend
- `npm run build`: Build the frontend for production
- `npm run deploy`: Deploy to GitHub Pages
- `npm run install-all`: Install dependencies for all packages

## 📞 API Endpoints

- `GET /api/health`: Health check
- `GET /api/spotify/auth`: Spotify authentication URL
- `GET /api/spotify/current-track`: Current playing track
- `GET /api/spotify/auth-status`: Authentication status
- `POST /api/contact`: Contact form submission

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Last Updated**: August 30, 2025 - Project restructured with separate Frontend and Backend folders for better organization and deployment.
