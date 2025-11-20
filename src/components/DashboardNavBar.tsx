import{useEffect , useState} from "react";
import { getCurrentUser, logoutUser } from "../api/auth";
import { AppBar, Toolbar, Typography } from "@mui/material";

interface User {
    id:string;
    name:string;
    email:string
}

export default function DashboardNavBar(){
    const [user , setUser] = useState< User | null>(null);


    useEffect(() => {
        getCurrentUser().then((u) => setUser(u));
    }, []);

    const handleLogout = async () => {
        await logoutUser ; 
        window.location.href = '/login'
    };

    return(
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow : 1}}>
                    Markdown Editor
                </Typography>
                {user && (
                    <Typography sx={{mr:2}}>
                        {user.name}
                    </Typography>
                )}
                <button color="inherit" onClick={handleLogout}>
                    Logout
                </button>
            </Toolbar>
        </AppBar>
    )
}