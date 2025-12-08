# Data Analysis and Preprocessing Tool

A modern, full-stack web application for data analysis, visualization, and cleaning. Built with React, FastAPI, and Plotly for interactive data exploration.

## Features

### 📊 Statistical Analysis
- Calculate mean, median, variance, and standard deviation
- Normal distribution analysis with PDF and CDF calculations
- Normality tests (Shapiro-Wilk, Kolmogorov-Smirnov)
- Skewness and kurtosis analysis
- Comprehensive column profiling

### 📈 Interactive Visualizations
- **Histograms**: Distribution visualization with customizable bins
- **Box Plots**: Quartile analysis and outlier detection
- **Scatter Plots**: Relationship analysis with trend lines
- **Correlation Heatmaps**: Numeric column correlations
- **Normal Distribution Curves**: Overlay with actual data distribution

### 🧹 Data Cleaning
- **Missing Value Detection**: Identify and handle missing data
- **Duplicate Detection**: Find and remove duplicate rows
- **Outlier Detection**: Z-Score and IQR methods
- **Data Cleaning**: Multiple strategies for preprocessing
- **Export**: Download cleaned datasets as CSV

### 🎨 User Interface
- Dark mode dashboard with smooth animations
- Responsive design for desktop and tablet
- Real-time data preview and statistics
- Interactive tabs for different analysis sections
- Loading states and error handling

## Technology Stack

### Frontend
- **React 19**: Modern UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Plotly.js**: Interactive visualizations
- **Wouter**: Lightweight routing
- **shadcn/ui**: Pre-built components

### Backend
- **FastAPI**: Modern async Python web framework
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing
- **SciPy**: Scientific computing and statistics
- **Scikit-learn**: Machine learning utilities
- **Plotly**: Chart generation
- **Uvicorn**: ASGI server

## Project Structure

```
data-analysis-tool/
├── client/                          # React frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── Dashboard.tsx        # Main dashboard
│   │   │   ├── FileUpload.tsx       # File upload handler
│   │   │   ├── DataPreview.tsx      # Data preview table
│   │   │   ├── StatisticsPanel.tsx  # Statistics display
│   │   │   ├── VisualizationPanel.tsx # Charts and plots
│   │   │   ├── DataCleaningPanel.tsx # Cleaning operations
│   │   │   ├── PlotlyChart.tsx      # Plotly renderer
│   │   │   └── ui/                  # shadcn/ui components
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Main page
│   │   │   └── NotFound.tsx         # 404 page
│   │   ├── App.tsx                  # App router
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── index.html                   # HTML template
│   └── package.json
│
├── backend/                         # FastAPI backend
│   ├── main.py                      # Main application
│   ├── services/
│   │   ├── file_handler.py          # File upload and parsing
│   │   ├── statistics.py            # Statistical calculations
│   │   ├── visualization.py         # Chart generation
│   │   └── data_cleaning.py         # Data cleaning operations
│   ├── venv/                        # Python virtual environment
│   ├── requirements.txt             # Python dependencies
│   └── README.md                    # Backend documentation
│
├── README.md                        # This file
└── package.json                     # Root package configuration
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm/pnpm
- **Python** 3.11+
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/data-analysis-tool.git
cd data-analysis-tool
```

#### 2. Setup Backend

```bash
cd backend

# Create and activate virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### 3. Setup Frontend

```bash
cd ../client

# Install dependencies
pnpm install  # or npm install
```

## Running the Application

### Start Backend Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

The backend will start on `http://localhost:8000`

### Start Frontend Development Server

In a new terminal:

```bash
cd client
pnpm dev  # or npm run dev
```

The frontend will start on `http://localhost:5173`

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Usage

### 1. Upload Dataset

- Click the upload area or select a file
- Supported formats: CSV, XLSX, XLS
- Maximum file size: 50MB

### 2. Preview Data

- View first 5 rows of your dataset
- See column information (type, null count, unique values)
- Understand data structure before analysis

### 3. Statistical Analysis

