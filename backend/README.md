# Data Analysis Backend API

FastAPI-based backend for data analysis, visualization, and cleaning operations.

## Quick Start

### Setup

```bash
# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Run Server

```bash
python main.py
```

Server will start on `http://localhost:8000`

### API Documentation

Interactive API docs available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Health Check

```
GET /health
```

Returns server status.

### File Upload

```
POST /api/upload
```

Upload and parse CSV or Excel file.

**Parameters:**
- `file` (File): CSV or Excel file

**Response:**
```json
{
  "success": true,
  "filename": "data.csv",
  "shape": {"rows": 1000, "columns": 10},
  "columns": ["col1", "col2", ...],
  "column_info": {
    "col1": {
      "type": "numeric",
      "dtype": "float64",
      "non_null_count": 1000,
      "null_count": 0,
      "unique_count": 500,
      "sample_values": [1.5, 2.3, 3.1]
    }
  },
  "preview": [...]
}
```

### Statistics

```
POST /api/statistics
```

Calculate statistics for dataset or specific column.

**Parameters:**
- `file` (File): CSV or Excel file
- `column` (Optional[str]): Specific column name

**Response:**
```json
{
  "success": true,
  "statistics": {
    "column_name": {
      "type": "numeric",
      "count": 1000,
      "mean": 50.5,
      "median": 50.0,
      "std_dev": 15.2,
      "variance": 231.04,
      "min": 0.0,
      "max": 100.0,
      "q1": 37.5,
      "q3": 62.5,
      "iqr": 25.0,
      "skewness": 0.05,
      "kurtosis": -0.2,
      "normality_test": {
        "test": "Shapiro-Wilk",
        "statistic": 0.99,
        "p_value": 0.45,
        "is_normal": true
      },
      "normal_distribution": {
        "mean": 50.5,
        "std_dev": 15.2,
        "pdf_values": {...},
        "cdf_values": {...}
      }
    }
  }
}
```

### Visualizations

#### Histogram

```
POST /api/visualizations/histogram
```

Generate histogram for numeric column.

**Parameters:**
- `file` (File): CSV or Excel file
- `column` (str): Column name
- `bins` (int): Number of bins (default: 30)

**Response:** Plotly JSON figure

#### Box Plot

```
POST /api/visualizations/boxplot
```

Generate box plot for numeric column.

**Parameters:**
- `file` (File): CSV or Excel file
- `column` (str): Column name

**Response:** Plotly JSON figure

#### Scatter Plot

```
POST /api/visualizations/scatter
```

Generate scatter plot for two numeric columns.

**Parameters:**
- `file` (File): CSV or Excel file
- `x_column` (str): X-axis column
- `y_column` (str): Y-axis column

**Response:** Plotly JSON figure with trend line

#### Correlation Heatmap

```
POST /api/visualizations/heatmap
```

Generate correlation heatmap for numeric columns.

**Parameters:**
- `file` (File): CSV or Excel file

**Response:** Plotly JSON figure

#### Normal Distribution

```
POST /api/visualizations/normal-distribution
```

Generate normal distribution curve with data overlay.

**Parameters:**
- `file` (File): CSV or Excel file
- `column` (str): Column name

**Response:** Plotly JSON figure with statistics annotations

### Data Cleaning

#### Detect Missing Values

```
POST /api/cleaning/detect-missing
```

Identify missing values in dataset.

**Parameters:**
- `file` (File): CSV or Excel file

**Response:**
```json
{
  "success": true,
  "missing_info": {
    "total_missing": 50,
    "total_cells": 10000,
    "columns_with_missing": {
      "column_name": {
        "count": 10,
        "percentage": 1.0
      }
    }
  }
}
```

#### Detect Duplicates

```
POST /api/cleaning/detect-duplicates
```

Find duplicate rows in dataset.

**Parameters:**
- `file` (File): CSV or Excel file

**Response:**
```json
{
  "success": true,
  "duplicate_info": {
    "total_duplicates": 5,
    "total_rows": 1000,
    "duplicate_percentage": 0.5,
    "duplicate_indices": [10, 20, 30, ...]
  }
}
```

#### Detect Outliers

