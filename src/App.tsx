import * as React from "react";

 import './App.scss'
import  Pages from './pages'
import {useState,useEffect} from "react";
require('dotenv').config();
 import  mysql from 'mysql'


 import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./pages";



import Layout from './Layout/layout'
import LayoutAuth from './Layout/LayoutAuth'
import  Index from './pages/dashboard'
import Members from '@/pages/members'
import UpdateMember from "@/pages/members/UpdateMember";
// @ts-ignore
import {NotificationContainer} from 'react-notifications';
// import AddMember from "@/pages/members/AddMember";
console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)
interface LoginProps {
    conn?: any; // Update this type to match the MySQL connection type
}

function App() : JSX.Element  {

    const [conn, setConn] = useState(undefined);
    // set connection variable
    const dataConnection = {
        //host     : '888.88.88.88', //:3306
        host: process.env.REACT_APP_HOST,
        user: process.env.REACT_APP_USER,
        password: process.env.REACT_APP_PASSWORD,
        database: process.env.REACT_APP_DATA_BASENAME,
    }
    const {host, user, password, database} = dataConnection;

    // function connection mysql remote
    const connection = () => {
        let c = mysql.createConnection(dataConnection);
        c.connect((err) => {
            // in case of error
            if (err) {
                alert(err.code);
                return console.log(err.code, err.fatal, err.stack);
            }
            return console.log("Connection successfully established");
        });
        // @ts-ignore
        setConn(c);
    };
    useEffect(()=>{
        connection();
    },[])



    return (
        <>
            <Router>
                <Routes  conn={conn}/>
            </Router>
            <NotificationContainer/>

        </>
    );

}

export default App





