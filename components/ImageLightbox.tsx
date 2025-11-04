"use client";

import { useState, useEffect, useRef } from "react";
import ModalPortal from "./ModalPortal";
import { X } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

// Define our zoom levels
const ZOOM_LEVELS = [1, 2, 3]; // 1x, 2x, 3x
const DOUBLE_CLICK_DELAY = 300; // 300ms

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const [zoomLevel, setZoomLevel] = useState(0); // Index for ZOOM_LEVELS (0, 1, or 2)
  const [transformOrigin, setTransformOrigin] = useState("50% 50%");
  const lastClickTime = useRef(0);

  // Get the current scale value (1, 2, or 3)
  const scale = ZOOM_LEVELS[zoomLevel];

  // Add event listener for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // This function now handles both single and double clicks
  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();

    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime.current;

    // Check if this is a double-click/tap
    if (timeSinceLastClick < DOUBLE_CLICK_DELAY) {
      // --- This is a DOUBLE-CLICK ---
      e.preventDefault(); // Prevents default browser zoom on double-tap
      
      const nextLevel = (zoomLevel + 1) % ZOOM_LEVELS.length; // Cycle 0 -> 1 -> 2 -> 0

      if (nextLevel === 0) {
        // Resetting zoom
        setTransformOrigin("50% 50%");
      } else {
        // Zooming in (to level 1 or 2)
        const rect = e.currentTarget.getBoundingClientRect();
        const xOrigin = ((e.clientX - rect.left) / rect.width) * 100;
        const yOrigin = ((e.clientY - rect.top) / rect.height) * 100;
        setTransformOrigin(`${xOrigin}% ${yOrigin}%`);
      }
      
      setZoomLevel(nextLevel);

    } 
    // This was a single click, so we just update the time
    lastClickTime.current = now;
  };

  return (
    <ModalPortal>
      <div
        className="lightbox-overlay animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="lightbox-container"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="lightbox-close"
            title="Close (Esc)"
          >
            <X size={24} />
          </button>
          
          <div className="lightbox-image-wrapper">
            <img
              src={src}
              alt={alt}
              className="lightbox-image" // No more .zoomed class needed
              onClick={handleClick}
              // We now control the transform with inline styles
              style={{
                transformOrigin: transformOrigin,
                transform: `scale(${scale})`,
                cursor: scale > 1 ? "zoom-out" : "zoom-in"
              }}
            />
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}