import { NFTCard } from "../components/nftCard";
import { useState } from "react";

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState("");
  const [startToken, setStartToken] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchNFTs = async () => {
    setIsLoading(true);
    let nfts;
    console.log("fetching nfts");
    const api_key = "lmsojVdyGh8B3152-q-bDPtiaC_Ce1rq";
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
    var requestOptions = {
      method: "GET",
    };

    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${wallet}&pageKey=${nextPage}&pageSize=${pageSize}`;

      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      console.log("fetching nfts for collection owned by address");
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}&pageKey=${nextPage}&pageSize=${pageSize}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    }

    console.log(nfts);
    setIsLoading(false);
    if (nfts) {
      console.log("nfts:", nfts);
      setNFTs(nfts.ownedNfts);
      if (nfts.pageKey) {
        setNextPage(nfts.pageKey);
      }
    }
  };

  const fetchNFTsForCollection = async () => {
    console.log("for collection");
    if (collection.length) {
      var requestOptions = {
        method: "GET",
      };
      const api_key = "lmsojVdyGh8B3152-q-bDPtiaC_Ce1rq";
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${startToken}&limit=${pageSize}`;
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );
      if (nfts) {
        console.log("NFTs in collection:", nfts);
        setNFTs(nfts.nfts);
      }
      setStartToken(startToken + pageSize);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <style>{"body { background-color: rgb(40,40,40); }"}</style>
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          disabled={fetchForCollection}
          className="bg-slate-400 px-8 py-1 rounded text-gray-800 disabled:text-slate-400 font-medium disabled:placeholder-slate-400 placeholder-gray-800"
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
          value={wallet}
          type={"text"}
          placeholder="Add your wallet address"
        ></input>
        <input
          className="bg-slate-400 px-8 py-1 rounded text-gray-800 font-medium placeholder-gray-800"
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          type={"text"}
          placeholder="Add the collection address"
        ></input>

        <label className="text-gray-400">
          <input
            onChange={(e) => {
              setFetchForCollection(e.target.checked);
            }}
            type={"checkbox"}
            className="mr-2"
          ></input>
          Fetch for collection
        </label>

        <button
          className={
            "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5 font-medium rounded"
          }
          onClick={() => {
            setNFTs([]);
            setNextPage("");
            setStartToken(1);
            if (fetchForCollection) {
              fetchNFTsForCollection();
            } else {
              fetchNFTs();
            }
          }}
        >
          Let's go!
        </button>
        {(nextPage != "" || startToken > 1) && (
          <button
            className={
              "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5 font-medium rounded"
            }
            onClick={() => {
              if (fetchForCollection) {
                fetchNFTsForCollection();
              } else {
                fetchNFTs();
              }
            }}
          >
            Next Page
          </button>
        )}
        {isLoading && <p className="text-gray-400">Loading...</p>}
        <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
          {NFTs.length &&
            NFTs.map((nft, i) => {
              return <NFTCard nft={nft} key={i}></NFTCard>;
            })}
        </div>
      </div>
    </div>
  );
};

export default Home;
