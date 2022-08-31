import { useState, useEffect } from "react";
import { Grid, Typography, Box, Button } from "@mui/material";
import { DataGrid, gridColumnsTotalWidthSelector } from "@mui/x-data-grid";
import "./style.css";

import BalanceOf from "./ImportMenu/BalanceOf";
import Transfer from "./ImportMenu/Transfer";
import ApproveList from "./ImportMenu/ApproveList";
import Allowance from "./ImportMenu/Allowance";
import Mint from "./ImportMenu/Mint";
import Approve from "./ImportMenu/Approve";
import Burn from "./ImportMenu/Burn";
import Web3 from "web3/dist/web3.min.js"; // webpack < 5
import AddMinter from "./ImportMenu/AddMinter";
import RemoveMinter from "./ImportMenu/RemoveMinter";
import MinterConsensus from "./ImportMenu/MinterConsensus";
import MinterReject from "./ImportMenu/MinterReject";
import MintConsensus from "./ImportMenu/MintConsensus";
import TransferFrom from "./ImportMenu/TransferFrom";
import { useSelector } from "react-redux";
import PayIn from "./ImportMenu/PayIn";
import Payout from "./ImportMenu/Payout";
import CheckTimeLock from "./ImportMenu/Checktimelock";
import ImportTokenAddress from "./ImportMenu/ImportTokenAddress";
import SetBeneficiaryAmounts from "./ImportMenu/SetBeneficiaryAmounts";
import SetTimesAndRate from "./ImportMenu/SetTimesAndRate";
import StartRelease from "./ImportMenu/StartRelease";
import CheckTime from "./ImportMenu/CheckTime";
import Release from "./ImportMenu/Release";

import Stake30 from "./ImportMenu/Staking/Stake30";
import Stake60 from "./ImportMenu/Staking/Stake60";
import Stake90 from "./ImportMenu/Staking/Stake90";
import ViewTimeUntilWithDrawFullTime from "./ImportMenu/Staking/viewTimeUntilWithDrawFullTime";
import WithdrawFulltime from "./ImportMenu/Staking/WithdrawFulltime";
import ForceWithdraw from "./ImportMenu/Staking/ForceWithdraw";
import GetBalanceStakeOf from "./ImportMenu/Staking/GetBalanceStakeOf";
import GetTimeEndStake from "./ImportMenu/Staking/GetTimeEndStake";
import GetBonusWillGet from "./ImportMenu/Staking/GetBonusWillGet";
import Earned from "./ImportMenu/Staking_v2/Earned";
import GetReward from "./ImportMenu/Staking_v2/getRewards";
import NotifyRewardAmount from "./ImportMenu/Staking_v2/notifyRewardAmount";
import SetRewardsDuration from "./ImportMenu/Staking_v2/setRewardsDuration";
import Stake from "./ImportMenu/Staking_v2/stake";
import Withdraw from "./ImportMenu/Staking_v2/withdraw";
import GetBalanceStake from "./ImportMenu/Staking_v2/GetBalanceStake";

