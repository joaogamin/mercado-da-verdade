import type { Dicionario } from "./pt-BR";

export const es: Dicionario = {
  nav: {
    tagline: "Verificación estadística",
    marca: "Mercado da",
    marcaDestaque: "Verdade",
    abrirMenu: "Abrir menú",
    idioma: "Idioma",
    links: [
      { href: "#regua", rotulo: "La vara de medir" },
      { href: "#alimentos", rotulo: "Alimentos" },
      { href: "#auditoria", rotulo: "Producto a producto" },
      { href: "#desemprego", rotulo: "Desempleo" },
      { href: "#comparativo", rotulo: "La comparación" },
      { href: "#seis-por-um", rotulo: "Jornada 6x1" },
      { href: "#ibge", rotulo: "El IBGE" },
      { href: "#verdade", rotulo: "Lo que sí es cierto" },
    ],
  },
  hero: {
    selo: "✓ Verificamos el método, no el partido",
    titulo1: "El dato es real.",
    titulo2: "El contexto fue recortado.",
    lead1:
      "Este sitio verifica, número por número, la pieza de propaganda electoral sobre el costo de vida publicada en [mercadodamentira.com.br ↗](https://mercadodamentira.com.br/).",
    lead2:
      "La conclusión, tras revisar cada sección: **no inventaron los datos**. Hicieron algo más difícil de percibir — eligieron una vara de medir que empieza y termina justo en los puntos que producen la conclusión deseada. Aquí devolvemos lo que fue recortado, **con la misma fuente oficial**.",
    boxTitulo: "Aquí no hay medias verdades.",
    boxP1:
      "De las seis comparaciones de su tabla, **tres se sostienen sin reparos** — y están marcadas como correctas en este sitio, con la ley y la fuente de cada una. El desempleo del 5,4% es real y es el menor de la serie. La informalidad está bajando.",
    boxP2:
      "Un sitio de verificación que solo encuentra errores de un lado es propaganda con otro nombre. Cada cifra aquí tiene fuente primaria, y el código y la base son abiertos.",
    stats: [
      { n: "109", k: "de los 112 productos de su propio sitio siguen más caros que en ene/2019" },
      { n: "14,9%", k: "el desempleo alcanzó su pico en el 1.er trim. de 2021, en plena pandemia" },
      { n: "159,7", k: "el índice mundial de alimentos de la FAO marcó récord en mar/2022" },
      { n: "3 de 6", k: "comparaciones de su tabla se sostienen — y nosotros lo confirmamos" },
    ],
  },
  comum: {
    narrativa: "La narrativa",
    contextoExato: "El contexto exacto",
    veredito: "Veredicto",
    oPonto: "El punto",
  },
  regua: {
    eyebrow: "La vara de medir, al descubierto",
    titulo: "Los dos períodos no son comparables.",
    lead:
      "El sitio original compara **ene/2019 a jul/2022** con **ene/2023 a jul/2026**. Parece simétrico: tres años y medio de cada lado. Pero mire lo que cae dentro de cada ventana — usando un índice **global**, que ningún presidente brasileño controla.",
    figCaption: "ÍNDICE DE PRECIOS DE LOS ALIMENTOS DE LA FAO/ONU · promedio anual · base 2014-2016 = 100",
    figAlt:
      "Índice mundial de alimentos de la FAO: sube de 95 en 2019 al récord de 2022, cae en 2023-2024 y vuelve a subir hasta 133 en 2026.",
    janelaA: 'VENTANA "BOLSONARO" DEL SITIO',
    janelaB: 'VENTANA "LULA" DEL SITIO',
    covid: "COVID-19",
    guerra1: "GUERRA EN",
    guerra2: "UCRANIA",
    nota:
      "* 2026: valor de agosto (133,3), el más alto desde fines de 2022. Pico mensual absoluto de la serie: 159,7 puntos en marzo de 2022.",
    narrativaTitulo: '"Tres años y medio de cada gobierno, lado a lado."',
    narrativaP:
      "La simetría del calendario se presenta como si fuera simetría de condiciones. Mismo número de meses, misma fuente, mismo índice — luego, lo que sobra sería mérito o culpa de la gestión.",
    contextoTitulo: "Una ventana toma toda la subida global. La otra toma la bajada.",
    contextoP1:
      'La ventana "Bolsonaro" empieza en 95 puntos y **termina justo en el pico histórico** del índice mundial de alimentos: la pandemia, el colapso logístico y la guerra en Ucrania están todos dentro de ella.',
    contextoP2:
      'La ventana "Lula" empieza **justo después de ese pico** y aprovecha la normalización de las cadenas globales. Buena parte de la diferencia ya estaba dada antes de cualquier decisión tomada en Brasilia.',
    veredito:
      "Los números están bien. Lo que no se sostiene es la atribución de causa: el mismo patrón de alza y caída aparece en todo el mundo, incluso en países cuyos gobiernos no cambiaron.",
    fontes:
      "Fuentes: FAO — Índice de Precios de los Alimentos (series mensuales y anuales, base 2014-2016=100); comunicado de la FAO de marzo de 2022 sobre el récord de 159,7 puntos; comunicado de la FAO de septiembre de 2026.",
  },
  alimentos: {
    eyebrow: "Bloque 1 · Inflación de alimentos",
    titulo: "La comida subió en todo el mundo — y después cedió en todo el mundo.",
    lead:
      'El sitio abre con el número más fuerte de la pieza: **13,2% de inflación de alimentos al año** en la ventana anterior contra **3,0% al año** en la actual. "Cuatro veces más cara." El dato del IPCA es correcto. La pregunta que no responde es: *¿cuatro veces más cara por culpa de quién?*',
    narrativaTitulo: '"La comida subió 4 veces más con Bolsonaro."',
    narrativaP:
      "Alimentación en el hogar, IPCA/IBGE Tabla 7060, tres años y medio de cada gobierno. 54,24% contra 13,66% acumulado.",
    contextoTitulo: "Tres choques externos cupieron enteros en la primera ventana.",
    contextoP1:
      "**1. Pandemia y colapso logístico (2020-2021).** El flete marítimo se multiplicó, las cadenas de suministro se rompieron y la demanda contenida empujó los alimentos en todo el mundo.",
    contextoP2:
      "**2. Guerra en Ucrania (feb/2022).** Rusia y Ucrania representaban cerca del 27% de las exportaciones mundiales de trigo y más de la mitad del aceite de girasol. El índice global de la FAO marcó el récord de toda la serie en marzo de 2022.",
    contextoP3:
      "**3. Fertilizantes.** Brasil importa la mayor parte de lo que usa, y Rusia y Bielorrusia son proveedores centrales. Las sanciones encarecieron el insumo — y el insumo entra en el precio de la cosecha siguiente.",
    stats: [
      { n: "+51%", k: "el índice mundial de alimentos de la FAO subió de 95,1 (2019) a 143,7 (2022) — sin ningún gobierno brasileño al mando" },
      { n: "−15%", k: "y retrocedió de 143,7 (2022) a 122,0 (2024), la marea que la segunda ventana tuvo a favor" },
      { n: "133,3", k: "y volvió a subir: agosto de 2026, el nivel más alto desde fines de 2022" },
    ],
    veredito:
      "Engañoso por omisión de causa. La diferencia entre las dos ventanas es en gran parte la diferencia entre estar en la subida y estar en la bajada de un ciclo global de materias primas. Y como el índice de la FAO volvió a subir en 2026, la misma métrica que hoy se usa como prueba de competencia puede volverse prueba de incompetencia en pocos meses — sin que nada haya cambiado en Brasilia.",
    fontes:
      "Fuentes: IBGE/IPCA (Tabla 7060, alimentación en el hogar); FAO — Índice de Precios de los Alimentos; comunicados de la FAO/ONU de marzo de 2022 y septiembre de 2026.",
  },
  desemprego: {
    eyebrow: "Bloque 2 · La métrica del desempleo",
    titulo: "El pico del 14,9% no es el punto de partida de nadie.",
    lead:
      'La tabla comparativa del sitio pone **"14%+"** en la columna del gobierno anterior y **5,4%** en la actual. Pero 14,9% no fue ni cómo empezó ni cómo terminó el gobierno anterior: fue el auge de la pandemia, en el 1.er trimestre de 2021.',
    figCaption: "TASA DE DESOCUPACIÓN · PNAD CONTÍNUA TRIMESTRAL / IBGE · en % de la fuerza laboral",
    figAlt:
      "Desempleo: 12,7% a inicios de 2019, pico de 14,9% en el primer trimestre de 2021 durante la pandemia, 7,9% a fines de 2022 y 5,4% en junio de 2026.",
    trocaGoverno: "CAMBIO DE GOBIERNO",
    pandemia: "PANDEMIA / CONFINAMIENTOS",
    pico: "PICO DE LA SERIE",
    rotulos: ["1T/19", "4T/19", "1T/21", "4T/22", "4T/23", "4T/24", "jun/26"],
    narrativaTitulo: '"Desempleo récord de 14%+ contra 5,4%, el menor de la historia."',
    narrativaP:
      "La tabla del sitio pone el peor número jamás registrado de un lado y el mejor del otro, como si fueran los saldos de cada gestión.",
    contextoTitulo: "Compare inicio con inicio y final con final.",
    contextoP1:
      "El gobierno anterior **recibió 12,7%** (1.er trim. 2019) y **entregó 7,9%** (4.º trim. 2022): caída de 4,8 puntos, atravesando la pandemia en el medio.",
    contextoP2:
      "El gobierno actual **recibió 7,9%** y llegó a **5,4%** (jun/2026): caída de 2,5 puntos — un resultado real y el mejor de la serie, pero obtenido a partir de una herencia que ya venía cayendo.",
    contextoP3:
      "El 14,9% pertenece al 1.er trimestre de 2021 — un trimestre de confinamiento, no un balance de gestión.",
    veredito:
      'El 5,4% es verdadero y es el menor de la serie histórica. Lo falso es el contraste: usar el pico de la pandemia como "el número del adversario" carga a la gestión el costo de un choque sanitario global.',
    fontes:
      "Fuentes: IBGE/PNAD Contínua trimestral — 1.er trim. 2019 (12,7%), 4.º trim. 2019 (11,0%), 1.er trim. 2021 (14,9%, máximo de la serie iniciada en 2012), 4.º trim. 2022 (7,9%), 4.º trim. 2023 (7,4%), 4.º trim. 2024 (6,2%) y trimestre cerrado en junio de 2026 (5,4%).",
  },
  // <<SECOES>>
};
