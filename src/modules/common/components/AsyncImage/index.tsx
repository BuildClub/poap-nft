import { ipfsLinkError } from '@utils/index';
import { useEffect, useRef, useState } from 'react';

interface Iimage {
  src: string | undefined;
  alt: string;
  onError: () => void;
}

const AsyncImage = (props: Iimage) => {
  const [isFallbackNode, setIsFallbackNode] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const loadedSrcRef = useRef<string | undefined>('');

  const image = new Image();

  useEffect(() => {
    loadedSrcRef.current = '';
    if (props.src) {
      const handleLoad = () => {
        loadedSrcRef.current = props.src;
        setIsImageLoaded(true);
      };

      image.addEventListener('load', handleLoad);
      image.src = props.src;
      image.onerror = props.onError;
      image.alt = props.alt;
      setTimeout(() => {
        if (loadedSrcRef.current !== props.src) {
          //@ts-ignore
          image.src = ipfsLinkError(props.src);
          setIsFallbackNode(true);
          image.removeEventListener('load', handleLoad);
        }
      }, 5000);
      return () => {
        image.removeEventListener('load', handleLoad);
      };
    }
  }, [props.src]);

  if (isImageLoaded && !isFallbackNode) {
    return <img {...props} />;
  }
  if (isFallbackNode && !isImageLoaded) {
    return <img src={ipfsLinkError(props.src)} alt={props.alt} onError={props.onError} />;
  }
  return <img {...props} />;
};

export default AsyncImage;
