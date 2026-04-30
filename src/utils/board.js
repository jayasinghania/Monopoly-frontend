export const GROUP_COLORS = {
  brown: { bg: '#8B4513', text: '#fff', light: '#a0522d' },
  lightBlue: { bg: '#87CEEB', text: '#1a1a2e', light: '#b0e0f0' },
  pink: { bg: '#DB2777', text: '#fff', light: '#ec4899' },
  orange: { bg: '#EA580C', text: '#fff', light: '#f97316' },
  red: { bg: '#DC2626', text: '#fff', light: '#ef4444' },
  yellow: { bg: '#EAB308', text: '#1a1a2e', light: '#facc15' },
  green: { bg: '#16A34A', text: '#fff', light: '#22c55e' },
  blue: { bg: '#1D4ED8', text: '#fff', light: '#3b82f6' },
};

export const BOARD_SPACES = [
  { id: 0, name: 'GO', shortName: 'GO', type: 'go', icon: '→' },
  { id: 1, name: 'Mediterranean Ave', shortName: 'Mediterranean', type: 'property', group: 'brown', price: 60, houseCost: 50 },
  { id: 2, name: 'Community Chest', shortName: 'Community', type: 'community', icon: '📦' },
  { id: 3, name: 'Baltic Avenue', shortName: 'Baltic', type: 'property', group: 'brown', price: 60, houseCost: 50 },
  { id: 4, name: 'Income Tax', shortName: 'Income Tax', type: 'tax', icon: '💰', amount: 200 },
  { id: 5, name: 'Reading Railroad', shortName: 'Reading RR', type: 'railroad', icon: '🚂', price: 200 },
  { id: 6, name: 'Oriental Avenue', shortName: 'Oriental', type: 'property', group: 'lightBlue', price: 100, houseCost: 50 },
  { id: 7, name: 'Chance', shortName: 'Chance', type: 'chance', icon: '❓' },
  { id: 8, name: 'Vermont Avenue', shortName: 'Vermont', type: 'property', group: 'lightBlue', price: 100, houseCost: 50 },
  { id: 9, name: 'Connecticut Ave', shortName: 'Connecticut', type: 'property', group: 'lightBlue', price: 120, houseCost: 50 },
  { id: 10, name: 'Jail', shortName: 'JAIL', type: 'jail', icon: '🔒' },
  { id: 11, name: 'St. Charles Place', shortName: 'St. Charles', type: 'property', group: 'pink', price: 140, houseCost: 100 },
  { id: 12, name: 'Electric Company', shortName: 'Electric Co', type: 'utility', icon: '💡', price: 150 },
  { id: 13, name: 'States Avenue', shortName: 'States', type: 'property', group: 'pink', price: 140, houseCost: 100 },
  { id: 14, name: 'Virginia Avenue', shortName: 'Virginia', type: 'property', group: 'pink', price: 160, houseCost: 100 },
  { id: 15, name: 'Pennsylvania RR', shortName: 'Penn. RR', type: 'railroad', icon: '🚂', price: 200 },
  { id: 16, name: 'St. James Place', shortName: 'St. James', type: 'property', group: 'orange', price: 180, houseCost: 100 },
  { id: 17, name: 'Community Chest', shortName: 'Community', type: 'community', icon: '📦' },
  { id: 18, name: 'Tennessee Ave', shortName: 'Tennessee', type: 'property', group: 'orange', price: 180, houseCost: 100 },
  { id: 19, name: 'New York Avenue', shortName: 'New York', type: 'property', group: 'orange', price: 200, houseCost: 100 },
  { id: 20, name: 'Free Parking', shortName: 'FREE', type: 'freeParking', icon: '🅿️' },
  { id: 21, name: 'Kentucky Avenue', shortName: 'Kentucky', type: 'property', group: 'red', price: 220, houseCost: 150 },
  { id: 22, name: 'Chance', shortName: 'Chance', type: 'chance', icon: '❓' },
  { id: 23, name: 'Indiana Avenue', shortName: 'Indiana', type: 'property', group: 'red', price: 220, houseCost: 150 },
  { id: 24, name: 'Illinois Avenue', shortName: 'Illinois', type: 'property', group: 'red', price: 240, houseCost: 150 },
  { id: 25, name: 'B. & O. Railroad', shortName: 'B&O RR', type: 'railroad', icon: '🚂', price: 200 },
  { id: 26, name: 'Atlantic Avenue', shortName: 'Atlantic', type: 'property', group: 'yellow', price: 260, houseCost: 150 },
  { id: 27, name: 'Ventnor Avenue', shortName: 'Ventnor', type: 'property', group: 'yellow', price: 260, houseCost: 150 },
  { id: 28, name: 'Water Works', shortName: 'Water Works', type: 'utility', icon: '🚰', price: 150 },
  { id: 29, name: 'Marvin Gardens', shortName: 'Marvin Gdns', type: 'property', group: 'yellow', price: 280, houseCost: 150 },
  { id: 30, name: 'Go to Jail', shortName: 'GO TO JAIL', type: 'goToJail', icon: '👮' },
  { id: 31, name: 'Pacific Avenue', shortName: 'Pacific', type: 'property', group: 'green', price: 300, houseCost: 200 },
  { id: 32, name: 'N. Carolina Ave', shortName: 'N. Carolina', type: 'property', group: 'green', price: 300, houseCost: 200 },
  { id: 33, name: 'Community Chest', shortName: 'Community', type: 'community', icon: '📦' },
  { id: 34, name: 'Pennsylvania Ave', shortName: 'Pennsylvania', type: 'property', group: 'green', price: 320, houseCost: 200 },
  { id: 35, name: 'Short Line', shortName: 'Short Line', type: 'railroad', icon: '🚂', price: 200 },
  { id: 36, name: 'Chance', shortName: 'Chance', type: 'chance', icon: '❓' },
  { id: 37, name: 'Park Place', shortName: 'Park Place', type: 'property', group: 'blue', price: 350, houseCost: 200 },
  { id: 38, name: 'Luxury Tax', shortName: 'Luxury Tax', type: 'tax', icon: '💎', amount: 100 },
  { id: 39, name: 'Boardwalk', shortName: 'Boardwalk', type: 'property', group: 'blue', price: 400, houseCost: 200 },
];

export function getBoardPosition(id) {
  if (id >= 0 && id <= 10) {
    return { row: 10, col: 10 - id, side: 'bottom' };
  } else if (id >= 11 && id <= 19) {
    return { row: 10 - (id - 10), col: 0, side: 'left' };
  } else if (id >= 20 && id <= 30) {
    return { row: 0, col: id - 20, side: 'top' };
  } else {
    return { row: id - 30, col: 10, side: 'right' };
  }
}
