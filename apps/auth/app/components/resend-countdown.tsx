'use client';

import { linkStyle } from '@repo/ui/components/link';
import { cn } from '@repo/ui/lib/utils';
import { useEffect, useMemo, useState } from 'react';

export function ResendCountdown({
  className,
  secondsUntilCanResend,
  onResend,
}: { className?: string; secondsUntilCanResend: number; onResend: () => void }) {
  const [seconds, setSeconds] = useState(secondsUntilCanResend);
  // update timer when secondsUntilCanResend changes
  useEffect(() => {
    setSeconds(secondsUntilCanResend);
  }, [secondsUntilCanResend]);
  const isElapsed = useMemo(() => seconds === 0, [seconds]);

  useEffect(() => {
    if (!isElapsed) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 0) {
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
        <button type="button" onClick={onResend} className={linkStyle}>
          Send another code
        </button>
      ) : (
        <>
          Send another in <span className="font-mono tracking-tighter">{remainingMinutes}:</span>
          <span className="font-mono">{remainingSeconds}</span>
        </>
      )}
    </div>
  );
}
