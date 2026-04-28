import * as React from "react";

export type PictureSources = Record<string, string>;

export interface PictureData {
  sources: PictureSources;
  img: { src: string; w: number; h: number };
}

interface ResponsiveImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "src" | "srcSet" | "width" | "height"
  > {
  image: PictureData;
  alt: string;
  sizes?: string;
  pictureClassName?: string;
}

const MIME: Record<string, string> = {
  avif: "image/avif",
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
};

const ORDER = ["avif", "webp", "jpeg", "jpg", "png", "gif"];

export function ResponsiveImage({
  image,
  alt,
  sizes,
  pictureClassName,
  className,
  loading,
  decoding,
  fetchPriority,
  ...rest
}: ResponsiveImageProps) {
  const formats = Object.keys(image.sources).sort(
    (a, b) => ORDER.indexOf(a) - ORDER.indexOf(b),
  );
  return (
    <picture className={pictureClassName}>
      {formats.map((fmt) => (
        <source
          key={fmt}
          type={MIME[fmt] ?? `image/${fmt}`}
          srcSet={image.sources[fmt]}
          sizes={sizes}
        />
      ))}
      <img
        src={image.img.src}
        width={image.img.w}
        height={image.img.h}
        alt={alt}
        className={className}
        sizes={sizes}
        loading={loading}
        decoding={decoding ?? "async"}
        fetchPriority={fetchPriority}
        {...rest}
      />
    </picture>
  );
}
