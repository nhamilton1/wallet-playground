export interface initPubKeyInterface {
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

export interface initBc1Interface {
  address: string;
  serializedPath: string;
  path: number[];
}

export interface initSignInterface {
  address: string;
  signature: string;
}
