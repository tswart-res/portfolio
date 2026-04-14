"use client";

interface ProjectVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

// Native HTML5 video - Caddy serves this path directly with range request support.
// Do NOT use next/image or any streaming wrapper here.
export default function ProjectVideo({
  src,
  poster,
  className,
}: ProjectVideoProps) {
  return (
    <video
      src={src}
      poster={poster}
      controls
      preload="none"
      playsInline
      className={`w-full rounded-[var(--radius-card)] bg-[var(--surface)] ${className ?? ""}`}
    />
  );
}
