# Ayudante de Blackjack

**En pocas palabras:** es una app para el celular que te ayuda a llevar el conteo de cartas en una mesa de blackjack en vivo y a saber qué te conviene hacer (pedir, quedarte, doblar, separar).

No necesitas internet en el casino. No hay servidor ni base de datos. Todo queda guardado en tu navegador.

> **Aviso:** esto es para aprender y practicar. No te garantiza ganar. La suerte, las reglas de la mesa y tus errores también cuentan.

---

## ¿Para quién es esto?

Para alguien que ya sabe jugar blackjack y quiere una **mochila de ayuda** en la mesa:

- Llevar el **conteo de cartas** (sistema Hi-Lo, explicado abajo sin complicaciones).
- Ver **cuánto conviene apostar** según cómo va la baraja.
- Recibir una sugerencia de **qué jugada hacer** (estrategia básica).
- Usar el **modo en vivo** cuando hay varios jugadores y tu turno no llega de inmediato.

La app arranca en **español latinoamericano**. Puedes cambiar a inglés con el selector arriba a la derecha.

---

## Blackjack para principiantes (lo mínimo que necesitas)

### ¿Qué es el blackjack?

Tú y el **dealer** (la casa) compiten por acercarse a **21** sin pasarte.

- Las cartas del **2 al 10** valen su número.
- **J, Q y K** valen 10.
- El **As** vale 11 o 1 (la app lo calcula sola).

En cada mano puedes, según el caso:

| Jugada | Qué significa |
|--------|----------------|
| **Pedir** | Te dan otra carta. |
| **Quedarte** | No pides más; juegas con lo que tienes. |
| **Doblar** | Duplicas la apuesta y recibes **una sola** carta más. |
| **Separar** | Si tienes un par (por ejemplo 8 y 8), divides en dos manos. |

La app te sugiere cuál opción usar según tus cartas y la carta visible del dealer.

### ¿Qué es “contar cartas”?

No es trucar. Es **recordar qué tipo de cartas ya salieron** para tener una idea de si quedan más cartas altas o más bajas en la baraja.

En el sistema **Hi-Lo** (el que usa esta app):

| Cartas | Efecto en el conteo |
|--------|---------------------|
| 2, 3, 4, 5, 6 | **+1** (cartas “bajas”) |
| 7, 8, 9 | **0** (neutras) |
| 10, J, Q, K, As | **−1** (cartas “altas”) |

Vas sumando eso mano a mano. Eso es el **conteo corrido**.

Pero ojo: **+6 no significa lo mismo** si todavía quedan 6 barajas o si casi no queda nada. Por eso existe el **conteo real**:

```
Conteo real = Conteo corrido ÷ Barajas que faltan
```

Cuanto **más alto** el conteo real, en general conviene **apostar un poco más**. Cuando va bajo o negativo, conviene **apostar poco**.

La app hace esas cuentas por ti. Tú solo vas **metiendo las cartas que ves**.

---

## Cómo usar la app en la mesa (paso a paso)

Imagina que te sientas en un casino. Abres la app. Sigue este orden:

### Paso 1 — Barajas en la mesa

Arriba verás **“Barajas en la mesa”**.

- Pregúntale al dealer o fíjate en la mesa: ¿cuántas barajas usan? Lo normal es **6 u 8**.
- Ajusta el número con **−** y **+**.

> Si no sabes cuántas son, empieza con **8** (es lo más común) y corrige después si te enteras.

### Paso 2 — Carta del dealer

Toca la carta que el dealer tiene **boca arriba** (la que todos ven).

Sin eso, la app no puede decirte qué conviene hacer.

### Paso 3 — Tus cartas (y las de otros, si quieres)

Cada jugador tiene su bloque:

1. Pulsa **“Soy yo”** en tu asiento.
2. Toca tus cartas en los botones, **o** escríbelas abajo (`A,7` o `10,6`) y pulsa **Aplicar**.
3. Si hay más jugadores en la mesa, puedes agregarlos con **+ Agregar jugador** y meter **sus cartas visibles**. Eso mejora el conteo.

Para borrar una carta que metiste mal, tócala otra vez (sale con una **×**).

### Paso 4 — Mira el panel de conteo

Ahí ves, en lenguaje sencillo:

