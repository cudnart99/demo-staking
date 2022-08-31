import { useState } from "react";
import {
    Grid,
    TextField,
    Button,
    Alert,
    CircularProgress,
} from "@mui/material";
// import Web3 from "web3/dist/web3.min.js";
import { useSelector } from "react-redux";

const Burn = ({ web3Token, tokenData, refreshDataGrid }) => {
    const web3 = useSelector((state) => state.web3Library);
    const { applyDecimals } = require("../../../utils/ethereumAPI");

    const symbol = tokenData.find((x) => x.name === "Symbol").value;
    const decimals = tokenData.find((x) => x.name === "Decimals").value;

    const [data, setData] = useState({
        arg2: "",
        errorMessage: "",
        successMessage: "",
        loading: false,
    });

    const onClickMint = async () => {
        setData({ ...data, loading: true });
        let errorMessage = "";
        let successMessage = "";

        try {
            const accounts = await web3.eth.getAccounts();
            const amountToBurn = applyDecimals(data.arg2, decimals, "positive");
            await web3Token.methods
                .burn(amountToBurn)
                .send({ from: accounts[0] });
            successMessage = `Burn successful. ${data.arg2} ${symbol} sent`;
            refreshDataGrid();
        } catch (error) {
            errorMessage = error.message;
        }

        setData({ ...data, loading: false, errorMessage, successMessage });
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    sx={{ m: 1 }}
                    onClick={(e) => onClickMint()}
                    disabled={data.loading}
                >
                    {data.loading ? <CircularProgress size={25} /> : "Burn"}
                </Button>
            </Grid>
            <Grid item xs={12}>
                {/* <TextField 
                    label="To"
                    sx={{ m: 1, width: '50ch' }}
                    size="small"
                    placeholder="0x"
                    onChange={(e) => setData({ ...data, arg1: e.target.value, errorMessage: '', successMessage: ''})}
                    InputLabelProps={{ shrink: true }}
                    disabled={data.loading}
                /> */}
                <TextField
                    label="Value"
                    sx={{ m: 1, width: "30ch" }}
                    size="small"
                    placeholder="1"
                    type="number"
                    onChange={(e) =>
                        setData({
                            ...data,
                            arg2: e.target.value,
                            errorMessage: "",
                            successMessage: "",
                        })
                    }
                    InputLabelProps={{ shrink: true }}
                    disabed={data.loading}
                />
            </Grid>
            <Grid item xs={12}>
                {data.errorMessage && (
                    <Alert
                        severity="error"
                        onClose={() => setData({ ...data, errorMessage: "" })}
                    >
                        {data.errorMessage}
                    </Alert>
                )}
                {data.successMessage && (
                    <Alert
                        severity="success"
                        onClose={() => setData({ ...data, successMessage: "" })}
                    >
                        {data.successMessage}
                    </Alert>
                )}
            </Grid>
        </Grid>
    );
};

export default Burn;
