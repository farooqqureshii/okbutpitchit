"use client";

import PptxGenJS from "pptxgenjs";
import { Slide } from "../page";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface ExportPPTXProps {
  slides: Slide[];
  theme: string;
}

// Helper function to render a chart to a base64 string
const getChartBase64 = async (chartData: any, theme: string): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    const themeColors = {
      modern: { primary: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', grid: '#e5e7eb', text: '#374151' },
      classic: { primary: '#d97706', background: 'rgba(217, 119, 6, 0.1)', grid: '#fbbf24', text: '#92400e' },
      bold: { primary: '#3b82f6', background: 'rgba(59, 130, 246, 0.2)', grid: '#64748b', text: '#f8fafc' }
    };
    const colors = themeColors[theme as keyof typeof themeColors] || themeColors.modern;

    const chartInstance = new Chart(ctx, {
      type: chartData.type || 'bar',
      data: chartData.data,
      options: {
        responsive: false,
        animation: {
          onComplete: () => {
            resolve(chartInstance.toBase64Image());
            chartInstance.destroy();
          }
        },
        scales: {
          x: { ticks: { color: colors.text }, grid: { color: colors.grid } },
          y: { ticks: { color: colors.text }, grid: { color: colors.grid } }
        },
        plugins: {
          legend: { labels: { color: colors.text } }
        }
      }
    });
  });
};

export default function ExportPPTX({ slides, theme }: ExportPPTXProps) {
  const exportPowerPoint = async () => {
    let pres = new PptxGenJS();
    pres.layout = "LAYOUT_16x9";

    for (const slide of slides) {
      let pptxSlide = pres.addSlide();
      
      const bgColor = theme === 'bold' ? '000000' : 'FDFDFD';
      const textColor = theme === 'bold' ? 'FFFFFF' : '000000';
      pptxSlide.background = { color: bgColor };

      pptxSlide.addText(slide.title, { 
        x: 0.5, y: 0.5, w: '90%', h: 1, 
        fontSize: 32, bold: true, color: textColor 
      });

      if (slide.text) {
        pptxSlide.addText(slide.text, { 
          x: 0.5, y: 1.5, w: '90%', h: 1, 
          fontSize: 18, color: textColor 
        });
      }

      if (slide.bullets && slide.bullets.length > 0) {
        pptxSlide.addText(slide.bullets.join('\n'), {
          x: 0.5, y: 2.5, w: '90%', h: 2,
          fontSize: 18, color: textColor,
          bullet: true
        });
      }

      if (slide.chart && slide.chart.data) {
        pptxSlide.addText("Chart:", { x: 0.5, y: 2.0, w: '90%', h: 1 });
        const chartImage = await getChartBase64(slide.chart, theme);
        if (chartImage) {
          pptxSlide.addImage({
            data: chartImage,
            x: 1, y: 2.5, w: 8, h: 4
          });
        }
      }

      if (slide.media && slide.media.url) {
        pptxSlide.addText("Demo Link:", { x: 0.5, y: 2.5, w: '90%', h: 1 });
        pptxSlide.addText([{
          text: slide.media.url,
          options: { hyperlink: { url: slide.media.url, tooltip: "Click to view" } }
        }], {
          x: 0.5, y: 3.0, w: '90%', h: 1,
          fontSize: 16, color: '0000FF'
        });
      }
    }

    pres.writeFile({ fileName: `presentation.pptx` });
  };

  return (
    <button
      onClick={exportPowerPoint}
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-5 rounded-lg text-sm transition-all duration-300 shadow-md hover:shadow-lg"
    >
      Export PPTX
    </button>
  );
} 