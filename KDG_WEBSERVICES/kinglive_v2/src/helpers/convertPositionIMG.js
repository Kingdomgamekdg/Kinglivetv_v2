export default function convertPositionIMG(position) {
  return {
    '--x': position?.x * -1 + '%',
    '--y': position?.y * -1 + '%',
    '--zoom': position?.zoom + '%',
  }
}
