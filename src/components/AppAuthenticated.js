import React from "react";
import { Box } from "@mui/system";
import {
    CssBaseline,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { AppBar, Toolbar } from "@mui/material";
import ERC20App from "./ERC20/ERC20App";
import ConnectNetwork from "./ERC20/ConnectNetwork";
import { useSelector, useDispatch } from "react-redux";
import {
    addWeb3Account,
    addWeb3Library,
    addWalletConnectProvider,
} from "../redux/actions";
import App from "../App";


const AppAuthenticated = () => {
    const dispatch = useDispatch();
    const drawerWidth = 240;
    const walletlinkProvider = useSelector((state) => state.walletConnectProvider)

    const disconnectWallet = async () => {
        try {
            await walletlinkProvider.close();
            await console.log("1");
            await dispatch(addWalletConnectProvider(null));
            await console.log("2");
            await dispatch(addWeb3Account(""));
            await console.log("3");
            // await dispatch(addWeb3Library(null));
            await console.log("4");
            await console.log("disconnect");
            window.location.reload(true);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            {/* <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        IVIRSE Token Wallet
                    </Typography>
                    <ConnectNetwork />
                </Toolbar>
            </AppBar> */}
            {/* <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <Divider />
                <List>
                    <ListItemButton>
                        <ListItemText primary="IVIRSE Coin" />
                    </ListItemButton>
                    <ListItemButton onClick={disconnectWallet}>
                        <ListItemText primary="Disconnect wallet" />
                    </ListItemButton>
                </List>
            </Drawer> */}
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: "Background".default, p: 3 }}
            >
                {/* <Toolbar /> */}
                <ERC20App />
            </Box>
        </Box>
    );
};

export default AppAuthenticated;
