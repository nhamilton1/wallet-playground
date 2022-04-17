import Transport from "@ledgerhq/hw-transport";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Btc from "@ledgerhq/hw-app-btc";
import React, { useLayoutEffect, useState } from "react";

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

const Ledger: React.FC = () => {
  const [transport, setTransport] = useState<object>();
  const [error, setError] = useState<string>("");
  const [address, setAddress] = useState<InitAdd>(InitialAddress);
  const [xpub, setXpub] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [signError, setSignError] = useState<string>("");
  // const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    if (transport) {
      setError("");
    }
    if (signature) {
      setSignError("");
    }
  }, [transport, signature]);

  const handleClick = async () => {
    try {
      const transport = await TransportWebUSB.create();
      const btc = new Btc(transport);
      console.log(transport);

      // single sig setup
      const getWalletPublicKey = await btc.getWalletPublicKey(
        "M/84'/0'/0'/0'",
        {
          format: "bech32",
        }
      );
      const xpub = await btc.getWalletXpub({
        path: "m/84'/0'/0'",
        xpubVersion: 76067358,
      });

      console.log(getWalletPublicKey);
      setAddress({
        ...address,
        bitcoinAddress: getWalletPublicKey.bitcoinAddress,
        chainCode: getWalletPublicKey.chainCode,
        publicKey: getWalletPublicKey.publicKey,
      });
      setXpub(xpub);
      setTransport(transport);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }

    // multi sig setup
    // const getWalletPublicKey = await btc.getWalletPublicKey("m/48'/0'/0'/2'");
    // const xpub = await btc.getWalletXpub({
    //   path: "m/48'/0'/0'/2'",
    //   xpubVersion: 76067358,
    // });
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
        setSignature(signature);
        return signature;
      })
      .catch((e) => {
        setSignError(e.message);
        console.error(e);
      });
  };

  return (
    <div className="flex justify-center items-center flex-col mt-7 w-full">
      <div className="flex items-center flex-col justify-center">
        <div>
          <h1 className="text-center">Transport</h1>
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
          <div className="p-10">
            <div className="break-all">
              <h2 className="underline">Xpub</h2>
              <p>{!xpub ? "" : xpub}</p>
            </div>
            <div className="break-all">
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
      </div>
      <div className="w-full">
        <div>
          <div className="flex justify-center items-center flex-col">
            <h2>Sign Message Here</h2>
            <button
              className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              type="button"
              onClick={handleSignClick}
            >
              Sign Message
            </button>
            <div className="flex justify-center items-center flex-col p-10">
              {!signature ? (
                ""
              ) : (
                <div className="break-all">
                  <h2 className="underline">Signature</h2>
                  <p>{!signature ? "" : signature}</p>
                </div>
              )}
            </div>
          </div>
          {signError ? (
            <div className="m-5">
              <p className="text-red-500">{signError}</p>{" "}
            </div>
          ) : null}
        </div>
      </div>
      {error ? (
        <div className="m-5">
          <p className="text-red-500">{error}</p>{" "}
        </div>
      ) : null}
    </div>
  );
};

export default Ledger;
