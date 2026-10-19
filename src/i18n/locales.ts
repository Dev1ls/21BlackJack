import type { BettingSuggestion, CardRank, StrategyAction } from '../types/blackjack';

const ES_CARD_NAMES: Record<CardRank, string> = {
  A: 'As',
  '2': 'Dos',
  '3': 'Tres',
  '4': 'Cuatro',
  '5': 'Cinco',
  '6': 'Seis',
  '7': 'Siete',
  '8': 'Ocho',
  '9': 'Nueve',
  '10': 'Diez',
  J: 'Jota',
  Q: 'Reina',
  K: 'Rey',
};

const EN_CARD_NAMES: Record<CardRank, string> = {
  A: 'Ace',
  '2': 'Two',
  '3': 'Three',
  '4': 'Four',
  '5': 'Five',
  '6': 'Six',
  '7': 'Seven',
  '8': 'Eight',
  '9': 'Nine',
  '10': 'Ten',
  J: 'Jack',
  Q: 'Queen',
  K: 'King',
};

export interface Translations {
  app: {
    title: string;
    subtitle: string;
    disclaimer: string;
  };
  shoe: {
    title: string;
    decks: string;
    hint: string;
  };
  counter: {
    title: string;
    runningCount: string;
    trueCount: string;
    cardsSeen: string;
    decksRemaining: string;
    penetration: string;
    betting: string;
    estimatedEdge: string;
    edgeApprox: string;
    insurance: string;
    insuranceTake: string;
    insuranceNo: string;
  };
  dealer: {
    title: string;
    upcard: string;
    upcardWhen: string;
    upcardLocked: string;
    tapUpcard: string;
    hole: string;
    holeWhen: string;
    holeNow: string;
    holeLocked: string;
    holeDone: string;
    /** @deprecated */
    holeHidden: string;
    /** @deprecated */
    holeHint: string;
    /** @deprecated */
    revealHole: string;
    draw: string;
    drawWhen: string;
    drawLocked: string;
    drawEmpty: string;
    tableStarts: string;
    mustHit: string;
    stands: string;
    standsDone: string;
    bust: string;
    bustDone: string;
    /** @deprecated */
    drawHint: string;
    /** @deprecated use tapUpcard */
    tapCard: string;
  };
  players: {
    title: string;
    addPlayer: string;
    playerName: (num: number) => string;
    setAsMe: string;
    me: string;
    remove: string;
    hand: (num: number) => string;
    noCards: string;
    tapToRemove: string;
    manualPlaceholder: string;
    set: string;
    current: string;
  };
  extraCards: {
    title: string;
    hint: string;
    burnNote: string;
  };
  strategy: {
    title: string;
    needDealer: string;
    needCards: string;
    cards: string;
    total: string;
    handLabel: (num: number) => string;
    tapToHit: string;
    waitingDealer: string;
    waitingReveal: string;
    waitingDraw: string;
    roundEnd: string;
    handDone: string;
  };
  phases: {
    opening: string;
    playerTurn: string;
    dealerReveal: string;
    dealerDraw: string;
    roundEnd: string;
  };
  playerActions: {
    stand: string;
    split: string;
    double: string;
    finishDealer: string;
    doubleHint: string;
  };
  ui: {
    advanced: string;
    showPlay: string;
    hidePlay: string;
    myHand: string;
    myHandWhenOpening: string;
    myHandWhenPlaying: string;
    myHandWhenDone: string;
    otherPlayers: string;
    otherPlayersHint: string;
  };
  flowGuide: {
    title: string;
    optional: string;
    stepNow: (current: number, total: number) => string;
    hintSetup: string;
    hintDeal: string;
    hintPlay: string;
    hintOthers: string;
    hintHole: string;
    hintDraw: string;
    hintSave: string;
    steps: {
      setup: string;
      deal: string;
      play: string;
      others: string;
      hole: string;
      draw: string;
      save: string;
    };
  };
  tableMode: {
    title: string;
    description: string;
    myPlayerNumber: string;
    lockPreliminary: string;
    preliminaryDecision: string;
    finalDecision: string;
    notSet: string;
    trueCountChange: string;
    runningCountChange: string;
    decisionChanged: string;
    decisionSame: string;
  };
  roundControls: {
    title: string;
    savedRounds: (count: number) => string;
    saveRound: string;
    newRound: string;
    undoLastRound: string;
    resetShoe: string;
  };
  explanation: {
    show: string;
    hide: string;
    title: string;
    runningCountTitle: string;
    runningCountBody: string;
    trueCountTitle: string;
    trueCountBody: string;
    trueCountFormula: string;
    decksRemainingTitle: string;
    decksRemainingBody: string;
    penetrationTitle: string;
    penetrationBody: string;
    penetrationFormula: string;
    tableDynamicsTitle: string;
    tableDynamicsBody: string;
    visibleCardsTitle: string;
    visibleCardsBody: string;
    estimatedEdgeTitle: string;
    estimatedEdgeBody: string;
    estimatedEdgeFormula: string;
    varianceTitle: string;
    varianceBody: string;
  };
  offline: {
    message: string;
  };
  language: {
    label: string;
    es: string;
    en: string;
  };
  theme: {
    label: string;
    classic: string;
    casino: string;
  };
  actions: Record<StrategyAction, string>;
  betting: Record<BettingSuggestion, string>;
  strategyReasons: {
    noCards: string;
    naturalBlackjack: string;
    bust: (total: number) => string;
    reached21: string;
    pair: (value: number) => string;
    soft: (total: number) => string;
    hard: (total: number) => string;
  };
  parseCardErrors: {
    emptyCard: string;
    invalidCard: (part: string) => string;
  };
  practiceTimer: {
    title: string;
    description: string;
    waiting: string;
    presetLabel: string;
    start: string;
    ready: string;
    tryAgain: string;
    runningHint: string;
    success: (seconds: string) => string;
    timeout: string;
    autoPlay: (action: string) => string;
    recommended: (action: string) => string;
    mismatch: string;
  };
  notice: {
    badge: string;
    title: string;
    body: string;
    helpIntro: string;
    helpChile: string;
    helpScj: string;
    helpSpain: string;
    helpUs: string;
    privacy: string;
    rules: string;
  };
  a11y: {
    card: (rank: CardRank) => string;
    removeCard: (name: string) => string;
    decreaseDecks: string;
    increaseDecks: string;
    timerSeconds: (seconds: number) => string;
    selectPlayer: (name: string) => string;
    saveFailed: string;
    saveTrimmed: string;
    manualCards: string;
    progress: string;
  };
}

