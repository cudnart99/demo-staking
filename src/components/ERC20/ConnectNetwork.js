import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import "./style.css";
import { useDispatch } from "react-redux";
import {addChainId, addTokenAddress} from "../../redux/actions"
import {address} from "../TokenAddress/tokenAddress";


const networks = {
    bsc: {
        chainId: `0x${Number(56).toString(16)}`,
        chainName: "Binance Smart Chain Mainnet",
        nativeCurrency: {
            name: "Binance Chain Native Token",
            symbol: "BNB",
            decimals: 18,
        },
        rpcUrls: [
            "https://bsc-dataseed1.binance.org",
            "https://bsc-dataseed2.binance.org",
            "https://bsc-dataseed3.binance.org",
            "https://bsc-dataseed4.binance.org",
            "https://bsc-dataseed1.defibit.io",
            "https://bsc-dataseed2.defibit.io",
            "https://bsc-dataseed3.defibit.io",
            "https://bsc-dataseed4.defibit.io",
            "https://bsc-dataseed1.ninicoin.io",
            "https://bsc-dataseed2.ninicoin.io",
            "https://bsc-dataseed3.ninicoin.io",
            "https://bsc-dataseed4.ninicoin.io",
            "wss://bsc-ws-node.nariox.org",
        ],
        blockExplorerUrls: ["https://bscscan.com"],
    },
    Mainnet: {
        chainId: `0x${Number(1).toString(16)}`,
        chainName: "Ethereum Mainnet",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        // rpcUrls: [
        //     "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
        //     "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
        //     "https://api.mycryptoapi.com/eth",
        //     "https://cloudflare-eth.com",
        // ],
        rpcUrls: [
            "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        ],
        blockExplorerUrls: ["https://etherscan.io"],
    },
    Ropsten: {
        chainId: `0x${Number(3).toString(16)}`,
        chainName: "Ropsten",
        nativeCurrency: {
            name: "Ropsten Ether",
            symbol: "ROP",
            decimals: 18,
        },
        rpcUrls: [
            "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            // "https://ropsten.infura.io/v3/${INFURA_API_KEY}",
            // "wss://ropsten.infura.io/ws/v3/${INFURA_API_KEY}",
        ],
        blockExplorerUrls: ["https://ropsten.etherscan.io"],
    },
    Rinkeby: {
        chainId: `0x${Number(4).toString(16)}`,
        chainName: "Rinkeby",
        nativeCurrency: {
            name: "Rinkeby Ether",
            symbol: "RIN",
            decimals: 18,
        },
        rpcUrls: [
            "https://rinkeby.infura.io/v3/${INFURA_API_KEY}",
            "wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}",
        ],
        blockExplorerUrls: ["https://rinkeby.etherscan.io"],
    },
    Kovan: {
        chainId: `0x${Number(42).toString(16)}`,
        chainName: "Kovan",
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
};

const changeNetwork = async ({ networkName, setError }) => {
    console.log("id", networks[networkName].chainId);
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: networks[networkName].chainId }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
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
                alert(err.message);
            }
        }
        // handle other "switch" errors
    }
};

const checkTokenAddress = (chainId) => {
    let tempt = "";
    address.map(e => {
        if(e.chainId == chainId) {
            tempt = e.ad;
        }
    });
    return tempt;
}

const ConnectNetwork = () => {
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const handleNetworkSwitch = async (networkName) => {
        setError();
        await changeNetwork({ networkName, setError });
    };

    const networkChanged = (chainId) => {
        console.log({ chainId });
    };

    const checkOption = (e) => {
        console.log(e.target.value);
        switch (e.target.value) {
            case "10":
                console.log("Mainnet");
                handleNetworkSwitch("Mainnet");
                // handleNetworkSwitch("bsc");
                break;
            case "20":
                console.log("Ropsten");
                handleNetworkSwitch("Ropsten");
                dispatch(addChainId(3));
                dispatch(addTokenAddress(checkTokenAddress(3)));
                break;
            case "30":
                console.log("Rinkeby");
                handleNetworkSwitch("Rinkeby");
                dispatch(addChainId(4));
                dispatch(addTokenAddress(checkTokenAddress(4)));
                break;
            case "40":
                console.log("Kovan");
                handleNetworkSwitch("Kovan");
                dispatch(addChainId(42));
                dispatch(addTokenAddress(checkTokenAddress(42)));
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        window.ethereum.on("chainChanged", networkChanged);

        return () => {
            window.ethereum.removeListener("chainChanged", networkChanged);
        };
    }, []);

    return (
        <Box sx={{ minWidth: 120 }} className="CN-box">
            <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Network
                </InputLabel>
                <NativeSelect
                    defaultValue={20}
                    inputProps={{
                        name: "age",
                        id: "uncontrolled-native",
                    }}
                    onChange={checkOption}
                >
                    <option value={10}>Ethereum</option>
                    <option value={20}>Ropsten Testnet</option>
                    <option value={30}>Rinkeby Testnet</option>
                    <option value={40}>Kovan Testnet</option>
                </NativeSelect>
            </FormControl>
        </Box>
    );
};

export default ConnectNetwork;
