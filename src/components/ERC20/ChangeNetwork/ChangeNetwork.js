import { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import { Grid, Typography, Box, Button } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const networks = {
  eth: {
    // là mạng default nên chỉ cần chainId là được mấy cái dưới không cần
    chainId: `0x${Number(1).toString(16)}`,
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [
      "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
      "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
      "https://api.mycryptoapi.com/eth",
      "https://cloudflare-eth.com",
    ],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  kovan: {
    // là mạng default nên chỉ cần chainId là được mấy cái dưới không cần
    chainId: `0x${Number(42).toString(16)}`,
    chainName: "Ethereum Testnet Kovan",
    nativeCurrency: {
      name: "Kovan Ether",
      symbol: "KOV",
      decimals: 18,
    },
    rpcUrls: [
      "https://kovan.poa.network",
      "http://kovan.poa.network:8545",
      "https://kovan.infura.io/v3/${INFURA_API_KEY}",
      "wss://kovan.infura.io/ws/v3/${INFURA_API_KEY}",
      "ws://kovan.poa.network:8546",
    ],
    blockExplorerUrls: ["https://kovan.etherscan.io"],
  },
  ropsten: {
    // là mạng default nên chỉ cần chainId là được mấy cái dưới không cần
    chainId: `0x${Number(3).toString(16)}`,
    chainName: "Ropsten",
    nativeCurrency: {
      name: "Ropsten Ether",
      symbol: "ROP",
      decimals: 18,
    },
    rpcUrls: [
      "https://ropsten.infura.io/v3/${INFURA_API_KEY}",
      "wss://ropsten.infura.io/ws/v3/${INFURA_API_KEY}",
    ],
    blockExplorerUrls: ["https://ropsten.etherscan.io"],
  },
  rinkeby: {
    chainId: `0x${Number(4).toString(16)}`,
    chainName: "Rinkeby",
    nativeCurrency: {
      name: "Rinkeby Ether",
      symbol: "RIN",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.infura.io/v3/${INFURA_API_KEY}"],
    blockExplorerUrls: ["https://rinkeby.etherscan.io"],
  },
};
const changeNetwork = async ({ networkName, setError }) => {
  console.log("{ ...networks[networkName].chainId }", {
    chainId: networks[networkName].chainId,
  });
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: networks[networkName].chainId }],
    });
    console.log("switchError.code");
  } catch (switchError) {
    console.log("switchError.code", switchError.code);
    // 4002 : This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...networks[networkName],
            },
          ],
        });
      } catch (err) {
        setError(err.message);
      }
    }
  }
};

export default function ChangeNetwork() {
  const [error, setError] = useState();
  const [chain, setChain] = useState();

  const handleNetworkSwitch = async (networkName) => {
    setError();
    setChain(chain);
    await changeNetwork({ networkName, setError });
  };

  const networkChanged = (chainId) => {
    console.log({ chainId });
  };

  useEffect(() => {
    window.ethereum.on("chainChanged", networkChanged);

    return () => {
      window.ethereum.removeListener("chainChanged", networkChanged);
    };
  }, []);

  // const handleChange = (value) => {
  //   console.log("event.target.value", value);
  //   // setAge(event.target.value);
  // };

  return (
    <div>
      <main>
        <h1>Change MetaMask network</h1>
        <Box sx={{ width: 300 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Switch to</InputLabel>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={chain}
              label="Switch to"
              onChange={(event) => handleNetworkSwitch(event.target.value)}
            >
              <MenuItem value={"eth"}>Ethereum Mainnet</MenuItem>
              <MenuItem value={"kovan"}>Ethereum Testnet Kovan</MenuItem>
              <MenuItem value={"ropsten"}>Ropsten</MenuItem>
              <MenuItem value={"rinkeby"}>Rinkeby</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <ErrorMessage message={error} />
      </main>
    </div>
  );
}
