import { NextRequest, NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';

export async function POST(request: NextRequest) {
  try {
    const { slides, theme } = await request.json();

    const pres = new PptxGenJS();
    pres.layout = "LAYOUT_16x9";

    for (const slide of slides) {
      const pptxSlide = pres.addSlide();
      
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
        // For now, we'll add a placeholder for charts
        // In a full implementation, you'd need to generate chart images server-side
        pptxSlide.addText("Chart data available", {
          x: 1, y: 2.5, w: 8, h: 4,
          fontSize: 14, color: textColor
        });
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

    const buffer = await pres.write();
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': 'attachment; filename="presentation.pptx"',
      },
    });
  } catch (error) {
    console.error('PPTX export error:', error);
    return NextResponse.json({ error: 'Failed to export PPTX' }, { status: 500 });
  }
} 