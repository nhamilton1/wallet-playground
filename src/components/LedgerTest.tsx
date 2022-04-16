import Transport from "@ledgerhq/hw-transport";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Btc from "@ledgerhq/hw-app-btc";
import { useState } from "react";
import React from "react";

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
    bitcoinAddress: '',
    chainCode: '',
    publicKey: '',
}

const LedgerTest = () => {
  const [transport, setTransport] = useState<object>();
  const [error, setError] = useState<object>();
  const [address, setAddress] = useState<InitAdd>(InitialAddress);
  const [xpub, setXpub] = useState()

  const handleClick = async () => {
    const transport = await TransportWebUSB.create();

    // single sig setup
    // const getWalletPublicKey = await btc.getWalletPublicKey("m/84'/0'/0'", { format: "bech32"});
    // const xpub = await btc.getWalletXpub({
    //     path: "m/84'/0'/0'",
    //     xpubVersion: 76067358
    // })

    const btc = new Btc(transport);
    console.log(btc);

    const xpub = await btc.getWalletXpub({
    path: "m/48'/0'/0'/2'",
    xpubVersion: 76067358
    })

    console.log(xpub)

    // const transportError = TransportWebUSB.e
    // console.log(getWalletXpub);
    setTransport(transport);
  };


  return (
    <div>
      <h1>Ledger Test</h1>
      <button onClick={handleClick}>Create</button>
    </div>
  );
};

export default LedgerTest;