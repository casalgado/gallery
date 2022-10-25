import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";

export const NFTCard = ({ nft }) => {
  const [copied, setCopied] = useState(false);

  const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
  const truncateEthAddress = (address) => {
    const match = address.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="w-1/4 flex flex-col">
      <div className="rounded-md">
        <img
          className="object-cover h-128 w-full rounded-t-md"
          src={nft.media[0].gateway}
        ></img>
      </div>
      <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
        <div className="">
          <h2 className="text-xl text-gray-800">{nft.title}</h2>
          <p className="text-gray-600">Id: {parseInt(nft.id.tokenId, 16)}</p>

          <p className="text-gray-600">
            <CopyToClipboard
              text={nft.contract.address}
              onCopy={() => handleCopy()}
            >
              <button className="cursor:pointer inline">
                <img src="copy.png" alt="Copy to Clipboard Icon" />
              </button>
            </CopyToClipboard>
            {truncateEthAddress(nft.contract.address)}
            {copied && (
              <span className="ml-4 bg-slate-400 px-2 py-1 text-slate-800 rounded-xl">
                copied
              </span>
            )}
          </p>
        </div>

        <div className="flex-grow mt-2">
          <p className="text-gray-600">{nft.description}</p>
        </div>
      </div>
    </div>
  );
};
