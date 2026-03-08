export const INSTRUMENTS = ['Piano', 'Violin', 'Lute', 'Lyre', 'Cello', 'Guitar'] as const;

export type Instrument = (typeof INSTRUMENTS)[number];
