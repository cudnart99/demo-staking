import { useState, useEffect } from "react";
// import AppAuthenticated from "../AppAuthenticated";
import Web3 from "web3/dist/web3.min.js";
// import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
// import Web3Modal from "web3modal";

const ConnectWallet2 = () => {
  //   const [walletConnected, setWalletConnected] = useState(false);
  //   const [instruction, setInstruction] = useState(
  //     "Waiting for connection with wallet..."
  //   );
  const [acc, setAcc] = useState("");

  useEffect(() => {
    const connectWallet = async () => {
      const provider = new WalletConnectProvider({
        rpc: {
          56: "https://bsc-dataseed1.binance.org",
        },
      });

      //  Enable session (triggers QR Code modal)
      await provider.enable();

      // if (!window.ethereum) return;
      //   try {
      //     const providerOptions = {
      //       walletconnect: {
      //         package: WalletConnectProvider,
      //         options: {
      //           rpc: {
      //             56: "https://bsc-dataseed1.binance.org",
      //           },
      //           chainId: 56,
      //         },
      //       },
      //     };

      //     const web3Modal = new Web3Modal({
      //       network: "mainnet", // optional
      //       cacheProvider: true, // optional
      //       providerOptions, // required
      //     });

      //     const provider = await web3Modal.connect();
      //     await web3Modal.toggleModal();

      //     // regular web3 provider methods
          const newWeb3 = new Web3(provider);
          const accounts = await newWeb3.eth.getAccounts();
          setAcc(accounts[0])
      //     console.log(accounts);
      //   } catch (error) {
      //     setInstruction(
      //       "Wallet connection denied, reload the page to try again."
      //     );
      //     return;
      //   }
      };
      connectWallet();
      // setInstruction("");
      // setWalletConnected(true);
      //       try {
      //         await window.ethereum.send('eth_requestAccounts');
      //         window.web3 = new Web3(window.ethereum);
      //       } catch (error) {
      //         setInstruction("Wallet connection denied, reload the page to try again.");
      //         return;
    // };
  }, []);

  return (
    <div>
      <h1>I'm Connect Wallet</h1>
      {/* {window.ethereum ? ( */}
      {/* {walletConnected ? ( */}
      <>
        <h1>Account = {acc}</h1>
      </>
      {/* ) : (
        instruction
      )} */}
      {/* : ( */}
      {/* "Wallet not found." */}
      {/* )} */}
    </div>
  );
};

export default ConnectWallet2;
