"use client";

import { Slide } from "../page";

interface ExportPPTXProps {
  slides: Slide[];
  theme: string;
}

export default function ExportPPTX({ slides, theme }: ExportPPTXProps) {
  const exportPowerPoint = async () => {
    try {
      const response = await fetch('/api/export-pptx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slides, theme }),
      });

      if (!response.ok) {
        throw new Error('Failed to export PPTX');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'presentation.pptx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export PPTX. Please try again.');
    }
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