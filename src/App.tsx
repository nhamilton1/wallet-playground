import Trezor from "components/Trezor";
import React from "react";
import LedgerTest from "./components/LedgerTest";

function App() {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div>
        <div className="flex flex-col justify-center items-center">
          <h1>Ledger</h1>
          <LedgerTest />
        </div>
        <div className="flex flex-col justify-center items-center">
          <h1>Trezor</h1>
          <Trezor />
        </div>
      </div>
    </div>
  );
}

export default App;
