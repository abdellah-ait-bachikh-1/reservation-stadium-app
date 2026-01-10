// hooks/useSafePositionScreen.ts
import { useState, useEffect, useRef, useCallback } from "react";

export const useSafePositionScreen = (onClickOutside?: () => void) => {
  const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  
  const bellRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
 
  const calculatePosition = useCallback(() => {
    if (!bellRef.current) return;

    const bellRect = bellRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Check if mobile
    const mobileView = viewportWidth < 768;
    setIsMobile(mobileView);

    if (mobileView) {
      // Mobile positioning - centered in the screen with fixed positioning
      const dropdownWidth = Math.min(384, viewportWidth - 32);
      
      // Center horizontally in the viewport
      const leftPosition = Math.max(16, (viewportWidth - dropdownWidth) / 2);
      
      // Estimate dropdown height
      const estimatedHeight = 400;
      
      // Position with adequate margin from top and bottom
      const topPosition = Math.max(16, Math.min(80, (viewportHeight - estimatedHeight) / 2));

      setPositionStyle({
        position: "fixed",
        left: `${leftPosition}px`,
        top: `${topPosition}px`,
        width: `${dropdownWidth}px`,
        maxWidth: "384px",
        maxHeight: `${viewportHeight - 32}px`,
        zIndex: 9999,
      });
    } else {
      // Desktop positioning - relative to bell
      const spaceOnRight = viewportWidth - bellRect.right;
      const estimatedHeight = 400;
      
      let desktopStyle: React.CSSProperties = {
        position: "absolute",
        top: "100%",
        marginTop: "8px",
        zIndex: 9999,
        width: "384px",
      };

      // Check if dropdown would overflow on the right
      if (spaceOnRight < 384 + 16) {
        // Not enough space on right, position on left side
        desktopStyle.right = "0";
        desktopStyle.left = "auto";
      } else {
        // Enough space on right, position normally
        desktopStyle.left = "0";
        desktopStyle.right = "auto";
      }

      // Check vertical space
      if (bellRect.bottom + estimatedHeight + 8 > viewportHeight - 16) {
        // Position above if not enough space below
        desktopStyle.top = "auto";
        desktopStyle.bottom = "100%";
        desktopStyle.marginTop = "0";
        desktopStyle.marginBottom = "8px";
      }

      setPositionStyle(desktopStyle);
    }
    
    setIsCalculated(true);
  }, []);

  // Refine position when dropdown actually opens and we know its real dimensions
  const refinePosition = useCallback(() => {
    if (!dropdownRef.current || !bellRef.current) return;

    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const bellRect = bellRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    setPositionStyle(prev => {
      const newStyle = { ...prev };
      
      if (newStyle.position === "absolute") {
        // Desktop refinement
        const isPositionedAbove = newStyle.bottom === "100%";
        
        if (!isPositionedAbove) {
          // Currently positioned below, check if it fits
          if (bellRect.bottom + dropdownRect.height + 8 > viewportHeight - 16) {
            newStyle.top = "auto";
            newStyle.bottom = "100%";
            newStyle.marginTop = "0";
            newStyle.marginBottom = "8px";
          }
        } else {
          // Currently positioned above, check if it fits better below
          if (bellRect.top > dropdownRect.height + 16) {
            // Actually fits below better
            newStyle.top = "100%";
            newStyle.bottom = "auto";
            newStyle.marginTop = "8px";
            newStyle.marginBottom = "0";
          }
        }
      } else if (newStyle.position === "fixed") {
        // Mobile refinement - ensure it's centered and visible
        const dropdownWidth = Math.min(384, viewportWidth - 32);
        
        // Recalculate left position to ensure centering
        const leftPosition = Math.max(16, (viewportWidth - dropdownWidth) / 2);
        newStyle.left = `${leftPosition}px`;
        
        // Adjust top position if needed
        const currentTop = parseInt(newStyle.top as string) || 0;
        
        if (currentTop + dropdownRect.height > viewportHeight - 16) {
          // Too low, move up
          newStyle.top = `${Math.max(16, viewportHeight - dropdownRect.height - 16)}px`;
        } else if (currentTop < 16) {
          // Too high, move down
          newStyle.top = "16px";
        }
        
        // Ensure max height doesn't exceed viewport
        newStyle.maxHeight = `${viewportHeight - 32}px`;
      }
      
      return newStyle;
    });
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!onClickOutside) return;
      
      const target = event.target as Node;
      
      // Check if click is outside both bell container and dropdown
      const isClickOutside = 
        bellRef.current && 
        !bellRef.current.contains(target) && 
        dropdownRef.current && 
        !dropdownRef.current.contains(target);
      
      if (isClickOutside) {
        onClickOutside();
      }
    };

    // Handle escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClickOutside) {
        onClickOutside();
      }
    };

    if (onClickOutside) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    // Cleanup
    return () => {
      if (onClickOutside) {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      }
    };
  }, [onClickOutside]);

  useEffect(() => {
    calculatePosition();

    const handleResize = () => {
      calculatePosition();
      // Small delay to refine after resize
      setTimeout(refinePosition, 100);
    };

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calculatePosition, refinePosition]);

  // Refine position when dropdown opens
  useEffect(() => {
    if (dropdownRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        // Small delay to ensure animation completes
        setTimeout(refinePosition, 50);
      });

      resizeObserver.observe(dropdownRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [refinePosition]);

  return { 
    bellRef, 
    dropdownRef, 
    positionStyle, 
    calculatePosition, 
    refinePosition,
    isMobile,
    isCalculated 
  };
};