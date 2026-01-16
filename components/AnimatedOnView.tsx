// components/ui/scroll-animation.tsx
"use client";

import { ReactNode, useRef, useEffect, useState } from 'react';

interface ScrollElementProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  intensity?: 'subtle' | 'medium' | 'strong';
  once?: boolean;
  viewport?: {
    once?: boolean;
    amount?: number;
    margin?: string;
  };
}

export default function ScrollElement({
  children,
  className = "",
  delay = 0,
  direction = 'up',
  intensity = 'medium',
  once = false,
  viewport = { once: true, amount: 0.5, margin: '0px 0px 0px 0px' }
}: ScrollElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState(0);

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, scrollDirection]);

  // Intersection Observer for viewport detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once || viewport.once) {
            observer.unobserve(entry.target);
          }
        } else if (!once && !viewport.once) {
          // Reverse animation when element leaves viewport while scrolling up
          if (scrollDirection === 'up') {
            setIsVisible(false);
          }
        }
      },
      {
        threshold: viewport.amount || 0.1,
        rootMargin: viewport.margin || '0px 0px -100px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [once, viewport, scrollDirection]);

  // Intensity mapping
  const intensityMap = {
    subtle: { y: 20, x: 20, scale: 0.95, opacity: 0.8 },
    medium: { y: 40, x: 40, scale: 0.9, opacity: 0.6 },
    strong: { y: 60, x: 60, scale: 0.85, opacity: 0.4 }
  };

  const intensityValues = intensityMap[intensity];

  // Get CSS transform based on direction and scroll direction
  const getTransform = () => {
    const isReversed = scrollDirection === 'up';
    
    switch (direction) {
      case 'up':
        return `translateY(${isReversed ? -intensityValues.y : intensityValues.y}px)`;
      case 'down':
        return `translateY(${isReversed ? intensityValues.y : -intensityValues.y}px)`;
      case 'left':
        return `translateX(${isReversed ? -intensityValues.x : intensityValues.x}px)`;
      case 'right':
        return `translateX(${isReversed ? intensityValues.x : -intensityValues.x}px)`;
      case 'scale':
        return `scale(${intensityValues.scale})`;
      default:
        return '';
    }
  };

  const getInitialStyles = () => {
    return {
      transform: getTransform(),
      opacity: intensityValues.opacity,
    };
  };

  const getAnimationStyles = () => {
    return {
      transform: direction === 'scale' ? 'scale(1)' : 'translateY(0) translateX(0)',
      opacity: 1,
      transition: `all ${0.6 + (delay / 1000)}s cubic-bezier(0.34, 1.56, 0.64, 1)`,
      transitionDelay: `${delay}ms`,
    };
  };

  return (
    <div
      ref={ref}
      className={className}
      style={isVisible ? getAnimationStyles() : getInitialStyles()}
    >
      {children}
    </div>
  );
}