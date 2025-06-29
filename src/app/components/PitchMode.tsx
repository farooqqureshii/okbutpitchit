"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ChartSlide = dynamic(() => import("./ChartSlide"), { ssr: false });
const MediaEmbed = dynamic(() => import("./MediaEmbed"), { ssr: false });

interface Slide {
  title: string;
  text?: string;
  bullets?: string[];
  chart?: any;
  media?: any;
}

interface PitchModeProps {
  slides: Slide[];
  theme: string;
  open: boolean;
  onClose: () => void;
}

export default function PitchMode({ slides, theme, open, onClose }: PitchModeProps) {
  const [idx, setIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
      if (e.key === 'Escape') onClose();
      if (e.key === 'Home') setIdx(0);
      if (e.key === 'End') setIdx(slides.length - 1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, slides.length, onClose]);

  useEffect(() => { 
    if (open) setIdx(0); 
  }, [open]);

  const nextSlide = () => {
    if (idx < slides.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIdx(i => i + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const prevSlide = () => {
    if (idx > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIdx(i => i - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  if (!open) return null;

  const currentSlide = slides[idx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm">
      {/* Header with controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="text-white text-lg font-semibold">
            {idx + 1} / {slides.length}
          </div>
          <div className="flex gap-1">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === idx ? 'bg-white' : 'bg-white/30'
                }`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-white/70 text-sm hidden md:block">
            Use ← → or Space to navigate • ESC to exit
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-red-400 text-3xl font-light transition-colors duration-200 hover:scale-110"
          >
            ×
          </button>
        </div>
      </div>

      {/* Main slide content */}
      <div className={`w-full max-w-6xl mx-auto px-8 transition-all duration-300 ${
        isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}>
        <div className={`rounded-3xl shadow-2xl p-16 min-h-[600px] flex flex-col justify-center transition-all duration-500 ${
          theme === 'modern' 
            ? 'bg-white text-neutral-900' 
            : theme === 'classic' 
            ? 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-900 border border-amber-200' 
            : 'bg-gradient-to-br from-black to-neutral-800 text-white border-2 border-blue-400'
        }`}>
          {/* Slide title */}
          <h1 className="text-6xl font-black mb-8 leading-tight text-center">
            {currentSlide.title}
          </h1>
          
          {/* Slide content */}
          <div className="flex-1 flex flex-col justify-center items-center">
            {currentSlide.text && (
              <div className="text-3xl leading-relaxed mb-8 text-center opacity-90 max-w-4xl">
                {currentSlide.text}
              </div>
            )}
            
            {currentSlide.bullets && (
              <ul className="space-y-6 text-2xl max-w-4xl mx-auto">
                {currentSlide.bullets.map((b: string, j: number) => (
                  <li key={j} className="flex items-start gap-6 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${j * 0.1}s` }}>
                    <span className={`w-3 h-3 rounded-full mt-4 flex-shrink-0 ${
                      theme === "modern" ? "bg-blue-500" :
                      theme === "classic" ? "bg-amber-600" :
                      "bg-blue-400"
                    }`}></span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {currentSlide.chart && (
              <div className="w-full max-w-4xl aspect-[2/1] mx-auto">
                <ChartSlide chart={currentSlide.chart} theme={theme} />
              </div>
            )}

            {currentSlide.media && (
              <div className="w-full max-w-2xl mx-auto">
                <MediaEmbed media={currentSlide.media} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6">
        <button 
          onClick={prevSlide}
          disabled={idx === 0} 
          className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
            idx === 0 
              ? 'bg-white/20 text-white/40 cursor-not-allowed' 
              : 'bg-white/90 text-neutral-800 hover:bg-white hover:scale-105 shadow-lg'
          }`}
        >
          <span className="text-xl">←</span>
          <span className="hidden sm:inline">Previous</span>
        </button>
        
        <button 
          onClick={nextSlide}
          disabled={idx === slides.length - 1} 
          className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
            idx === slides.length - 1 
              ? 'bg-white/20 text-white/40 cursor-not-allowed' 
              : 'bg-white/90 text-neutral-800 hover:bg-white hover:scale-105 shadow-lg'
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <span className="text-xl">→</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${((idx + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
} 