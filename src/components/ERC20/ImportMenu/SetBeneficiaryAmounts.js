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
import { OutTable, ExcelRenderer } from "react-excel-renderer";

const SetBeneficiaryAmounts = ({ web3Time, tokenAddress, refreshDataGrid }) => {
  const [file, setFile] = useState(null);
  const [check, setCheck] = useState(false);
  const fileHandler = async (e) => {
    let fileObj = e.target.files[0];
    console.log(fileObj, "fileObj");

    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, async (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        console.log(resp, "resp");
        await setFile({
          cols: resp.cols,
          rows: resp.rows,
        });
        setCheck(true);
      }
    });
  };

  const web3 = useSelector((state) => state.web3Library);
  const { applyDecimals } = require("../../../utils/ethereumAPI");
  // const symbol = tokenData.find(x => x.name === "Symbol").value;
  // const decimals = tokenData.find(x => x.name === "Decimals").value;
  const decimals = 18;

  const [data, setData] = useState({
    arg1: "",
    arg2: "",
    errorMessage: "",
    successMessage: "",
    loading: false,
  });

  const onClickTransfer = async () => {
      console.log(file, "file-----------------");
    setData({ ...data, loading: true });
    let errorMessage = "";
    let successMessage = "";

    try {
      let temp1 = [];
      let temp4 = [];
      for (let i = 0; i < file.rows.length; i++) {
        temp1.push(file.rows[i][0]);
        const amountToSend = applyDecimals(file.rows[i][1], decimals, "positive");
        temp4.push(amountToSend);
      }

      console.log("temp1", temp1);
      console.log("temp4", temp4);

      const accounts = await web3.eth.getAccounts();
      await web3Time.methods
        .setBeneficiaryAmounts(tokenAddress, temp1, temp4)
        .send({ from: accounts[0] });
      successMessage = `Set Beneficiary Amounts - Successful.`;
      refreshDataGrid();
    } catch (error) {
      errorMessage = error.message;
    }

    setData({ ...data, loading: false, errorMessage, successMessage });
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <input type="file" onChange={fileHandler} />
      </Grid>
      {file && (
        <OutTable
          data={file.rows}
          columns={file.cols}
          tableClassName="table"
          tableHeaderRowClass="heading"
        />
      )}
      <Grid item xs={12}>
        {check && (
          <Button
            variant="contained"
            sx={{ m: 1 }}
            onClick={(e) => onClickTransfer()}
            disabled={data.loading}
          >
            {data.loading ? (
              <CircularProgress size={25} />
            ) : (
              "SetBeneficiaryAmounts"
            )}
          </Button>
        )}
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

export default SetBeneficiaryAmounts;
