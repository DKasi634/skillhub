import { MissingItemImage } from "@/assets";
import React, { useEffect, useState } from "react";
import { ShimerEffect } from "@/globals/styles";

interface GenericImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  hasShimmerEffect?: boolean;
}

const GenericImage: React.FC<GenericImageProps> = ({
  src = "",
  fallbackSrc = MissingItemImage,
  hasShimmerEffect = true,
  alt = "",
  className = "",
  ...imgProps
}) => {
  const [imageSrc, setImageSrc] = useState<string>(MissingItemImage);
  const [loading, setLoading] = useState(true);

  const handleError = (_: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setLoading(false);
    setImageSrc(fallbackSrc);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  useEffect(() => {
    setImageSrc(src);
    setLoading(true); // Reset loading when the source changes
  }, [src]);

  return (
    <div className={`relative inline-block ${className}`}>
      {(hasShimmerEffect && loading )&& (
        <ShimerEffect className="absolute inset-0 w-full h-full bg-dark-variant" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        {...imgProps}
      />
    </div>
  );
};

export default GenericImage;