export const es: Translations = {
  app: {
    title: 'Práctica de Blackjack',
    subtitle: 'Entrenador Hi-Lo · Estrategia básica · Solo práctica',
    disclaimer:
      'Entrenador para mayores de 18 años. Practica aquí; no lo uses en un casino ni con dinero real. No promete ganancias.',
  },
  shoe: {
    title: 'Barajas del zapato',
    decks: 'Cantidad:',
    hint: 'En la práctica se simulan 6 u 8 barajas. Ajusta el número para el zapato de ensayo.',
  },
  counter: {
    title: 'Conteo de cartas',
    runningCount: 'Conteo corrido',
    trueCount: 'Conteo real',
    cardsSeen: 'Cartas que ya salieron',
    decksRemaining: 'Barajas que faltan',
    penetration: 'Avance de la baraja',
    betting: 'Apuesta de práctica',
    estimatedEdge: 'Ventaja aproximada',
    edgeApprox: 'Solo una estimación',
    insurance: 'Seguro',
    insuranceTake: 'SÍ',
    insuranceNo: 'NO',
  },
  dealer: {
    title: 'Dealer',
    upcard: 'Carta visible (boca arriba)',
    upcardWhen: 'Al inicio de la mano — antes de decidir qué hacer.',
    upcardLocked: 'Ya registrada. Para cambiarla, usa «Nueva mano» abajo.',
    tapUpcard: '👇 Toca la carta que ves boca arriba',
    hole: 'Carta oculta (boca abajo)',
    holeWhen: 'NO es ahora. Solo cuando termines tú y el dealer voltee.',
    holeNow: '👇 El dealer volteó. Toca cuál era la carta oculta:',
    holeLocked: 'Aparece solo después de que te quedes, pidas, dobles o te pases.',
    holeDone: 'Registrada — ahora cuenta las cartas que pida el dealer.',
    holeHidden: 'Todavía boca abajo',
    holeHint: 'No sirve para decidir tu jugada; solo para el conteo cuando se ve.',
    revealHole: 'Volteó — registrar',
    draw: 'Cartas que pide el dealer',
    drawWhen: 'Si el dealer pide más cartas, agrégalas una por una.',
    drawLocked: 'Primero registra la carta oculta (paso 2).',
    drawEmpty: 'Si se quedó con 2 cartas, no agregues nada y pulsa «Dealer terminó».',
    tableStarts: 'El dealer reparte primero — empieza por su carta visible.',
    mustHit: 'Dealer tiene menos de 17 — toca cada carta que saque:',
    stands: 'Se queda (17+)',
    standsDone: 'Dealer se quedó en 17 o más. Pulsa «Dealer terminó» o guarda la mano.',
    bust: 'Se pasó',
    bustDone: 'Dealer se pasó. Pulsa «Dealer terminó» o guarda la mano.',
    drawHint: 'Cada carta extra del dealer suma al conteo.',
    tapCard: 'Elige la carta que tiene el dealer boca arriba',
  },
  players: {
    title: 'Jugadores',
    addPlayer: '+ Agregar jugador',
    playerName: (num) => `Jugador ${num}`,
    setAsMe: 'Soy yo',
    me: '★ YO',
    remove: 'Eliminar',
    hand: (num) => `Mano ${num}`,
    noCards: 'Todavía no hay cartas',
    tapToRemove: 'Toca para borrar',
    manualPlaceholder: 'Ej: A,7 o 10,6',
    set: 'Aplicar',
    current: 'Tienes:',
  },
  extraCards: {
    title: 'Cartas extra para el conteo',
    hint: 'Todo lo visible que NO está en dealer ni en tu mano: quemadas al cambiar baraja, descartes, cartas de vecinos, etc.',
    burnNote:
      '🔥 Cartas quemadas: al empezar una baraja nueva o tras barajar, el dealer suele quemar 1 carta (a veces más). Regístrala aquí — no hace falta tener otros jugadores.',
  },
  strategy: {
    title: 'Qué conviene hacer',
    needDealer: 'Elige la carta visible del dealer.',
    needCards: 'Agrega tus 2 cartas iniciales.',
    cards: 'Cartas:',
    total: 'Suma:',
    handLabel: (num) => `(Mano ${num})`,
    tapToHit: 'Toca una carta abajo para PEDIR',
    waitingDealer: 'Ya te quedaste — espera a que el dealer muestre la oculta',
    waitingReveal: 'Registra la carta oculta del dealer',
    waitingDraw: 'Cuenta las cartas que pide el dealer',
    roundEnd: 'Mano terminada — guarda o empieza otra',
    handDone: 'Mano cerrada',
  },
  phases: {
    opening: 'Reparto — dealer + tus 2 cartas',
    playerTurn: 'Tu turno — solo importa la carta visible del dealer',
    dealerReveal: 'Volteó la oculta — regístrala ahora para el conteo',
    dealerDraw: 'Dealer pide cartas — agrégalas al conteo',
    roundEnd: 'Mano terminada',
  },
  playerActions: {
    stand: 'Quedarme',
    split: 'Separar',
    double: 'Doblar (+1 carta)',
    finishDealer: 'Dealer terminó',
    doubleHint: 'Doblar: agrega 1 carta y cierras la mano',
  },
  ui: {
    advanced: 'Opciones avanzadas',
    showPlay: 'Ver jugada',
    hidePlay: 'Ocultar',
    myHand: 'Mis cartas',
    myHandWhenOpening: 'Paso 2: tus 2 cartas iniciales (después de la carta visible del dealer).',
    myHandWhenPlaying: 'Tu turno: pide cartas tocando abajo, o usa los botones Quedarme / Doblar / Separar.',
    myHandWhenDone: 'Mano cerrada — tus cartas siguen visibles para el conteo.',
    otherPlayers: 'Otros jugadores (simulación)',
    otherPlayersHint: 'Opcional. Sirve para practicar el conteo con más cartas visibles.',
  },
  flowGuide: {
    title: 'Orden de la mano',
    optional: '(opc.)',
    stepNow: (current, total) => `Paso ${current} de ${total}`,
    hintSetup:
      '¿Baraja nueva? Registra aquí las cartas quemadas (si las viste). Luego dealer visible + tus 2 cartas.',
    hintDeal: 'Arriba: carta visible del dealer. Abajo: tus 2 cartas iniciales.',
    hintPlay:
      'Mira el panel «Qué conviene hacer» → pide, quédate, dobla o separa. La carta oculta del dealer NO va todavía.',
    hintOthers:
      'Si la simulación tiene más jugadores, registra sus cartas visibles antes de tu turno.',
    hintHole:
      'Ya terminaste tú. El dealer volteó la oculta → tócala en la sección Dealer, paso 2.',
    hintDraw:
      'El dealer pide cartas → agrégalas en paso 3. Si no pidió más, pulsa «Dealer terminó».',
    hintSave: 'Mano lista. «Guardar mano» suma todo al conteo de la baraja, o «Nueva mano» para la siguiente.',
    steps: {
      setup: 'Baraja / quemadas',
      deal: 'Reparto',
      play: 'Tu jugada',
      others: 'Otros jugadores',
      hole: 'Oculta dealer',
      draw: 'Dealer pide',
      save: 'Guardar',
    },
  },
  tableMode: {
    title: 'Simulación de mesa',
    description:
      'Practica una decisión preliminar mientras registras cartas de otros jugadores. La sugerencia se recalcula en la simulación.',
    myPlayerNumber: '¿Cuál jugador eres tú?',
    lockPreliminary: 'Guardar mi jugada por ahora',
    preliminaryDecision: 'Lo que ibas a hacer',
    finalDecision: 'Lo que te conviene ya en tu turno',
    notSet: 'Aún no guardaste nada',
    trueCountChange: 'Cambio en conteo real:',
    runningCountChange: 'Cambio en conteo corrido:',
    decisionChanged: '⚠ Cambió la jugada recomendada por el conteo',
    decisionSame: '✓ Sigue siendo la misma jugada',
  },
  roundControls: {
    title: 'Manos y conteo',
    savedRounds: (count) => `Manos ya contadas en esta baraja: ${count}`,
    saveRound: 'Guardar mano',
    newRound: 'Nueva mano',
    undoLastRound: 'Deshacer última mano',
    resetShoe: 'Baraja nueva (reiniciar todo)',
  },
  explanation: {
    show: 'Ver cómo funciona',
    hide: 'Ocultar explicación',
    title: 'Cómo funciona',
    runningCountTitle: 'Conteo corrido',
    runningCountBody:
      'Vas sumando +1 con cartas bajas (2 al 6) y −1 con cartas altas (10, J, Q, K y As). El 7, 8 y 9 no cambian nada. Eso te dice si quedan más cartas altas o bajas.',
    trueCountTitle: 'Conteo real',
    trueCountBody:
      'El conteo corrido solo no alcanza: importa cuántas barajas faltan. +6 con 3 barajas por delante (+2 real) vale mucho más que +6 con casi una sola baraja (+6 real).',
    trueCountFormula: 'Conteo real = Conteo corrido ÷ Barajas que faltan',
    decksRemainingTitle: 'Barajas que faltan',
    decksRemainingBody:
      'Cuando queda poca baraja, cada carta nueva pesa más en el conteo. La app calcula esto restando las cartas que ya registraste.',
    penetrationTitle: 'Avance de la baraja',
    penetrationBody:
      'Es qué tan avanzada va la baraja simulada antes de barajar de nuevo. Más avance = el conteo de práctica es más informativo.',
    penetrationFormula: 'Avance = Cartas que salieron ÷ Total de cartas × 100',
    tableDynamicsTitle: 'Varios jugadores',
    tableDynamicsBody:
      'En la simulación, más jugadores significan más cartas visibles antes de tu turno. Regístralas para afinar el conteo de práctica.',
    visibleCardsTitle: 'Mientras más cartas registres, mejor',
    visibleCardsBody:
      'Cuenta todo lo visible: dealer, tu mano, otros jugadores y cartas botadas. Cada carta mejora el conteo.',
    estimatedEdgeTitle: 'Ventaja aproximada',
    estimatedEdgeBody:
      'Es una cifra de entrenamiento. No es una ventaja en dinero real y no promete ganancias.',
    estimatedEdgeFormula: 'Ventaja ≈ (Conteo real − 1) × 0.5%',
    varianceTitle: 'Igual puedes perder racha',
    varianceBody:
      'Aunque el conteo de práctica vaya bien, una racha corta puede salir mal. Este entrenador no le gana a la suerte.',
  },
  offline: {
    message: 'Sin internet — la práctica queda guardada en este dispositivo',
  },
  language: {
    label: 'Idioma',
    es: 'Español',
    en: 'English',
  },
  theme: {
    label: 'Estilo',
    classic: 'Clásico',
    casino: 'Fieltro',
  },
  actions: {
    HIT: 'PEDIR',
    STAND: 'QUEDARTE',
    DOUBLE: 'DOBLAR',
    SPLIT: 'SEPARAR',
    BUST: 'TE PASASTE',
    BLACKJACK: 'BLACKJACK',
    '21': '21',
    INSURANCE: 'SEGURO',
  },
  betting: {
    MINIMUM: 'MÍNIMA',
    BASE: 'NORMAL',
    'RAISE x2': 'SUBE x2',
    'RAISE x4': 'SUBE x4',
    AGGRESSIVE: 'FUERTE',
  },
  strategyReasons: {
    noCards: 'Todavía no tienes cartas',
    naturalBlackjack: 'Blackjack natural',
    bust: (total) => `Te pasaste con ${total}`,
    reached21: 'Llegaste a 21',
    pair: (value) => `Par de ${value}s`,
    soft: (total) => `Mano blanda ${total}`,
    hard: (total) => `Mano dura ${total}`,
  },
  parseCardErrors: {
    emptyCard: 'Falta una carta. Usa el formato: A,7 o 10,6',
    invalidCard: (part) => `"${part}" no es válida. Usa: A, 2-10, J, Q, K`,
  },
  practiceTimer: {
    title: 'Practica contra el reloj',
    description:
      'Cronómetro de práctica. Elige un límite, registra las cartas y pulsa Listo. Es un ejercicio, no un modo para una mesa real.',
    waiting: 'Elige la carta del dealer y al menos 2 cartas tuyas para practicar.',
    presetLabel: 'Límite de práctica:',
    start: 'Iniciar cronómetro',
    ready: '¡Listo!',
    tryAgain: 'Intentar de nuevo',
    runningHint: 'te queda',
    success: (seconds) => `Bien: lo hiciste en ${seconds} s`,
    timeout: 'Se acabó el tiempo de práctica',
    autoPlay: (action) => `Referencia del ejercicio si se agota el tiempo: ${action}`,
    recommended: (action) => `Lo que te conviene: ${action}`,
    mismatch: 'Esa referencia rápida no siempre coincide con la estrategia básica. Por eso se practica.',
  },
  notice: {
    badge: '18+',
    title: 'Solo práctica. Juega con responsabilidad.',
    body: 'Esta app es un entrenador. No la uses en un casino, en una mesa en vivo ni para apostar dinero real. El conteo con un dispositivo puede estar prohibido y puede violar las reglas del local.',
    helpIntro: 'Si el juego te está afectando, pide ayuda:',
    helpChile: 'Jugadores Anónimos Chile',
    helpScj: 'Autoexclusión SCJ (Chile)',
    helpSpain: 'FEJAR (España)',
    helpUs: '1-800-GAMBLER (EE. UU.)',
    privacy:
      'Privacidad: no hay cuenta, analítica ni servidor. Las manos de práctica se guardan solo en este navegador y puedes borrarlas con «Baraja nueva».',
    rules:
      'La estrategia asume varias barajas, dealer que se planta en todo 17 (también el 17 blando) y sin rendición. No se ajusta sola a otras reglas.',
  },
  a11y: {
    card: (rank) => ES_CARD_NAMES[rank],
    removeCard: (name) => `Quitar ${name}`,
    decreaseDecks: 'Menos barajas',
    increaseDecks: 'Más barajas',
    timerSeconds: (seconds) => `${seconds} segundos`,
    selectPlayer: (name) => `Elegir ${name}`,
    saveFailed:
      'No se pudo guardar la práctica en este navegador. Puedes seguir entrenando; el progreso de esta visita puede perderse al cerrar.',
    saveTrimmed:
      'No había espacio para todo el historial. Se guardó la mano actual y se omitieron manos anteriores.',
    manualCards: 'Escribir cartas a mano',
    progress: 'Tiempo de práctica restante',
  },
};

