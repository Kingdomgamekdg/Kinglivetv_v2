export default function shortAddress(address) {
  return `${address.slice(0, 5)}\u2026${address.slice(-5)}`
}
