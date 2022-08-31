const initState = {
  web3Library: null,
  web3Account: "",
  walletConnectProvider: null,
  chainId: null,
  tokenAddress: "",
};

const rootReducer = (state = initState, action) => {
  // console.log({state, action});
  switch (action.type) {
    case "addWeb3Library":
      return {
        ...state,
        web3Library: action.payload,
      };
    case "addWeb3Account":
      return {
        ...state,
        web3Account: action.payload,
      };
    case "addWalletConnectProvider":
      return {
        ...state,
        walletConnectProvider: action.payload,
      };
    case "addChainId":
      return {
        ...state,
        chainId: action.payload,
      };
    case "addTokenAddress":
      return {
        ...state,
        tokenAddress: action.payload,
      };
    case "addTimelockAddress":
      return {
        ...state,
        tokenAddress: action.payload,
      };

    default:
      return state;
  }
};

export default rootReducer;
