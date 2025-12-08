"""
Data cleaning service for handling missing values, duplicates, and outliers.
"""

import pandas as pd
import numpy as np
from scipy import stats
from typing import Optional, Dict, Any


class DataCleaningService:
    """Provides data cleaning and preprocessing functionality."""
    
    def detect_missing_values(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Detect missing values in the dataset.
        
        Args:
            df: Pandas DataFrame
            
        Returns:
            Dictionary with missing value information
        """
        missing_count = df.isnull().sum()
        missing_percent = (df.isnull().sum() / len(df)) * 100
        
        missing_info = {
            "total_missing": int(missing_count.sum()),
            "total_cells": int(df.shape[0] * df.shape[1]),
            "columns_with_missing": {}
        }
        
        for col in df.columns:
            if missing_count[col] > 0:
                missing_info["columns_with_missing"][col] = {
                    "count": int(missing_count[col]),
                    "percentage": float(missing_percent[col])
                }
        
        return missing_info
    
    def detect_duplicates(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Detect duplicate rows in the dataset.
        
        Args:
            df: Pandas DataFrame
            
        Returns:
            Dictionary with duplicate information
        """
        total_duplicates = df.duplicated().sum()
        
        duplicate_info = {
            "total_duplicates": int(total_duplicates),
            "total_rows": len(df),
            "duplicate_percentage": float((total_duplicates / len(df)) * 100) if len(df) > 0 else 0,
            "duplicate_indices": df[df.duplicated(keep=False)].index.tolist()[:100]  # Limit to first 100
        }
        
        return duplicate_info
    
    def detect_outliers(self, df: pd.DataFrame, column: str, method: str = "zscore") -> Dict[str, Any]:
        """
        Detect outliers using Z-Score or IQR method.
        
        Args:
            df: Pandas DataFrame
            column: Column to analyze
            method: "zscore" or "iqr"
            
        Returns:
            Dictionary with outlier information
        """
        data = df[column].dropna()
        
        if method == "zscore":
            z_scores = np.abs(stats.zscore(data))
            outlier_threshold = 3
            outliers = z_scores > outlier_threshold
            outlier_indices = data[outliers].index.tolist()
            
            outlier_info = {
                "method": "Z-Score",
                "threshold": outlier_threshold,
                "total_outliers": int(outliers.sum()),
                "outlier_percentage": float((outliers.sum() / len(data)) * 100),
                "outlier_indices": outlier_indices[:100],  # Limit to first 100
                "outlier_values": data[outliers].head(10).tolist()
            }
        
        elif method == "iqr":
            q1 = data.quantile(0.25)
            q3 = data.quantile(0.75)
            iqr = q3 - q1
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr
            
            outliers = (data < lower_bound) | (data > upper_bound)
            outlier_indices = data[outliers].index.tolist()
            
            outlier_info = {
                "method": "IQR",
                "lower_bound": float(lower_bound),
                "upper_bound": float(upper_bound),
                "total_outliers": int(outliers.sum()),
                "outlier_percentage": float((outliers.sum() / len(data)) * 100),
                "outlier_indices": outlier_indices[:100],  # Limit to first 100
                "outlier_values": data[outliers].head(10).tolist()
            }
        
        else:
            raise ValueError("Method must be 'zscore' or 'iqr'")
        
        return outlier_info
    
    def clean_dataset(
        self,
        df: pd.DataFrame,
        handle_missing: str = "drop",
        remove_duplicates: bool = True,
        remove_outliers: bool = False,
        outlier_column: Optional[str] = None,
        outlier_method: str = "zscore"
    ) -> pd.DataFrame:
        """
        Clean the dataset based on specified options.
        
        Args:
            df: Pandas DataFrame
            handle_missing: "drop", "mean", or "median"
            remove_duplicates: Whether to remove duplicate rows
            remove_outliers: Whether to remove outliers
            outlier_column: Column to check for outliers
            outlier_method: "zscore" or "iqr"
            
        Returns:
            Cleaned DataFrame
        """
        cleaned_df = df.copy()
        
        # Handle missing values
        if handle_missing == "drop":
            cleaned_df = cleaned_df.dropna()
        elif handle_missing == "mean":
            numeric_cols = cleaned_df.select_dtypes(include=[np.number]).columns
            cleaned_df[numeric_cols] = cleaned_df[numeric_cols].fillna(cleaned_df[numeric_cols].mean())
        elif handle_missing == "median":
            numeric_cols = cleaned_df.select_dtypes(include=[np.number]).columns
            cleaned_df[numeric_cols] = cleaned_df[numeric_cols].fillna(cleaned_df[numeric_cols].median())
        
        # Remove duplicates
        if remove_duplicates:
            cleaned_df = cleaned_df.drop_duplicates()
        
        # Remove outliers
        if remove_outliers and outlier_column:
            if outlier_column not in cleaned_df.columns:
                raise ValueError(f"Column '{outlier_column}' not found")
            
            data = cleaned_df[outlier_column].dropna()
            
            if outlier_method == "zscore":
                z_scores = np.abs(stats.zscore(data))
                outlier_mask = z_scores <= 3
            elif outlier_method == "iqr":
                q1 = data.quantile(0.25)
                q3 = data.quantile(0.75)
                iqr = q3 - q1
                lower_bound = q1 - 1.5 * iqr
                upper_bound = q3 + 1.5 * iqr
                outlier_mask = (data >= lower_bound) & (data <= upper_bound)
            else:
                raise ValueError("Method must be 'zscore' or 'iqr'")
            
            # Create a mask for the entire dataframe
            full_mask = pd.Series(True, index=cleaned_df.index)
            full_mask[data.index] = outlier_mask
            cleaned_df = cleaned_df[full_mask]
        
        return cleaned_df
