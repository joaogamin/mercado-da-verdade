/**
 * Selo da marca: mesma estrela do site original (path idêntico ao do favicon),
 * na nossa paleta e com o texto trocado. O texto vai em <text> porque aqui a
 * fonte da página já está carregada — diferente do favicon, que precisa
 * funcionar sem depender de fonte instalada.
 */
export default function Selo({ tamanho = 46 }: { tamanho?: number }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 100 100"
      className="selo"
      role="img"
      aria-label="Super Verdade"
    >
      <path
        fill="#ffdf00"
        stroke="#06231a"
        strokeWidth="3"
        strokeLinejoin="round"
        d="M50 3 60 17 77 11 78 29 95 34 85 49 95 64 78 69 77 87 60 81 50 96 40 81 23 87 22 69 5 64 15 49 5 34 22 29 23 11 40 17Z"
      />
      {/* textLength trava a largura: garante que o texto caiba dentro da
          estrela mesmo se a fonte cair para o fallback do sistema. */}
      <text x="50" y="45" textAnchor="middle" className="selo-txt" fontSize="18"
        textLength="40" lengthAdjust="spacingAndGlyphs">
        SUPER
      </text>
      <text x="50" y="65" textAnchor="middle" className="selo-txt" fontSize="18"
        textLength="58" lengthAdjust="spacingAndGlyphs">
        VERDADE
      </text>
    </svg>
  );
}
