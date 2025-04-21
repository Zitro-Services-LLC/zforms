
export function generateReferenceNumber() {
  const date = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateString =
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate());
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `EST-${dateString}-${rand}`;
}
