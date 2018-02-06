export const timeFormat = (duration: number): string => {
  const d = new Date(0);
  d.setSeconds(duration);
  return d.toISOString().substr(11, 8);
};

export const distanceFormat = (distance: number): string => {
  if (distance < 1000) {
    return `${distance} m`;
  }
  return `${(distance / 1000).toFixed(2)} km`;
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const randomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};