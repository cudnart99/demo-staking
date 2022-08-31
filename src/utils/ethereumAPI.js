const Decimal = require('decimal.js');
const applyDecimals = (rawValue, decimals, sign = "negative") => {
    if(!rawValue)
        return "";

    return Decimal(rawValue).mul(Decimal(10).pow(Decimal(sign === "positive" ? decimals : - decimals))).toFixed();
}

module.exports = {
    applyDecimals
}