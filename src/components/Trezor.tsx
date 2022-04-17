import React, { useEffect, useState } from "react";
import TrezorConnect from "trezor-connect";

interface initPubKeyInterface {
  chainCode: string;
  childNum: number;
  depth: number;
  fingerprint: number;
  publicKey: string;
  serializedPath: string;
  xpub: string;
  xpubSegwit: string;
  path?: number[];
}

const initPubkey = {
  chainCode: "",
  childNum: 0,
  depth: 0,
  fingerprint: 0,
  publicKey: "",
  serializedPath: "",
  xpub: "",
  xpubSegwit: "",
  path: [],
};

interface initBc1Interface {
  address: string;
  serializedPath: string;
  path: number[];
}

const initBc1 = {
  address: "",
  serializedPath: "",
  path: [],
};

interface initSignInterface {
  address: string;
  signature: string;
}

const initSign = {
  address: "",
  signature: "",
};

const Trezor: React.FC = () => {
  const [pubKey, setPubKey] = useState<initPubKeyInterface>(initPubkey);
  const [success, setSuccess] = useState(false);
  const [bc1, setBc1] = useState<initBc1Interface>(initBc1);
  const [bc1Success, setBc1Success] = useState(false);
  const [signature, setSignature] = useState<initSignInterface>(initSign);
  const [signatureSuccess, setSignatureSuccess] = useState(false);

  useEffect(() => {
    TrezorConnect.manifest({
      email: "",
      appUrl: "",
    });
  }, []);

  const handleClick = async () => {
    try {
      const getPubKey = await TrezorConnect.getPublicKey({
        path: "m/84'/0'/0'/0'",
        coin: "bitcoin",
      });

      if (getPubKey.success) {
        setPubKey({
          ...pubKey,
          ...getPubKey.payload,
        });
        setSuccess(true);
      }
    } catch (err) {
      setSuccess(false);
      console.error(err);
    }
  };

  const handleGetAddress = async () => {
    try {
      const getAddress = await TrezorConnect.getAddress({
        //https://github.com/trezor/connect/blob/develop/docs/methods/path.md
        path: [
          (84 | 0x80000000) >>> 0,
          (0 | 0x80000000) >>> 0,
          (0 | 0x80000000) >>> 0,
          0,
          0,
        ],
        coin: "bitcoin",
      });

      console.log(getAddress);

      if (getAddress.success) {
        setBc1({
          ...bc1,
          ...getAddress.payload,
        });
        setBc1Success(true);
        console.log(getAddress.payload);
      }
    } catch (err) {
      setBc1Success(false);
      console.error(err);
    }
  };

  const handleSignature = async () => {
    try {
      const signMessage = await TrezorConnect.signMessage({
        path: [
          (84 | 0x80000000) >>> 0,
          (0 | 0x80000000) >>> 0,
          (0 | 0x80000000) >>> 0,
          0,
          0,
        ],
        message: "test",
        coin: "bitcoin",
      });

      if (signMessage.success) {
        setSignature({
          ...signature,
          ...signMessage.payload,
        });
        setSignatureSuccess(true);
      }
      console.log(signature);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center flex-row mt-10">
        <div className="flex justify-evenly items-center flex-row w-full">
          <div className="flex justify-center items-center flex-col m-1">
            <h1>Transport</h1>
            <button
              className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              type="button"
              onClick={handleClick}
            >
              Get pubkey
            </button>
          </div>
          <div className="flex justify-center items-center flex-col m-1">
            <h1>bc1</h1>
            <button
              className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              type="button"
              onClick={handleGetAddress}
            >
              Get bc1 address
            </button>
          </div>
          <div className="flex justify-center items-center flex-col m-1">
            <h1>Sign Msg</h1>
            <button
              className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              type="button"
              onClick={handleSignature}
            >
              Sign
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-center items-center flex-col p-10 w-full">
          {success === false ? (
            ""
          ) : (
            <div className="break-all w-3/4 p-3">
              <h2 className="underline">Xpub</h2>
              <p>{pubKey.xpub}</p>
            </div>
          )}
          {bc1Success === false ? (
            ""
          ) : (
            <div className="break-all w-3/4 p-3">
              <h2 className="underline">Address</h2>
              <p>{bc1.address}</p>
            </div>
          )}
          {signatureSuccess === false ? ( "" ) : (
            <div className="break-all w-3/4 p-3">
              <h2 className="underline">Signature</h2>
              <p>{signature.signature}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trezor;
