# Aula Lumi · Profesora virtual con IA

Una profesora virtual que **escucha, explica en una pizarra, dibuja gráficos, desglosa fórmulas y habla**.
Funciona 100 % en el navegador (sin servidor) y usa la API gratuita de **Gemini**.

## Publicar en GitHub Pages
1. Crea un repositorio nuevo en GitHub (por ejemplo `aula-lumi`).
2. Sube **todo el contenido de esta carpeta** (`index.html`, `css/`, `js/`, `.nojekyll`, `README.md`). Puedes arrastrar los archivos en *Add file → Upload files*.
3. Ve a **Settings → Pages**, en *Source* elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`. Guarda.
4. En 1–2 minutos tu app estará en `https://TU-USUARIO.github.io/aula-lumi/`.

## Configurar Gemini
1. Consigue una API key gratis en <https://aistudio.google.com/apikey>.
2. Abre la app → **Ajustes** → pega la key y guarda.

> **La key nunca se escribe en el código ni se sube a GitHub.** Se guarda solo en el `localStorage` de tu navegador. No la pegues en ningún archivo del repositorio.
> Con el plan gratuito de Gemini, Google puede usar lo que envíes para mejorar sus productos: no escribas datos personales.

## Probar en local
Abre una terminal en la carpeta y ejecuta `python3 -m http.server 8000`; luego visita <http://localhost:8000>.
(El dictado por micrófono requiere `https` o `localhost`.)

## Estructura
| Archivo | Qué hace |
|---|---|
| `js/gemini.js` | Llamada a la API y **prompt de la profesora**. Aquí cambias de modelo o proveedor. |
| `js/board.js` | Pizarra: texto, fórmulas (KaTeX) y gráficos SVG. |
| `js/avatar.js` | Avatar 2.5D: parpadeo, gestos, labios, **reacciones** (risa, sorpresa, orgullo…) y clic para hacerle cosquillas. |
| `js/voice.js` | Voz y dictado del navegador. Avisa cuándo empieza y termina cada frase. |
| `js/sync.js` | **Director de la clase**: sincroniza la pizarra con la voz y mueve el brillito ✨ (`css/sync.css`). |
| `js/app.js` | Orquesta todo y guarda la memoria del alumno. |
| `css/style.css` | Diseño responsive (móvil y escritorio). |

