export default function shortAddress(address) {
  return `${address.slice(0, 3)}\u2026${address.slice(-3)}`
}
