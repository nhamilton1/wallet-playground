import Transport from "@ledgerhq/hw-transport";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Btc from "@ledgerhq/hw-app-btc";
import React, { useState } from "react";

declare global {
  interface Window {
    ledgerTransport: Transport;
  }
}

interface InitAdd {
  bitcoinAddress: string;
  chainCode: string;
  publicKey: string;
}

const InitialAddress = {
  bitcoinAddress: "",
  chainCode: "",
  publicKey: "",
};

const LedgerTest = () => {
  const [transport, setTransport] = useState<object>();
  // const [error, setError] = useState<object>();
  const [address, setAddress] = useState<InitAdd>(InitialAddress);
  const [xpub, setXpub] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    const transport = await TransportWebUSB.create();
    const btc = new Btc(transport);
    console.log(transport);

    // single sig setup
    const getWalletPublicKey = await btc.getWalletPublicKey("M/84'/0'/0'/0'", {
      format: "bech32",
    });
    const xpub = await btc.getWalletXpub({
      path: "m/84'/0'/0'",
      xpubVersion: 76067358,
    });

    // multi sig setup
    // const getWalletPublicKey = await btc.getWalletPublicKey("m/48'/0'/0'/2'");
    // const xpub = await btc.getWalletXpub({
    //   path: "m/48'/0'/0'/2'",
    //   xpubVersion: 76067358,
    // });

    console.log(getWalletPublicKey);
    setAddress({
      ...address,
      bitcoinAddress: getWalletPublicKey.bitcoinAddress,
      chainCode: getWalletPublicKey.chainCode,
      publicKey: getWalletPublicKey.publicKey,
    });
    setXpub(xpub);
    setTransport(transport);
  };

  const handleSignClick = async () => {
    const transport = await TransportWebUSB.create();
    const btc = new Btc(transport);
    btc
      .signMessageNew("M/84'/0'/0'/0'", Buffer.from("test").toString("hex"))
      .then((result) => {
        let v = result["v"] + 27 + 4;
        let signature = Buffer.from(
          v.toString(16) + result["r"] + result["s"],
          "hex"
        ).toString("base64");
        console.log("Signature : " + signature);
        return signature;
      })
      .catch((ex) => console.log(ex));
  };

  return (
    <div className="flex justify-center items-center flex-col ">
      <div>
        <h1>Ledger Test</h1>
        <button
          className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          type="button"
          onClick={handleClick}
        >
          Create
        </button>
      </div>
      {!transport && !xpub ? (
        ""
      ) : (
        <div className="flex flex-row justify-center ">
          <div className="mt-10 break-all w-80">
            <h2 className="underline">Xpub</h2>
            <p>{!xpub ? "" : xpub}</p>
          </div>
          <div className="mt-10 break-all w-80 m-3">
            <h2 className="underline">Address</h2>
            <p>
              {" "}
              <strong>chainCode:</strong> <span> {address.chainCode}</span>
            </p>
            <p>
              {" "}
              <strong>publicKey:</strong> <span> {address.publicKey}</span>
            </p>
            <p>
              {" "}
              <strong>bitcoinAddress:</strong>{" "}
              <span> {address.bitcoinAddress}</span>
            </p>
          </div>
        </div>
      )}
      <div>
        <h2 className="underline">Sign Message Here</h2>
        <div>
          <button
            className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            type="button"
            onClick={handleSignClick}
          >
            Sign Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default LedgerTest;
