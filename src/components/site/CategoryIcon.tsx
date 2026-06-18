type Props = { slug: string; className?: string };

// Íconos de línea consistentes (stroke 1.5, currentColor). Nada de emojis.
const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CategoryIcon({ slug, className = "h-6 w-6" }: Props) {
  const Svg = (children: React.ReactNode) => (
    <svg viewBox="0 0 24 24" className={className} {...common} aria-hidden="true">
      {children}
    </svg>
  );

  switch (slug) {
    case "cervezas":
      return Svg(
        <>
          <path d="M6 8h9v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8Z" />
          <path d="M15 10h2.5A2.5 2.5 0 0 1 20 12.5v2A2.5 2.5 0 0 1 17.5 17H15" />
          <path d="M8 8a2 2 0 0 1 2-2 2.3 2.3 0 0 1 .4-2.2 2.2 2.2 0 0 1 3.3.2A2 2 0 0 1 15 8" />
          <path d="M9 11.5v6M12 11.5v6" />
        </>,
      );
    case "vinos":
      return Svg(
        <>
          <path d="M9 3h6l-.4 8a3 3 0 0 1-2.6 2.96V19" />
          <path d="M15 3l-.4 8a3 3 0 0 1-2.6 2.96" />
          <path d="M9 19h6" />
          <path d="M9.2 8h5.6" />
        </>,
      );
    case "espumantes":
      return Svg(
        <>
          <path d="M8 4h8l-.7 9a3.3 3.3 0 0 1-6.6 0L8 4Z" />
          <path d="M12 16v4M9.5 20h5" />
          <path d="M19 4.5l1 1M20 8l1.3-.4M18.5 9.5l.6 1.3" />
        </>,
      );
    case "whisky":
    case "ron":
      return Svg(
        <>
          <path d="M6 5h12l-1 13a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 18L6 5Z" />
          <path d="M6.6 11h10.8" />
          <path d="M9 14.5l2-2M12 15l2.5-2.5" />
        </>,
      );
    case "vodka":
    case "licores":
      return Svg(
        <>
          <path d="M5 4h14l-7 8-7-8Z" />
          <path d="M12 12v6M8.5 18h7" />
        </>,
      );
    case "pisco":
      return Svg(
        <>
          <path d="M10 3h4v3l1.5 2.2a4 4 0 0 1 .7 2.3V18a3 3 0 0 1-3 3h-2.4a3 3 0 0 1-3-3v-7.5a4 4 0 0 1 .7-2.3L10 6V3Z" />
          <path d="M8 13h8" />
        </>,
      );
    case "bebidas-y-jugos":
      return Svg(
        <>
          <path d="M7 4h10l-.7 15a2 2 0 0 1-2 1.9H9.7a2 2 0 0 1-2-1.9L7 4Z" />
          <path d="M7.2 8h9.6" />
          <path d="M10 11.5v5M14 11.5v5" />
        </>,
      );
    case "snacks-y-confites":
      return Svg(
        <>
          <path d="M8 3h8l-1 4 1 14H8L9 7 8 3Z" />
          <path d="M9 7h6M9.4 12h5.2" />
        </>,
      );
    case "cigarros":
      return Svg(
        <>
          <rect x="3" y="13" width="16" height="4" rx="1" />
          <path d="M15 13v4" />
          <path d="M19 8c1.5 0 1.5 2 0 2M21 7c1.5 0 1.5 3 0 3" />
        </>,
      );
    case "carbon-y-parrilla":
      return Svg(
        <>
          <path d="M12 3c1.5 3-1.5 4 0 7 .8 1.6 3 1.4 3 4a3 3 0 1 1-6 0c0-1 .4-1.6.4-2.4C9.4 17 8 16 8 14c0-2.6 4-3 4-11Z" />
        </>,
      );
    default:
      return Svg(
        <>
          <path d="M10 3h4v4l1 2a3 3 0 0 1 1 2v7a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-7a3 3 0 0 1 1-2l1-2V3Z" />
          <path d="M8 12h8" />
        </>,
      );
  }
}