## Novedades
- **Modo Sorpresa de cumpleaños (v72)** (`js/party.js`, `css/party.css`): botón 🎂 en la barra. Lumi saluda por el nombre de tu amiga, dibuja en la pizarra un pastel con velitas, globos y tres regalitos, le canta el cumpleaños con su nombre (la letra aparece al ritmo de la voz), pide un deseo, lluvia de confeti, melodía de cajita de música y cierra con tu mensaje. Todo va escrito en el guion (no usa Gemini ni API key). También se activa escribiendo o diciendo «Lumi, ella es mi amiga Ana, hazle una sorpresa» o con un link `?cumple=Ana&de=Tu+nombre&msg=Tu+mensaje` que muestra un sobre para abrir. `CACHE` ahora es `lumi-v72`.
- **Dormir con Pip (v71c)**: Lumi se adormila (bosteza, cabecea, se le cierran los ojitos), se acuesta con manta y Pip se acurruca en su hombro; respira hondo, tiene burbuja en la nariz, habla dormida y sueña. Al tocarla despierta estirándose y Pip se despierta con ella. Nuevas reacciones: drowsy, cabeceo, snooze, sleeptalk, dream, snore, goodnight, cozy, cuddle, wakeup, tuckin. Además las reacciones ahora mueven las cejas, parpadean y Pip se suma a veces.
- **+35 gestos nuevos (v71b)** en `js/avatar.js`: abrazo, saludo militar, pulgar arriba, reverencia, micrófono, DJ, avioncito, cohete, magia, detective, selfie, brindis, eureka, «no no», beso volador y más; con poses de brazos nuevas, brazos que se mueven y frases propias. Salen solos, al tocar su cuerpo o su cara.
- **Lumi con más vida (v71)** (`css/lumi2.css`, cambios en `js/avatar.js`): hombros redondeados y luces y sombras de volumen en el cuerpo y el cuello, respiración que mueve pecho, cabeza y brazos, balanceo suave del peso, brazos con parallax y squash & stretch (se agacha, estira y aterriza) en saltos, risas, sustos y ronroneos. Ojos con brillos que se quedan atrás al mirar (efecto cristal) y pupilas que respiran y se dilatan con la emoción. `CACHE` ahora es `lumi-v71`.
- **Pizarra con ritmo (v70)** (`js/beat.js`, `css/beat.css`): cuando suena música, la pizarra late al compás: el marco brilla, el título se ilumina y crece un poquito, los iconos de los recuadros y las insignias de los pasos saltan, las notas se mecen, las fórmulas brillan y la tiza del borde salta; cada 4 latidos hay un primer tiempo más marcado. Con **audios y videos de tu dispositivo** detecta de verdad los golpes graves (bombo y bajo) con `captureStream` + `AnalyserNode` (solo lee una copia: el sonido y el volumen no cambian); con **YouTube** (el navegador no deja leer su audio) o fuentes sin señal usa un latido suave de ambiente. Se enciende y apaga con el botón 🥁 del reproductor (se recuerda), se pausa con la pestaña oculta y respeta *reducir movimiento*. Cada latido solo cambia una clase en `#board` y CSS hace una animación de ~0,35 s (sin bucles continuos). `CACHE` ahora es `lumi-v70c`.
- **Reproductor mejorado (v70)** (`js/player.js`, `css/player.css`): botones de **aleatorio 🔀** y **repetir** (toda la lista 🔁, una canción 🔂 o no repetir ➡️), **velocidad** 0.75x a 2x, **silencio**, **temporizador de estudio ⏲** (15, 25 = pomodoro 🍅, 45 o 60 min: baja el volumen poco a poco, pausa y Lumi se despide), **tres vistas** (video 🎬, solo audio 🎧 y *mini* 📌 con ⏮ ⏯ ⏭ en una pastilla), barra de progreso fina con degradado, **disco que gira** con ecualizador para los audios, ♫ animado en la canción actual, **arrastrar y soltar** archivos o enlaces sobre el reproductor, botón para vaciar la lista (pide confirmar) y **controles del sistema** (pantalla de bloqueo y teclas multimedia). Atajos con el reproductor enfocado: `Espacio` pausa, `←` `→` ±5 s, `↑` `↓` volumen, `M` silencio, `N` siguiente, `P` anterior, `S` aleatorio; y `Alt+P` pausa o reanuda desde cualquier parte. Los ajustes se recuerdan. Solo se animan `transform` y `height` (ligero) y se respeta *reducir movimiento*. `CACHE` ahora es `lumi-v70b`.
- **Pizarra creativa (v70, tanda 2)** (`css/board2.css`, `js/app.js`): cada estilo de pizarra tiene su textura (renglones azules en la blanca, puntitos en la kawaii, polvo de tiza en la negra); tu pregunta aparece como globo de diálogo, las fotos como polaroid y las notas como papelito; el título lleva marcador amarillo; los recuadros tienen esquina doblada y los de resumen y práctica se estampan con «¡LISTO!» y «¿te animas?»; los pasos alternan colores; el quiz muestra ✨ o 🤔 al responder. Además, **tocar cualquier elemento de la pizarra lo subraya con marcador** (tócalo de nuevo para quitarlo), útil para estudiar.
- **Pizarra más cuidada (v70)** (`css/board2.css`, nuevo): el título se subraya como con tiza, los recuadros tienen icono propio (💡 definición, ✏️ ejemplo, ⚠️ ojo, 📌 resumen, 🎯 tu turno) y tinte según su tipo, la pista aparece como una burbuja, los pasos forman una línea de tiempo numerada que termina en verde con ✓, el resultado `\boxed` se resalta, las tablas tienen filas alternas y encabezado destacado, las listas usan ✦, los quiz rebotan al acertar y se sacuden al fallar, y lo recién escrito se marca con una barrita amarilla. Respeta *reducir movimiento* y se ajusta en móvil.
- **Pedagogía viva y más expresión (v70)** (`js/gemini.js`, `js/app.js`): el prompt de Lumi suma tres bloques: *Pedagogía viva* (diagnóstico inicial, predecir antes de ver, pistas en escalera, contraste con el error típico, una idea por paso, chequeo de comprensión a mitad de clase, explicar distinto si el alumno duda y cierre activo), *Expresiones con sentido* (el mood, el gesto y la reacción acompañan cada momento: pregunta, sorpresa, «¡ah!», error común, acierto proporcional al logro) y *Pizarra con intención* (código de colores constante, orden de lectura, borrar lo que sobra y mostrar antes de abstraer). Además `autoReact()` en `app.js` hace que Lumi reaccione sola según la pizarra (ojo en *warn*, curiosidad en *try*, orgullo en *sum*, idea en *mnemonic*) cuando la IA no indica reacción. `CACHE` ahora es `lumi-v70`.
- **Modo examen y nivel explicado en Ajustes (v69)**: si pides un *examen, simulacro o que te evalúe*, Lumi hace de 8 a 12 preguntas, una por paso, que suben de fácil a difícil (recordar, aplicar, analizar), con tipos variados (quiz, verdadero/falso, completar, ordenar, unir, ejercicio), **sin revelar la respuesta al plantear la pregunta**, y cierra con lo que dominas y lo que conviene repasar. «Repasar» y «estudiar» siguen dando una sesión de resumen + regla mnemotécnica + práctica. Además, bajo *Nivel del alumno* ahora aparece una frase que describe cómo enseñará Lumi en ese nivel (`LV_TXT` en `app.js`). `CACHE` ahora es `lumi-v69`.
- **Estilo de enseñanza por nivel (v68)** (`js/gemini.js`, `js/app.js`): cada nivel de *Ajustes → Nivel del alumno* tiene ahora su propio perfil (`Gemini.LEVELS`), que se envía en cada consulta como «Perfil del nivel». **Primaria**: frases muy cortas, una idea por paso, mucho dibujo, juegos (tf, match, order) y tono alegre sin decir «mal». **Secundaria**: intuición primero y luego método, ejemplos de videojuegos, deportes y redes, error típico en «¡ojo!». **Bachillerato**: rigor y notación formal, el porqué de cada resultado, condiciones de validez, verificación y problemas de varios pasos. **Universidad**: terminología técnica directa, definiciones formales, demostraciones, supuestos y generalizaciones, y problemas de análisis. Si lo que escribe el alumno muestra otro nivel, Lumi se ajusta un peldaño sin avisarlo. Para cambiar un perfil, edita el texto de `LEVELS`. `CACHE` ahora es `lumi-v68`.
- **Lumi enseña con más potencia (v67)** (`js/gemini.js`, `js/app.js`): se reescribieron y ampliaron las instrucciones de la profesora.
  - **Método de clase**: gancho → intuición (analogía o dibujo) → definición precisa → ejemplo resuelto explicando el *porqué* de cada paso → «¡ojo!» con el error típico → resumen + práctica + siguiente paso.
  - **Andamiaje y práctica**: «yo lo hago, lo hacemos juntos, tú solo»; ejercicios con una sola respuesta comprobable y pistas graduadas; quiz con errores reales como opciones falsas y explicación de por qué falla cada una; repaso de los temas con errores.
  - **Más rigor**: verifica cuentas, signos y unidades; comprueba el resultado; notación consistente; no inventa datos ni fuentes; avisa cuando algo es aproximado, discutido o puede haber cambiado; si falta información, lo dice en lugar de adivinar.
  - **Según lo que pidas**: reglas distintas para «explícame», «resuelve», «por qué», «diferencia entre», «examen/repasar», saludos, programación e idiomas.
  - **Fotos y tareas**: Lumi primero escribe lo que leyó para que la corrijas, enseña el método (no solo el resultado) y deja un ejercicio parecido.
  - **Emociones y seguridad**: si te frustras, valida, baja un peldaño y elogia el esfuerzo; contenido apropiado para cualquier edad.
  - **Respuestas más fiables**: temperatura más baja (0.45) para más exactitud y reglas de JSON más estrictas (menos errores de formato).
  - **Indicaciones automáticas por consulta** (`lessonHint` en `app.js`, local y sin créditos extra): detecta foto, «no entendí», preguntas de seguimiento, examen, ejercicios, frustración y saludos, y le avisa a Lumi cómo enseñar mejor en ese caso. El resumen de cada clase que Lumi recuerda en el chat pasó de 300 a 420 caracteres para mantener mejor el hilo. `CACHE` ahora es `lumi-v67`.
