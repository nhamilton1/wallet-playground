import Transport from "@ledgerhq/hw-transport";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import React, { useLayoutEffect, useState } from "react";
import { InitAdd } from "../interface";
import BtcOld from "@ledgerhq/hw-app-btc/lib/BtcOld";

declare global {
  export interface Window {
    ledgerTransport: Transport;
  }
}

const InitialAddress = {
  bitcoinAddress: "",
};

const Ledger: React.FC = () => {
  const [transport, setTransport] = useState<object>();
  const [error, setError] = useState<string>("");
  const [address, setAddress] = useState<InitAdd>(InitialAddress);
  const [xpub, setXpub] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [signError, setSignError] = useState<string>("");
  const [signedMessageClicked, setSignedMessageClicked] =
    useState<boolean>(false);

  useLayoutEffect(() => {
    if (transport) {
      setError("");
    }
    if (signature) {
      setSignedMessageClicked(false);
      setSignError("");
    }
  }, [transport, signature]);

  const handleClick = async () => {
    try {
      const transport = await TransportWebUSB.create();
      // have to use BtcOld becuase Btc was not letting me use non standard path to find address
      // also BtcOld lets me assign the corect xpubVersion to get right xpub
      // testnet P2WSH xpubVersion = 39277699
      const oldBtc = new BtcOld(transport);

      // have to install bitcoin testnet on ledger
      // 48'/1'/0'/2'/0/0
      const getWalletPublicKey = await oldBtc.getWalletPublicKey(
        "M/48'/1'/0'/2'/0/0",
        {
          format: "bech32",
        }
      );

      const getXpub = await oldBtc.getWalletXpub({
        path: "48'/1'/0'/2'",
        xpubVersion: 39277699,
      });

      setAddress({
        ...address,
        bitcoinAddress: getWalletPublicKey.bitcoinAddress,
      });
      setXpub(getXpub);
      setTransport(transport);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleSignClick = async () => {
    setSignature("");
    setSignedMessageClicked(true);
    const transport = await TransportWebUSB.create();
    const btc = new BtcOld(transport);
    try {
      const signMessage = await btc.signMessageNew(
        "48'/1'/0'/2'/0/0",
        Buffer.from("test").toString("hex")
      );
      let v = signMessage["v"] + 27 + 4;
      let signature = Buffer.from(
        v.toString(16) + signMessage["r"] + signMessage["s"],
        "hex"
      ).toString("base64");
      console.log("Signature : " + signature);
      setSignature(signature);
    } catch (e: any) {
      setSignError(e.message);
      console.error(e);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col mt-7 w-full">
      <div className="flex justify-center items-center flex-row w-full">
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
        <div className="flex justify-center items-center flex-col">
          <h2>Sign Message Here</h2>
          <button
            className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            type="button"
            onClick={handleSignClick}
          >
            Sign Message
          </button>
        </div>
      </div>
      <div className="p-10">
        {signedMessageClicked === false ? (
          ""
        ) : (
          <div>
            <p className="text-red-500">
              Please follow instructions on your ledger device
            </p>
          </div>
        )}
        {!transport && !xpub ? (
          ""
        ) : (
          <div>
            <div className="break-all">
              <p>
                <strong>xpub:</strong> <span>{!xpub ? "" : xpub}</span>
              </p>
            </div>
            <div className="break-all">
              <p>
                <strong>bitcoinAddress:</strong>{" "}
                <span> {address.bitcoinAddress}</span>
              </p>
            </div>
          </div>
        )}
        {!signature ? (
          ""
        ) : (
          <div className="break-all">
            <h2 className="underline">Signature</h2>
            <p>{!signature ? "" : signature}</p>
          </div>
        )}
      </div>
      <div className="w-full">
        <div>
          {signError ? (
            <div className="mb-20">
              <p className="text-red-500">{signError}</p>{" "}
            </div>
          ) : null}
        </div>
      </div>
      {error ? (
        <div className="mb-20">
          <p className="text-red-500">{error}</p>{" "}
        </div>
      ) : null}
    </div>
  );
};

export default Ledger;
