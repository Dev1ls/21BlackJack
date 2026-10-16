# Práctica de Blackjack

**En pocas palabras:** es un entrenador para el celular. Sirve para practicar el conteo Hi-Lo, ver el conteo real y ensayar la jugada de estrategia básica (pedir, quedarte, doblar, separar).

No hay servidor ni base de datos. La sesión de práctica queda guardada en tu navegador y funciona sin conexión.

> **18+.** Esto es un ejercicio. No lo uses en un casino, en una mesa en vivo ni para apostar dinero real. No promete ganancias. Usar un dispositivo para contar cartas puede estar prohibido y puede violar las reglas del local.

Si el juego te está afectando, pide ayuda: [Jugadores Anónimos Chile](https://www.jugadoresanonimoschile.cl/) (+56 9 8342 9868), [autoexclusión de la SCJ](https://autoexclusion.scj.gob.cl/), [FEJAR](https://fejar.org/) (900 200 225) o 1-800-GAMBLER en Estados Unidos.

---

## ¿Para quién es esto?

Para alguien que ya sabe las reglas y quiere **entrenar** en casa:

- Practicar el **conteo de cartas** (sistema Hi-Lo, explicado abajo).
- Ver una **apuesta de práctica** según el conteo del ejercicio. Son unidades de entrenamiento, no dinero real.
- Recibir una sugerencia de **qué jugada hacer** (estrategia básica con supuestos fijos).
- Usar la **simulación de mesa** cuando quieras ensayar una mano con varios jugadores.
- Medirte con el **cronómetro de práctica**.

La app arranca en **español latinoamericano**. Puedes cambiar a inglés con el selector arriba a la derecha. El estilo **Fieltro** solo cambia los colores.

---

## Blackjack para principiantes (lo mínimo que necesitas)

### ¿Qué es el blackjack?

Tú y el **dealer** compiten por acercarse a **21** sin pasarte.

- Las cartas del **2 al 10** valen su número.
- **J, Q y K** valen 10.
- El **As** vale 11 o 1 (la app lo calcula sola).

En cada mano puedes, según el caso:

| Jugada | Qué significa |
|--------|----------------|
| **Pedir** | Te dan otra carta. |
| **Quedarte** | No pides más; juegas con lo que tienes. |
| **Doblar** | Duplicas la apuesta de práctica y recibes **una sola** carta más. |
| **Separar** | Si tienes un par (por ejemplo 8 y 8), divides en dos manos. |

La app te sugiere cuál opción usar según tus cartas y la carta visible del dealer.

### Reglas que asume el entrenador

La sugerencia está fija. No se configura por mesa:

- Varias barajas.
- El dealer se planta en todo 17, incluido el 17 blando.
- No hay rendición.

Otras reglas (dealer pide en 17 blando, doblar después de separar, rendición) pueden pedir otra jugada. La ventaja aproximada tampoco tiene en cuenta la penetración del zapato.

### ¿Qué es “contar cartas”?

En este entrenador es un **ejercicio de memoria**: anotas qué tipo de cartas ya salieron para estimar si en el zapato simulado quedan más cartas altas o más bajas.

En el sistema **Hi-Lo**:

| Cartas | Efecto en el conteo |
|--------|---------------------|
| 2, 3, 4, 5, 6 | **+1** (cartas “bajas”) |
| 7, 8, 9 | **0** (neutras) |
| 10, J, Q, K, As | **−1** (cartas “altas”) |

Vas sumando eso mano a mano. Eso es el **conteo corrido**.

**+6 no significa lo mismo** si todavía quedan 6 barajas o si casi no queda nada. Por eso existe el **conteo real**:

```
Conteo real = Conteo corrido ÷ Barajas que faltan
```

En el ejercicio, un conteo real más alto se muestra con una apuesta de práctica más alta. Cuando va bajo o negativo, la sugerencia baja a la mínima de práctica.

Tú vas **metiendo las cartas del ejercicio**. La app hace las cuentas.

---

## Cómo practicar (paso a paso)

Abre la app y sigue este orden. Es una mano simulada.

### Paso 1 — Barajas del zapato

Arriba verás **“Barajas del zapato”**.

- Elige cuántas barajas quieres ensayar. Lo habitual en la práctica es **6 u 8**.
- Ajusta el número con **−** y **+**.

> Si estás empezando, usa **8**.

### Paso 2 — Carta visible del dealer

Toca la carta **boca arriba** del dealer de la mano de práctica. La carta **oculta** no se usa para decidir la jugada.

### Paso 3 — Tus 2 cartas (panel “Mis cartas”)

Toca tus cartas en los botones. La **jugada grande** (PEDIR / QUEDARTE / DOBLAR / SEPARAR) aparece **a la derecha en desktop** o con **“Ver jugada”** abajo en el celular.

### Paso 4 — Tu turno de práctica

- **PEDIR:** toca otra carta en “Mis cartas”; la recomendación se recalcula sola.
- **QUEDARTE / SEPARAR / DOBLAR:** botones en el panel derecho (o en “Ver jugada” en móvil).

El banner de fase te dice en qué momento del ejercicio estás.

### Paso 5 — Carta oculta del dealer

Cuando terminas el turno y el dealer de la simulación **voltea la oculta**, pulsa esa carta. **Solo suma al conteo**; no cambia lo que ya jugaste.

### Paso 6 — Dealer pide cartas

Agrega cada carta extra del dealer. Pulsa **“Dealer terminó”** cuando acabe.

### Paso 7 — Guardar mano

**Guardar mano** cierra la ronda en el conteo. **Nueva mano** limpia cartas pero mantiene el conteo. El historial guarda como máximo las últimas 500 manos.

### Opciones avanzadas (colapsadas)

- **Otros jugadores** y **cartas extra** — para practicar el conteo con más cartas visibles.
- **Simulación de mesa** — guarda una decisión preliminar y la compara cuando cambie el conteo.
- **Cronómetro** — límites de 10, 15 o 20 segundos para ensayar la velocidad de registro. Es un ejercicio de tiempo, no un modo de juego real.

| Botón | Para qué sirve |
|-------|----------------|
| **Guardar mano** | Cierra la mano actual, la suma al conteo y limpia las cartas para la siguiente. |
| **Nueva mano** | Limpia cartas pero **mantiene** el conteo acumulado. |
| **Deshacer última mano** | Quita la última mano que guardaste del conteo. |
| **Baraja nueva (reiniciar todo)** | Zapato nuevo: conteo a cero y se borra el historial de esta baraja. |

---

## Instalar y correr el proyecto

### Requisitos

- [Node.js](https://nodejs.org/) 22.12 o superior (hace falta para Vitest 5)
- npm (viene con Node)

### Instalar dependencias

```bash
npm install
```

### Modo desarrollo (en tu PC)

```bash
npm run dev
```

Abre en el navegador la URL que aparece (normalmente `http://localhost:5173`).

El servidor de desarrollo escucha en la red local (`host: true`) para poder abrir la práctica desde un teléfono en la misma red. Úsalo solo en un entorno de confianza. No es la configuración de un sitio público.

### Compilar para producción

```bash
npm run build
```

### Probar la versión compilada

```bash
npm run preview
```

### Correr tests

```bash
npm test
```

Prueba la lógica del conteo, la estrategia, el guardado y la entrada de cartas (por ejemplo `A,7` o `10,6,K`).

### Test de tiempo (ejercicio)

El cronómetro de la app usa presupuestos de 10, 15 y 20 segundos. El test comprueba dos cosas:

1. **Lógica instantánea** — conteo + recomendación en menos de 50 ms.
2. **Tiempo humano estimado** — un turno típico de práctica (dealer + 2 cartas) cabe en 10 s aunque vayas lento.

```bash
npm run test:timing
```

---

## Instalar en el celular (PWA)

1. Ejecuta `npm run build` y `npm run preview`, **o** sube la carpeta `dist/` a un hosting estático.
2. Abre la app en **Chrome en Android**.
3. Menú (⋮) → **Instalar app** o **Agregar a pantalla de inicio**.
4. Queda como app independiente; la interfaz se guarda offline.

Al instalarla, el nombre es **Práctica de Blackjack**.

> Los datos de las manos se guardan en el dispositivo (`localStorage`). No se envían a ningún servidor. No hay analítica ni cuentas.

Si el hosting es Netlify o Cloudflare Pages, `public/_headers` copia los headers de seguridad al sitio. En Vercel se usa `vercel.json`. En otro hosting hay que configurar los mismos headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`). La CSP no va en `index.html` porque rompería el recarga en caliente de Vite.

---

## Privacidad

No se recoge información personal en un servidor. El idioma, el estilo y la sesión de práctica viven en `localStorage` de este navegador. **Baraja nueva** borra el historial de manos. Borrar los datos del sitio en el navegador borra el resto.

---

## Tecnologías (para curiosos)

| Pieza | Uso |
|-------|-----|
| React + TypeScript | Interfaz y lógica |
| Vite | Desarrollo y build |
| Tailwind CSS | Estilos |
| vite-plugin-pwa | Instalable y offline |
| Vitest | Tests automáticos |
| localStorage | Guardar la práctica en el dispositivo |

### Estructura del código

```
src/
  components/     # Pantallas y botones
  context/        # Idioma (es / en)
  i18n/           # Textos en español e inglés
  lib/            # Conteo, estrategia y guardado
  types/          # Tipos TypeScript
  App.tsx         # App principal
  main.tsx        # Entrada
```

---

## Preguntas frecuentes

**¿Tengo que meter cada carta de la mano de práctica?**  
Solo las que quieras contar en el ejercicio. Si no la registras, no entra al conteo.

**¿Puedo usarla sin contar cartas?**  
Sí. **“Qué conviene hacer”** funciona con tus cartas y la del dealer, aunque ignores el conteo.

**¿Por qué dice “dealer” y no “crupier”?**  
En muchas explicaciones en Latinoamérica se usa “dealer”. El texto está en `src/i18n/locales.ts`.

**¿Un conteo real alto significa que voy a ganar?**  
No. La cifra de ventaja es una estimación de práctica. En una sesión corta el resultado puede salir mal igual.

**¿Se pierde todo si cierro el navegador?**  
La sesión se guarda en el dispositivo hasta que pulses **Baraja nueva**, se llene la cuota del navegador o borres los datos del sitio. Si no hay espacio, la app avisa y sigue en pantalla en lugar de quedarse en blanco.

**¿Por qué el servidor de desarrollo es visible en la red local?**  
Para abrir la práctica en el teléfono mientras programas. No lo expongas a una red que no controlas.

---

## Aviso

Herramienta de **práctica** para mayores de 18 años. No promete ganancias. No está hecha para usarse en un casino ni con dinero real.
