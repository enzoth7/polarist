import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

const mediaContent = {
  video: {
    src: '/images/landing/para-eso-creamos-firefly.webm',
    background: '/images/landing/para-eso-creamos.webm',
    frameSequence: {
      basePath: '/images/landing/para-eso-creamos-firefly-frames-48',
      frameCount: 321,
    },
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
        frameSequence={currentMedia.frameSequence}
        titleLeft={currentMedia.titleLeft}
        titleRight={currentMedia.titleRight}
      />
    </div>
  );
};

export default ScrollExpansionDemo;