```
POST /api/cleaning/detect-outliers
```

Identify outliers using Z-Score or IQR method.

**Parameters:**
- `file` (File): CSV or Excel file
- `column` (str): Column name
- `method` (str): "zscore" or "iqr"

**Response:**
```json
{
  "success": true,
  "outlier_info": {
    "method": "Z-Score",
    "threshold": 3,
    "total_outliers": 15,
    "outlier_percentage": 1.5,
    "outlier_indices": [...],
    "outlier_values": [...]
  }
}
```

#### Clean Dataset

```
POST /api/cleaning/clean-dataset
```

Apply cleaning operations to dataset.

**Parameters:**
- `file` (File): CSV or Excel file
- `handle_missing` (str): "drop", "mean", or "median"
- `remove_duplicates` (bool): Remove duplicate rows
- `remove_outliers` (bool): Remove outliers
- `outlier_column` (Optional[str]): Column for outlier detection
- `outlier_method` (str): "zscore" or "iqr"

**Response:**
```json
{
  "success": true,
  "rows_before": 1000,
  "rows_after": 980,
  "rows_removed": 20,
  "data": [...]
}
```

#### Download Cleaned Dataset

```
POST /api/cleaning/download-cleaned
```

Download cleaned dataset as CSV file.

**Parameters:** Same as `/api/cleaning/clean-dataset`

**Response:** CSV file download

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid parameters or file format
- `500 Internal Server Error`: Server error

Error response format:
```json
{
  "detail": "Error message describing what went wrong"
}
```

## File Format Support

- **CSV**: Comma-separated values
- **XLSX**: Excel 2007+ format
- **XLS**: Excel 97-2003 format

Maximum file size: 50MB

## Data Type Detection

Columns are automatically classified as:
- **numeric**: Integer or floating-point values
- **categorical**: Text or discrete values
- **datetime**: Date and time values
- **boolean**: True/False values

## Statistical Methods

### Normality Tests

- **Shapiro-Wilk**: For samples ≤ 5000
- **Kolmogorov-Smirnov**: For samples > 5000

### Outlier Detection

- **Z-Score**: Values with |z| > 3 (default threshold)
- **IQR**: Values outside [Q1 - 1.5×IQR, Q3 + 1.5×IQR]

### Missing Value Handling

- **Drop**: Remove rows with any missing values
- **Mean**: Fill with column mean (numeric only)
- **Median**: Fill with column median (numeric only)

## Performance

- Asynchronous request handling
- Optimized for datasets up to 1GB
- Efficient memory usage with streaming
- Caching for repeated calculations

## Dependencies

See `requirements.txt` for complete list:
- fastapi: Web framework
- uvicorn: ASGI server
- pandas: Data manipulation
- numpy: Numerical computing
- scipy: Scientific computing
- scikit-learn: Machine learning utilities
- plotly: Visualization
- python-multipart: File upload handling

## Development

### Code Structure

```
services/
├── file_handler.py      # File I/O and parsing
├── statistics.py        # Statistical calculations
├── visualization.py     # Chart generation
└── data_cleaning.py     # Data preprocessing
```

### Adding New Endpoints

1. Create service method in appropriate module
2. Add endpoint in `main.py`
3. Include CORS headers
4. Add error handling
5. Document in API docs

### Testing

Run endpoints with curl:

```bash
# Health check
curl http://localhost:8000/health

# Upload file
curl -X POST -F "file=@data.csv" http://localhost:8000/api/upload

# Get statistics
curl -X POST -F "file=@data.csv" -F "column=age" http://localhost:8000/api/statistics
```

## CORS Configuration

Currently allows requests from all origins. For production, update in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>
```

### Memory Issues with Large Files

- Reduce file size
- Process in chunks
- Increase system RAM

### Slow Calculations

- Reduce dataset size for testing
- Use sampling for large datasets
- Consider async processing for very large files

## Future Enhancements

- [ ] Database integration
- [ ] User authentication
- [ ] Data caching
- [ ] Batch processing
- [ ] Advanced ML models
- [ ] Real-time streaming
- [ ] WebSocket support
- [ ] Rate limiting
