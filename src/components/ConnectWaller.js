import React from "react";
import { useRef, useEffect, useState, useCallback } from "react";
import { Box } from "@mui/system";
import {
    Grid,
    TextField,
    Button,
    Alert,
    CircularProgress,
} from "@mui/material";
import AppAuthenticated from "./AppAuthenticated";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
// import Web3 from "web3/dist/web3.min.js";
import Web3 from "web3/dist/web3.min.js";
import WalletLink from "walletlink";
import { useDispatch } from "react-redux";
import {
    addWeb3Account,
    addWeb3Library,
    addWalletConnectProvider,
} from "../redux/actions";
import { Web3Provider } from "@ethersproject/providers";

const ConnectWaller = () => {
    const [Connected, setConnected] = useState(false);
    const [web3Library, setWeb3Library] = useState();
    const [web3Account, setWeb3Account] = useState();
    const [walletConnectProvider, setWalletConnectProvider] = useState();
    const dispatch = useDispatch();

    const onClickMetamak = async () => {
        if (!window.ethereum) return;
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const account = accounts[0];
            console.log(account);
            dispatch(addWeb3Account(account));
            // const library = new Web3Provider(window.ethereum, "any");
            const library = new Web3(window.ethereum);
            console.log("library");
            console.log(library);
            dispatch(addWeb3Library(library));
            setConnected(true);
        } catch (error) {
            alert(error.message);
            return;
        }
    };

    const onClickWalletconnect = async () => {
        try {
            const provider = new WalletConnectProvider({
                rpc: {
                    1: "https://mainnet.infura.io/v3/56e3d18adfa3407c84bb34d040eb2795",
                    3: "https://ropsten.infura.io/v3/56e3d18adfa3407c84bb34d040eb2795",
                    4: "https://rinkeby.infura.io/v3/56e3d18adfa3407c84bb34d040eb2795",
                },
                qrcode: true,
                pollingInterval: 15000,
            });
            dispatch(addWalletConnectProvider(provider));

            const accounts = await provider.enable();
            const account = accounts[0];
            console.log(account);
            dispatch(addWeb3Account(account));

            // const library = new Web3Provider(provider, "any");
            const library = new Web3(provider);
            console.log("library");
            console.log(library);
            dispatch(addWeb3Library(library));

            setConnected(true);
        } catch (error) {
            alert(error.message);
            return;
        }
    };

    return (
        <Grid item xs={12}>
            <Button
                variant="contained"
                sx={{ m: 1 }}
                onClick={(e) => onClickMetamak()}
            >
                Metamask
            </Button>
            <Button
                variant="contained"
                sx={{ m: 1 }}
                onClick={onClickWalletconnect}
            >
                Wallet Connect
            </Button>
            {Connected ? <AppAuthenticated /> : ""}
        </Grid>
    );
};

export default ConnectWaller;
