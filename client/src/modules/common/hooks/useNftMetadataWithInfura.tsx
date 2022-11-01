import { resolveLink } from '@utils/index';
import { useEffect, useState } from 'react';

function useNftMetadataWithInfura(tokenUri: string = '') {
  const [imgUri, setImgUri] = useState<string>('');
  const [nftName, setNftName] = useState<string>('');
  const [nftDiscription, setNftDiscription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchNftMetadata = async () => {
    try {
      setIsLoading(true);

      //@ts-ignore
      const response = await fetch(resolveLink(tokenUri));
      const res = await response.json();

      if (res.detail || res.error) {
        setTimeout(() => {
          fetchNftMetadata();
        }, 1000);
        return;
      }

      if (res.image) {
        setImgUri(resolveLink(res.image));
      } else setImgUri('');

      if (res.name) {
        setNftName(res.name);
      }

      if (res.description) {
        setNftDiscription(res.description);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setImgUri('');
    if (tokenUri) {
      fetchNftMetadata();
    }
  }, [tokenUri]);

  return {
    nftDiscription,
    imgUri,
    nftName,
    isLoading,
  };
}

export default useNftMetadataWithInfura;
