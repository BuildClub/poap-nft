import imgNotFuond from '@assets/images/NftCards/img-not-found.png';
import nftImg from '@assets/images/nft-img-example.svg';

const NftImageNotFound = () => {
  return (
    <img
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        bottom: '0',
        left: '0',
      }}
      src={nftImg}
      alt="Image not found"
    />
  );
};

export default NftImageNotFound;
