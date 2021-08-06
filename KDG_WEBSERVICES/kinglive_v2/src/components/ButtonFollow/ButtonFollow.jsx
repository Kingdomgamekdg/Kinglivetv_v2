export default function ButtonFollow({ isFollow, handleFollow }) {
  return (
    <div className={`button-follow ${isFollow ? 'following' : ''}`} onClick={handleFollow}>
      <span className='span1'>{isFollow ? 'Following' : 'Follow'}</span>
      <span className='span2'>Unfollow</span>
    </div>
  )
}
