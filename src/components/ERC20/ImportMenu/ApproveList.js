import { useState } from 'react'
import { Grid, TextField, Button, Alert, CircularProgress } from '@mui/material'
// import Web3 from "web3/dist/web3.min.js";
// const web3 = new Web3(window.ethereum);
import { useSelector } from 'react-redux';


const ApproveList = ({ web3Token, tokenData, refreshDataGrid }) => {
    const { applyDecimals } = require('../../../utils/ethereumAPI');
    const web3 = useSelector((state) => state.web3Library);
    const symbol = tokenData.find(x => x.name === "Symbol").value;
    const decimals = tokenData.find(x => x.name === "Decimals").value;

    const [data, setData] = useState({ arg1: '', arg2: '', errorMessage: '', successMessage: '', loading: false});

    const onClickTransfer = async () => {

        setData({ ...data, loading: true});
        let errorMessage = "";
        let successMessage = "";
        
        try {
            console.log("addressList", data.arg1);
            console.log("amountList", data.arg2);
            // let temp1 = ["0x869e126b3BcF897371468E4e9108aCF0542f9d53","0x7B4f303219e53DA8EAddD96F9ee6f6BCFe688C5B","0xE2bd47830380BE593bBD96eC6c77De26d4F849ce"];
            let temp1 = [];
            let temp4 = [];
            let temp2 = data.arg2.split(",");
            let temp3 = data.arg1.split(",");
            for(let i = 0; i < temp3.length; i++) {
                let check = `${temp3[i]}`;
                temp1.push(check);
            }

            console.log("temp1", temp1);

            for(let i = 0; i < temp2.length; i++) {
                let check = parseFloat(temp2[i]);
                const amountToSend = applyDecimals(check, decimals, "positive");
                temp4.push(amountToSend);
            }
            console.log(temp4, "temp4");

            const accounts = await web3.eth.getAccounts();
            // const amountToSend = applyDecimals(data.arg2, decimals, "positive");
            await web3Token.methods.approveList(temp1, temp4)
                                    .send({ from: accounts[0] });
            successMessage = `successful`;
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
                >
                    {data.loading ? <CircularProgress size={25} /> : "ApproveList(address[] to, uint256[] value)"}
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    label="To"
                    sx={{ m: 1, width: '50ch' }}
                    size="small"
                    placeholder="0x"
                    onChange={(e) => setData({ ...data, arg1: e.target.value, errorMessage: '', successMessage: ''})}
                    InputLabelProps={{ shrink: true }}
                    disabled={data.loading}
                />
                <TextField 
                    label="Value"
                    sx={{ m: 1, width: '30ch' }}
                    size="small"
                    onChange={(e) => setData({ ...data, arg2: e.target.value, errorMessage: '', successMessage: ''})}
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

export default ApproveList