- **Conteo corrido** — la suma Hi-Lo hasta ahora.
- **Conteo real** — ajustado por cuánta baraja falta.
- **Cartas que ya salieron** — cuántas registraste.
- **Barajas que faltan** — estimado de lo que queda por repartir.
- **Avance de la baraja** — qué tan lejos van antes de barajar de nuevo.
- **Cuánto apostar** — sugerencia de MÍNIMA → FUERTE según el conteo real.
- **Seguro** — si el dealer enseña As y el conteo real es alto, a veces conviene el seguro (la app te dice SÍ o NO).

### Paso 5 — Qué conviene hacer

La sección **“Qué conviene hacer”** te muestra **PEDIR**, **QUEDARTE**, **DOBLAR**, **SEPARAR**, etc., para cada jugador. Tu mano aparece marcada con **★ YO**.

### Paso 6 — Modo en vivo (cuando no te toca todavía)

En mesas con varios jugadores, **otros piden cartas antes que tú**. Mientras tanto salen cartas nuevas y el conteo cambia.

1. Marca **qué jugador eres tú** (botones 1, 2, 3…).
2. Cuando ya tengas tus cartas y la del dealer, pulsa **“Guardar mi jugada por ahora”**.
3. Sigue metiendo cartas que veas (otros jugadores, cartas botadas) en **“Otras cartas que viste”**.
4. La app compara **lo que ibas a hacer** vs **lo que te conviene ya en tu turno**.

Si cambió, te avisa.

### Paso 7 — Guardar manos y empezar de cero

| Botón | Para qué sirve |
|-------|----------------|
| **Guardar mano** | Cierra la mano actual, la suma al conteo y limpia las cartas para la siguiente. |
| **Nueva mano** | Limpia cartas pero **mantiene** el conteo acumulado. |
| **Deshacer última mano** | Quita la última mano que guardaste del conteo. |
| **Baraja nueva (reiniciar todo)** | Barajaron de nuevo: conteo a cero. |

---

## Otras cartas que viste

No solo cuentan tus cartas. Mete también:

- Cartas de **otros jugadores** (las que están boca arriba).
- Cartas **botadas** o **quemadas** si las ves.

**Mientras más registres, más preciso el conteo.**

---

## Instalar y correr el proyecto

### Requisitos

- [Node.js](https://nodejs.org/) (versión LTS recomendada)
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

Prueba la lógica del conteo, la estrategia y la entrada de cartas (por ejemplo `A,7` o `10,6,K`).

---

## Instalar en el celular (PWA)

1. Ejecuta `npm run build` y `npm run preview`, **o** sube la carpeta `dist/` a cualquier hosting estático.
2. Abre la app en **Chrome en Android**.
3. Menú (⋮) → **Instalar app** o **Agregar a pantalla de inicio**.
4. Queda como app independiente; la interfaz se guarda offline.

> Los datos de tus manos se guardan en el celular (`localStorage`). No se envían a ningún servidor.

---

## Tecnologías (para curiosos)

| Pieza | Uso |
|-------|-----|
| React + TypeScript | Interfaz y lógica |
| Vite | Desarrollo y build |
| Tailwind CSS | Estilos |
| vite-plugin-pwa | Instalable y offline |
| Vitest | Tests automáticos |
| localStorage | Guardar tu progreso en el dispositivo |

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

## Preguntas frecuentes (estilo “¿y si…?”)

**¿Tengo que meter cada carta del casino?**  
Solo las que **puedes ver**. Si no la viste, no la cuentes.

**¿Puedo usarla sin contar cartas?**  
Sí. La parte de **“Qué conviene hacer”** funciona solo con tus cartas y la del dealer, aunque ignores el conteo.

**¿Por qué dice “dealer” y no “crupier”?**  
En muchas mesas de Latinoamérica se usa “dealer” en el día a día. Si prefieres otro término, se puede cambiar en las traducciones (`src/i18n/locales.ts`).

**¿Me van a ganar seguro si el conteo real está alto?**  
No. Un conteo bueno **aumenta tu ventaja a largo plazo**, pero en una noche puedes perder igual. Por eso la app dice “ventaja **aproximada**”.

**¿Se pierde todo si cierro el navegador?**  
No. Se guarda solo en tu dispositivo hasta que pulses **Baraja nueva** o borres datos del navegador.

---

## Disclaimer

Herramienta **educativa**. No promete ganancias. Respeta las reglas del casino donde juegues. El conteo de cartas no está permitido en todos los locales.
