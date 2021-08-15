export default function VideoPlayer({ guid }) {
  return (
    <div className='videoContainer'>
      <iframe
        className='videoContainer__player'
        title='video'
        loading='lazy'
        allowFullScreen={true}
        src={`https://iframe.mediadelivery.net/embed/1536/${guid}?autoplay=false`}
        allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
      ></iframe>
    </div>
  )
}
