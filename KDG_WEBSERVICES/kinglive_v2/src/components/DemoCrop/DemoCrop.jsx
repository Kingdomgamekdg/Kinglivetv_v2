import { useCallback, useMemo, useState } from 'react'
import Cropper from 'react-easy-crop'
// import nft from '../../assets/images/nft-market/nft.png'

const DemoCrop = ({ onCancel = () => {}, onFinish = () => {}, typeImage = 1, image = '' }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [imagePos, setImagePos] = useState({ x: 0, y: 0, zoom: 100 })

  const aspect = useMemo(() => {
    if (typeImage === 1) return 1
    return 3
  }, [typeImage])

  const onCropComplete = useCallback(
    ({ x, y, width }) => {
      setImagePos({ x, y, zoom: 10000 / width })
    },
    [zoom]
  )

  return (
    <>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        showGrid={false}
        zoomWithScroll={false}
      />

      <div
        style={{
          position: 'absolute',
          top: 50,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '50%',
        }}
      >
        <input
          style={{ width: '100%' }}
          type='range'
          defaultValue={1}
          min={1}
          max={3}
          step={0.01}
          onInput={(e) => setZoom(e.target.value)}
        />
      </div>

      <div style={{ position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)' }}>
        <div className='buttonX mr-20' onClick={() => onFinish(imagePos)}>
          Done
        </div>
        <div className='buttonX buttonX--cancel' onClick={onCancel}>
          Cancel
        </div>
      </div>
    </>
  )
}

export default DemoCrop