export const en: Translations = {
  app: {
    title: 'Blackjack Practice',
    subtitle: 'Hi-Lo trainer · Basic strategy · Practice only',
    disclaimer:
      'Practice trainer for ages 18+. Use it to train here, not at a casino and not with real money. It does not promise winnings.',
  },
  shoe: {
    title: 'Shoe',
    decks: 'Decks:',
    hint: 'Practice shoes usually use 6 or 8 decks. Change the number for the drill.',
  },
  counter: {
    title: 'Count Dashboard',
    runningCount: 'Running Count',
    trueCount: 'True Count',
    cardsSeen: 'Cards Seen',
    decksRemaining: 'Decks Remaining',
    penetration: 'Penetration',
    betting: 'Practice bet',
    estimatedEdge: 'Estimated Edge',
    edgeApprox: 'Approximation only',
    insurance: 'Insurance',
    insuranceTake: 'TAKE',
    insuranceNo: 'NO',
  },
  dealer: {
    title: 'Dealer',
    upcard: 'Upcard (face up)',
    upcardWhen: 'At the start of the hand — before you decide what to do.',
    upcardLocked: 'Already set. To change it, use «New Round» below.',
    tapUpcard: '👇 Tap the face-up card you see',
    hole: 'Hole card (face down)',
    holeWhen: 'NOT yet. Only after you finish and the dealer flips it.',
    holeNow: '👇 Dealer flipped. Tap what the hole card was:',
    holeLocked: 'Unlocks after you stand, hit to finish, double, or bust.',
    holeDone: 'Registered — now add any cards the dealer draws.',
    holeHidden: 'Still face down',
    holeHint: 'Not used for your decision — only for the count once visible.',
    revealHole: 'Revealed — register',
    draw: 'Cards the dealer draws',
    drawWhen: 'If the dealer hits, add each card one by one.',
    drawLocked: 'Register the hole card first (step 2).',
    drawEmpty: 'If the dealer stood on 2 cards, add nothing and tap «Dealer done».',
    tableStarts: 'The dealer deals first — start with the face-up card.',
    mustHit: 'Dealer has less than 17 — tap each card drawn:',
    stands: 'Stands (17+)',
    standsDone: 'Dealer stands on 17+. Tap «Dealer done» or save the round.',
    bust: 'Bust',
    bustDone: 'Dealer busted. Tap «Dealer done» or save the round.',
    drawHint: 'Each extra dealer card adds to the count.',
    tapCard: 'Tap a card below',
  },
  players: {
    title: 'Players',
    addPlayer: '+ Add Player',
    playerName: (num) => `Player ${num}`,
    setAsMe: 'Set as Me',
    me: '★ ME',
    remove: 'Remove',
    hand: (num) => `Hand ${num}`,
    noCards: 'No cards yet',
    tapToRemove: 'Tap to remove',
    manualPlaceholder: 'A,7 or 10,6',
    set: 'Set',
    current: 'Current:',
  },
  extraCards: {
    title: 'Extra cards for the count',
    hint: 'Anything visible NOT in dealer or your hand: burn cards on shuffle, discards, neighbors, etc.',
    burnNote:
      '🔥 Burn cards: when a new practice shoe starts, log the burned card here (usually 1). You do not need other players for that.',
  },
  strategy: {
    title: 'Strategy',
    needDealer: 'Set the dealer upcard first.',
    needCards: 'Add your first 2 cards.',
    cards: 'Cards:',
    total: 'Total:',
    handLabel: (num) => `(Hand ${num})`,
    tapToHit: 'Tap a card below to HIT',
    waitingDealer: 'You stood — wait for dealer hole card',
    waitingReveal: 'Register the dealer hole card',
    waitingDraw: 'Add each card the dealer draws',
    roundEnd: 'Hand over — save or start new',
    handDone: 'Hand closed',
  },
  phases: {
    opening: 'Deal — dealer + your 2 cards',
    playerTurn: 'Your turn — only the upcard matters',
    dealerReveal: 'Hole card revealed — register it for the count',
    dealerDraw: 'Dealer drawing — add cards to count',
    roundEnd: 'Hand finished',
  },
  playerActions: {
    stand: 'Stand',
    split: 'Split',
    double: 'Double (+1 card)',
    finishDealer: 'Dealer done',
    doubleHint: 'Double: add 1 card then hand closes',
  },
  ui: {
    advanced: 'Advanced options',
    showPlay: 'Show play',
    hidePlay: 'Hide',
    myHand: 'My cards',
    myHandWhenOpening: 'Step 2: your 2 starting cards (after the dealer upcard above).',
    myHandWhenPlaying: 'Your turn: tap cards below to hit, or use Stand / Double / Split.',
    myHandWhenDone: 'Hand closed — your cards stay visible for the count.',
    otherPlayers: 'Other players (simulation)',
    otherPlayersHint: 'Optional. Use it to practice the count with more face-up cards.',
  },
  flowGuide: {
    title: 'Hand order',
    optional: '(opt.)',
    stepNow: (current, total) => `Step ${current} of ${total}`,
    hintSetup:
      'New shoe? Log burn cards here (if you saw them). Then dealer upcard + your 2 cards.',
    hintDeal: 'Above: dealer upcard. Below: your 2 starting cards.',
    hintPlay:
      'Check «Strategy» panel → hit, stand, double, or split. Dealer hole card is NOT entered yet.',
    hintOthers:
      'If the simulation has other players, log their face-up cards before your turn.',
    hintHole:
      'You are done. Dealer flipped the hole card → tap it in Dealer section, step 2.',
    hintDraw:
      'Dealer hits → add cards in step 3. If no hits, tap «Dealer done».',
    hintSave: 'Hand complete. «Save Round» adds everything to the shoe count, or «New Round» for the next.',
    steps: {
      setup: 'Shoe / burns',
      deal: 'Deal',
      play: 'Your play',
      others: 'Other players',
      hole: 'Dealer hole',
      draw: 'Dealer hits',
      save: 'Save',
    },
  },
  tableMode: {
    title: 'Table simulation',
    description:
      'Practice a preliminary decision while you log other players’ cards. The suggestion updates inside the simulation.',
    myPlayerNumber: 'My Player Number',
    lockPreliminary: 'Lock Preliminary Decision',
    preliminaryDecision: 'Preliminary Decision',
    finalDecision: 'Final Decision Before My Turn',
    notSet: 'Not set',
    trueCountChange: 'True Count Change:',
    runningCountChange: 'Running Count Change:',
    decisionChanged: '⚠ Decision changed due to updated count',
    decisionSame: '✓ Decision remains the same',
  },
  roundControls: {
    title: 'Round Controls',
    savedRounds: (count) => `Saved rounds in shoe: ${count}`,
    saveRound: 'Save Round',
    newRound: 'New Round',
    undoLastRound: 'Undo Last Round',
    resetShoe: 'Reset Shoe',
  },
  explanation: {
    show: 'Show Explanation',
    hide: 'Hide Explanation',
    title: 'How It Works',
    runningCountTitle: 'Running Count',
    runningCountBody:
      'The running count tracks how many high vs low cards have been seen using the Hi-Lo system. Low cards (2–6) add +1, high cards (10–A) subtract −1, and 7–9 are neutral.',
    trueCountTitle: 'True Count',
    trueCountBody:
      'The true count adjusts the running count for how many decks are still in the shoe. A +6 running count with 3 decks left (+2 true) is much stronger than +6 with 1 deck left (+6 true).',
    trueCountFormula: 'True Count = Running Count ÷ Decks Remaining',
    decksRemainingTitle: 'Decks Remaining',
    decksRemainingBody:
      'Fewer decks remaining means each card has more impact on the count. The app estimates decks left from total cards minus cards seen.',
    penetrationTitle: 'Penetration',
    penetrationBody:
      'Penetration is how deep the practice shoe has been dealt. Deeper penetration makes the practice count more informative.',
    penetrationFormula: 'Penetration = Cards Seen ÷ Total Cards × 100',
    tableDynamicsTitle: 'Table Dynamics',
    tableDynamicsBody:
      'In the simulation, more players mean more face-up cards before your turn. Log them to sharpen the practice count.',
    visibleCardsTitle: 'More Visible Cards = Better Count',
    visibleCardsBody:
      'Every card you can see — dealer upcard, your hand, other players, and discards — improves count accuracy. Track everything visible.',
    estimatedEdgeTitle: 'Estimated Edge',
    estimatedEdgeBody:
      'The edge figure is a training estimate. It is not a real-money edge and it does not promise winnings.',
    estimatedEdgeFormula: 'Estimated Edge ≈ (True Count − 1) × 0.5%',
    varianceTitle: 'Variance Still Matters',
    varianceBody:
      'A good practice count can still be followed by a losing streak. This trainer does not beat luck.',
  },
  offline: {
    message: 'Offline — practice stays on this device',
  },
  language: {
    label: 'Language',
    es: 'Español',
    en: 'English',
  },
  theme: {
    label: 'Style',
    classic: 'Classic',
    casino: 'Felt',
  },
  actions: {
    HIT: 'HIT',
    STAND: 'STAND',
    DOUBLE: 'DOUBLE',
    SPLIT: 'SPLIT',
    BUST: 'BUST',
    BLACKJACK: 'BLACKJACK',
    '21': '21',
    INSURANCE: 'INSURANCE',
  },
  betting: {
    MINIMUM: 'MINIMUM',
    BASE: 'BASE',
    'RAISE x2': 'RAISE x2',
    'RAISE x4': 'RAISE x4',
    AGGRESSIVE: 'AGGRESSIVE',
  },
  strategyReasons: {
    noCards: 'No cards dealt yet',
    naturalBlackjack: 'Natural blackjack',
    bust: (total) => `Bust with ${total}`,
    reached21: 'Reached 21',
    pair: (value) => `Pair of ${value}s`,
    soft: (total) => `Soft ${total}`,
    hard: (total) => `Hard ${total}`,
  },
  parseCardErrors: {
    emptyCard: 'Empty card value found. Use format: A,7 or 10,6',
    invalidCard: (part) => `"${part}" is not a valid card. Use: A, 2-10, J, Q, K`,
  },
  practiceTimer: {
    title: 'Beat the Clock Practice',
    description:
      'Practice timer. Pick a limit, enter the cards, and tap Ready. It is a drill, not a mode for a real table.',
    waiting: 'Set the dealer card and at least 2 of your cards to practice.',
    presetLabel: 'Practice limit:',
    start: 'Start timer',
    ready: 'Ready!',
    tryAgain: 'Try again',
    runningHint: 'remaining',
    success: (seconds) => `Nice: finished in ${seconds}s`,
    timeout: 'Practice time is up',
    autoPlay: (action) => `Drill reference if time runs out: ${action}`,
    recommended: (action) => `Recommended: ${action}`,
    mismatch: 'That quick reference does not always match basic strategy. That is why this is practice.',
  },
  notice: {
    badge: '18+',
    title: 'Practice only. Gamble responsibly.',
    body: 'This app is a trainer. Do not use it in a casino, at a live table, or to bet real money. Using a counting device can be illegal and can break house rules.',
    helpIntro: 'If gambling is hurting you, ask for help:',
    helpChile: 'Jugadores Anónimos Chile',
    helpScj: 'SCJ self-exclusion (Chile)',
    helpSpain: 'FEJAR (Spain)',
    helpUs: '1-800-GAMBLER (US)',
    privacy:
      'Privacy: there is no account, analytics, or server. Practice hands stay in this browser, and “Reset Shoe” clears them.',
    rules:
      'Strategy assumes multiple decks, a dealer who stands on every 17 (including soft 17), and no surrender. It does not adapt to other rules.',
  },
  a11y: {
    card: (rank) => EN_CARD_NAMES[rank],
    removeCard: (name) => `Remove ${name}`,
    decreaseDecks: 'Fewer decks',
    increaseDecks: 'More decks',
    timerSeconds: (seconds) => `${seconds} seconds`,
    selectPlayer: (name) => `Choose ${name}`,
    saveFailed:
      'This browser could not save the practice session. You can keep training; progress from this visit may be lost when you close it.',
    saveTrimmed:
      'There was not enough space for the full history. The current hand was saved and older hands were left out.',
    manualCards: 'Type cards manually',
    progress: 'Practice time remaining',
  },
};
