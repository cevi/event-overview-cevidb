export function parseIsoDate(s: string): Date {
  const b = s.split(/\D+/);
  return new Date(Date.UTC(+b[0], +b[1] - 1, +b[2], 0, 0, 0));
}
