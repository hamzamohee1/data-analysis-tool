# Detailed Setup Guide

Complete step-by-step instructions for setting up the Data Analysis Tool.

## System Requirements

### Minimum Requirements
- **OS**: macOS, Linux, or Windows 10+
- **RAM**: 4GB
- **Disk Space**: 2GB
- **Internet**: Required for initial setup

### Recommended Requirements
- **OS**: macOS 12+, Ubuntu 20.04+, or Windows 11
- **RAM**: 8GB or more
- **Disk Space**: 5GB
- **CPU**: 4+ cores

## Installation Steps

### Step 1: Install Prerequisites

#### macOS

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install Python 3.11
brew install python@3.11

# Install Git
brew install git
```

#### Ubuntu/Debian

```bash
# Update package manager
sudo apt update

# Install Node.js
sudo apt install nodejs npm

# Install Python 3.11
sudo apt install python3.11 python3.11-venv

# Install Git
sudo apt install git
```

#### Windows

1. Download and install Node.js from https://nodejs.org/ (LTS version)
2. Download and install Python 3.11 from https://www.python.org/
   - **Important**: Check "Add Python to PATH" during installation
3. Download and install Git from https://git-scm.com/

Verify installation:
```bash
node --version
python --version
git --version
```

### Step 2: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/hamzamohee1/data-analysis-tool.git

# Navigate to project directory
cd data-analysis-tool

# Verify directory structure
ls -la
```

You should see:
```
backend/
client/
.gitignore
README.md
QUICKSTART.md
SETUP.md
package.json
```

### Step 3: Setup Backend

#### Create Virtual Environment

**macOS/Linux:**
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
```

**Windows (Command Prompt):**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

**Windows (PowerShell):**
```bash
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
```

#### Install Python Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

Expected output:
```
Successfully installed fastapi-0.124.0 uvicorn-0.38.0 pandas-2.3.3 ...
```

#### Verify Backend Setup

```bash
# Check if FastAPI is installed
python -c "import fastapi; print(fastapi.__version__)"

# Should output: 0.124.0 (or similar)
```

### Step 4: Setup Frontend

#### Install Node Dependencies

```bash
# Navigate to client directory
cd ../client

# Install dependencies using pnpm (recommended) or npm
pnpm install
# or
npm install
```

Expected output:
```
added 500+ packages
```

#### Verify Frontend Setup

```bash
# Check if React is installed
npm list react

# Should show React version
```

### Step 5: Verify Installation

#### Check Backend

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -c "import pandas, numpy, scipy, plotly; print('All backend dependencies OK')"
```

#### Check Frontend

```bash
cd ../client
npm list react react-dom typescript
```

Both should complete without errors.

## Running the Application

### Terminal Setup

You'll need **two terminal windows** open simultaneously:
- **Terminal 1**: Backend server
- **Terminal 2**: Frontend development server

### Terminal 1: Start Backend Server

```bash
# Navigate to backend directory
cd /path/to/data-analysis-tool/backend

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Start the server
python main.py
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### Terminal 2: Start Frontend Development Server

```bash
# Navigate to client directory
cd /path/to/data-analysis-tool/client

# Start development server
pnpm dev
# or
npm run dev
```

Expected output:
```
➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the Data Analysis Tool homepage with the file upload interface.

## Configuration

### Backend Configuration

Edit `backend/main.py` to customize:

```python
# Change server port
uvicorn.run(app, host="0.0.0.0", port=8000)

# Modify CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Frontend Configuration

Edit `client/src/index.css` to customize:

```css
:root {
  /* Change primary color */
  --primary: var(--color-blue-700);
  
  /* Change theme */
  --background: oklch(1 0 0);
  --foreground: oklch(0.235 0.015 65);
}
```

## Environment Variables

### Backend

Create `backend/.env` (optional):
```
BACKEND_PORT=8000
DEBUG=False
```

### Frontend

Create `client/.env` (optional):
```
VITE_API_URL=http://localhost:8000
```

## Troubleshooting

### Issue: "Python command not found"

**Solution:**
```bash
# Use python3 instead
python3 -m venv venv
python3 main.py
```

### Issue: "Port 8000 already in use"

**macOS/Linux:**
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

**Windows:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <PID> /F
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Frontend won't connect to backend

**Solution:**
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check CORS settings in `backend/main.py`
3. Ensure both servers are on correct ports
4. Try clearing browser cache (Ctrl+Shift+Delete)

### Issue: Large file upload fails

**Solution:**
- Maximum file size is 50MB
- Split larger files into smaller chunks
- Ensure sufficient disk space

### Issue: Slow performance

**Solution:**
- Close other applications
- Reduce dataset size for testing
- Increase system RAM
- Use Chrome or Firefox for better performance

## Development Workflow

### Making Changes

1. **Backend changes**: Edit files in `backend/services/` or `backend/main.py`
   - Server auto-reloads (may need manual restart)
   
2. **Frontend changes**: Edit files in `client/src/`
   - Changes auto-reload in browser

### Testing Backend

```bash
# Test API endpoint
curl -X GET http://localhost:8000/health

# Test file upload
curl -X POST -F "file=@sample.csv" http://localhost:8000/api/upload
```

### Building for Production

**Frontend:**
```bash
cd client
pnpm build
# or
npm run build
```

**Backend:**
```bash
cd backend
# Ready to deploy as-is with uvicorn
```

## Deployment

### Deploy to Heroku (Backend)

```bash
# Install Heroku CLI
brew install heroku  # macOS
# or download from https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create Heroku app
heroku create data-analysis-tool-api

# Deploy
git push heroku main
```

### Deploy to Vercel (Frontend)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import project from GitHub
4. Set environment variable: `VITE_API_URL=<backend-url>`
5. Deploy

### Deploy to AWS

See AWS documentation for:
- EC2 for backend
- S3 + CloudFront for frontend
- RDS for database (if needed)

## Next Steps

1. Read [README.md](README.md) for full documentation
2. Check [QUICKSTART.md](QUICKSTART.md) for quick reference
3. Review [backend/README.md](backend/README.md) for API details
4. Explore the codebase in `client/src/` and `backend/services/`

## Getting Help

- **Documentation**: Check README.md and backend/README.md
- **Issues**: Create an issue on GitHub
- **Questions**: Review API documentation at http://localhost:8000/docs

## Uninstalling

To remove the application:

```bash
# Remove project directory
rm -rf data-analysis-tool

# Remove virtual environment (already deleted above)
# No global changes were made
```

## Summary

You now have:
✅ Backend API running on port 8000
✅ Frontend development server on port 5173
✅ Full-stack data analysis application
✅ Ready to analyze and clean your data

Happy analyzing! 🚀
