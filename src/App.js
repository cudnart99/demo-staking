import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import ConnectWaller from "./components/ConnectWaller";



const App = () => {
    const [Connected, setConnected] = useState(false);
    const [instruction, setInstruction] = useState(
        "Waiting for connection with wallet..."
    );

    return (
        <div>
            {/* <Button onClick={onClickConnect}>connect waller</Button> */}
            {
                // (Connected ?
                // <AppAuthenticated  web3={web3}/>
                // : instruction)
            }
            <ConnectWaller />
        </div>
    );
};

export default App;