const ERC20Import = () => {
  let stakingAddress = "0xbf94674D8e4Eec7AFbEEc6aBf87E261579E5A797";
  let tokenAddressA = "0x0b0261E32fbAC2Ee47C487614A2482FBaF230335";
  let tokenAddressB = "0xef96da76eFd99e81a6adaF9106BE6740d0b63140";
  // let timeLockAddress = "0xc2bf3a6e055a5B47A0c9Df125acf3ED5602C985a";

  // console.log("tokenAddress", tokenAddress);
  const ERC20Token = require("./ERC20Token");
  const TimeLockABI = require("./TimeLock");
  const StakingABI = require("./Staking");

  const { applyDecimals } = require("../../utils/ethereumAPI");

  const web3 = useSelector((state) => state.web3Library);
  let web3TokenA = new web3.eth.Contract(ERC20Token.abi, tokenAddressA);
  let web3TokenB = new web3.eth.Contract(ERC20Token.abi, tokenAddressB);
  let web3Staking = new web3.eth.Contract(StakingABI, stakingAddress);
  // var netWork;

  const [tokenRefresh, setTokenRefresh] = useState(0);
  const [owner, setOwner] = useState("");
  const [logMessage, setLogMessage] = useState("");
  const [tokenData, setTokenData] = useState([
    { id: 0, name: "Address", value: tokenAddressA },
    { id: 1, name: "Name", value: "" },
    { id: 2, name: "Symbol", value: "" },
    { id: 3, name: "TotalSupply", value: "" },
    { id: 4, name: "Decimals", value: "" },
    { id: 5, name: "Current balance", value: "" },
    { id: 6, name: "Current address", value: "" },
  ]);
  const [accMinterList, setAccMinterList] = useState([]);
  const [minterConsensusList, setMinterConsensusList] = useState([]);
  const [netWork, setNetWork] = useState("");

  const columns = [
    { field: "name", headerName: "Token", width: 150 },
    { field: "value", headerName: "Value", width: 500 },
  ];

  const fetchData = async () => {
    // web3Token = new web3.eth.Contract(
    //     ERC20Token.abi,
    //     tokenAddress
    // );
    web3.eth.net.getNetworkType((err, kq) => {
      // console.log("err---", err);
      // console.log("kq---", kq);
      setNetWork(kq);
    });

    const accounts = await web3.eth.getAccounts();
    console.log("import", accounts);
    console.log("web3Token", web3TokenA);
    const name = await web3TokenA.methods.name().call();
    const symbol = await web3TokenA.methods.symbol().call();
    const totalSupply = await web3TokenA.methods.totalSupply().call();
    const decimals = await web3TokenA.methods.decimals().call();
    const owner1 = await web3Staking.methods.owner().call();
    setOwner(owner1);

    const currentBalance = await web3TokenA.methods
      .balanceOf(accounts[0])
      .call();
    const listMinter = await web3TokenA.methods.getMinters().call();
    console.log("accounts", accounts);
    console.log("listMinter", listMinter);
    setTokenData((tokenData) => [
      // tokenData[0],
      { ...tokenData[0], value: `${tokenAddressA} (${netWork})` },
      { ...tokenData[1], value: name },
      { ...tokenData[2], value: symbol },
      {
        ...tokenData[3],
        value: applyDecimals(totalSupply, decimals),
      },
      { ...tokenData[4], value: decimals },
      {
        ...tokenData[5],
        value: applyDecimals(currentBalance, decimals),
      },
      { ...tokenData[6], value: accounts[0] },
    ]);
  };

  useEffect(() => {
    // web3Token = new web3.eth.Contract(ERC20Token.abi, tokenAddress);
    fetchData();
    // console.log("abc----", netWork);
  }, [tokenRefresh]);
  const refreshDataGrid = () => setTokenRefresh((t) => ++t);
  const listConsensus = (x) => {
    setMinterConsensusList([...minterConsensusList, x]);
  };
  const listReject = (x) => {
    console.log("reject", x);
    console.log("consensus", minterConsensusList);
    var arr1 = [];
    for (let i = 0; i < minterConsensusList.length; i++) {
      if (minterConsensusList[i] !== x) {
        arr1.push(minterConsensusList[i]);
      }
      console.log("arr", arr1);
    }
    setMinterConsensusList(arr1);
  };
  // const onConsensus = async () => {
  //   const accounts = await web3.eth.getAccounts();
  //   return await web3Token.methods.minterConsensus().send({ from: accounts[0] });
  // };
  return (
    <div>
      <div className="icon">
        <img src="letter-i.png" style={{ width: "100%", height: "100%" }}></img>
        <div className="infor">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" noWrap component="div" sx={{ m: 1 }}>
                Token infor
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ height: "500px" }}>
              <DataGrid rows={tokenData} columns={columns}></DataGrid>
            </Grid>
            <Button
              style={{
                backgroundColor: "antiquewhite",
                position: "relative",
                left: "20px",
                top: "5px",
              }}
              onClick={() => setTokenRefresh((t) => ++t)}
            >
              Refresh
            </Button>
            <Grid item xs={12} sx={{ height: "150px" }}>
              Account minter
              <div>
                {accMinterList.map((x) => {
                  if (x.status) {
                    return (
                      <li key={x.value} style={{ color: "green" }}>
                        {x.value}
                      </li>
                    );
                  } else {
                    return (
                      <li key={x.value} style={{ color: "red" }}>
                        {x.value}
                      </li>
                    );
                  }
                })}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <div>Stake address: {stakingAddress}</div>
      <div>Owner staking contract :{owner} </div>
      <div>
        Account 1 (Owner tokenA) : 0xd9866589145067D11275e0949F0aE60F867b68C0
      </div>
      <div>
        Account 2 (Owner tokenB) : 0x4dc6c938d15223fD7CCb9FbD45E53FBdeb4caACa
      </div>
      <div>Account 3 (User 1) : 0x74E71424A0DD8975Db149D5c8C40462331F44fA2</div>
      <div>Account 4 (User 2) : 0x6B826036B7A94f218a99c17909707a58C630737E</div>
      <br />
      <div style={{ display: "flex" }}>
        <div>
          <h1>TokenA (USDT,BNB,ETH)</h1>
          <Box
            border={1}
            sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
          >
            <Mint
              web3Token={web3TokenA}
              tokenData={tokenData}
              refreshDataGrid={refreshDataGrid}
            />
          </Box>
          <Box
            border={1}
            sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
          >
            <BalanceOf web3Token={web3TokenA} tokenData={tokenData} />
          </Box>
          <Box
            border={1}
            sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
          >
            <Approve
              web3Token={web3TokenA}
              refreshDataGrid={refreshDataGrid}
              tokenData={tokenData}
            />
          </Box>
          <Box
            border={1}
            sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
          >
            <Allowance
              web3Token={web3TokenA}
              tokenData={tokenData}
              refreshDataGrid={refreshDataGrid}
            />
          </Box>
        </div>
        <div>
          <h1>TokenB (IVI)</h1>
          <Box
            border={1}
            sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
          >
            <Mint
              web3Token={web3TokenB}
              tokenData={tokenData}
              refreshDataGrid={refreshDataGrid}
            />
          </Box>
          <Box
            border={1}
            sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
          >
            <BalanceOf web3Token={web3TokenB} tokenData={tokenData} />
          </Box>
          <Box
            border={1}
            sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
          >
            <Approve
              web3Token={web3TokenB}
              refreshDataGrid={refreshDataGrid}
              tokenData={tokenData}
            />
          </Box>
          <Box
            border={1}
            sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}
          >
            <Allowance
              web3Token={web3TokenB}
              tokenData={tokenData}
              refreshDataGrid={refreshDataGrid}
            />
          </Box>
        </div>
      </div>

      <div>
        ------------------------------------------------------------------------------
      </div>
      <h1>Staking contract</h1>
      <div>
        ------------------------------------------------------------------------------
      </div>
      <h3>Only onwer</h3>
      <Box border={1} sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}>
        <NotifyRewardAmount
          web3Staking={web3Staking}
          refreshDataGrid={refreshDataGrid}
          tokenData={tokenData}
        />
      </Box>
      <Box border={1} sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}>
        <SetRewardsDuration
          web3Staking={web3Staking}
          refreshDataGrid={refreshDataGrid}
          tokenData={tokenData}
        />
      </Box>
      <div>
        ------------------------------------------------------------------------------
      </div>
      <h3>User</h3>
      <Box border={1} sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}>
        <Stake
          web3Staking={web3Staking}
          refreshDataGrid={refreshDataGrid}
          tokenData={tokenData}
        />
      </Box>
      <Box border={1} sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}>
        <GetBalanceStake
          web3Staking={web3Staking}
          refreshDataGrid={refreshDataGrid}
          tokenData={tokenData}
        />
      </Box>
      <Box border={1} sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}>
        <Withdraw
          web3Staking={web3Staking}
          refreshDataGrid={refreshDataGrid}
          tokenData={tokenData}
        />
      </Box>
      <Box border={1} sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}>
        <Earned
          web3Staking={web3Staking}
          refreshDataGrid={refreshDataGrid}
          tokenData={tokenData}
        />
      </Box>
      <Box border={1} sx={{ mt: 2, borderRadius: 1, borderColor: "LightGray" }}>
        <GetReward
          web3Staking={web3Staking}
          refreshDataGrid={refreshDataGrid}
          tokenData={tokenData}
        />
      </Box>
    </div>
  );
};

export default ERC20Import;
