"""
Data Analysis and Preprocessing Tool - FastAPI Backend
Provides endpoints for file uploads, statistical analysis, visualization, and data cleaning.
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import io
import json
from typing import Optional

from services.file_handler import FileHandler
from services.statistics import StatisticsService
from services.visualization import VisualizationService
from services.data_cleaning import DataCleaningService

app = FastAPI(
    title="Data Analysis Tool API",
    description="API for data analysis, visualization, and cleaning",
    version="1.0.0"
)

# Configure CORS to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
file_handler = FileHandler()
stats_service = StatisticsService()
viz_service = VisualizationService()
cleaning_service = DataCleaningService()


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "message": "Data Analysis API is running"}


@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a CSV or Excel file and return basic statistics.
    
    Args:
        file: CSV or Excel file
        
    Returns:
        JSON with file info, columns, and basic statistics
    """
    try:
        contents = await file.read()
        df = file_handler.load_file(contents, file.filename)
        
        if df is None:
            raise HTTPException(status_code=400, detail="Invalid file format. Please upload CSV or Excel files.")
        
        # Get column information
        column_info = file_handler.get_column_info(df)
        
        return {
            "success": True,
            "filename": file.filename,
            "shape": {"rows": len(df), "columns": len(df.columns)},
            "columns": list(df.columns),
            "column_info": column_info,
            "preview": df.head(5).to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/statistics")
async def get_statistics(file: UploadFile = File(...), column: Optional[str] = None):
    """
    Calculate statistics for the uploaded file.
    
    Args:
        file: CSV or Excel file
        column: Optional specific column to analyze
        
    Returns:
        JSON with statistics including mean, median, variance, std dev, and distribution info
    """
    try:
        contents = await file.read()
        df = file_handler.load_file(contents, file.filename)
        
        if df is None:
            raise HTTPException(status_code=400, detail="Invalid file format.")
        
        if column and column not in df.columns:
            raise HTTPException(status_code=400, detail=f"Column '{column}' not found.")
        
        # Get statistics
        stats = stats_service.calculate_statistics(df, column)
        
        return {
            "success": True,
            "statistics": stats
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/visualizations/histogram")
async def create_histogram(file: UploadFile = File(...), column: str = None, bins: int = 30):
    """
    Generate a histogram for a numeric column.
    
    Args:
        file: CSV or Excel file
        column: Column name for histogram
        bins: Number of bins
        
    Returns:
        Plotly JSON visualization
    """
    try:
        contents = await file.read()
        df = file_handler.load_file(contents, file.filename)
        
        if df is None or column not in df.columns:
            raise HTTPException(status_code=400, detail="Invalid file or column.")
        
        fig = viz_service.create_histogram(df, column, bins)
        return JSONResponse(fig.to_dict())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/visualizations/boxplot")
async def create_boxplot(file: UploadFile = File(...), column: str = None):
    """
    Generate a box plot for a numeric column.
    
    Args:
        file: CSV or Excel file
        column: Column name for box plot
        
    Returns:
        Plotly JSON visualization
    """
    try:
        contents = await file.read()
        df = file_handler.load_file(contents, file.filename)
        
        if df is None or column not in df.columns:
            raise HTTPException(status_code=400, detail="Invalid file or column.")
        
        fig = viz_service.create_boxplot(df, column)
        return JSONResponse(fig.to_dict())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/visualizations/scatter")
async def create_scatter(file: UploadFile = File(...), x_column: str = None, y_column: str = None):
    """
    Generate a scatter plot for two numeric columns.
    
    Args:
        file: CSV or Excel file
        x_column: X-axis column
        y_column: Y-axis column
        
    Returns:
        Plotly JSON visualization
    """
    try:
        contents = await file.read()
        df = file_handler.load_file(contents, file.filename)
        
        if df is None or x_column not in df.columns or y_column not in df.columns:
            raise HTTPException(status_code=400, detail="Invalid file or columns.")
        
        fig = viz_service.create_scatter(df, x_column, y_column)
        return JSONResponse(fig.to_dict())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/visualizations/heatmap")
async def create_heatmap(file: UploadFile = File(...)):
    """
    Generate a correlation heatmap for numeric columns.
    
    Args:
        file: CSV or Excel file
        
    Returns:
        Plotly JSON visualization
    """
    try:
        contents = await file.read()
        df = file_handler.load_file(contents, file.filename)
        
        if df is None:
            raise HTTPException(status_code=400, detail="Invalid file.")
        
        fig = viz_service.create_heatmap(df)
        return JSONResponse(fig.to_dict())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/visualizations/normal-distribution")
async def create_normal_distribution(file: UploadFile = File(...), column: str = None):
    """
    Generate a normal distribution curve for a numeric column.
    
    Args:
        file: CSV or Excel file
        column: Column name
        
    Returns:
        Plotly JSON visualization with distribution curve
    """
    try:
        contents = await file.read()
        df = file_handler.load_file(contents, file.filename)
        
        if df is None or column not in df.columns:
            raise HTTPException(status_code=400, detail="Invalid file or column.")
        
        fig = viz_service.create_normal_distribution(df, column)
        return JSONResponse(fig.to_dict())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/cleaning/detect-missing")
async def detect_missing(file: UploadFile = File(...)):
    """
    Detect missing values in the dataset.
    
    Args:
        file: CSV or Excel file
        
    Returns:
        JSON with missing value information
    """
    try:
        contents = await file.read()
        df = file_handler.load_file(contents, file.filename)
        
        if df is None:
            raise HTTPException(status_code=400, detail="Invalid file.")
        
        missing_info = cleaning_service.detect_missing_values(df)
        return {
            "success": True,
            "missing_info": missing_info
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/cleaning/detect-duplicates")
async def detect_duplicates(file: UploadFile = File(...)):
    """
    Detect duplicate rows in the dataset.
    
    Args:
        file: CSV or Excel file
        
    Returns:
        JSON with duplicate information
    """
    try:
        contents = await file.read()
        df = file_handler.load_file(contents, file.filename)
        
        if df is None:
            raise HTTPException(status_code=400, detail="Invalid file.")
        
        duplicate_info = cleaning_service.detect_duplicates(df)
        return {
            "success": True,
            "duplicate_info": duplicate_info
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/cleaning/detect-outliers")
async def detect_outliers(file: UploadFile = File(...), column: str = None, method: str = "zscore"):
    """
    Detect outliers using Z-Score or IQR method.
    
    Args:
        file: CSV or Excel file
        column: Column to analyze
        method: "zscore" or "iqr"
        
    Returns:
        JSON with outlier information
    """
    try:
        contents = await file.read()
        df = file_handler.load_file(contents, file.filename)
        
        if df is None or column not in df.columns:
            raise HTTPException(status_code=400, detail="Invalid file or column.")
        
        outlier_info = cleaning_service.detect_outliers(df, column, method)
        return {
            "success": True,
            "outlier_info": outlier_info
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/cleaning/clean-dataset")
async def clean_dataset(
    file: UploadFile = File(...),
    handle_missing: str = "drop",
    remove_duplicates: bool = True,
    remove_outliers: bool = False,
    outlier_column: Optional[str] = None,
    outlier_method: str = "zscore"
):
    """
    Clean the dataset based on specified options.
    
    Args:
        file: CSV or Excel file
        handle_missing: "drop", "mean", or "median"
        remove_duplicates: Whether to remove duplicate rows
        remove_outliers: Whether to remove outliers
        outlier_column: Column to check for outliers
        outlier_method: "zscore" or "iqr"
        
    Returns:
        Cleaned dataset as CSV file
    """
    try:
        contents = await file.read()
        df = file_handler.load_file(contents, file.filename)
        
        if df is None:
            raise HTTPException(status_code=400, detail="Invalid file.")
        
        # Apply cleaning operations
        cleaned_df = cleaning_service.clean_dataset(
            df,
            handle_missing=handle_missing,
            remove_duplicates=remove_duplicates,
            remove_outliers=remove_outliers,
            outlier_column=outlier_column,
            outlier_method=outlier_method
        )
        
        # Convert to CSV
        csv_buffer = io.StringIO()
        cleaned_df.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)
        
        return {
            "success": True,
            "rows_before": len(df),
            "rows_after": len(cleaned_df),
            "rows_removed": len(df) - len(cleaned_df),
            "data": cleaned_df.to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/cleaning/download-cleaned")
async def download_cleaned(
    file: UploadFile = File(...),
    handle_missing: str = "drop",
    remove_duplicates: bool = True,
    remove_outliers: bool = False,
    outlier_column: Optional[str] = None,
    outlier_method: str = "zscore"
):
    """
    Download cleaned dataset as CSV file.
    
    Args:
        file: CSV or Excel file
        handle_missing: "drop", "mean", or "median"
        remove_duplicates: Whether to remove duplicate rows
        remove_outliers: Whether to remove outliers
        outlier_column: Column to check for outliers
        outlier_method: "zscore" or "iqr"
        
    Returns:
        CSV file for download
    """
    try:
        contents = await file.read()
        df = file_handler.load_file(contents, file.filename)
        
        if df is None:
            raise HTTPException(status_code=400, detail="Invalid file.")
        
        # Apply cleaning operations
        cleaned_df = cleaning_service.clean_dataset(
            df,
            handle_missing=handle_missing,
            remove_duplicates=remove_duplicates,
            remove_outliers=remove_outliers,
            outlier_column=outlier_column,
            outlier_method=outlier_method
        )
        
        # Save to temporary file
        output_filename = "cleaned_data.csv"
        cleaned_df.to_csv(output_filename, index=False)
        
        return FileResponse(
            output_filename,
            media_type="text/csv",
            filename=output_filename
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
