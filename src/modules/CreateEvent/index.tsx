import React, { useEffect, useMemo, useState } from 'react';
import { Input, Select, Tabs, Tooltip, DatePicker, Space, DatePickerProps } from 'antd';
import cn from 'classnames';
import s from './CreateEvent.module.scss';
import { LINKS_NFT_ADDRESS } from '@utils/constants';
import { usePoapLinksSignContract } from '@modules/common/hooks/useContract';
import { useWeb3React } from '@web3-react/core';
import { buildQueryGodwoken } from '@utils/contracts';
import { useMutation, useQuery } from 'react-query';
import { ADD_EVENT_KEY } from '@utils/queryKeys';
import { create as ipfsHttpClient } from 'ipfs-http-client';
// import keccak256 from 'keccak256';
// import { bufferToHex } from 'ethereumjs-util';

const { TextArea } = Input;
// const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';

const CreateEvent = ({}) => {
  const { account, chainId, library } = useWeb3React();

  //@ts-ignore
  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

  const [fileUrl, setFileUrl] = useState<string>('');
  const [formInput, updateFormInput] = useState({ email: '', name: '', description: '' });

  const {
    createEvent: addEventQuery,
    hasRole: hasRoleQyery,
    estimateGas: { addEvent: addEventEstimates },
  } = usePoapLinksSignContract(LINKS_NFT_ADDRESS, true);

  // const {
  //   data: isRoleAdmin,
  //   isLoading: isRoleAdminLoading,
  //   refetch: refetchIsRoleAdmin,
  // } = useQuery(
  //   `HasRole_${account}_${DEFAULT_ADMIN_ROLE}`,
  //   (): Promise<any> => buildQueryGodwoken(hasRoleQyery, [DEFAULT_ADMIN_ROLE, account], 500000),
  //   {
  //     enabled: !!account,
  //     onError: (err) => console.log(err, `HasRole_${account}_${DEFAULT_ADMIN_ROLE}`),
  //   },
  // );

  // useEffect(() => {
  //   if (account) {
  //     refetchIsRoleAdmin();
  //   }
  // }, [account]);

  const { data: addEventTx, mutateAsync: addEvent, isLoading: isAddEventLoading } = useMutation(
    `${ADD_EVENT_KEY}_${formInput.email}_${formInput.name}_${fileUrl}`,
    (url: any): Promise<any> =>
      buildQueryGodwoken(
        addEventQuery,
        [account, formInput.name, formInput.description, formInput.email, url],
        500000,
      ),
    {
      onError: (err) =>
        console.log(err, `${ADD_EVENT_KEY}_${formInput.email}_${formInput.name}_${fileUrl}`),
    },
  );

  const isStartAuctionBtnActive = useMemo(() => {
    if (!account) return true;
    // if (!account || !isRoleAdmin) return true;
    return false;
  }, [account]);
  // }, [account, isRoleAdmin]);

  const setImage = async (e: any) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      setFileUrl(url);
    } catch (error) {
      console.log('Error uploading file:', error);
    }
  };

  // async function getExampleImage() {
  //   const imageOriginUrl =
  //     'https://user-images.githubusercontent.com/87873179/144324736-3f09a98e-f5aa-4199-a874-13583bf31951.jpg';
  //   const r = await fetch(imageOriginUrl);
  //   if (!r.ok) {
  //     //@ts-ignore
  //     throw new Error(`error fetching image: [${r.statusCode}]: ${r.status}`);
  //   }
  //   return r.blob();
  // }

  const createEvent = async () => {
    const { name, description, email } = formInput;
    // console.log(' name, description, email ', name, description, email);

    if (!name || !description || !email || !fileUrl) return;
    // upload to IPFS
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    try {
      const added = await client.add(data);
      const url = added.path;
      // const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      // const image = await getExampleImage();

      // const nft = {
      //   image, // use image Blob as `image` field
      //   name: "Storing the World's Most Valuable Virtual Assets with NFT.Storage",
      //   description: 'The metaverse is here. Where is it all being stored?',
      //   properties: {
      //     type: 'blog-post',
      //     origins: {
      //       http: 'https://nft.storage/blog/post/2021-11-30-hello-world-nft-storage/',
      //       ipfs:
      //         'ipfs://bafybeieh4gpvatp32iqaacs6xqxqitla4drrkyyzq6dshqqsilkk3fqmti/blog/post/2021-11-30-hello-world-nft-storage/',
      //     },
      //     authors: [{ name: 'David Choi' }],
      //     content: {
      //       'text/markdown':
      //         'The last year has witnessed the explosion of NFTs onto the world’s mainstage. From fine art to collectibles to music and media, NFTs are quickly demonstrating just how quickly grassroots Web3 communities can grow, and perhaps how much closer we are to mass adoption than we may have previously thought. <... remaining content omitted ...>',
      //     },
      //   },
      // };

      // //@ts-ignore
      // const nftStorageClient = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API_KEY });
      // const metadata = await nftStorageClient.store(nft);

      // console.log('NFT data stored!');
      // console.log('Metadata URI: ', metadata.url);

      await addEvent(url);
      // console.log('addEventTx', addEventTx);
    } catch (error) {
      console.log('Error uploading file:', error);
    }
  };

  return (
    <div className="container">
      <div className={s.inner}>
        <h4 className={s.title}>Create event</h4>
        <h5 className={s.subTitle}>Event title</h5>
        <div className={cn(s.amount)}>
          <Input
            className={s.amountInput}
            value={formInput.name}
            onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
          />
        </div>

        <h5 className={s.subTitle}>Event description</h5>

        <div className={cn(s.amount)}>
          <TextArea
            className={s.areaInput}
            value={formInput.description}
            onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
          />
        </div>

        {/* <div className={s.inputs}>
        <div className={s.input}>
          <h5 className={s.subTitle}>Country</h5>

          <div
            onFocus={buyoutPriceFocus}
            onBlur={buyoutPriceFocus}
            className={cn(s.amount, selectBuyoutPriceFocus && s.amountFocus)}
          >
            <Input
              className={s.amountInput}
              placeholder="Amount"
              //   value={stopPriceValue}
              //   onChange={(e) => onStopPriceHandler(e.target.value)}
            />
          </div>
        </div>
        <div className={s.input}>
          <h5 className={s.subTitle}>City</h5>

          <div
            onFocus={buyoutPriceFocus}
            onBlur={buyoutPriceFocus}
            className={cn(s.amount, selectBuyoutPriceFocus && s.amountFocus)}
          >
            <Input
              className={s.amountInput}
              placeholder="Amount"
              //   value={stopPriceValue}
              //   onChange={(e) => onStopPriceHandler(e.target.value)}
            />
          </div>
        </div>
      </div> */}

        {/* <Space direction="horizontal"> */}

        {/* <div className={s.inputs}>
        <div className={s.inputDate}>
          <h5 className={s.subTitle}>Start date</h5>

          <DatePicker className={cn(s.amount, s.dateInput)} onChange={onChange} />
        </div>
        <div className={s.inputDate}>
          <h5 className={s.subTitle}>End date</h5>

          <DatePicker className={cn(s.amount, s.dateInput)} onChange={onChange} />
        </div>
        <div className={s.inputDate}>
          <h5 className={s.subTitle}>Expiration date</h5>

          <DatePicker className={cn(s.amount, s.dateInput)} onChange={onChange} />
        </div>
      </div> */}

        <div className={s.inputs}>
          <div className={s.input}>
            <h5 className={s.subTitle}>Upload image</h5>

            <div className={cn(s.amount)}>
              <Input className={s.amountInput} type="file" onChange={setImage} />
            </div>
          </div>
          <div className={s.input}>
            <h5 className={s.subTitle}>Email</h5>

            <div className={cn(s.amount)}>
              <Input
                className={s.amountInput}
                value={formInput.email}
                onChange={(e) => updateFormInput({ ...formInput, email: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* <div className={s.inputs}>
        <div className={s.input}>
          <h5 className={s.subTitle}>Upload emails</h5>

          <div
            onFocus={buyoutPriceFocus}
            onBlur={buyoutPriceFocus}
            className={cn(s.amount, selectBuyoutPriceFocus && s.amountFocus)}
          >
            <Input
              className={s.amountInput}
              placeholder="Amount"
              type="file"
              //   value={stopPriceValue}
              onChange={(e) => handleChangeXls(e)}
            />
          </div>
        </div>
        <div className={s.input}>
          <h5 className={s.subTitle}>Upload image</h5>

          <div
            onFocus={buyoutPriceFocus}
            onBlur={buyoutPriceFocus}
            className={cn(s.amount, selectBuyoutPriceFocus && s.amountFocus)}
          >
            <Input
              className={s.amountInput}
              placeholder="Amount"
              type="file"
              //   value={stopPriceValue}
              //   onChange={(e) => onStopPriceHandler(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={s.inputs}>
        <div className={s.input}>
          <h5 className={s.subTitle}>Number of links</h5>

          <div
            onFocus={buyoutPriceFocus}
            onBlur={buyoutPriceFocus}
            className={cn(s.amount, selectBuyoutPriceFocus && s.amountFocus)}
          >
            <Input
              className={s.amountInput}
              placeholder="Amount"
              type="number"
              //   value={stopPriceValue}
              //   onChange={(e) => onStopPriceHandler(e.target.value)}
            />
          </div>
        </div>
        <div className={s.input}>
          <h5 className={s.subTitle}>Email</h5>

          <div
            onFocus={buyoutPriceFocus}
            onBlur={buyoutPriceFocus}
            className={cn(s.amount, selectBuyoutPriceFocus && s.amountFocus)}
          >
            <Input
              className={s.amountInput}
              placeholder="Amount"
              //   value={stopPriceValue}
              //   onChange={(e) => onStopPriceHandler(e.target.value)}
            />
          </div>
        </div>
      </div> */}

        {/* </Space> */}

        {/* <h5 className={s.subTitle}>Auction duration</h5>
      <div className={s.auctionInputWrapper}>
        <div
          onFocus={auctionDateFocus}
          onBlur={auctionDateFocus}
          className={cn(s.amountAuction, selectAuctionDateFocus && s.amountFocus)}
        >
          <Input
            className={s.auctionInput}
            placeholder="Amount"
            // value={dateValue}
            // onChange={(e) => setDateValue(e.target.value)}
          />
        </div>
        <div className={'custom-select custom-select--arrow-inside custom-select--small-mobile'}>
          <Select defaultValue="days" onChange={setTimeRange}>
            <Option value="minutes">Minute(s)</Option>
            <Option value="hours">Hour(s)</Option>
            <Option value="days">Day(s)</Option>
            <Option value="months">Month(s)</Option>
          </Select>
        </div>
      </div> */}

        <div className={s.actionBtnWrapp}>
          <button disabled={isStartAuctionBtnActive} className="btn primary" onClick={createEvent}>
            {'Save'}
          </button>
        </div>

        {/* <div className={s.actionBtnWrapp}>
        <button
          className="btn primary"
          // onClick={completeAction}
          onClick={typeChangePrice ? saveChangesAction : completeAction}
          disabled={isButtonActive}
        >
          {typeChangePrice ? 'Save changes' : 'Complete'}
        </button>
      </div> */}
      </div>
    </div>
  );
};

export default CreateEvent;
