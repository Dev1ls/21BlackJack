import type { BettingSuggestion, StrategyAction } from '../types/blackjack';

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
  };
  strategy: {
    title: string;
    needDealer: string;
    cards: string;
    total: string;
    handLabel: (num: number) => string;
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
}

export const es: Translations = {
  app: {
    title: 'Ayudante de Blackjack',
    subtitle: 'Conteo de cartas · Qué jugar · Modo en vivo',
    disclaimer:
      'Esto es solo para aprender; no te garantiza ganar. Las reglas del casino, cuánto puedes apostar, errores y la suerte del momento también cuentan.',
  },
  shoe: {
    title: 'Barajas en la mesa',
    decks: 'Cantidad:',
    hint: 'Cuántas barajas usa el casino en esa mesa (lo normal es 6 u 8).',
  },
  counter: {
    title: 'Conteo de cartas',
    runningCount: 'Conteo corrido',
    trueCount: 'Conteo real',
    cardsSeen: 'Cartas que ya salieron',
    decksRemaining: 'Barajas que faltan',
    penetration: 'Avance de la baraja',
    betting: 'Cuánto apostar',
    estimatedEdge: 'Ventaja aproximada',
    edgeApprox: 'Solo una estimación',
    insurance: 'Seguro',
    insuranceTake: 'SÍ',
    insuranceNo: 'NO',
  },
  dealer: {
    title: 'Carta del dealer',
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
    title: 'Otras cartas que viste',
    hint: 'Cartas de otros jugadores, las que botaron, quemadas, etc.',
  },
  strategy: {
    title: 'Qué conviene hacer',
    needDealer: 'Primero elige la carta del dealer para ver qué te conviene.',
    cards: 'Cartas:',
    total: 'Suma:',
    handLabel: (num) => `(Mano ${num})`,
  },
  tableMode: {
    title: 'Modo en vivo',
    description:
      'Guarda tu jugada mientras los demás piden cartas. Si salen más cartas visibles, la app recalcula solo.',
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
      'Es qué tan lejos van en repartir antes de barajar de nuevo. Más avance = conteo más confiable, pero menos tiempo para subir la apuesta.',
    penetrationFormula: 'Avance = Cartas que salieron ÷ Total de cartas × 100',
    tableDynamicsTitle: 'Varios jugadores en la mesa',
    tableDynamicsBody:
      'Con 3 o 4 jugadores salen más cartas boca arriba antes de que te toque. Aprovecha para ir metiendo lo que ves y afinar tu jugada.',
    visibleCardsTitle: 'Mientras más cartas registres, mejor',
    visibleCardsBody:
      'Cuenta todo lo visible: dealer, tu mano, otros jugadores y cartas botadas. Cada carta mejora el conteo.',
    estimatedEdgeTitle: 'Ventaja aproximada',
    estimatedEdgeBody:
      'Es una idea general de si la mesa te favorece; no promete que vayas a ganar.',
    estimatedEdgeFormula: 'Ventaja ≈ (Conteo real − 1) × 0.5%',
    varianceTitle: 'Igual puedes perder racha',
    varianceBody:
      'Aunque el conteo vaya bien, en lo corto puedes perder varias manos seguidas. Esta app te ayuda a jugar mejor; no le gana a la suerte.',
  },
  offline: {
    message: 'Sin internet — todo se guarda en tu celular',
  },
  language: {
    label: 'Idioma',
    es: 'Español',
    en: 'English',
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
};

export const en: Translations = {
  app: {
    title: 'Blackjack Live Helper',
    subtitle: 'Hi-Lo count · Strategy · Table mode',
    disclaimer:
      'This tool is educational and does not guarantee profit. Casino rules, table limits, penetration, mistakes, and variance affect results.',
  },
  shoe: {
    title: 'Shoe',
    decks: 'Decks:',
    hint: 'How many decks the casino uses at this table (usually 6 or 8).',
  },
  counter: {
    title: 'Count Dashboard',
    runningCount: 'Running Count',
    trueCount: 'True Count',
    cardsSeen: 'Cards Seen',
    decksRemaining: 'Decks Remaining',
    penetration: 'Penetration',
    betting: 'Betting',
    estimatedEdge: 'Estimated Edge',
    edgeApprox: 'Approximation only',
    insurance: 'Insurance',
    insuranceTake: 'TAKE',
    insuranceNo: 'NO',
  },
  dealer: {
    title: 'Dealer Visible Card',
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
    title: 'Extra Visible Cards',
    hint: 'Discards, other players, burn cards, etc.',
  },
  strategy: {
    title: 'Strategy',
    needDealer: 'Set dealer card to see strategy recommendations.',
    cards: 'Cards:',
    total: 'Total:',
    handLabel: (num) => `(Hand ${num})`,
  },
  tableMode: {
    title: 'Live Table Mode',
    description:
      'Lock your preliminary decision while other players act. The app recalculates as extra visible cards are added.',
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
      'Penetration is how deep into the shoe you are. Higher penetration means more reliable count data, but less time to bet big before the shuffle.',
    penetrationFormula: 'Penetration = Cards Seen ÷ Total Cards × 100',
    tableDynamicsTitle: 'Table Dynamics',
    tableDynamicsBody:
      'With 3–4 players at the table, more cards are dealt face-up before your turn. That gives you extra time to input visible cards and refine your count and strategy decision.',
    visibleCardsTitle: 'More Visible Cards = Better Count',
    visibleCardsBody:
      'Every card you can see — dealer upcard, your hand, other players, and discards — improves count accuracy. Track everything visible.',
    estimatedEdgeTitle: 'Estimated Edge',
    estimatedEdgeBody:
      'The edge estimate is a rough approximation, not a guarantee of profit.',
    estimatedEdgeFormula: 'Estimated Edge ≈ (True Count − 1) × 0.5%',
    varianceTitle: 'Variance Still Matters',
    varianceBody:
      'Even with a positive count, short-term results swing wildly. You can lose many hands in a row despite playing correctly. This tool helps you make better decisions — it does not eliminate luck.',
  },
  offline: {
    message: 'Offline — all data saved locally',
  },
  language: {
    label: 'Language',
    es: 'Español',
    en: 'English',
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
};
