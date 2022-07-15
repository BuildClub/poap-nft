import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePoapLinksSignContract } from '@modules/common/hooks/useContract';
import { buildQueryGodwoken } from '@utils/contracts';
import { LINKS_NFT_ADDRESS } from '@utils/constants';

function useERC1155Tokens(address: string) {
  const [nfts, setNfts] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const { chainId, account } = useWeb3React();

  const {
    balanceOf: balanceOfQuery,
    uri: tokenUriQuery,
    getNftsIdsOfUser: getNftsIdsOfUserQuery,
  } = usePoapLinksSignContract(LINKS_NFT_ADDRESS, true);

  useEffect(() => {}, [address]);

  const fetchUsersNfts = useCallback(async () => {
    if (!account) return;

    try {
      setIsLoading(true);

      let tokensUris = [];

      const getNftsIdsOfUser: string = await buildQueryGodwoken(
        getNftsIdsOfUserQuery,
        [account],
        500000,
      );

      if (getNftsIdsOfUser.length === 0) {
        setIsLoading(false);
        return;
      }

      //@ts-ignore
      for (const nftId of getNftsIdsOfUser) {
        const balanceOf: string = await buildQueryGodwoken(
          balanceOfQuery,
          [account, +nftId.toString()],
          500000,
        );
        const tokenURI: string = await buildQueryGodwoken(
          tokenUriQuery,
          [+nftId.toString()],
          500000,
        );

        tokensUris.push({
          token_uri: tokenURI,
          token_address: LINKS_NFT_ADDRESS,
          token_id: String(+nftId.toString()),
          owner_of: account,
        });
      }

      setNfts(tokensUris);
      setTotal(getNftsIdsOfUser.length);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [address, account]);

  useEffect(() => {
    fetchUsersNfts();
  }, [fetchUsersNfts]);

  return { nfts, total, isLoading };
}

export default useERC1155Tokens;
