import { ipfsLinkError, resolveLink } from '@utils/index';
import { useEffect, useState } from 'react';

function useNftMetadataWithInfura(tokenUri: string = '') {
  const [imgUri, setImgUri] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [nftName, setNftName] = useState<string>('');
  const [nftUrl, setNftUrl] = useState<string>('');
  const [nftAttributes, setNftAttributes] = useState<any>(null);
  const [nftDiscription, setNftDiscription] = useState<string>('');
  const [nftCreated, setNftCreated] = useState<string>('');
  const [collectionName, setCollectionName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchNftMetadata = async () => {
    try {
      setIsLoading(true);

      // TODO a better backend
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
        console.log('res.image', resolveLink(res.image));

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
    price,
    nftName,
    nftUrl,
    isLoading,
    nftAttributes,
    nftCreated,
    collectionName,
  };
}

export default useNftMetadataWithInfura;
