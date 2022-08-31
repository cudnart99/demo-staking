import { useState } from "react";
import {
    Typography,
    Button,
    TextField,
    Grid,
    CircularProgress,
    Alert,
    Link, Box
} from "@mui/material";
import Web3 from "web3/dist/web3.min.js";
import { useSelector, useDispatch } from "react-redux";

const ERC20Create = ({ importToken }) => {
    const [tokenName, setTokenName] = useState("");
    const [tokensymbol, setTokenSymbol] = useState("");
    const defaultInitialSupply = "1000000000000000000";
    const defaultDecimals = "18";
    const [tokenInitalSupply, setTokenInitialSupply] =
        useState(defaultInitialSupply);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const web3 = useSelector((state) => state.web3Library);
    const ERC20Token = require("./ERC20Token");
    const { applyDecimals } = require("../../utils/ethereumAPI");
    const web3Token = new web3.eth.Contract(ERC20Token.abi);

    const dispatch = useDispatch();

    const onClickAction = async () => {
        if (successMessage) {
            // importToken(web3Token.options.address);
            // dispatch(addTokenAddress())
            return;
        }
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        const accounts = await web3.eth.getAccounts();
        console.log("create", accounts[0]);
        try {
            const result = await web3Token
                .deploy({
                    data: ERC20Token.bytecode,
                    arguments: [],
                })
                .send({ from: accounts[0], gas: 5000000 });
            web3Token.options.address = result._address;
            setSuccessMessage(
                `Token successfully deployed at: ${web3Token.options.address}`
            );
            const deployedToken = new web3.eth.Contract(
                ERC20Token.abi,
                web3Token.options.address
            );
            const name = await deployedToken.methods.name().call();
            const symbol = await deployedToken.methods.symbol().call();
            // setSuccessMessage(`Name: ${name}`);
            // setSuccessMessage(`Symbol: ${symbol}`);
        } catch (error) {
            setErrorMessage(error.message);
        }

        setLoading(false);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6" noWrap component="div" sx={{ m: 1 }}>
                    Create Token
                </Typography>
            </Grid>
            <Grid tem xs={12}>
                <TextField
                    label="Name"
                    sx={{ m: 1, width: "25ch" }}
                    placeholder="GOLD"
                    onChange={(e) => setTokenName(e.target.value)}
                ></TextField>
                <TextField
                    label="Symbol"
                    sx={{ m: 1, width: "25ch" }}
                    placeholder="GLD"
                    onChange={(e) => setTokenSymbol(e.target.value)}
                ></TextField>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Init supply raw"
                    sx={{ m: 1, width: "30ch" }}
                    placeholder={defaultInitialSupply}
                    type="number"
                    value={tokenInitalSupply}
                    onChange={(e) => setTokenInitialSupply(e.target.value)}
                ></TextField>
                <TextField
                    label="Initial supply (adjusted)"
                    sx={{ m: 1, width: "30ch" }}
                    placeholder="1"
                    value={applyDecimals(tokenInitalSupply, defaultDecimals)}
                    variant="filled"
                ></TextField>
                <TextField
                    label="Decimals"
                    sx={{ m: 1, width: "10ch" }}
                    value={defaultDecimals}
                    type="number"
                    variant="filled"
                ></TextField>
            </Grid>
            <Grid item xs={12}>
                {successMessage && (
                    <Alert severity="success">{successMessage}</Alert>
                )}
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <Button
                    variant="contained"
                    sx={{ m: 1 }}
                    onClick={() => onClickAction()}
                    disable={loading}
                >
                    {loading ? (
                        <CircularProgress size={25} />
                    ) : (
                        "Create"
                    )}
                </Button>
            </Grid>
        </Grid>
    );
};

export default ERC20Create;
