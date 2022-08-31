import { useState, useEffect } from 'react';
import AppAuthenticated from "../AppAuthenticated"
import Web3 from 'web3/dist/web3.min.js';

const Metamask = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [instruction, setInstruction] = useState("Waiting for connection with wallet...");

  useEffect(() => {
    const connectWallet = async () => {
      if(!window.ethereum)
        return;

      try {
        await window.ethereum.send('eth_requestAccounts');
        window.web3 = new Web3(window.ethereum);
      } catch (error) {
        setInstruction("Wallet connection denied, reload the page to try again.");
        return;
      }
      setInstruction("");
      setWalletConnected(true);
    };
    connectWallet();
    console.log("window.ethereum",window.ethereum);
  }, []);

  return (
    <div>
      {window.ethereum ?
        (walletConnected ?
          <AppAuthenticated/>
          : instruction)
        : "Metamask or other EIP-1102 / EIP-1193 compliant wallet not found."
      }
    </div>
  )
}

export default Metamask