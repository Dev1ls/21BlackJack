# 21BlackJack

A mobile-first offline trainer for Hi-Lo card counting and basic strategy, built for practice at home.

Card counting is a memory drill, and a chart does not prepare you for a moving shoe. 21BlackJack — Práctica de Blackjack — is a phone-first PWA: you enter each card, the running count and true count update, and a basic-strategy suggestion (hit, stand, double, or split) sits beside the hand.

There is no server, no database, and no account. The practice session stays in the browser (`localStorage`) and keeps working offline once the app is installed. Practice bet units follow the true count. A table simulation and a practice timer let you rehearse speed with more cards on the table.

The interface ships in Latin American Spanish and English. A Felt theme is available. The suggestion uses fixed, stated rules: several decks, the dealer stands on every 17 (including soft 17), and there is no surrender.

## Highlights

- Hi-Lo running count and true count, with practice bet units that follow the count
- Basic strategy on the hand: hit, stand, double, or split
- Table simulation and a practice timer
- Installable PWA; the session stays on the device and works offline
- Latin American Spanish and English, plus a Felt theme

## Stack

React, TypeScript, Vite, Tailwind CSS, vite-plugin-pwa, Vitest.

## Status

Personal practice tool by Nicolas Wozniak (Chile), solo developer — TECHNOLOGIES SOLUTIONS CARLOS NICOLAS CONCHA WOZNIAK E.I.R.L. / W.Enterprise.

18+ educational practice only. Not for casinos, live tables, or real-money betting. Help: [Jugadores Anónimos Chile](https://www.jugadoresanonimoschile.cl/).

---

# 21BlackJack

Entrenador offline para el celular, hecho para practicar conteo Hi-Lo y estrategia básica en casa.

Contar cartas es un ejercicio de memoria, y una tabla no alcanza cuando el zapato se mueve. 21BlackJack — Práctica de Blackjack — es una PWA pensada para el teléfono: ingresas cada carta, el conteo corrido y el conteo real se actualizan, y al lado aparece la jugada de estrategia básica (pedir, quedarse, doblar o separar).

No hay servidor, ni base de datos, ni cuentas. La sesión de práctica queda en el navegador (`localStorage`) y sigue funcionando sin conexión una vez instalada la app. Las unidades de apuesta de práctica siguen el conteo real. La simulación de mesa y el cronómetro dejan ensayar la velocidad con más cartas sobre la mesa.

La interfaz sale en español latinoamericano y en inglés. Incluye un tema Fieltro. La sugerencia usa reglas fijas y explícitas: varias barajas, el dealer se planta en todo 17 (incluido el blando) y no hay rendición.

## Destacados

- Conteo corrido y conteo real Hi-Lo, con unidades de práctica que siguen el conteo
- Estrategia básica en la mano: pedir, quedarse, doblar o separar
- Simulación de mesa y cronómetro de práctica
- PWA instalable; la sesión queda en el dispositivo y funciona sin conexión
- Español latinoamericano e inglés, más el tema Fieltro

## Stack

React, TypeScript, Vite, Tailwind CSS, vite-plugin-pwa, Vitest.

## Estado

Herramienta personal de práctica de Nicolas Wozniak (Chile), desarrollador en solitario — TECHNOLOGIES SOLUTIONS CARLOS NICOLAS CONCHA WOZNIAK E.I.R.L. / W.Enterprise.

Solo práctica educativa para mayores de 18. No es para casinos, mesas en vivo ni apuestas con dinero real. Ayuda: [Jugadores Anónimos Chile](https://www.jugadoresanonimoschile.cl/).
