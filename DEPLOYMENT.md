# Printer Lease Management Tool - Deployment Guide

## Overview
This is a modular JavaScript-based web application for printer contract management. The app has been refactored from a monolithic HTML file into a modular architecture with proper error handling and debugging capabilities.

## Architecture
- **Frontend**: Modular JavaScript with centralized registry and logging
- **Backend**: Static file serving via nginx
- **Deployment**: Docker container with nginx

## File Structure
```
f:\WORKWORK\PRINTER\
├── index.html              # Main HTML file with fallback logic
├── js/                     # JavaScript modules
│   ├── logger.js           # Centralized logging system
│   ├── module-registry.js  # Module dependency management
│   ├── translation-manager.js # Language switching
│   ├── printer-database.js # Printer data management
│   ├── autocomplete-manager.js # Search autocomplete
│   ├── template-manager.js # Contract templates
│   ├── form-manager.js     # Form handling
│   └── debug-panel.js      # Debug UI (Ctrl+Shift+D)
├── Dockerfile              # Docker build instructions
├── docker-compose.yml      # Docker orchestration
└── requirements.txt        # Python dependencies (if needed)
```

## Features
- **Autocomplete**: Search functionality for companies, printers, and locations
- **Language Switching**: Multi-language support (EN/FR/DE)
- **Dynamic Lists**: Add/remove items to printer and location lists
- **Contract Templates**: Pre-filled contract forms
- **Debug Panel**: Module health monitoring and log export (Ctrl+Shift+D)
- **Error Handling**: Comprehensive error logging and user feedback
- **Module Registry**: Centralized dependency management

## Deployment Instructions

### Local Testing (Windows)
1. Open `index.html` directly in a browser
2. All features should work with fallback logic
3. Press `Ctrl+Shift+D` to open debug panel

### Docker Deployment

#### Prerequisites
- Docker installed
- Docker Compose installed

#### Build and Run
```powershell
# Navigate to project directory
cd f:\WORKWORK\PRINTER

# Build the Docker image
docker-compose build --no-cache

# Start the container
docker-compose up -d

# Check container status
docker-compose ps

# View logs
docker-compose logs

# Stop the container
docker-compose down
```

#### Access the Application
- The application will be available at `http://localhost:[PORT]`
- The port is randomly assigned by Docker Compose
- Check the port with `docker-compose ps`

### Dockerfile Details
The Dockerfile copies the following files into the nginx container:
- `index.html` → `/usr/share/nginx/html/index.html`
- `js/` directory → `/usr/share/nginx/html/js/`

### Troubleshooting

#### JavaScript Module 404 Errors
- Ensure the `js/` directory is properly copied in the Dockerfile
- Rebuild the container with `--no-cache` flag
- Check nginx logs for file serving errors

#### Module Loading Issues
- Open browser developer tools to check console errors
- Use the debug panel (Ctrl+Shift+D) to check module health
- Verify all modules are registered in the module registry

#### Windows Compatibility
- The app includes fallback logic for Windows file path issues
- Autocomplete and dynamic lists work even if modules fail to load
- All features are tested on Windows 10/11

### Development Notes
- All JavaScript modules are independent and can be developed separately
- The module registry handles dependencies and error recovery
- Logging is centralized and can be exported for debugging
- The debug panel provides real-time module health monitoring

### Production Considerations
- Consider adding a favicon.ico to eliminate 404 errors
- Implement proper error pages for nginx
- Add SSL/TLS support for production deployment
- Consider using a reverse proxy for additional security
- Monitor container resource usage and logs
