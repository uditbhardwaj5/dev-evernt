'use client';

import { useEffect, useRef } from 'react';
import posthog from 'posthog-js';

interface Props {
  eventName: string;
}

export default function TrackEvent({ eventName }: Props) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      posthog.capture(eventName);
      tracked.current = true;
    }
  }, [eventName]);

  return null;
}
