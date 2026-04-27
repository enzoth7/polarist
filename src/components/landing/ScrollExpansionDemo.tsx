import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

const mediaContent = {
  video: {
    src: '/images/landing/scroll_media.png',
    background: '/images/landing/scroll_bg.png',
    titleLeft: 'Para eso',
    titleRight: 'Creamos',
  },
};

const ScrollExpansionDemo = () => {
  const currentMedia = mediaContent.video;

  return (
    <div className='relative z-[18] w-full bg-black' style={{ background: '#010101' }}>
      <ScrollExpandMedia
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        titleLeft={currentMedia.titleLeft}
        titleRight={currentMedia.titleRight}
      />
    </div>
  );
};

export default ScrollExpansionDemo;
