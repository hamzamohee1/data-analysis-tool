# Quick Start Guide

Get the Data Analysis Tool running in 5 minutes!

## Prerequisites

- Node.js 18+ (https://nodejs.org/)
- Python 3.11+ (https://www.python.org/)
- Git (https://git-scm.com/)

## Installation (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/hamzamohee1/data-analysis-tool.git
cd data-analysis-tool
```

### 2. Setup Backend (2 minutes)

```bash
cd backend

# Create virtual environment
python3.11 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Setup Frontend (2 minutes)

Open a new terminal and run:

```bash
cd client
pnpm install  # or npm install
```

## Running the Application

### Terminal 1: Start Backend

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2: Start Frontend

```bash
cd client
pnpm dev  # or npm run dev
```

You should see:
```
➜  Local:   http://localhost:5173/
```

### 3. Open in Browser

Navigate to: **http://localhost:5173**

## First Steps

1. **Upload a CSV or Excel file** - Click the upload area or drag-and-drop
2. **Preview your data** - See the first 5 rows and column information
3. **Analyze statistics** - Select a column and view statistical metrics
4. **Create visualizations** - Generate histograms, box plots, scatter plots, and heatmaps
5. **Clean your data** - Detect and handle missing values, duplicates, and outliers
6. **Download results** - Export cleaned datasets as CSV

## Sample Data

To test the application, create a simple CSV file:

```csv
age,salary,years_experience,department
25,50000,1,Sales
28,55000,3,Sales
32,65000,7,Engineering
29,60000,4,Engineering
35,75000,10,Management
26,52000,2,Sales
31,70000,8,Engineering
```

Save as `sample_data.csv` and upload to the tool.

## Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process and try again
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Backend connection error
- Ensure backend is running on http://localhost:8000
- Check that both terminals are active
- Try refreshing the browser

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [backend/README.md](backend/README.md) for API documentation
- Explore the code in `client/src/` and `backend/services/`

## Features Overview

| Feature | Location |
|---------|----------|
| File Upload | Home page |
| Data Preview | Dashboard → Preview tab |
| Statistics | Dashboard → Statistics tab |
| Visualizations | Dashboard → Visualizations tab |
| Data Cleaning | Dashboard → Data Cleaning tab |

## Common Tasks

### Analyze a specific column
1. Upload file
2. Go to Statistics tab
3. Select column from dropdown
4. Click "Preview Cleaned Data"

### Create a scatter plot
1. Upload file
2. Go to Visualizations tab
3. Click "Scatter" tab
4. Select X and Y columns
5. Click "Generate Scatter Plot"

### Clean missing values
1. Upload file
2. Go to Data Cleaning tab
3. Click "Detect Missing Values"
4. Select "Drop rows with missing values"
5. Click "Preview Cleaned Data"
6. Click "Download CSV"

## Performance Tips

- For large files (>100MB), consider splitting into smaller chunks
- Close other applications to free up memory
- Use Chrome or Firefox for best visualization performance

## Getting Help

- Check the [README.md](README.md) for comprehensive documentation
- Review [backend/README.md](backend/README.md) for API details
- Check browser console (F12) for error messages
- Ensure both backend and frontend are running

## What's Included

✅ Full-stack application (React + FastAPI)
✅ Interactive data visualizations
✅ Statistical analysis
✅ Data cleaning tools
✅ Dark mode UI
✅ Responsive design
✅ Complete API documentation
✅ Production-ready code

## Ready to Go!

Your Data Analysis Tool is now ready to use. Start exploring your data! 🚀
