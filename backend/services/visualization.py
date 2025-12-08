"""
Visualization service for creating interactive charts using Plotly.
"""

import pandas as pd
import numpy as np
from scipy import stats
import plotly.graph_objects as go
import plotly.express as px
from typing import Optional


class VisualizationService:
    """Creates interactive visualizations using Plotly."""
    
    def create_histogram(self, df: pd.DataFrame, column: str, bins: int = 30) -> go.Figure:
        """
        Create a histogram for a numeric column.
        
        Args:
            df: Pandas DataFrame
            column: Column name
            bins: Number of bins
            
        Returns:
            Plotly Figure
        """
        data = df[column].dropna()
        
        fig = go.Figure()
        
        fig.add_trace(go.Histogram(
            x=data,
            nbinsx=bins,
            name=column,
            marker=dict(color='#3b82f6', line=dict(color='#1e40af', width=1)),
            opacity=0.7
        ))
        
        fig.update_layout(
            title=f"Histogram of {column}",
            xaxis_title=column,
            yaxis_title="Frequency",
            hovermode='x unified',
            template='plotly_white',
            height=500,
            showlegend=True
        )
        
        return fig
    
    def create_boxplot(self, df: pd.DataFrame, column: str) -> go.Figure:
        """
        Create a box plot for a numeric column.
        
        Args:
            df: Pandas DataFrame
            column: Column name
            
        Returns:
            Plotly Figure
        """
        data = df[column].dropna()
        
        fig = go.Figure()
        
        fig.add_trace(go.Box(
            y=data,
            name=column,
            marker=dict(color='#3b82f6'),
            boxmean='sd'
        ))
        
        fig.update_layout(
            title=f"Box Plot of {column}",
            yaxis_title=column,
            template='plotly_white',
            height=500,
            showlegend=True
        )
        
        return fig
    
    def create_scatter(self, df: pd.DataFrame, x_column: str, y_column: str) -> go.Figure:
        """
        Create a scatter plot for two numeric columns.
        
        Args:
            df: Pandas DataFrame
            x_column: X-axis column
            y_column: Y-axis column
            
        Returns:
            Plotly Figure
        """
        # Remove rows with NaN in either column
        plot_df = df[[x_column, y_column]].dropna()
        
        fig = go.Figure()
        
        fig.add_trace(go.Scatter(
            x=plot_df[x_column],
            y=plot_df[y_column],
            mode='markers',
            marker=dict(
                size=8,
                color='#3b82f6',
                opacity=0.6,
                line=dict(color='#1e40af', width=1)
            ),
            name='Data Points',
            text=[f"{x_column}: {x}<br>{y_column}: {y}" 
                  for x, y in zip(plot_df[x_column], plot_df[y_column])],
            hovertemplate='%{text}<extra></extra>'
        ))
        
        # Add trend line
        z = np.polyfit(plot_df[x_column], plot_df[y_column], 1)
        p = np.poly1d(z)
        x_trend = np.linspace(plot_df[x_column].min(), plot_df[x_column].max(), 100)
        y_trend = p(x_trend)
        
        fig.add_trace(go.Scatter(
            x=x_trend,
            y=y_trend,
            mode='lines',
            name='Trend Line',
            line=dict(color='#ef4444', width=2, dash='dash')
        ))
        
        fig.update_layout(
            title=f"Scatter Plot: {x_column} vs {y_column}",
            xaxis_title=x_column,
            yaxis_title=y_column,
            template='plotly_white',
            height=500,
            hovermode='closest'
        )
        
        return fig
    
    def create_heatmap(self, df: pd.DataFrame) -> go.Figure:
        """
        Create a correlation heatmap for numeric columns.
        
        Args:
            df: Pandas DataFrame
            
        Returns:
            Plotly Figure
        """
        # Select only numeric columns
        numeric_df = df.select_dtypes(include=[np.number])
        
        if numeric_df.shape[1] < 2:
            raise ValueError("At least 2 numeric columns are required for correlation heatmap")
        
        # Calculate correlation matrix
        corr_matrix = numeric_df.corr()
        
        fig = go.Figure(data=go.Heatmap(
            z=corr_matrix.values,
            x=corr_matrix.columns,
            y=corr_matrix.columns,
            colorscale='RdBu',
            zmid=0,
            text=np.round(corr_matrix.values, 2),
            texttemplate='%{text}',
            textfont={"size": 10},
            colorbar=dict(title="Correlation")
        ))
        
        fig.update_layout(
            title="Correlation Heatmap",
            xaxis_title="Features",
            yaxis_title="Features",
            template='plotly_white',
            height=600,
            width=700
        )
        
        return fig
    
    def create_normal_distribution(self, df: pd.DataFrame, column: str) -> go.Figure:
        """
        Create a normal distribution curve with histogram overlay.
        
        Args:
            df: Pandas DataFrame
            column: Column name
            
        Returns:
            Plotly Figure
        """
        data = df[column].dropna()
        
        if len(data) == 0:
            raise ValueError("No numeric data available")
        
        # Calculate statistics
        mean = data.mean()
        std_dev = data.std()
        
        # Create histogram
        fig = go.Figure()
        
        fig.add_trace(go.Histogram(
            x=data,
            nbinsx=30,
            name='Data',
            marker=dict(color='#3b82f6', opacity=0.6),
            histnorm='probability density'
        ))
        
        # Add normal distribution curve
        x = np.linspace(data.min(), data.max(), 200)
        y = stats.norm.pdf(x, mean, std_dev)
        
        fig.add_trace(go.Scatter(
            x=x,
            y=y,
            mode='lines',
            name='Normal Distribution',
            line=dict(color='#ef4444', width=3)
        ))
        
        # Add statistics annotations
        annotations_text = (
            f"Mean: {mean:.2f}<br>"
            f"Std Dev: {std_dev:.2f}<br>"
            f"Skewness: {stats.skew(data):.2f}<br>"
            f"Kurtosis: {stats.kurtosis(data):.2f}"
        )
        
        fig.add_annotation(
            text=annotations_text,
            xref="paper", yref="paper",
            x=0.98, y=0.97,
            showarrow=False,
            bgcolor="rgba(255, 255, 255, 0.8)",
            bordercolor="#000000",
            borderwidth=1,
            xanchor="right",
            yanchor="top",
            font=dict(size=11)
        )
        
        fig.update_layout(
            title=f"Normal Distribution Analysis: {column}",
            xaxis_title=column,
            yaxis_title="Probability Density",
            template='plotly_white',
            height=500,
            hovermode='x unified',
            showlegend=True
        )
        
        return fig
