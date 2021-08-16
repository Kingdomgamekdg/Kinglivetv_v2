
const SlideArtworkDetail = () => {
    
    return (
        <>
            <div className="box-slide-artwork">
                <div className="box-return">
                    <img src={arrowLeft} alt="" /> 
                    <span className="text-return">The World NFT Set Up In My Mind</span>
                </div>
                <Swiper
                    centeredSlides={true}
                    centered
                    loop={true}
                    lazy={true}
                    navigation={true}
                    spaceBetween={0}
                    slidesPerView={1}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                    >
                    <SwiperSlide>{contentSwiper}</SwiperSlide>
                </Swiper>
                <div className="box-img">
                    <img src={zoom} alt="" />
                </div>
            </div>
        </>
    )
}
export default SlideArtworkDetail