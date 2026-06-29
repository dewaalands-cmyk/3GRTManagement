import Image, { type ImageProps } from "next/image";

export function SmartImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const unoptimized = src.startsWith("data:") || props.unoptimized;
  return <Image {...props} unoptimized={unoptimized} />;
}
