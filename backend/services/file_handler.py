"""
File handling service for loading CSV and Excel files.
"""

import pandas as pd
import io
from typing import Optional, Dict, Any


class FileHandler:
    """Handles file uploads and parsing."""
    
    ALLOWED_EXTENSIONS = {'.csv', '.xlsx', '.xls'}
    
    def load_file(self, contents: bytes, filename: str) -> Optional[pd.DataFrame]:
        """
        Load a CSV or Excel file from bytes.
        
        Args:
            contents: File contents as bytes
            filename: Original filename
            
        Returns:
            Pandas DataFrame or None if invalid format
        """
        try:
            if filename.endswith('.csv'):
                return pd.read_csv(io.BytesIO(contents))
            elif filename.endswith(('.xlsx', '.xls')):
                return pd.read_excel(io.BytesIO(contents))
            else:
                return None
        except Exception as e:
            raise ValueError(f"Error reading file: {str(e)}")
    
    def get_column_info(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Get information about columns in the dataset.
        
        Args:
            df: Pandas DataFrame
            
        Returns:
            Dictionary with column information
        """
        column_info = {}
        
        for col in df.columns:
            dtype = str(df[col].dtype)
            
            # Determine column type
            if pd.api.types.is_numeric_dtype(df[col]):
                col_type = "numeric"
            elif pd.api.types.is_datetime64_any_dtype(df[col]):
                col_type = "datetime"
            elif pd.api.types.is_bool_dtype(df[col]):
                col_type = "boolean"
            else:
                col_type = "categorical"
            
            column_info[col] = {
                "type": col_type,
                "dtype": dtype,
                "non_null_count": int(df[col].notna().sum()),
                "null_count": int(df[col].isna().sum()),
                "unique_count": int(df[col].nunique()),
                "sample_values": df[col].dropna().head(3).tolist()
            }
        
        return column_info
