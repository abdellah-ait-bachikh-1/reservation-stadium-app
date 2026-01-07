// Create a new file: hooks/useViewportSpace.ts
"use client";

import { useState, useEffect, useRef } from 'react';

export function useViewportSpace(menuHeight = 200) {
  const [hasSpaceBelow, setHasSpaceBelow] = useState(true);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkSpace = () => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      setHasSpaceBelow(spaceBelow >= menuHeight || spaceBelow > spaceAbove);
    };

    checkSpace();
    window.addEventListener('scroll', checkSpace);
    window.addEventListener('resize', checkSpace);
    
    return () => {
      window.removeEventListener('scroll', checkSpace);
      window.removeEventListener('resize', checkSpace);
    };
  }, [menuHeight]);

  return { hasSpaceBelow, elementRef };
}