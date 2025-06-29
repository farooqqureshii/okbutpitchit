"use client";

import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

interface ChartSlideProps {
  chart: {
    type: string;
    data: any;
    title?: string;
    description?: string;
  };
  theme: string;
}

export default function ChartSlide({ chart, theme }: ChartSlideProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !chart) {
      return;
    }

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const colors = {
      modern: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        background: 'rgba(59, 130, 246, 0.1)',
        grid: '#e5e7eb',
        text: '#374151'
      },
      classic: {
        primary: '#d97706',
        secondary: '#dc2626',
        background: 'rgba(217, 119, 6, 0.1)',
        grid: '#fbbf24',
        text: '#92400e'
      },
      bold: {
        primary: '#3b82f6',
        secondary: '#06b6d4',
        background: 'rgba(59, 130, 246, 0.2)',
        grid: '#64748b',
        text: '#f8fafc'
      }
    };

    const themeColors = colors[theme as keyof typeof colors] || colors.modern;

    const config: ChartConfiguration = {
      type: chart.type as any,
      data: {
        ...chart.data,
        datasets: chart.data.datasets.map((dataset: any, index: number) => ({
          ...dataset,
          borderColor: index === 0 ? themeColors.primary : themeColors.secondary,
          backgroundColor: dataset.fill !== false 
            ? (index === 0 ? themeColors.background : `${themeColors.secondary}20`)
            : 'transparent',
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: index === 0 ? themeColors.primary : themeColors.secondary,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          tension: dataset.tension || 0.4,
          fill: dataset.fill !== undefined ? dataset.fill : false
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'start',
            labels: {
              color: themeColors.text,
              font: {
                size: 14,
                weight: 'bold'
              },
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: theme === 'bold' ? '#1e293b' : '#ffffff',
            titleColor: themeColors.text,
            bodyColor: themeColors.text,
            borderColor: themeColors.primary,
            borderWidth: 2,
            cornerRadius: 12,
            padding: 12,
            displayColors: true,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: themeColors.grid,
              lineWidth: 1
            },
            ticks: {
              color: themeColors.text,
              font: {
                size: 12,
                weight: 'normal'
              },
              padding: 8
            },
            border: {
              color: themeColors.grid,
              width: 2
            }
          },
          y: {
            grid: {
              color: themeColors.grid,
              lineWidth: 1
            },
            ticks: {
              color: themeColors.text,
              font: {
                size: 12,
                weight: 'normal'
              },
              padding: 8
            },
            border: {
              color: themeColors.grid,
              width: 2
            }
          }
        },
        elements: {
          point: {
            hoverRadius: 8
          },
          line: {
            borderJoinStyle: 'round',
            borderCapStyle: 'round'
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    chartRef.current = new Chart(canvasRef.current, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chart, theme]);

  if (!chart) return null;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center p-8 sm:p-12 md:p-16">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{chart.title}</h2>
      <p className="text-base sm:text-lg md:text-xl text-neutral-600 mb-6">{chart.description}</p>
      <div className="w-full max-w-2xl mx-auto flex-grow flex items-center justify-center">
        <div className="relative w-full aspect-[2/1] max-h-[400px]">
          <canvas
            ref={canvasRef}
            className="rounded-2xl shadow-inner"
            style={{ 
              background: theme === 'bold' 
                ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
                : theme === 'classic'
                ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
            }}
          />
        </div>
      </div>
      
      {/* Chart insights */}
      <div className={`mt-6 text-center ${
        theme === 'modern' ? 'text-blue-600' :
        theme === 'classic' ? 'text-amber-600' :
        'text-slate-300'
      }`}>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              theme === 'modern' ? 'bg-blue-500' :
              theme === 'classic' ? 'bg-amber-500' :
              'bg-blue-400'
            }`}></div>
            <span className="font-medium">
              {chart.data.datasets[0]?.label || 'Data'}
            </span>
          </div>
          <div className="text-xs opacity-75">
            {chart.data.labels?.length || 0} data points
          </div>
        </div>
      </div>
    </div>
  );
} 