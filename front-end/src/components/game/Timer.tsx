"use client";

import { useEffect, useState, useRef } from 'react';

interface TimerProps {
  readonly initialSeconds: number;
  readonly isActive: boolean;
  readonly onTimeUp: () => void;
  readonly onTick?: (secondsRemaining: number) => void;
}

export function Timer({ initialSeconds, isActive, onTimeUp, onTick }: TimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer when initialSeconds changes (new game)
  useEffect(() => {
    setSecondsRemaining(initialSeconds);
  }, [initialSeconds]);

  // Handle countdown
  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        const newValue = prev - 1;
        
        // Notify parent of tick
        if (onTick) {
          onTick(newValue);
        }

        // Check if time is up
        if (newValue <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onTimeUp();
          return 0;
        }

        return newValue;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, onTimeUp, onTick]);

  const format_time = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const get_color_class = (): string => {
    const percentRemaining = (secondsRemaining / initialSeconds) * 100;
    
    if (percentRemaining <= 10 || secondsRemaining <= 10) {
      return 'text-red-500 animate-pulse';
    } else if (percentRemaining <= 25 || secondsRemaining <= 20) {
      return 'text-orange-500';
    } else if (percentRemaining <= 50) {
      return 'text-yellow-500';
    }
    return 'text-green-500';
  };

  const get_progress_color = (): string => {
    const percentRemaining = (secondsRemaining / initialSeconds) * 100;
    
    if (percentRemaining <= 10 || secondsRemaining <= 10) {
      return 'bg-red-500';
    } else if (percentRemaining <= 25 || secondsRemaining <= 20) {
      return 'bg-orange-500';
    } else if (percentRemaining <= 50) {
      return 'bg-yellow-500';
    }
    return 'bg-green-500';
  };

  const progressPercent = (secondsRemaining / initialSeconds) * 100;

  return (
    <div className="flex flex-col items-center gap-2 min-w-[120px]">
      <div className="flex items-center gap-2">
        <span className="text-2xl">⏱️</span>
        <span className={`text-2xl font-bold tabular-nums ${get_color_class()}`}>
          {format_time(secondsRemaining)}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${get_progress_color()} transition-all duration-300`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      
      {secondsRemaining <= 10 && secondsRemaining > 0 && (
        <div className="text-xs text-red-400 animate-pulse font-bold">
          HURRY!
        </div>
      )}
    </div>
  );
}

export function get_remaining_seconds(ref: { current: number | null }): number | null {
  return ref.current;
}

