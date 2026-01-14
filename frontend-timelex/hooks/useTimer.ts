
import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialDuration: number, isRunning: boolean) => {
  const [elapsed, setElapsed] = useState(initialDuration);
  const [startTime, setStartTime] = useState<number | null>(isRunning ? Date.now() : null);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      if (!startTime) setStartTime(Date.now());
      interval = window.setInterval(() => {
        setElapsed(initialDuration + (Date.now() - (startTime || Date.now())));
      }, 1000);
    } else {
      setStartTime(null);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, initialDuration, startTime]);

  const reset = useCallback(() => {
    setElapsed(0);
    setStartTime(null);
  }, []);

  return { elapsed, reset };
};
