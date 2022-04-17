import Trezor from "components/Trezor";
import React from "react";
import Ledger from "./components/Ledger";

function App() {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div>
        <div className="flex flex-col justify-center items-center">
          <h1>Ledger</h1>
          <Ledger />
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
