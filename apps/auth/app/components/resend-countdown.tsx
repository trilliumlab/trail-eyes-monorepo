'use client';

import { linkStyle } from '@repo/ui/components/link';
import { useEffect, useState } from 'react';
import { cn } from '@repo/ui/lib/utils';

export function ResendCountdown({ className }: { className?: string }) {
  const initialSeconds = 90;
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isElapsed, setIsElapsed] = useState(false);

  useEffect(() => {
    if (!isElapsed) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 0) {
            clearInterval(interval);
            setIsElapsed(true);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isElapsed]);

  // Convert seconds minutes + seconds
  const remainingMinutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 });

  return (
    <div className={cn(className, 'transition-colors', !isElapsed && 'text-muted-foreground')}>
      {isElapsed ? (
        <button type="button" onClick={() => console.log('Resend email')} className={linkStyle}>
          Resend code
        </button>
      ) : (
        <>
          Resend code in <span className="font-mono tracking-tighter">{remainingMinutes}:</span>
          <span className="font-mono">{remainingSeconds}</span>
        </>
      )}
    </div>
  );
}
