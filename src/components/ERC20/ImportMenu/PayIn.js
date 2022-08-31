import { useState } from 'react'
import { Grid, TextField, Button, Alert, CircularProgress } from '@mui/material'
// import Web3 from "web3/dist/web3.min.js";
// const web3 = new Web3(window.ethereum);
import { useSelector } from 'react-redux';


const PayIn = ({ web3Token, tokenData, refreshDataGrid }) => {
    const web3 = useSelector((state) => state.web3Library);
    const { applyDecimals } = require('../../../utils/ethereumAPI');
    const symbol = tokenData.find(x => x.name === "Symbol").value;
    const decimals = tokenData.find(x => x.name === "Decimals").value;

    const [data, setData] = useState({ arg1: '', arg2: '', arg3: '', errorMessage: '', successMessage: '', loading: false});

    const onClickTransfer = async () => {

        setData({ ...data, loading: true});
        let errorMessage = "";
        let successMessage = "";
        
        try {
            const accounts = await web3.eth.getAccounts();
            const amountToSend = applyDecimals(data.arg2, decimals, "positive");
            const timelock = parseInt(data.arg3);
            await console.log(timelock);
            await web3Token.methods.payIn(data.arg1, amountToSend, timelock)
                                    .send({ from: accounts[0] });
            successMessage = `Action successful.`;
            refreshDataGrid();
        } catch (error) {
            errorMessage = error.message;
        }

        setData({ ...data, loading: false, errorMessage, successMessage });
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Button 
                    variant="contained"
                    sx={{ m: 1 }}
                    onClick={(e) => onClickTransfer()}
                    disabled={data.loading}
                    style={{backgroundColor: "#956bd7"}}
                >
                    {data.loading ? <CircularProgress size={25} /> : "payIn(người nhận , amount , locktime)"}
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    label="người nhận"
                    sx={{ m: 1, width: '50ch' }}
                    size="small"
                    placeholder="0x"
                    onChange={(e) => setData({ ...data, arg1: e.target.value, errorMessage: '', successMessage: ''})}
                    InputLabelProps={{ shrink: true }}
                    disabled={data.loading}
                />
                <TextField 
                    label="amount"
                    sx={{ m: 1, width: '30ch' }}
                    size="small"
                    placeholder="1"
                    type="number"
                    onChange={(e) => setData({ ...data, arg2: e.target.value, errorMessage: '', successMessage: ''})}
                    InputLabelProps={{ shrink: true }}
                    disabled={data.loading}
                />
                <TextField 
                    label="timelock"
                    sx={{ m: 1, width: '30ch' }}
                    size="small"
                    placeholder="1"
                    type="number"
                    onChange={(e) => setData({ ...data, arg3: e.target.value, errorMessage: '', successMessage: ''})}
                    InputLabelProps={{ shrink: true }}
                    disabed={data.loading}
                />
            </Grid>
            <Grid item xs={12}>
                {data.errorMessage && 
                    <Alert 
                        severity="error" 
                        onClose={() => setData({ ...data, errorMessage: ""})}>
                        {data.errorMessage}
                    </Alert>
                }
                {data.successMessage &&
                    <Alert
                        severity="success"
                        onClose={() => setData({ ...data, successMessage: ""})}>
                        {data.successMessage}
                    </Alert>
                }
            </Grid>
        </Grid>
    )
}

export default PayIn