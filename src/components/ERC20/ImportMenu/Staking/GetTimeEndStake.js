import { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
// import Web3 from "web3/dist/web3.min.js";
// const web3 = new Web3(window.ethereum);
import { useSelector } from "react-redux";

const GetTimeEndStake = ({ web3Staking, refreshDataGrid, tokenData }) => {
    // const web3 = useSelector((state) => state.web3Library);

  const [data, setData] = useState({
    arg1: "",
    arg2: "",
    errorMessage: "",
    successMessage: "",
    loading: false,
  });

  const onClickApprove = async () => {
    setData({ ...data, loading: true });

    let errorMessage = "";
    let successMessage = "";
    try {
        // const accounts = await web3.eth.getAccounts();
      var re = await web3Staking.methods.getTimeEndStake(data.arg1).call();
      successMessage = `${re}`;

      // Refresh the token info to update the wallet balance
      refreshDataGrid();
    } catch (error) {
      errorMessage = error.message;
    }
    console.log("re", re);
    setData({ ...data, loading: false, errorMessage, successMessage });
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Button
          variant="contained"
          sx={{ m: 1 }}
          onClick={(e) => onClickApprove()}
          disabled={data.loading}
          style={{ backgroundColor: "#956bd7" }}
        >
          {data.loading ? <CircularProgress size={25} /> : "Get Time End Stake"}
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Address"
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
        {/* <TextField
                    label="Value"
                    sx={{ m: 1, width: '30ch' }}
                    size="small"
                    placeholder="1"
                    type="number"
                    onChange={(e) => setData({ ...data, arg2: e.target.value, errorMessage: '', successMessage: '' })}
                    InputLabelProps={{ shrink: true }}
                    disabled={data.loading}
                /> */}
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

export default GetTimeEndStake;
