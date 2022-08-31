
export const addWeb3Library = (data) => {
    return {
        type: 'addWeb3Library',
        payload: data
    }
}

export const addWeb3Account = (data) => {
    return {
        type: 'addWeb3Account',
        payload: data
    }
}
export const addWalletConnectProvider = (data) => {
    return {
        type: 'addWalletConnectProvider',
        payload: data
    }
}

export const addChainId = (data) => {
    return {
        type: 'addChainId',
        payload: data
    }
}

export const addTokenAddress = (data) => {
    return {
        type: 'addTokenAddress',
        payload: data
    }
}

export const addTimelockAddress = (data) => {
    return {
        type: 'addTimelockAddress',
        payload: data
    }
}
