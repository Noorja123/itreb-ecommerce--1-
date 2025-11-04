"use client";

import { useState, useEffect } from "react";
import ModalPortal from "./ModalPortal";
import { X } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);

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

  const toggleZoom = (e: React.MouseEvent) => {
    // Stop click from bubbling up to the overlay
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return (
    <ModalPortal>
      <div
        className="lightbox-overlay animate-fadeIn"
        onClick={onClose} // Close when clicking the dark background
      >
        <div
          className="lightbox-container"
          onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
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
              className={`lightbox-image ${isZoomed ? "zoomed" : ""}`}
              onClick={toggleZoom}
            />
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}