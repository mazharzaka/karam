"use client";

import React, { useEffect, useRef, useState } from "react";

export interface SmoothImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
}

/**
 * Renders an `<img>` with a dark animated skeleton placeholder while loading
 * and a smooth 300ms opacity fade-in once loaded.
 * Must be placed inside a `relative overflow-hidden` container with explicit dimensions.
 */
export const SmoothImage: React.FC<SmoothImageProps> = ({
  src,
  alt = "",
  className = "",
  skeletonClassName = "",
  onLoad,
  onError,
  ...rest
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src]);

  return (
    <>
      {!isLoaded && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden bg-zinc-900/80 animate-pulse ${skeletonClassName}`}
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setIsLoaded(true);
          onError?.(e);
        }}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        {...rest}
      />
    </>
  );
};

