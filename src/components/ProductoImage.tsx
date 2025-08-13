import Image, { ImageProps } from 'next/image';

type Props = Omit<ImageProps, 'fill' | 'sizes'> & {
  maxHeight?: number; // px
  wrapperClassName?: string;
};

/**
 * No recorta: object-contain + max height aplicado al <Image>, no al wrapper.
 */
export default function ProductoImage({
  alt,
  src,
  maxHeight = 400,
  className = '',
  wrapperClassName = '',
  width = 800,
  height = 800,
  ...rest
}: Props) {
  return (
    <div
      className={`w-full rounded-lg bg-surface p-2 grid place-items-center ${wrapperClassName}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`h-auto w-full object-contain ${className}`}
        // límite de alto sobre la imagen (no el contenedor)
        style={{ maxHeight }}
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={false}
        {...rest}
      />
    </div>
  );
}
