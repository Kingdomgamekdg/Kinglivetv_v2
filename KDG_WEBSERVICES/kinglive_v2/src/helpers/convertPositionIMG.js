export default function convertPositionIMG(position) {
  return {
    '--x': `-${position?.x}%`,
    '--y': `-${position?.y}%`,
    '--zoom': `${position?.zoom}%`,
  }
}