- **Arreglo del peinado Medio moño (v66)**: el moño de arriba quedaba cortado por el borde del marco; ahora es un poco más pequeño, queda completo y tiene un brillo suave. Revisé también los 37 trajes, los 9 peinados, los 7 lentes y los 18 accesorios renderizados uno por uno.
- **Arreglo del reproductor (v65)**: corregido un error que saltaba en la consola cada vez que Lumi hablaba o te escuchaba antes de abrir el reproductor de música (intentaba ajustar el volumen de un elemento que aún no existía).
- **Minireproductor de música y videos (v62)** (`js/player.js`, `css/player.css`): botón 🎵 en la barra de arriba. Reproduce **YouTube por enlace** (videos y listas, con la API oficial), **enlaces directos** a .mp3/.mp4 y **tus archivos** del dispositivo (no se suben a ningún lado). Es flotante, **arrastrable**, minimizable (solo audio o con video) y recuerda su lugar, tu lista y el volumen. **Baja el volumen solo cuando Lumi habla o te escucha**, y Lumi y Pip tararean y bailan mientras suena. Se viste de cada tema. Los videos de YouTube necesitan internet y algunos no permiten reproducirse fuera de YouTube. Todo local, sin créditos de IA.
- **Más detalles de cada tema en lo que Lumi dice (v61)** (`js/themetalk.js`, `css/themetalk.css`): el **subtítulo** se viste según el tema (burbuja de líneas punteadas con corazón latiendo en *Kawaii*, terminal «LUMI//» con cursor y glitch en *Futurista*, cuadro de diálogo RPG con «LUMI ▶» y flechita ▼ en *Gamer*, globo de manga con destellos en *Anime*, burbuja con espumita en *Océano*, nota de cuaderno con tacita en *Café*, hoja que se mece en *Bosque*, estrellitas en *Medianoche*…) y «late» cada vez que Lumi dice algo nuevo. El **estado** habla con la voz del tema («Lista para jugar ▶ nivel 1», «SISTEMA LISTO ▸ en línea», «Lista, con cafecito en mano ☕»…), la **cajita de escribir** cambia su invitación («> escribe tu consulta_», «Susurra tu duda… 🌙»), el **título de la pestaña** lleva el emoji del tema, y el nombre de Lumi, la **barra de cariño** (segmentada en Gamer, con olas en Océano…), los **consejos**, las sugerencias al pasar el mouse y el marco de Lumi al hablar también se visten del tema. No cambia lo que Lumi dice. Todo local, sin créditos de IA.
- **Cada tema con su esencia en todo el aula (v60)** (`js/classfx.js`, `css/classfx.css`): al elegir un tema, toda la pantalla se llena de su ambiente: lluvia de corazones y brillitos (*Kawaii*), código que cae y barrido de escáner (*Futurista*), píxeles y puntos de arcade (*Gamer*), pétalos al viento (*Anime*), burbujas y olas (*Océano*), destellos dorados y un sol que respira (*Atardecer*), estrellas que titilan (*Medianoche*), vapor de café (*Café*), hojas y luciérnagas (*Bosque*) o un aire limpio y sobrio (*Profesional*). Además: criaturas que cruzan la pantalla de vez en cuando (unicornio, OVNI, delfín, mariposa…), **chispas del tema donde tocas**, una ráfaga al cambiar de tema, **marco con adornos en la pizarra** (esquinas, brillo, escáner, olas, anillo de café…), texto con el brillo del tema, un saludo de pizarra vacía con su voz («PRESS START ▶ nivel 1», «☕ Un cafecito y a aprender»…), la repisa con sus colores y chispas cuando Lumi escribe. Se apaga con «reducir movimiento» o el interruptor de detalles del tema. Todo local, sin créditos de IA.
- **Trajes completos (v59)**: pestaña *👗 Trajes* en la tienda con 16 looks que se compran una vez y cambian todo de golpe (ropa, pelo, peinado, lentes, accesorio, pestañas, pendientes, escenario y el look de Pip): Maestra, Científica, Astronauta, Colegiala, Kimono sakura, Qipao de jade, Hechicera, Princesa, Gamer, Gatita, Deportista, Detective, Jardinera, Pijamada, Navidad y Fiesta. Después puedes ajustar cualquier pieza en las otras pestañas. Todo local, sin créditos de IA.
- **Lumi cambia de aspecto con el tema (v55)** (`js/looks.js`): *Kawaii* (mejillas rosadas, ojos rosa-lila y brillitos), *Futurista* (androide: piel plateada, ojos de pantalla cian, paneles, LEDs que parpadean, auriculares y antena), *Profesional* (natural y sobrio, sin brillitos), *Gamer* (ojos lima, auriculares con micrófono y píxeles), *Anime* (ojos de cielo con brillos y sakura), *Océano* (aletas de sirena y burbujas), *Atardecer* (pecas de sol y broche de sol), *Medianoche* (luna y estrellitas), *Café* (tonos cálidos y vapor) y *Bosque* (orejas de elfa, hojitas y florcita). Todo lo que compras en la tienda (pelo, peinado, ropa, lentes, accesorios, pestañas y pendientes) se dibuja **encima** del look, así que sigue funcionando igual en cualquier tema.
- **Tanda 14 de herramientas de enseñanza (v54)**: 8 herramientas nuevas para la pizarra de Lumi — `system` (sistemas de ecuaciones con gráfica), `sequence` (sucesiones y progresiones), `areas` (área y perímetro de 7 figuras), `motion` (MRU/MRUA con gráficas), `combin` (variaciones y combinaciones con lista), `interest` (interés simple y compuesto), `verb` (conjugación con raíz y terminación) y `rounding` (redondeo en la recta numérica). Todo local, sin créditos de IA.
- **Flequillo y lentes con más detalle (v53)**: el flequillo tiene sombra en la punta, brillo en el borde, un mechón central y dos hebras que enmarcan la cara; los lentes (redondos, cuadrados y gatunos) tienen cristal con degradé, reflejos, borde interior, puente con almohadillas y patillas hacia las orejas, y el marco es más fino para que se vean más sus ojos. Todo local, sin créditos de IA.
- **Pelo con mechones y manos completas (v52)**: el pelo de atrás ahora tiene mechones, reflejos suaves, bordes más oscuros y degradé hacia las puntas (se adapta a cada peinado), las manos se ven enteras con dedos, pulgar y brillo en vez de quedar cortadas por el marco, y las sombras usan degradados más ligeros para que la animación siga fluida en el celular. Todo local, sin créditos de IA.
- **Rediseño de Lumi (v51)**: mandíbula y barbilla más redondeadas y suaves, sombra difuminada bajo el mentón y de la cabeza sobre el pecho, hombros más naturales con mangas con volumen y brillo, luz y sombra en el cuerpo y mechones laterales con volumen. Todo local, sin créditos de IA.
- **Más trajes, más temas y 2.5D con más profundidad (v50)**: 8 trajes nuevos en la tienda (*Jardinera*, *Cárdigan*, *Qipao*, *Pijama de estrellas*, *Traje mágico*, *Chaqueta cyber*, *Vestido de gala* y *Gabardina detective*) en 17 colores, y 5 **temas** nuevos (*Océano*, *Atardecer*, *Medianoche*, *Café* y *Bosque*). El 2.5D de Lumi ahora tiene más capas: el pelo de atrás, el cuerpo, la cabeza, los accesorios, los pendientes y el ahoge se mueven a distinta profundidad, hay una luz suave sobre su cara que se desliza con el puntero o el giroscopio y su cabeza proyecta sombra sobre el pecho. Todo local, sin créditos de IA.
- **Lumi más pulida y atenta (v49)**: ojos con sombra del párpado sobre el iris, pliegue del párpado, rincón rosado y brillito que titila; brillo en la nariz, sombra suave en el mentón e interior de las orejas; el flequillo y los mechones laterales se mecen despacito. Además **te escucha mientras escribes** (mira hacia abajo, se lleva la mano a la oreja y a veces te anima) y **te recibe cuando vuelves a la pestaña** tras un rato. Todo local, sin gastar créditos de IA.
- **Look nuevo de Lumi (v48)**: en la tienda hay pestañas *Pestañas* (largas, mariposa, brillantes) y *Pendientes* (perlas, estrellas, corazones, aros, cristal), más dos peinados (*Ondas* y *Trenza lateral*). Al estrenar algo hace pose de modelo (vuelta, se echa el pelo o te encanta). Y celebra sus **aniversarios contigo** (7, 30, 100, 200 y 365 días) y tus **rachas** (3, 7, 14, 30, 60 y 100 días) con monedas de regalo.
- **Lumi más bella y con más personalidad (v47)**: aura de luz suave que respira detrás de ella, destellitos que brillan en su pelo, sombra lavanda en los párpados, brillo en las mejillas y los labios y un cuello más natural. Tiene **gustos propios** (el 7, el té con alfajor, las estrellas, el violeta…) que cuenta cuando está tranquila (14 frases nuevas), se echa el pelo hacia atrás, te piropea y hace travesuras. La IA ahora tiene su muletilla «¡Brillemos!» y felicita citando lo concreto que lograste.
- **Lumi más viva (v46)**: ahora **Lumi y Pip interactúan**: Lumi mira a Pip y comenta sus travesuras (aplaude sus acrobacias, se ríe de su hipo, se sorprende si estornuda…), y la sigue con la mirada mientras juegas «¡Atrápame!». Además, cuando está sola hace cosas nuevas: toma té, lee, garabatea, mira su reloj, se ajusta los lentes y se enternece (6 reacciones nuevas con sus frases). Todo local, sin créditos de IA.
- **Nivel de amistad con Pip (v45)**: Pip gana puntos cuando la tocas, la mimas, la arrastras, le das de comer y juegas «¡Atrápame!». Hay 8 niveles (Curiosa, Amiguita, Compañera, Mejor amiga, Aventurera, Estrella brillante, Leyenda y Guardiana de Lumi); al subir hace una acrobacia y te regala monedas. Toca a Pip para ver tu nivel y cuánto falta. Además te saluda al abrir la app y se asoma curiosa cuando acercas el mouse.
- **Juego «¡Atrápame!» (v44)**: de vez en cuando Pip te reta (o cada 8 toques que le des): salta por toda la pantalla y tienes que tocarla. +2 🪙 por cada atrapada y +8 🪙 de bonus si la atrapas 3 veces; si no, ¡Pip gana! También le puede dar hipo. Todo local, sin créditos de IA.
- **Pip más travieso (v43)**: ahora puedes **arrastrar a Pip** por la pantalla (al soltarla vuelve rebotando a su lugar), **mantenerla presionada** para que ronronee, y **darle de comer** desde la pestaña *Pip: comida* de la tienda (galleta, fresita, helado, pizza, pastel, té de burbujas; cuestan monedas y le suben el cariño). Cada 5 premios hace una acrobacia especial y si le das demasiado seguidos se pone llenísima. De noche (23:00–6:00) se le cierran los ojitos más seguido.
- **Tiendita de Pip y más vida (v42)**: tres pestañas nuevas, *Pip: color* (dorado, rosita, celeste, menta, violeta, galaxia, fuego, arcoíris), *Pip: gorros* (fiesta, florcita, gorra, navideño, aureola, mago, birrete, corona) y *Pip: extras* (moñito, cascabel, bufanda, lentes de sol, globito, audífonos, capa de héroe). Al ponérselos hace una pirueta y comenta su look. Trucos nuevos: saluda, manda besitos, rebota, se estira, y se asombra cuando Lumi está pensando.
- **Pip con vida (v41)**: la estrellita ahora parpadea, bate las alas (más rápido cuando Lumi habla, lento si duerme), te sigue con la mirada, pone caras (feliz, sorprendida, tímida, dormida con zzz) y hace trucos solita (vueltas, saltos mortales, se esconde y se asoma, canta, estornuda, se marea). Copia las reacciones de Lumi y, si la tocas, responde distinto según cuántas veces la toques; con 10, 25, 50 y 100 toques se pone cariñosa. Todo local: no gasta créditos de la IA.
- **Lumi con más vida (v38)**: te sigue con la mirada (mouse o dedo) cuando no está hablando; tiene un **humor del día** (juguetona, tranquila, enérgica, curiosa o cariñosa) que cambia lo que hace sola; te saluda distinto en fechas especiales y si faltaste 3 días o más («te extrañé»); y reacciona a lo que pasa en la app: nuevo chat, detenerla, quedarse sin internet y volver. Todo local, sin gastar créditos de la IA.
- **Más personalidad (v37)**: 10 reacciones nuevas (`sigh`, `huff`, `tease`, `sneeze`, `hum`, `peek`, `flex`, `laugh`, `shrug`, `party`), más frases y datos curiosos que no se repiten seguidos, más cosas que hace sola cuando la dejas tranquila (tararea, suspira, se asoma, se ríe, estornuda muy de vez en cuando), y cada 25 minutos te recuerda estirarte y tomar agua. La IA también conoce las reacciones nuevas y las usa en clase.
- **Lumi más expresiva (v36)**: mira hacia la pizarra cuando señala o explica (según dónde esté colocada: izquierda, derecha, arriba, abajo o flotante; en el celular mira hacia abajo), el rubor de las mejillas cambia con su ánimo y su marco tiene un aro de luz suave cuando habla o piensa (se apaga con «reducir movimiento»).
- **Avatar más vivo (v35)**: parpadeo natural (tiempos al azar, a veces doble, lento si tiene sueño, y no parpadea con los ojos cerrados de alegría), micro-movimientos de la mirada y parpadeo al girar los ojos, y cejas que suben al preguntar (una sola ceja) o exclamar. Todo se calcula en el navegador, sin gastar créditos de la IA.
- **Chats con contexto propio (v34)**: cada chat guarda sus mensajes y Lumi solo recibe el historial del chat activo, así que ya no se mezclan. Si recargas, la app te avisa «Continuando: …» y sigues donde quedaste; **Nuevo chat** empieza de cero. En 📖 **Mis chats** puedes retomar cualquiera (sin voz al reabrirlo) o borrarlo. Si cambias de chat mientras llega una respuesta, esta se guarda en su chat original y no se cuela en el actual.
- **Método de enseñanza v33**: enganche → idea intuitiva → ejemplo resuelto → práctica gradual (contigo y luego solo) → error común → resumen. Lumi se adapta con tu **rendimiento reciente** (aciertos y temas con errores, guardado solo en tu navegador, sin llamadas extra a la IA), guía tus errores con pistas en vez de dar la solución de golpe y varía la posición de la respuesta correcta en los quiz.
- Fórmulas con KaTeX, desarrollo paso a paso, tablas y gráficos con ejes, puntos, asíntotas y áreas sombreadas.
- Lumi con expresiones, gestos continuos y efecto 2.5D (mueve el mouse o el dedo).
- **Tienda**: ganas monedas por cada clase y compras pelo, peinados, ropa, lentes, accesorios, fondos y pizarras (`js/shop.js`).

## Dibujos en la pizarra
Pide "explícame las células con dibujos". Gemini genera ilustraciones SVG del tema (con rótulos) que se dibujan como trazos de tiza, y puede construirlas por partes durante la explicación. Para dibujos más detallados usa el modelo `gemini-2.5-pro` en Ajustes.

## Lumi 2.5D: personalidad y juegos
La profesora es un avatar anime 2.5D en SVG (capas con parallax, pelo con física, sincronía labial). Se personaliza en la tienda. Interactúa con ella:
- **Toca la cara**: reacciona distinto cada vez (risa, sorpresa, beso, vergüenza, presumida…) y dice una frase. Con voz activada, también la dice en voz alta.
- **Mantén presionada la cabeza**: se deja acariciar.
- **Toca el cuerpo**: choca los cinco, baila o se pone presumida.
- **Toca a su estrellita (Pip)**: salta y da vueltas.
- **Toca muchas veces seguidas**: ¡se marea!
- Si la dejas sola un rato, bosteza y se duerme (💤); al tocar la pantalla se despierta asustada.
- Mientras explica: gestos, cejas y cabeza con rebote al ritmo de las palabras (más fuerte en ! y ?).
- **Voz expresiva**: elige sola la mejor voz en español de tu dispositivo (natural/neuronal, femenina y de tu región), divide lo que dice en frases, sube el tono en las preguntas, acelera en las exclamaciones, hace pausas y cambia el tono según su ánimo. En Ajustes puedes elegir voz, velocidad y tono, y probarla con «Probar voz».
- **Gestos según lo que dice**: señala cuando dice «mira/aquí», levanta el dedo con «ojo/cuidado», aplaude al felicitar, saluda con «hola», asiente con «claro», niega con «no», piensa con las preguntas y abre los brazos con las exclamaciones.
- **Vínculo y racha**: la barra 💖 bajo su nombre sube con las clases, los aciertos del quiz y los mimos; cada nivel da monedas y una celebración. Si estudias días seguidos, ella lo nota (🔥). 3 aciertos seguidos = racha con bonus.
- **Te escucha**: mientras escribes, te mira y asiente; al usar el micrófono se inclina a escucharte. Si cambias de ropa o pelo en la tienda, da una vuelta para presumir.
- Reacciones disponibles para la IA (`react`): giggle, gasp, proud, think, oops, nod, love, idea, cheer, wow, smug, shy, dance, dizzy, kiss, applause. Gestos (`gesture`): open, point, think, wave, shrug, cheer, hips, wide, present, clap. Expresiones (`mood`): happy, think, surprise, wink, neutral, excited, smug, shy. Todo está en `js/avatar.js` (`EX`, `RX`, `AN`, `QUIPS`).

## Hologramas 3D (`js/holo.js`, `css/holo.css`)
Lumi puede proyectar un **holograma 3D** en la pizarra (`{"t":"holo",...}`) para explicar un objeto por partes. El alumno puede: girar y hacer zoom (arrastrar / pellizcar), **separar las partes** (💥), **cortar** el objeto (✂️), alternar **holograma / sólido**, mostrar u ocultar **capas** y **tocar cada parte** para leer su explicación (con botón para preguntarle más a Lumi). También hay un mini-juego «🎯 ¿Dónde está?» (con puntaje, racha y monedas), un **🎓 Recorrido guiado** (Lumi recorre cada parte y la lee en voz alta si la voz está activada) un **🏫 Modo clase** (presenta todas las partes en voz alta y luego hace un quiz de 4 preguntas con bonus), y **📸 Guardar** para descargar el holograma como PNG. La cámara se centra sola en la parte elegida.
La pestaña **🔮 Hologramas** de Herramientas trae 18 figuras prediseñadas (sólidos platónicos, cubo, cilindro·esfera·cono, toro, átomo, agua, ADN, sistema solar, Tierra por capas, cristal de sal, célula, corazón, volcán, motor, neurona, ojo, flor y célula vegetal) que se generan en el navegador: **no gastan créditos de Gemini**. El botón **🔮 Holograma** junto al cuadro de texto (y «Crear» en la pestaña) le pide a Lumi un tema nuevo: ella lo construye y lo explica. Solo eso o «Pedirle a Lumi» hace una consulta.

### Progreso
La pestaña 🔮 marca cada figura con ✓ (vista) o ⭐ (clase perfecta) y resume cuántas viste, cuántas clases completaste y tu porcentaje de aciertos (se guarda solo en este navegador). El bonus de 5 monedas del Modo clase se gana **una sola vez por figura**, la primera vez que aciertas todo.

### Comparar hologramas
La pestaña **⚖️ Comparar hologramas** muestra dos figuras lado a lado (por ejemplo célula animal vs vegetal): giran a la vez, al tocar una parte se resalta la equivalente en el otro modelo y un panel lista lo que tienen **en común** y lo que es **solo de cada uno**. Lumi también puede crearlas (`{"t":"holocmp","a":{holo},"b":{holo}}`): en el botón **🔮 Holograma** rellena «Comparar con…».

## El aula
Recuadros de definición, ejemplo, "ojo", resumen y "tu turno"; listas que se escriben solas; quiz de comprensión (con monedas); borrado de la pizarra; visor 3D interactivo (superficies, sólidos, moléculas, sistema solar); botón "Tengo una duda"; y **exportar la pizarra a PNG, JPG o PDF**.

## Cómo funciona
Pregunta → `app.js` arma el contexto (nivel, rendimiento, historial del chat, pizarra actual e indicaciones según lo que pides) → Gemini responde un JSON con pasos (`say` + elementos de pizarra) → cada paso se escribe en la pizarra mientras la profesora lo dice con voz y lip-sync.

## Ideas para seguir
Voz neuronal (Google Cloud TTS / ElevenLabs), Gemini Live API para conversar en tiempo real, más gestos y expresiones, subir fotos de ejercicios, exportar apuntes a PDF, cuentas y progreso por alumno.
| `Foto` | Botón para subir/tomar fotos: Lumi las lee con Gemini y enseña lo que ahí aparece. |

## Novedades v6
- **Temas**: kawaii, futurista, profesional, gamer y anime (icono de paleta). Cambian colores, pizarra y fondo de Lumi. Los archivos: `js/theme.js` y `css/ui.css`.
- **Pantalla completa** (icono de expandir). En iPhone, usa «Añadir a pantalla de inicio»: la app trae `manifest.webmanifest`.
- **Lumi 2.5D renovada**: nuevo diseño, mascota flotante, decoración por tema, accesorios nuevos en la tienda y boca sincronizada con la voz.

## Novedades v7
- **Fórmulas sin símbolos raros**: `js/mathfix.js` repara el LaTeX que llega de la IA (barras dobles, `\( \)`, `$$`, LaTeX sin `$`) y se aplica a *todos* los textos (títulos de recuadros, pies de dibujo, gráficas, rótulos SVG, subtítulos). Donde no se puede dibujar con KaTeX (rótulos de dibujos) se convierte a Unicode (½, ×, √, x²). La voz lee «un medio», «x al cuadrado», etc.
- **Instalable como app (PWA)**: botón de instalar en la barra, `sw.js` y manifiesto con iconos maskable.
- **Sin internet**: la app abre offline; el avatar 2.5D, la tienda, los temas y las **clases guardadas** (icono del libro 📖) funcionan sin conexión. Preguntar algo nuevo sí necesita internet (Gemini). Las librerías externas (KaTeX, three.js) se guardan tras la primera visita online.
- **Avatar 2.5D**: capas de profundidad (flequillo, mechones, brillo de luz, mascota y fondo se mueven distinto), giroscopio en el celular, pelo con física de resorte, boca con dientes y lengua, sombras bajo el flequillo y la cabeza, luz de borde.
- Al cambiar archivos sube `CACHE` en `sw.js` (por ejemplo `lumi-v8`) para que los usuarios reciban la actualización.

## Novedades v7.1 · Servicios y modelos de IA
- **Ajustes → Servicio de IA**: Gemini, Claude (Anthropic), OpenAI, OpenRouter, Groq, Ollama/LM Studio local u otro servicio compatible con OpenAI (con su URL base). Cada servicio guarda su propia key y modelo.
- **Cargar modelos**: pega la key y la app pide al servicio la lista de modelos que *esa key* puede usar; eliges en un menú o escribes uno a mano. Sirve también para probar que la key funciona.
- **Autocorrección**: si el modelo guardado ya no existe (404, como `gemini-2.5-flash` en keys nuevas), Lumi busca sola el mejor disponible, continúa la clase y lo deja guardado.
- Modelo por defecto de Gemini: `gemini-3.8-flash`.
- Nota: algunos servicios bloquean llamadas desde el navegador (CORS); si pasa, prueba con OpenRouter o Groq.

## Novedades v11
- **Diseño** (icono de panel en la barra): elige dónde está Lumi (izquierda, derecha, arriba, abajo, flotante u oculta), su tamaño, el tamaño de la letra y los dibujos de la pizarra, la letra, el marco, las esquinas, el espaciado, el ancho, la barra de botones y qué mostrar. Incluye combinaciones listas. Archivos: `js/layout.js`, `css/layout.css`.
- **Tienda ampliada**: 10 colores de pelo, 3 peinados (corto, cola alta, medio moño), 14 prendas (buzos, marinero, kimono, traje espacial, chaqueta escolar, vestidos…), 4 lentes, 10 accesorios (conejo, birrete, bruja, antenas, headset…), 8 fondos de Lumi, 8 pizarras y **11 escenarios** para toda la pantalla.
- Sube `CACHE` en `sw.js` al cambiar archivos (ahora `lumi-v12`).

## Novedades v12 · Herramientas de estudio (🧰)
Botón 🧰 en la barra. Funciona sin internet. Archivos: `js/tools.js`, `css/tools.css`.
- **Graficar**: hasta 4 funciones, derivada, tabla de valores, zoom con pellizco, toca para leer valores.
- **Calculadora científica** (DEG/RAD, historial, `2x`, `5!`, `%`, `|x|`).
- **Ecuaciones**: cuadrática (con vértice), sistema 2×2 y raíces de cualquier f(x).
- **Tarjetas** con repaso espaciado (dan monedas), **Pomodoro** (da monedas), **Conversor** de 9 magnitudes, **Notas** (cuánto necesito en el final) y **Apuntes**.
- Botón «Pedirle a Lumi que lo explique» en varias herramientas.
- `CACHE` en `sw.js` ahora es `lumi-v13`.

## Novedades v13
En la caja 🧰: **⚛️ Tabla periódica** (118 elementos, buscador, filtro por familia, configuración electrónica, botón para pedirle a Lumi) y **🧊 Gráfico 3D** de superficies z = f(x, y) con three.js (rango, detalle, malla, giro automático, ejemplos). Archivos: `js/tools2.js`, `js/graf3d.js`. `CACHE` ahora es `lumi-v14`.

## Novedades v14 · Más herramientas de enseñanza para Lumi
Lumi ahora puede usar 10 elementos nuevos en la pizarra (`js/teach.js`, `css/teach.css`; están explicados en el prompt de `js/gemini.js`):
`timeline` (línea de tiempo), `concept` (mapa conceptual), `compare` (A vs B), `numline` (recta numérica con intervalos), `flow` (procesos y ciclos), `chart` (barras y torta) y, para practicar, `match` (unir parejas), `blank` (completar), `tf` (verdadero/falso) y `flash` (tarjeta de repaso). Los juegos dan monedas y suben el vínculo igual que el quiz. `CACHE` ahora es `lumi-v15`.

## Novedades v15 · Seis herramientas de enseñanza más
`geo` (triángulos, rectángulos, círculo, trapecio… con medidas), `fraction` (fracciones en barra o torta, con comparación), `code` (código con explicación línea por línea y salida), `vocab` (vocabulario con audio en el idioma), `order` (juego de ordenar pasos) y `element` (ficha de elemento químico). `CACHE` ahora es `lumi-v16`.

## Novedades v16 · Cinco herramientas de enseñanza más
`forces` (diagrama de cuerpo libre con fuerza neta), `circuit` (circuitos en serie y paralelo), `reaction` (ecuaciones químicas que cuentan los átomos y dicen si están balanceadas), `unitcircle` (círculo unitario con valores exactos de seno, coseno y tangente) y `music` (pentagrama con botón para escuchar las notas). `CACHE` era `lumi-v17`.

## Novedades v17 · Seis herramientas de enseñanza más
Arreglo del ritmo (pizarra y voz siempre sincronizadas, `js/voice.js` y `play()` en `js/app.js`) y nueva tanda en `js/teach2.js` + `css/teach2.css`: `eqsteps` (ecuaciones paso a paso con la operación de cada línea), `coords` (plano cartesiano con puntos, segmentos, polígono y medidas), `venn` (Venn de 2 o 3 conjuntos), `tree` (árbol de probabilidad que multiplica ramas y comprueba que sumen 1), `punnett` (cuadro de Punnett con genotipos y fenotipos) y `arith` (suma con acarreos, resta y multiplicación en columna). Están explicadas en el prompt de `js/gemini.js`. `CACHE` era `lumi-v18`.

## Novedades v18 · Seis herramientas de enseñanza más (tanda 5)
`js/teach3.js` + `css/teach3.css`: `wave` (ondas: amplitud, longitud de onda, cresta y valle, con una segunda onda para comparar), `sentence` (análisis de oraciones con colores y función de cada parte), `longdiv` (división larga paso a paso, con decimales opcionales), `ph` (escala de pH con sustancias marcadas), `angles` (ángulo con su tipo, complemento y suplemento) y `stats` (media, mediana, moda y rango con diagrama de puntos). Explicadas en el prompt de `js/gemini.js`. `CACHE` era `lumi-v19`.

## Novedades v19 · Seis herramientas de enseñanza más (tanda 6)
`js/teach4.js` + `css/teach4.css`: `parts` (dibujos ya hechos con partes rotuladas: célula animal, célula vegetal, flor y capas de la Tierra; se pueden resaltar partes, ocultar rótulos para preguntar «¿qué parte es?» o cambiar su texto), `geocoords` (planisferio con latitud y longitud, sin países), `lens` (lente convergente o divergente con diagrama de rayos e imagen calculada), `bonds` (H2, O2, N2, Cl2, HCl, H2O, CO2, NH3, CH4 y NaCl con enlaces y electrones), `probdice` (dados y monedas con botones para lanzar y comparar con lo esperado) y `fractionline` (fracciones y decimales en la recta). Explicadas en el prompt de `js/gemini.js`. `CACHE` ahora es `lumi-v20`.

## Novedades v21 · Pizarra sincronizada con la voz + brillito ✨
**Antes:** la pizarra se dibujaba a su propio ritmo mientras Lumi hablaba por otro lado, así que no coincidían (sobre todo con las herramientas nuevas, que escriben por partes).
**Ahora** (`js/sync.js`, `css/sync.css`, cambios en `js/voice.js`, `js/app.js`, `js/gemini.js`):
- **Cada elemento aparece cuando Lumi llega a su frase.** Lo que dice en cada paso se parte en frases y los elementos de la pizarra se reparten entre ellas, en orden. Nada se escribe antes de que ella lo mencione.
- **Lo que se escribe por partes va al ritmo de la profesora**: líneas de una resolución, ítems de una lista, eventos de una línea de tiempo, líneas de código, pasos de una división larga, trazos de un dibujo… Con una frase por parte, cada línea aparece justo cuando ella la explica (si empieza con una frase de introducción, las partes van después). El Director no necesita que cada herramienta lo sepa: «retiene» sus temporizadores mientras se dibuja y los reprograma al ritmo de la voz.
- **Brillito que muestra de qué habla** (`#spot`): un contorno luminoso con destellos rodea lo que se acaba de escribir y se desliza de una parte a otra; en los dibujos sigue el trazo que se está haciendo. Se puede desactivar en **Ajustes → «Resaltar con un brillito…»**.
- **Subtítulo frase a frase**: en el panel de Lumi se muestra la frase que está diciendo ahora.
- **Funciona con cualquier voz**: usa el inicio real de cada frase (`onstart`), las palabras (`onboundary`) cuando el navegador las da y, si no, una estimación que se calibra sola con lo que tarda de verdad la voz. Con la voz apagada va al ritmo de lectura.
- **Parar** detiene también la pizarra y apaga el brillito. «Borrar» ya no gasta una frase: actúa justo antes del elemento siguiente.
- El prompt de la profesora (`js/gemini.js`) ahora le pide hablar en el mismo orden en que escribe y dedicar una frase por elemento (y por parte). Las clases guardadas antiguas también se sincronizan.
- `CACHE` ahora es `lumi-v21`.

## Novedades v23 · Seis herramientas de enseñanza más (tanda 8)
`js/teach6.js` + `css/teach6.css`: `percent` (cuadrícula de 100 y cálculo del porcentaje), `clock` (reloj analógico y digital, con tiempo transcurrido), `balance` (balanza para ecuaciones), `calendar` (mes con días marcados), `wordparts` (prefijo, raíz, sufijo o sílabas con su significado) y `array` (arreglo de puntos para multiplicar y propiedad distributiva). Explicadas en el prompt de `js/gemini.js`. `CACHE` ahora es `lumi-v23`.

## Novedades v24 · Ocho herramientas de enseñanza más (tanda 9)
`js/teach7.js` + `css/teach7.css`: `scatter` (dispersión con recta de tendencia y correlación), `rtri` (triángulo rectángulo con Pitágoras, sen, cos y tan), `conjugate` (conjugación con la terminación resaltada), `pattern` (sucesiones aritméticas y geométricas con fórmula del término n), `layers` (capas apiladas), `areamodel` (multiplicar partiendo los factores, también con álgebra), `atom` (átomo de Bohr con electrones de valencia) y `ratio` (razones equivalentes y reparto proporcional). Explicadas en el prompt de `js/gemini.js`. `CACHE` ahora es `lumi-v24`.

## Novedades v25 · Tanda 10: herramientas de DIBUJO
`js/teach8.js` + `css/teach8.css`. `scene` es un **lienzo libre** (100 × 75) donde Lumi dibuja con formas, curvas suaves, flechas, arcos, textos y emojis que aparecen en orden con trazo animado; es más simple y fiable que escribir SVG a mano (`draw` sigue existiendo para dibujos muy detallados). Además: `solid` (cubo, prisma, cilindro, cono, pirámide y esfera con medidas, volumen y área), `cycle` (ciclos circulares), `breakdown` (expresión partida en piezas con llaves), `barmodel` (modelo de barras), `objects` (objetos para contar, agrupar y tachar), `tilegrid` (cuadrículas, mapas y tableros) , `comic` (historieta de paneles) y `jumps` (saltos en la recta numérica). `diagram` ahora admite rombos de decisión y emojis en los nodos. Explicadas en el prompt de `js/gemini.js`. `CACHE` ahora es `lumi-v25`.

## Novedades v26 · Tanda 11: plantillas de dibujo y gráficos listos
`js/teach9.js` (usa los estilos de `css/teach8.css`): `anatomy` (corazón, ojo, planta, sistema solar y volcán ya dibujados con partes rotuladas; se pueden resaltar, mostrar solo algunas o convertir en un ejercicio con números), `moonphases` (fases de la Luna, norte o sur), `slope` (pendiente de una recta), `transform` (traslación, reflexión, giro y homotecia), `lever` (palanca y torque), `projectile` (tiro parabólico), `boxplot` (caja y bigotes con atípicos), `circleparts` (partes de la circunferencia) y `regpoly` (polígonos regulares). Explicadas en el prompt de `js/gemini.js`. `CACHE` ahora es `lumi-v26`.

## Novedades v27 · Dibujos SVG con mucha más potencia
**`scene` v2** (`js/teach10.js`, `css/teach10.css`; reemplaza al `scene` de `teach8.js`, que sigue ahí como respaldo y todo lo que ya funcionaba se ve igual):
- **20 figuras ya dibujadas** (`stamp`): sol, luna, nube, nube con lluvia, árbol, pino, casa, montaña, persona, gota, flor, pez, pájaro, corazón, estrella, cohete, barco, manzana, libro y bombilla. Se ven mucho mejor que dibujarlas con formas sueltas.
- **Fondos listos** (`bg`): `day`, `night`, `sunset`, `sea`, `space` y `room` (además del tinte de color de siempre).
- **Acabado**: degradados (`grad` + `gd`), sombra suave (`sh`), colores `#rrggbb` y más nombres de color, girar/escalar/voltear cualquier forma (`rot`, `sc`, `flip`), grupos con transformación (`group`) y repetición (`rep`).
- **Formas nuevas**: `path` (comandos SVG), `star`, `ngon`, `wave`, `spiral`, `bubble` (globo de diálogo), `label` (punto con línea y rótulo), `dim` (cota de medida) y sectores (`arc` con `pie`). Texto de varias líneas. Lienzos `wide`, `square` y `tall` (`ratio`).
- **Animaciones en bucle** (`anim`): float, bounce, spin, pulse, blink, sway, twinkle, drift y flow.
- **Sincronía con la voz**: las formas ya no usan retrasos de CSS sino temporizadores agrupados por `at`, así el Director (`js/sync.js`) las reparte entre las frases de Lumi (una frase por grupo) y el brillito sigue el trazo; `scene` cuenta como dibujo en `sync.js`.

**`draw` (SVG escrito a mano)** mejorado en `js/board.js`: ahora admite `<filter>` con `feDropShadow` y `feGaussianBlur`, `<clipPath>`, `<use href="#id">` (internos), `fill-rule`, `stroke-dashoffset`, más colores por clase (`f-gold`, `s-green`…), animaciones por clase (`an-float`, `an-spin`…) y sombra (`sh`); el texto lleva un halo para leerse sobre cualquier dibujo, lo que está dentro de `defs` ya no se anima como trazo y los límites suben a 60 000 caracteres y 700 elementos.

El prompt de la profesora (`js/gemini.js`) explica todo esto y pide dibujos en capas y con buena composición. `CACHE` ahora es `lumi-v27`.

## Novedades v39 · Tanda 12: la tiza de la profe y más
`js/teach11.js` + `css/teach11.css`:
- **`pen`**: encierra, subraya, enmarca o tacha algo que ya está escrito en la pizarra, sin escribir nada nuevo (`target` cuenta desde el último elemento; `line` apunta a una línea de un `steps`; `note` pone un rótulo). Así Lumi puede señalar el resultado, el error o el dato clave como un profe real.
- **`factortree`**: árbol de factores primos (2 a 9999) con exponentes y, con `m`, MCD y MCM.
- **`units`**: escalera de conversión de unidades de longitud, masa y capacidad (y áreas/volúmenes con `power`).
- **`vectors`**: suma de vectores punta con cola con componentes, módulo y ángulo.
- **`truth`**: tablas de verdad con tautología / contradicción / contingencia.
**Arreglo:** `steps` con `lines` + `notes` (desarrollo en LaTeX) había dejado de dibujarse porque `teach5.js` lo redefinió para `items`; ahora si llega `lines` se usa el método clásico y los dos formatos conviven.
`CACHE` ahora es `lumi-v39`.

## Novedades v40 · Tanda 13
`js/teach12.js` + `css/teach12.css`: `scinot` (notación científica moviendo la coma), `bases` (binario, octal, hexadecimal y cualquier base de 2 a 16, con divisiones y valor posicional), `quad` (ecuación de segundo grado con discriminante, vértice y parábola), `tangent` (de la secante a la tangente: la derivada como límite), `riemann` (integral como suma de rectángulos, con error frente al área exacta) y `syllables` (sílabas, sílaba tónica y aguda/llana/esdrújula). `CACHE` ahora es `lumi-v40`.

## Novedades v54 · Tanda 14
`js/teach13.js` + `css/teach13.css` (se enganchan a `Board.draw` encima de `teach12.js`; el texto de la IA siempre se inserta como texto):
- **`system`**: dos ecuaciones lineales con reducción paso a paso, comprobación y gráfica con el punto de corte; detecta rectas paralelas (sin solución) y coincidentes (infinitas).
- **`sequence`**: sucesión aritmética (`d`) o geométrica (`r`): términos con la operación entre ellos, término general, un término lejano (`find`), suma de los n primeros y suma infinita si |r| < 1.
- **`areas`**: rectángulo, cuadrado, triángulo, círculo, trapecio, paralelogramo y rombo dibujados con sus medidas, con área y perímetro (fórmula sustituida).
- **`motion`**: cinemática con gráficas posición–tiempo y velocidad–tiempo (MRU si `a` = 0, MRUA si hay aceleración), valores finales y desplazamiento.
- **`combin`**: variaciones, combinaciones y variaciones con repetición (n ≤ 20, con BigInt para resultados exactos) y, si son pocas, la lista de todas las posibilidades.
- **`interest`**: interés simple vs compuesto con gráfica comparada, fórmulas con los números, tabla por años y diferencia final.
- **`verb`**: tabla de conjugación con la raíz y la terminación resaltadas; formas irregulares marcadas; sirve para cualquier idioma.
- **`rounding`**: redondeo sobre la recta numérica: entre qué valores está, cifra que decide y flecha hacia el resultado (de decenas de millar a diezmilésimas).
El prompt de la profesora (`js/gemini.js`) documenta las 8 herramientas y cuándo usarlas. `CACHE` ahora es `lumi-v54`.

## Novedades v56 · Tanda 15
`js/teach14.js` + `css/teach14.css` (encima de `teach13.js`): `periodic` (tabla periódica completa con familias, grupos y períodos resaltables), `histogram` (datos agrupados con tabla de frecuencias y clase modal), `fracop` (suma, resta, producto y división de fracciones paso a paso, con barras), `energy` (barras de energía cinética y potencial; conservación o pérdida por rozamiento) y `complex` (plano de Argand con módulo, argumento, suma, producto y conjugado). `CACHE` ahora es `lumi-v56`.

## Novedades v57 · Gestos y detallitos según el tema 🎀
`js/themefx.js` + `css/themefx.css`. Lumi cambia de personalidad con el tema (todo local, **no llama a la IA ni gasta créditos**):
- **Partículas suaves** siempre presentes (solo CSS): corazoncitos y brillitos en kawaii, bits de código y un escáner que baja en futurista, píxeles de colores en gamer, pétalos en anime, burbujas en océano, luz dorada en atardecer, estrellitas en medianoche, vapor en café y luciérnagas y hojas en bosque.
- **Gestos y detallitos al azar** (en promedio uno cada 30–40 s, solo si estás usando la app y Lumi está tranquila): reacciones que ya existían (beso, twirl, flex, sip, peek…) combinadas con adornos y frases propias del tema: «+10 XP» y «LEVEL UP!» en gamer, glitch holográfico y «SYS OK» en futurista, unicornio y gatito en kawaii, estrella fugaz y búho en medianoche, mariposa y ardilla en bosque, delfín y tortuga en océano, etc.
- **Al cambiar de tema**, Lumi lo celebra a su manera.
- Se apaga en **Ajustes → Detalles y gestos de Lumi según el tema**; también se desactiva con «reducir movimiento» del sistema y se pausa con la pestaña oculta. Cada tema tiene 12–15 gestos (más el de entrada); también hay lluvia de partículas y ondas expansivas, y al **tocar a Lumi** a veces hace además algo de su tema. Para agregar gestos nuevos: `ACTS`, `MORE` y `ENTER` en `js/themefx.js`.
`CACHE` ahora es `lumi-v58` (v58 sumó más gestos por tema, lluvia de partículas, ondas y gestos al tocar a Lumi).

## Novedades v63 · Más detalles por tema 🎀
`js/themefx.js` + `css/themefx.css` (todo local, **cero créditos de IA**; se apaga con «Detalles y gestos de Lumi según el tema»):
- **Pastilla de «pensando…»** sobre Lumi mientras espera la respuesta, con estilo propio por tema (`PROCESANDO ▮▮▯` en futurista, `LOADING ▰▰▱` en gamer, «buceando ideas 🫧» en océano, «preguntándole al búho 🦉» en bosque…).
- **Ecualizador** de 7 barritas mientras Lumi habla (colores y forma por tema: pixelado en gamer, burbujas en océano, etc.).
- **Aciertos y fallos**: cuando un ejercicio de la pizarra se marca bien o mal, Lumi celebra o consuela a la manera de su tema (lluvia de corazones en kawaii, «PERFECT!» en gamer, «Game over… ¡revancha!», etc.).
Las chispas al tocar ya las hacen `classfx.js`, así que no se duplicaron. `CACHE` ahora es `lumi-v63`.

## Novedades v64 · Tanda 16
`js/teach15.js` + `css/teach15.css` (encima de `teach14.js`; el texto de la IA siempre se inserta como texto):
- **`inequality`**: inecuación lineal `ax + b (<, ≤, >, ≥) c` paso a paso, avisa cuando el signo se invierte (a negativo), recta numérica con círculo lleno/vacío, intervalo y comprobación.
- **`gcdlcm`**: m.c.d. y m.c.m. de 2 o 3 números con tabla de exponentes primos (mínimos y máximos resaltados) y control m.c.d. × m.c.m.
- **`powers`**: leyes de las potencias (producto, cociente, potencia de potencia, exponente cero y negativo) con los factores expandidos.
- **`temp`**: termómetro con °C, °F y K, y la conversión con las fórmulas sustituidas.
- **`money`**: descompone una cantidad en billetes y monedas (valores de ejemplo) y calcula el vuelto si hay `pay`.
Documentadas en el prompt (`js/gemini.js`). `CACHE` ahora es `lumi-v64`.
