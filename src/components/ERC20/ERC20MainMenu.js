import React from "react";
import { useState } from "react";
import {
    Button,
    Grid,
    TextField,
    Box,
    CircularProgress,
    Alert,
} from "@mui/material";
import Web3 from "web3/dist/web3.min.js";
import { useSelector } from "react-redux";
// import WalletConnectProvider from "@walletconnect/web3-provider";

// const provider = new WalletConnectProvider({
//     rpc: {
//         3: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
//     },
//     qrcodeModalOptions: {
//         mobileLinks: [
//             "rainbow",
//             "metamask",
//             "argent",
//             "trust",
//             "imtoken",
//             "pillar",
//         ],
//     },
// });

// const onClickQR = async () => {
//     await provider.enable();
//     const web3 = new Web3(provider);
// };

// const web3 = new Web3(window.ethereum);

const ERC20MainMenu = ({ onClickCreate, onClickLogin }) => {
    const web3 = useSelector((state) => state.web3Library)
    const ERC20Token = require("./ERC20Token");
    const web3Token = new web3.eth.Contract(ERC20Token.abi);
    const [data, setData] = useState({
        arg1: "",
        errorMessage: "",
        successMessage: "",
        loading: false,
    });

    const onClickSreach = async () => {
        setData({ ...data, loading: true });
        let errorMessage = "";
        let successMessage = "";

        try {
            // const accounts = await web3.eth.getAccounts();
            // const amountToSend = applyDecimals(data.arg2, decimals, "positive");
            // await web3Token.methods.addMinter(data.arg1)
            // .send({ from: accounts[0] });
            web3Token.options.address = data.arg1;
            // setSuccessMessage(`Token successfully deployed at: ${web3Token.options.address}`);
            const deployedToken = new web3.eth.Contract(
                ERC20Token.abi,
                // web3Token.options.address
                data.arg1
            );
            const name = await deployedToken.methods.name().call();
            const symbol = await deployedToken.methods.symbol().call();

            // if (name !== "IVIRSECoin") throw "At address is not available!";
            // if (symbol !== "IVI") throw "At address is not available!";

            successMessage = `Token ${name} - ${symbol}.`;
        } catch (error) {
            // errorMessage = error;
            errorMessage = error.message;
        }

        setData({ ...data, loading: false, errorMessage, successMessage });
    };

    // const onClickLogin = ()

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    sx={{ m: 1 }}
                    onClick={() => onClickCreate()}
                >
                    Create token
                </Button>
            </Grid>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        sx={{ m: 1 }}
                        onClick={(e) => onClickSreach()}
                        disabled={data.loading}
                        style={{ backgroundColor: "#e5a84d" }}
                    >
                        {data.loading ? (
                            <CircularProgress size={25} />
                        ) : (
                            "Sreach Address Token"
                        )}
                    </Button>
                    <TextField
                        label="Token Address"
                        sx={{ m: 1, width: "50ch" }}
                        size="small"
                        placeholder="0x"
                        onChange={(e) =>
                            setData({
                                ...data,
                                arg1: e.target.value,
                                errorMessage: "",
                                successMessage: "",
                            })
                        }
                        InputLabelProps={{ shrink: true }}
                        disabled={data.loading}
                    />
                </Grid>
                <Grid item xs={12}>
                    {data.errorMessage && (
                        <Alert
                            severity="error"
                            onClose={() =>
                                setData({ ...data, errorMessage: "" })
                            }
                        >
                            {data.errorMessage}
                        </Alert>
                    )}
                    {data.successMessage && (
                        <Alert
                            severity="success"
                            onClose={() =>
                                setData({ ...data, successMessage: "" })
                            }
                        >
                            {data.successMessage}
                        </Alert>
                    )}
                </Grid>
            </Box>
            <Box
                border={1}
                sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
            >
                {data.successMessage != "" ? (
                    <Button
                        variant="contained"
                        sx={{ m: 1 }}
                        onClick={(e) => onClickLogin(data.arg1)}
                        disabled={data.loading}
                        style={{ backgroundColor: "#e5a84d" }}
                    >
                        {data.loading ? (
                            <CircularProgress size={25} />
                        ) : (
                            "Login Token"
                        )}
                    </Button>
                ) : (
                    ""
                )}
            </Box>
            <Grid item xs={12}>
                <Box
                >
                    <Button
                        variant="contained"
                        sx={{ m: 1 }}
                        onClick={(e) =>
                            onClickLogin(
                                "0x2bc4607349De2Aaa8668c203Ea236b2D30e75BCB"
                            )
                        }
                        disabled={data.loading}
                        style={{ backgroundColor: "#00bcd4" }}
                    >
                        Login IVI
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ERC20MainMenu;
