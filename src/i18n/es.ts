import type { Dicionario } from "./pt-BR";

export const es: Dicionario = {
  nav: {
    tagline: "Verificación estadística",
    marca: "Mercado da",
    marcaDestaque: "Verdade",
    abrirMenu: "Abrir menú",
    idioma: "Idioma",
    links: [
      { href: "#regua", rotulo: "La vara" },
      { href: "#alimentos", rotulo: "Alimentos" },
      { href: "#auditoria", rotulo: "Producto" },
      { href: "#desemprego", rotulo: "Desempleo" },
      { href: "#comparativo", rotulo: "Comparación" },
      { href: "#seis-por-um", rotulo: "Jornada 6x1" },
      { href: "#ibge", rotulo: "IBGE" },
      { href: "#verdade", rotulo: "Lo que es cierto" },
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
  comparativo: {
    eyebrow: "Línea por línea",
    titulo: "Su tabla comparativa, auditada.",
    lead:
      'Tomamos la tabla que ellos llaman "la comparación que lo resume todo" y verificamos cada línea. Tres de las seis se sostienen sin reparos — y lo decimos con todas las letras. Las otras tres dependen de un contexto que quedó afuera.',
    colunaA: 'Columna "Bolsonaro":',
    colunaB: 'Columna "Lula":',
    selos: { enganoso: "Engañoso", parcial: "Correcto, sin contexto", correto: "Correcto" },
    linhas: [
      {
        ind: "Comida en el supermercado", a: "+54,24%", b: "+13,66%",
        txt: "Ambas cifras coinciden con el IPCA. Lo que la tabla no dice es que la primera ventana contiene la pandemia, el colapso logístico y la guerra en Ucrania, y termina en el récord histórico del índice mundial de alimentos. Además, el precio de hoy es el resultado de las dos ventanas sumadas: la comida acumula alza en ambas.",
      },
      {
        ind: "Desempleo", a: "14%+", b: "5,4%",
        txt: "Compara el pico de la serie (14,9% en el 1.er trim. de 2021, auge de los confinamientos) con el valor actual. El gobierno anterior recibió 12,7% y entregó 7,9%; el actual recibió 7,9% y llegó a 5,4%. El 5,4% es real y es el menor de la serie — el pico de 14,9% es el que no es el saldo de nadie.",
      },
      {
        ind: "Ingreso medio", a: "−R$ 33", b: "+R$ 476",
        txt: "El ingreso real efectivamente cayó hasta 2021 y se recuperó después — hoy está en el nivel más alto de la serie (R$ 3.652 en el trimestre hasta ene/2026). Pero la caída coincide con la destrucción de puestos en la pandemia y el alza parte de una base deprimida. Una parte de la recuperación es terreno retomado, no terreno nuevo.",
      },
      {
        ind: "Impuesto a la renta", a: "4 años de tabla congelada", b: "Exención hasta R$ 5 mil",
        txt: "Es correcto. La tabla del impuesto no se corrigió entre 2019 y 2022, y la Ley 15.270/2025 amplió la exención a quienes ganan hasta R$ 5 mil, vigente desde enero de 2026, con cerca de 15 millones de beneficiados. Salvedad honesta de contexto: el congelamiento de la tabla empezó en 2015, antes del gobierno anterior.",
      },
      {
        ind: "Salario mínimo", a: "R$ 1.212 (2022)", b: "R$ 1.621 (2026)",
        txt: "Los valores son correctos. La comparación es nominal, pero en este caso la ganancia real también existe: la Ley 14.663/2023 restableció la política de valorización (inflación más el PIB de dos años antes), y el ajuste de 2026 trajo ganancia por encima de la inflación.",
      },
      {
        ind: "Poder de compra del mínimo", a: "+R$ 214", b: "+R$ 409",
        txt: "Es la misma política de valorización medida como ganancia real acumulada. Diferencia de método, no de contexto externo: aquí la comparación mide una decisión de política pública, que es exactamente lo que una comparación entre gobiernos debería medir.",
      },
    ],
    veredito:
      "La pieza no fabrica números — selecciona la vara de medir. Donde la comparación mide una decisión de política pública (impuesto a la renta, salario mínimo), es legítima y nosotros la confirmamos. Donde mide un ciclo global (comida, desempleo, ingreso), atribuir el resultado a la gestión es el error.",
    fontes:
      "Fuentes: IBGE (IPCA Tabla 7060, PNAD Contínua); Ley 15.270/2025 (exención del impuesto a la renta hasta R$ 5 mil, vigente ene/2026); Ley 14.663/2023 (política de valorización del salario mínimo); Senado Federal y Ministerio de Hacienda.",
  },
  escala: {
    eyebrow: "Bloque 3 · La jornada 6x1",
    titulo: "Una propuesta en votación no es una entrega.",
    lead:
      'Hay que ser justos: la ficha del sitio original dice, con todas las letras, "propuesta en debate en el Congreso". El problema no está en el texto de la ficha — está en **dónde fue colocada**: dentro de la sección titulada *"Lo que Lula hizo"*, junto a medidas que de hecho ya están vigentes.',
    narrativaTitulo: '"Fin de la jornada 6x1" en la lista de lo ya hecho.',
    narrativaP:
      "La ficha aparece entre la exención del impuesto a la renta (ley vigente), el programa de renegociación de deudas y la caída de la pobreza. La lectura rápida — que es como casi todo el mundo lee un sitio — registra todo como entregado.",
    contextoTitulo: "Falta la etapa más difícil: dos rondas en el pleno del Senado.",
    contextoP1:
      "La enmienda constitucional 221/2019 (con la 8/2025 adjunta) avanzó de verdad en 2026 y está más cerca que nunca. Pero necesita **49 votos en dos rondas en el Senado**, y la votación en el pleno **aún no tiene fecha**, con la oposición obstruyendo.",
    contextoP2:
      "Hasta que eso ocurra, la jornada 6x1 sigue siendo legal y vigente para quien trabaja bajo ella hoy.",
    etapas: [
      { t: "Admisibilidad en la comisión de constitución de la Cámara", d: "22 de abril de 2026" },
      { t: "Aprobada por la Cámara en dos rondas", d: "27 de mayo de 2026" },
      { t: "Llega al Senado", d: "28 de mayo de 2026" },
      { t: "Aprobada en la comisión de constitución del Senado", d: "2 de septiembre de 2026" },
      { t: "Pleno del Senado — 1.ª ronda (49 votos)", d: "sin fecha fijada" },
      { t: "Pleno del Senado — 2.ª ronda (49 votos)", d: "no ocurrió" },
      { t: "Promulgación — se vuelve norma constitucional", d: "no ocurrió" },
    ],
    veredito:
      "Una promesa en curso presentada en lugar de una entrega. El avance es real y reciente — y vender futuro como presente es justamente lo que erosiona la confianza cuando la votación se traba.",
    fontes:
      "Fuentes: Senado Federal — enmienda 221/2019 (aprobación en comisión el 02/09/2026 y envío al pleno); Cámara de Diputados — aprobación en dos rondas el 27/05/2026; Agência Brasil, septiembre de 2026. Situación verificada el {data}.",
  },
  ibge: {
    eyebrow: "Bloque 4 · La credibilidad del IBGE",
    titulo: "El error no está en la planilla. Y el problema del IBGE también es real.",
    lead:
      "Circula en las redes que el IBGE — el instituto nacional de estadística de Brasil — estaría falsificando los números. Circula en la propaganda que cuestionar al IBGE es golpismo. Las dos cosas son simplificaciones — y las dos estorban a quien quiere entender lo que está pasando.",
    tagNao: "Lo que NO se sostiene",
    naoTitulo: '"Los números son inventados."',
    naoP1:
      "No hay evidencia alguna de manipulación del IPCA (índice de precios) ni de la PNAD (encuesta de empleo). Son encuestas con metodología pública, microdatos abiertos, muestra auditable y ejecución por funcionarios de carrera. Cualquier investigador puede recalcular los índices a partir de los microdatos — y eso lo hacen rutinariamente universidades, bancos e institutos independientes, que llegan a los mismos resultados.",
    naoP2:
      "La **reponderación de la PNAD en 2025**, hecha para incorporar el Censo 2022, es un procedimiento técnico estándar, anunciado con antelación y aplicado **retroactivamente a toda la serie** — incluidos los años del gobierno anterior. No crea mejora artificial: recalibra el pasado y el presente con la misma vara.",
    naoP3:
      "Y los pesos del IPCA siguen los de la encuesta de presupuestos familiares anterior: la actualización solo debe regir a partir de 2027. Es decir, el índice usado en esa comparación **no fue alterado** por este gobierno.",
    tagSim: "Lo que SÍ es preocupante",
    simTitulo: "El blindaje institucional se desgastó — y eso está documentado.",
    simP1:
      "El **19 de enero de 2026**, Rebeca Palis, coordinadora responsable del cálculo del PIB, fue destituida. Al menos tres integrantes del equipo dejaron sus cargos en solidaridad.",
    simP2:
      "En **febrero y marzo de 2026**, el Ministerio Público ante el tribunal de cuentas pidió la separación del presidente del IBGE, Márcio Pochmann, alegando riesgo de uso político de los datos del PIB en año electoral y preocupación por cambios en las metodologías de recolección y tratamiento.",
    simP3:
      "Nada de eso demuestra que una cifra haya sido falsificada. Demuestra que las salvaguardas que hacen difícil la falsificación quedaron más frágiles — y eso es motivo legítimo de vigilancia, no de pánico.",
    veredito:
      "Acusar al IBGE de fraude es injusto con quien produce los datos y desvía la atención del problema real. El dato es confiable; lo que se elige es la vara aplicada sobre él en la propaganda. Al mismo tiempo, la crisis de gobernanza del instituto es real y merece seguimiento — entre otras cosas porque la mejor defensa de los números es la autonomía de quien los calcula.",
    fontes:
      "Fuentes: IBGE — nota técnica sobre la reponderación de la PNAD en 2025 y Proyecciones de Población posteriores al Censo 2022; IBGE/POF sobre la actualización de los pesos del IPCA; Correio Braziliense y Gazeta do Povo (marzo de 2026) sobre la presentación del Ministerio Público ante el tribunal de cuentas y las destituciones en la dirección de cuentas nacionales.",
  },
  verdade: {
    eyebrow: "Honestidad en los dos sentidos",
    titulo: "Lo que la propaganda acierta — y lo que nadie te está contando.",
    lead:
      "Un sitio de verificación que solo encuentra errores del otro lado no es verificación, es propaganda con otro nombre. Así que seamos explícitos sobre lo que sí se confirma.",
    colunaAcertos: "✓ Lo que se confirma",
    colunaOmissoes: "! Lo que queda afuera de los dos lados",
    acertos: [
      { t: "5,4% es el menor desempleo de la serie", d: "El récord de la PNAD, iniciada en 2012, es real. No hay truco en el número en sí." },
      { t: "La informalidad está bajando", d: "37,5% en el trimestre hasta ene/2026, el menor nivel desde julio de 2020. El contraargumento de que 'los empleos son todos informales' no se sostiene en los datos." },
      { t: "El ingreso medio está en el nivel más alto de la serie", d: "R$ 3.652 de ingreso real habitual, +5,4% en un año. Es récord de hecho." },
      { t: "La exención del impuesto hasta R$ 5 mil está vigente", d: "Ley 15.270/2025, aplicada en la nómina desde el 1.º de enero de 2026, con cerca de 15 millones de beneficiados." },
      { t: "El salario mínimo tuvo ganancia real", d: "La política de valorización fue restablecida por la Ley 14.663/2023 y el mínimo de 2026 (R$ 1.621) subió por encima de la inflación." },
      { t: "La subutilización cayó mucho", d: "13,8% en el trimestre hasta abril de 2026, contra más del 30% en el auge de la pandemia. La mejora del mercado laboral es amplia, no un artificio de definición." },
    ],
    omissoes: [
      { t: "El precio no volvió, solo dejó de correr", d: "109 de los 112 productos de su propia tabla siguen más caros que en enero de 2019. Inflación baja significa que el precio subió despacio — no que bajó." },
      { t: "El café acumula +156% desde 2019", d: "Y subió 48,7% en la ventana actual, según los números del propio sitio. Algunos artículos del día a día siguen pesando mucho más en el presupuesto." },
      { t: "La marea global cambió de nuevo", d: "El índice de alimentos de la FAO llegó a 133,3 puntos en agosto de 2026, el mayor desde fines de 2022. El viento a favor de 2023-2024 no es permanente." },
      { t: "El ciclo global explica los dos lados", d: "La misma lógica que exime a este gobierno del alza de 2021-2022 exime al anterior. Quien usa el argumento del contexto debe aplicarlo en las dos direcciones." },
    ],
    ponto:
      "La mejora del mercado laboral es real y la desaceleración de los precios es real. Lo que no es real es la relación de causa que la pieza construye entre una cosa y la otra, ni la idea de que el precio de la comida volvió a lo que era. Se puede reconocer el resultado sin comprar la explicación.",
    fontes:
      "Fuentes: IBGE/PNAD Contínua (desocupación, informalidad, subutilización e ingreso real, publicaciones de 2026); Ley 15.270/2025; Ley 14.663/2023; FAO — Índice de Precios de los Alimentos, agosto de 2026; y la propia base de productos publicada en mercadodamentira.com.br.",
  },
  metodologia: {
    eyebrow: "Metodología",
    titulo: "Cómo llegamos a estos números.",
    itens: [
      { t: "Usamos sus propias cifras", d: "La tabla fue extraída de la propia sección “Producto a producto” del sitio original, en septiembre de 2026. Ninguna variación fue alterada. Solo quitamos 4 etiquetas repetidas (el mismo ítem del IPCA aparecía con nombre corto y nombre completo), quedando 112 productos. La única columna nueva es la del acumulado." },
      { t: "Archivamos la pieza original", d: "Una copia del sitio verificado fue guardada en el Internet Archive el 9 de septiembre de 2026. Si lo editan o bajan la página, la versión que auditamos sigue pública y verificable — el enlace está en las fuentes de abajo." },
      { t: "Encadenamos, no sumamos", d: "Para saber dónde está el precio hoy respecto a ene/2019, los dos períodos consecutivos se multiplican: (1+a)×(1+b)−1. Sumar las dos variaciones daría un número equivocado." },
      { t: "Comparamos inicio con inicio", d: "Para desempleo e ingreso usamos el valor del trimestre en que cada gobierno asumió y del trimestre en que entregó — en vez del peor y el mejor punto de la serie." },
      { t: "Probamos contra una serie global", d: "El índice de alimentos de la FAO funciona como control: si el mismo movimiento aparece en todo el mundo, no puede acreditarse ni debitarse a un gobierno brasileño." },
      { t: "Decimos cuándo ellos tienen razón", d: "Tres de las seis líneas de la comparación original se sostienen. Están marcadas como correctas, con la fuente legal de cada una." },
      { t: "Fechamos todo", d: "Los indicadores coyunturales cambian. Cada bloque trae su fecha de verificación, y la página informa la última actualización general." },
    ],
    tituloFontes: "Fuentes primarias",
    fontes: [
      { t: "IBGE · IPCA (Tabla 7060)", u: "https://sidra.ibge.gov.br/tabela/7060" },
      { t: "IBGE · PNAD Contínua", u: "https://www.ibge.gov.br/estatisticas/sociais/trabalho/17270-pnad-continua.html" },
      { t: "FAO · Índice de Precios de los Alimentos", u: "https://www.fao.org/worldfoodsituation/foodpricesindex/en/" },
      { t: "Senado · Enmienda 221/2019", u: "https://www25.senado.leg.br/web/atividade/materias/-/materia/174386" },
      { t: "Ley 15.270/2025 (impuesto a la renta)", u: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm" },
      { t: "Ley 14.663/2023 (salario mínimo)", u: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14663.htm" },
      { t: "Copia archivada del sitio original (9 sep 2026)", u: "https://web.archive.org/web/20260909203458/https://mercadodamentira.com.br/" },
    ],
  },
  compartilhe: {
    eyebrow: "Compartir",
    titulo: "Esta cuenta tiene que circular.",
    lead:
      "La vara torcida viaja rápido porque es simple. El contexto viaja despacio porque exige explicación. Si esta verificación te ayudó a entender el número, también ayudará a otra persona.",
    textoCompartilhado:
      "109 de los 112 productos que la campaña usa como prueba siguen más caros que en enero de 2019. Y la cuenta está hecha con sus propios números.",
    whatsapp: "WhatsApp",
    postarNoX: "Publicar en X",
    copiarLink: "Copiar enlace",
    linkCopiado: "Enlace copiado",
    nota: "El texto ya viene listo con el dato principal. Si prefieres, escribe el tuyo — el enlace es el mismo.",
  },
  autor: {
    eyebrow: "Quién hizo esta verificación",
    nome: "João Pedro Gamin",
    bio1:
      "Hice este sitio por cuenta propia, sin vínculo con ningún partido, campaña, medio u organismo público. La motivación fue simple: los números de la pieza original eran verdaderos y aun así la conclusión no se sostenía. Eso es un problema de método, y el método se puede demostrar.",
    bio2:
      "Todo el código y la base de datos están abiertos. Si encuentras un error mío, abre una issue en el repositorio — la corrección se publica con la misma claridad que la afirmación original.",
    tituloNumeros: "ESTE PROYECTO EN NÚMEROS",
    numeros: [
      { n: "112", k: "productos auditados" },
      { n: "9", k: "fuentes primarias" },
      { n: "5", k: "afirmaciones verificadas" },
      { n: "100%", k: "del código abierto" },
    ],
  },
  footer: {
    marca: "MERCADO DA",
    marcaDestaque: "VERDADE",
    disclaimer:
      "Proyecto independiente y de autoría identificada, hecho por cuenta propia. **No está ligado a ningún partido, campaña, coalición, candidato u organismo público**, y no es propaganda electoral. No tenemos vínculo alguno con los responsables del sitio mercadodamentira.com.br, cuyo contenido se cita aquí únicamente con fines de análisis crítico y verificación.",
    correcoes:
      "Todos los datos provienen de fuentes públicas y oficiales, listadas en cada bloque, y el código fuente y la base de productos son abiertos: cualquier persona puede rehacer las cuentas. ¿Encontraste un error nuestro? Abre una issue en el repositorio. La corrección se publica con la misma claridad que la afirmación original — esa es la diferencia entre verificación y propaganda.",
    ultimaVerificacao: "Última verificación de los indicadores: {data}.",
    github: "Código y datos en GitHub",
  },
  auditoria: {
    eyebrow: "Producto a producto",
    titulo: '"Más barato" no quiere decir barato.',
    lead:
      "Tomamos los **{total} productos** de la propia tabla del sitio original, con sus números, sin cambiar una coma. E hicimos la única cuenta que faltaba: encadenar las dos ventanas para saber dónde está el precio **hoy** respecto a enero de 2019.",
    stats: [
      { n: "{acima} de {total}", k: "productos siguen más caros que en enero de 2019" },
      { n: "{caiu}", k: "productos sí bajaron durante la ventana 2023-2026" },
      { n: "{aindaCaro} de esos {caiu}", k: "bajaron, pero siguen por encima del precio de 2019" },
      { n: "{abaixo}", k: "productos están realmente por debajo del nivel de 2019" },
    ],
    buscar: "Buscar producto…",
    filtros: { enganosos: "Bajó, pero sigue caro", acima: "Por encima de 2019", todos: "Todos" },
    colunas: { produto: "Producto", janelaA: "Ventana 2019-2022", janelaB: "Ventana 2023-2026", acumulado: "Precio hoy vs. ene/2019" },
    vazio: "Ningún producto encontrado.",
    veredito:
      'El aceite de soja aparece como "más barato con Lula" (−14,2%). Es verdad — y aun así cuesta **135% más** que en 2019. El arroz bajó 1,9% y sigue 47,6% por encima. Una caída después de un disparo no devuelve el precio: devuelve una fracción de él. Por eso el gráfico mejora y la sensación en la caja del supermercado no acompaña.',
    calculo:
      'Cálculo: nivel de precio acumulado = ((1 + variación de la 1.ª ventana) × (1 + variación de la 2.ª ventana) − 1). Variaciones extraídas de la sección "Producto a producto" de mercadodamentira.com.br (sep/2026), que cita IPCA/IBGE. Al encadenar períodos consecutivos, los índices se multiplican — no se suman.',
  },
  schema: {
    descricao: "Verificación estadística de la propaganda electoral brasileña sobre el costo de vida, con datos del IBGE y la FAO.",
    checagens: [
      { claim: "El desempleo cayó de más del 14% al 5,4% gracias a la gestión actual.", rating: "Engañoso: compara el pico de la pandemia con el dato actual" },
      { claim: "La comida subió 4 veces más con el gobierno anterior que con el actual.", rating: "Dato correcto, causa engañosa: omite el ciclo global de alimentos" },
      { claim: "Decenas de productos se abarataron con el gobierno actual.", rating: "Sin contexto: 109 de 112 productos siguen por encima del precio de ene/2019" },
      { claim: "El fin de la jornada 6x1 está entre las entregas del gobierno actual.", rating: "Engañoso: la enmienda aún no fue votada en el pleno del Senado" },
      { claim: "El IBGE estaría falsificando los datos de empleo e inflación.", rating: "Falso: no hay evidencia de manipulación del IPCA ni de la PNAD" },
    ],
  },
  meta: {
    title: "Mercado da Verdade — el dato es real, el contexto fue recortado",
    desc: "Verificación número por número de mercadodamentira.com.br. Los datos oficiales son reales — lo que se eligió fue la vara: 109 de 112 productos siguen por encima de 2019.",
    keywords: [
      "verificación de datos", "Brasil", "alfabetización estadística", "cherry picking",
      "IPCA", "IBGE", "inflación de alimentos", "desempleo", "costo de vida Brasil",
      "elecciones Brasil 2026", "periodismo de datos", "estadísticas engañosas",
    ],
  },
  // <<SECOES>>
};
