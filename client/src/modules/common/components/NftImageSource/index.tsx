import { useState } from 'react';
import { isVideo } from '@utils/index';
import AsyncImage from '../AsyncImage';

interface INftImageSource {
  source: string | undefined;
  controls: boolean;
  autoPlay: boolean;
  muted: boolean;
}

const NftImageSource = ({ source, controls, autoPlay, muted }: INftImageSource) => {
  const [isVideoActive, setIsVideoActive] = useState(false);

  const videoHandler = () => {
    setIsVideoActive(true);
  };

  return (
    <>
      {isVideo(source) || isVideoActive ? (
        <video
          width="100%"
          height="100%"
          preload="auto"
          autoPlay={autoPlay}
          loop
          controls={controls}
          muted={muted}
        >
          <source src={source} type="video/mp4" />
          <source src={source} type="video/webm" />
          <source src={source} type="video/ogg" />
        </video>
      ) : (
        <AsyncImage src={source} alt="NFT Card Image" onError={videoHandler} />
      )}
    </>
  );
};

export default NftImageSource;
