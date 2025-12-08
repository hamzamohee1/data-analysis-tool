"""
Statistics service for calculating statistical measures and distributions.
"""

import pandas as pd
import numpy as np
from scipy import stats
from typing import Optional, Dict, Any


class StatisticsService:
    """Calculates statistical measures and distributions."""
    
    def calculate_statistics(self, df: pd.DataFrame, column: Optional[str] = None) -> Dict[str, Any]:
        """
        Calculate comprehensive statistics for the dataset or a specific column.
        
        Args:
            df: Pandas DataFrame
            column: Optional specific column to analyze
            
        Returns:
            Dictionary with statistics
        """
        result = {}
        
        if column:
            # Single column statistics
            if column not in df.columns:
                raise ValueError(f"Column '{column}' not found")
            
            col_data = df[column].dropna()
            
            if pd.api.types.is_numeric_dtype(col_data):
                result[column] = self._numeric_statistics(col_data)
            else:
                result[column] = self._categorical_statistics(col_data)
        else:
            # All columns statistics
            for col in df.columns:
                col_data = df[col].dropna()
                
                if pd.api.types.is_numeric_dtype(col_data):
                    result[col] = self._numeric_statistics(col_data)
                else:
                    result[col] = self._categorical_statistics(col_data)
        
        return result
    
    def _numeric_statistics(self, series: pd.Series) -> Dict[str, Any]:
        """Calculate statistics for numeric columns."""
        # Remove NaN values
        data = series.dropna()
        
        if len(data) == 0:
            return {"error": "No numeric data available"}
        
        # Basic statistics
        mean = float(data.mean())
        median = float(data.median())
        std_dev = float(data.std())
        variance = float(data.var())
        
        # Distribution statistics
        skewness = float(stats.skew(data))
        kurtosis = float(stats.kurtosis(data))
        
        # Normality test (Shapiro-Wilk)
        if len(data) <= 5000:  # Shapiro-Wilk works best with smaller samples
            stat, p_value = stats.shapiro(data)
            normality_test = {
                "test": "Shapiro-Wilk",
                "statistic": float(stat),
                "p_value": float(p_value),
                "is_normal": bool(p_value > 0.05)
            }
        else:
            # Use Kolmogorov-Smirnov for larger samples
            stat, p_value = stats.kstest(data, 'norm', args=(mean, std_dev))
            normality_test = {
                "test": "Kolmogorov-Smirnov",
                "statistic": float(stat),
                "p_value": float(p_value),
                "is_normal": bool(p_value > 0.05)
            }
        
        # Normal distribution parameters
        normal_dist = {
            "mean": mean,
            "std_dev": std_dev,
            "pdf_values": self._calculate_pdf(data, mean, std_dev),
            "cdf_values": self._calculate_cdf(data, mean, std_dev)
        }
        
        return {
            "type": "numeric",
            "count": int(len(data)),
            "mean": mean,
            "median": median,
            "std_dev": std_dev,
            "variance": variance,
            "min": float(data.min()),
            "max": float(data.max()),
            "q1": float(data.quantile(0.25)),
            "q3": float(data.quantile(0.75)),
            "iqr": float(data.quantile(0.75) - data.quantile(0.25)),
            "skewness": skewness,
            "kurtosis": kurtosis,
            "normality_test": normality_test,
            "normal_distribution": normal_dist
        }
    
    def _categorical_statistics(self, series: pd.Series) -> Dict[str, Any]:
        """Calculate statistics for categorical columns."""
        value_counts = series.value_counts()
        
        return {
            "type": "categorical",
            "count": int(len(series)),
            "unique_values": int(series.nunique()),
            "most_common": series.mode()[0] if len(series.mode()) > 0 else None,
            "value_counts": value_counts.head(10).to_dict(),
            "mode_frequency": int(value_counts.iloc[0]) if len(value_counts) > 0 else 0
        }
    
    def _calculate_pdf(self, data: pd.Series, mean: float, std_dev: float) -> Dict[str, list]:
        """Calculate PDF (Probability Density Function) values."""
        x = np.linspace(data.min(), data.max(), 100)
        y = stats.norm.pdf(x, mean, std_dev)
        
        return {
            "x": x.tolist(),
            "y": y.tolist()
        }
    
    def _calculate_cdf(self, data: pd.Series, mean: float, std_dev: float) -> Dict[str, list]:
        """Calculate CDF (Cumulative Distribution Function) values."""
        x = np.linspace(data.min(), data.max(), 100)
        y = stats.norm.cdf(x, mean, std_dev)
        
        return {
            "x": x.tolist(),
            "y": y.tolist()
        }