- Select a numeric column
- View comprehensive statistics (mean, median, std dev, variance)
- Analyze distribution (skewness, kurtosis)
- Check normality test results

### 4. Create Visualizations

- **Histogram**: Analyze value distribution
- **Box Plot**: Identify quartiles and outliers
- **Scatter Plot**: Explore relationships between variables
- **Heatmap**: Visualize correlations
- **Normal Distribution**: Compare data with normal curve

### 5. Clean Data

- **Detect Missing Values**: Identify null data
- **Detect Duplicates**: Find duplicate rows
- **Detect Outliers**: Use Z-Score or IQR methods
- **Clean Dataset**: Apply multiple cleaning strategies
- **Download**: Export cleaned data as CSV

## API Endpoints

### File Upload
- `POST /api/upload` - Upload and parse file

### Statistics
- `POST /api/statistics` - Calculate statistics for column

### Visualizations
- `POST /api/visualizations/histogram` - Generate histogram
- `POST /api/visualizations/boxplot` - Generate box plot
- `POST /api/visualizations/scatter` - Generate scatter plot
- `POST /api/visualizations/heatmap` - Generate correlation heatmap
- `POST /api/visualizations/normal-distribution` - Generate normal distribution curve

### Data Cleaning
- `POST /api/cleaning/detect-missing` - Detect missing values
- `POST /api/cleaning/detect-duplicates` - Detect duplicates
- `POST /api/cleaning/detect-outliers` - Detect outliers
- `POST /api/cleaning/clean-dataset` - Clean dataset
- `POST /api/cleaning/download-cleaned` - Download cleaned CSV

## Configuration

### Backend Configuration

Edit `backend/main.py` to modify:
- Server host and port
- CORS settings
- File size limits

### Frontend Configuration

Edit `client/src/index.css` for:
- Color theme
- Typography
- Spacing and sizing

## Performance Optimization

- Backend processes datasets asynchronously
- Frontend uses React hooks for efficient rendering
- Plotly charts are lazy-loaded
- Virtual environment isolates dependencies

## Troubleshooting

### Backend Connection Error

If frontend can't connect to backend:
1. Ensure backend is running: `curl http://localhost:8000/health`
2. Check CORS settings in `backend/main.py`
3. Verify port 8000 is not in use

### Large File Upload Issues

- Maximum file size is 50MB
- For larger files, split into chunks
- Ensure sufficient disk space

### Visualization Not Displaying

- Check browser console for errors
- Verify Plotly.js is loaded from CDN
- Try refreshing the page

## Development

### Adding New Features

1. **Backend**: Add new service in `backend/services/`
2. **API**: Create new endpoint in `backend/main.py`
3. **Frontend**: Create component in `client/src/components/`
4. **Integration**: Connect frontend to API

### Code Style

- Backend: Follow PEP 8
- Frontend: Use TypeScript strict mode
- Use ESLint for code quality

## Deployment

### Deploy Backend

Options:
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repository
- **AWS**: Use EC2 or Lambda
- **DigitalOcean**: Deploy with App Platform

### Deploy Frontend

Options:
- **Vercel**: Connect GitHub repository
- **Netlify**: Drag and drop or GitHub integration
- **AWS S3 + CloudFront**: Static hosting
- **GitHub Pages**: Free hosting

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review API documentation

## Changelog

### Version 1.0.0 (Initial Release)
- File upload and parsing
- Statistical analysis
- Interactive visualizations
- Data cleaning operations
- Dark mode UI
- Responsive design

## Future Enhancements

- [ ] Real-time data streaming
- [ ] Advanced statistical models
- [ ] Machine learning predictions
- [ ] Multi-file analysis
- [ ] Data export to multiple formats
- [ ] User authentication
- [ ] Data caching and history
- [ ] Collaborative features
- [ ] API rate limiting
- [ ] Advanced filtering options

## Author

Built with attention to detail and modern best practices.

## Acknowledgments

- FastAPI documentation
- React best practices
- Plotly visualization library
- Pandas and NumPy communities
