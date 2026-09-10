import type { Locale } from "@/i18n/config";

// Bandeiras em SVG, nao emoji: o Windows nao tem glifos de bandeira e
// renderiza os emojis regionais como as letras do pais ("BR", "US", "ES").

export default function Bandeira({ locale }: { locale: Locale }) {
  const comum = { width: 20, height: 14, viewBox: "0 0 20 14", "aria-hidden": true as const };

  if (locale === "pt-BR") {
    return (
      <svg {...comum}>
        <rect width="20" height="14" fill="#009739" />
        <path d="M10 1.6 18.4 7 10 12.4 1.6 7z" fill="#FEDD00" />
        <circle cx="10" cy="7" r="3" fill="#012169" />
      </svg>
    );
  }

  if (locale === "en") {
    return (
      <svg {...comum}>
        <rect width="20" height="14" fill="#fff" />
        {[0, 2, 4, 6, 8, 10, 12].map((y) => (
          <rect key={y} y={y} width="20" height="1.08" fill="#B22234" />
        ))}
        <rect width="8.5" height="7.5" fill="#3C3B6E" />
      </svg>
    );
  }

  return (
    <svg {...comum}>
      <rect width="20" height="14" fill="#AA151B" />
      <rect y="3.5" width="20" height="7" fill="#F1BF00" />
    </svg>
  );
}
