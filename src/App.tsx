import React from "react";
import LedgerTest from "./components/LedgerTest";

function App() {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex flex-col justify-center items-center">
        <h1>Ledger</h1>
        <LedgerTest />
      </div>
    </div>
  );
}

export default App;
