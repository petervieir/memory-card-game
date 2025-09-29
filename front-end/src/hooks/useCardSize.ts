"use client";

import { useState, useEffect } from 'react';
import { type Difficulty } from '@/types/game';

interface CardSize {
  width: number;
  height: number;
  className: string;
}

export function useCardSize(difficulty: Difficulty): CardSize {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Set initial size
    updateSize();
    
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate optimal card size based on window size and grid
  const calculateCardSize = (): CardSize => {
    const { width: windowWidth, height: windowHeight } = windowSize;
    const { gridCols, gridRows } = difficulty;

    // Default fallback for SSR
    if (windowWidth === 0) {
      return {
        width: 80,
        height: 96,
        className: 'w-20 h-24'
      };
    }

    // Calculate available space (accounting for padding, gaps, and other UI elements)
    const headerHeight = 200; // Approximate height of header, instructions, etc.
    const padding = 64; // Total horizontal padding
    const gap = 8; // Gap between cards (2 * 4px from gap-2)
    
    const availableWidth = windowWidth - padding;
    const availableHeight = windowHeight - headerHeight;
    
    // Calculate max card size based on available space
    const maxCardWidth = (availableWidth - (gap * (gridCols - 1))) / gridCols;
    const maxCardHeight = (availableHeight - (gap * (gridRows - 1))) / gridRows;
    
    // Maintain aspect ratio (4:5 - width:height)
    const aspectRatio = 4 / 5;
    
    let cardWidth = Math.min(maxCardWidth, maxCardHeight * aspectRatio);
    let cardHeight = cardWidth / aspectRatio;
    
    // Apply size constraints based on screen size
    if (windowWidth < 640) { // Mobile
      cardWidth = Math.max(48, Math.min(cardWidth, 80));
    } else if (windowWidth < 1024) { // Tablet
      cardWidth = Math.max(64, Math.min(cardWidth, 96));
    } else { // Desktop
      cardWidth = Math.max(80, Math.min(cardWidth, 120));
    }
    
    cardHeight = cardWidth / aspectRatio;
    
    // Round to nearest multiple of 4 for Tailwind compatibility
    cardWidth = Math.round(cardWidth / 4) * 4;
    cardHeight = Math.round(cardHeight / 4) * 4;

    // Generate Tailwind classes based on calculated size
    const getClassName = (width: number, height: number): string => {
      // Convert px to Tailwind units (4px = 1 unit)
      const wUnit = width / 4;
      const hUnit = height / 4;
      
      // Map to closest Tailwind size classes
      const widthClass = getWidthClass(wUnit);
      const heightClass = getHeightClass(hUnit);
      
      return `${widthClass} ${heightClass}`;
    };

    return {
      width: cardWidth,
      height: cardHeight,
      className: getClassName(cardWidth, cardHeight)
    };
  };

  return calculateCardSize();
}

function getWidthClass(units: number): string {
  if (units <= 12) return 'w-12'; // 48px
  if (units <= 16) return 'w-16'; // 64px
  if (units <= 20) return 'w-20'; // 80px
  if (units <= 24) return 'w-24'; // 96px
  if (units <= 28) return 'w-28'; // 112px
  if (units <= 32) return 'w-32'; // 128px
  return 'w-36'; // 144px
}

function getHeightClass(units: number): string {
  if (units <= 16) return 'h-16'; // 64px
  if (units <= 20) return 'h-20'; // 80px
  if (units <= 24) return 'h-24'; // 96px
  if (units <= 28) return 'h-28'; // 112px
  if (units <= 32) return 'h-32'; // 128px
  if (units <= 36) return 'h-36'; // 144px
  if (units <= 40) return 'h-40'; // 160px
  return 'h-44'; // 176px
}
