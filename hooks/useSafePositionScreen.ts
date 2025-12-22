// hooks/useSafePositionScreen.ts
import { useState, useEffect, useRef, useCallback } from "react";

export const useSafePositionScreen = () => {
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
      // Mobile positioning - centered with fixed positioning
      const dropdownWidth = Math.min(384, viewportWidth - 32);
      const centerX = viewportWidth / 2;
      let leftPosition = centerX - dropdownWidth / 2;

      // Ensure dropdown stays within viewport bounds
      leftPosition = Math.max(16, leftPosition);
      leftPosition = Math.min(leftPosition, viewportWidth - dropdownWidth - 16);

      // Estimate dropdown height (will be refined when dropdown opens)
      const estimatedHeight = 400; // Approximate height

      let topPosition: number;
      const spaceBelow = viewportHeight - bellRect.bottom;

      if (spaceBelow > estimatedHeight + 16) {
        // Enough space below
        topPosition = bellRect.bottom + 8;
      } else if (bellRect.top > estimatedHeight + 16) {
        // Enough space above
        topPosition = bellRect.top - estimatedHeight - 8;
      } else {
        // Center vertically
        topPosition = Math.max(16, (viewportHeight - estimatedHeight) / 2);
      }

      setPositionStyle({
        position: "fixed",
        left: `${leftPosition}px`,
        top: `${topPosition}px`,
        width: `${dropdownWidth}px`,
        maxWidth: "384px",
        zIndex: 9999,
      });
    } else {
      // Desktop positioning - use your original logic
      const spaceOnRight = viewportWidth - bellRect.right;
      
      let desktopStyle: React.CSSProperties = {
        position: "absolute",
        top: "100%",
        marginTop: "8px",
        zIndex: 9999,
        width: "384px", // Fixed width for desktop (w-96)
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
      const estimatedHeight = 400;
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
    const viewportHeight = window.innerHeight;

    setPositionStyle(prev => {
      const newStyle = { ...prev };
      
      // Refine vertical positioning based on actual dropdown height
      if (newStyle.position === "absolute") {
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
        // Refine mobile positioning
        const spaceBelow = viewportHeight - bellRect.bottom;
        
        if (spaceBelow < dropdownRect.height + 16 && bellRect.top > dropdownRect.height + 16) {
          // Move above bell
          newStyle.top = `${bellRect.top - dropdownRect.height - 8}px`;
        } else if (spaceBelow >= dropdownRect.height + 16) {
          // Keep below bell
          newStyle.top = `${bellRect.bottom + 8}px`;
        }
        
        // Ensure it doesn't go off screen
        if (parseInt(newStyle.top as string) + dropdownRect.height > viewportHeight - 16) {
          newStyle.top = `${Math.max(16, viewportHeight - dropdownRect.height - 16)}px`;
        }
        
        // Set max height if needed
        if (dropdownRect.height > viewportHeight - 32) {
          newStyle.maxHeight = `${viewportHeight - 32}px`;
        }
      }
      
      return newStyle;
    });
  }, []);

  useEffect(() => {
    calculatePosition();

    window.addEventListener("resize", calculatePosition);
    
    return () => {
      window.removeEventListener("resize", calculatePosition);
    };
  }, [calculatePosition]);

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