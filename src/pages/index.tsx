//Dependencies
import React, {useState , useEffect} from "react";
import { Redirect, Switch } from "react-router-dom";
 import { Router } from "./router";

// Layouts
import LayoutAuth from ".././Layout/LayoutAuth";
import LayoutEmpty from ".././Layout/LayoutEmpty";
import Layout from "../Layout/layout";
 import  Login from './login'
import Dashboard from "@/pages/dashboard";
 import Members from "@/pages/members";
 import Profil from "@/pages/members/profile";
import Paiment from "@/pages/paiment";
 import ErrorPage from './error'

interface Props {
    conn: any; // Update this type to match the MySQL connection type
}
const Routes:React.FC<Props> = (props) => {
const {conn} = props
    const [data, setData] = useState([]);
    console.log("data",data)
    const getData= async ()=>{
        const connection = await conn;
        await  connection.query(
            {
                sql: ` SELECT m.MemberID  ,s.end_date FROM subscriptions s, Members m ,Category c WHERE s.MemberID = m.MemberID AND c.Category_id = m.Category_id AND  payment_status = 'unpaid'AND MONTH(end_date) <= MONTH(CURRENT_DATE()) AND YEAR(end_date) <= YEAR(CURRENT_DATE()) AND day(end_date) <= day(CURRENT_DATE());`,
                timeout: 40 * 1000, // 40s
            },
            [0], // values to replace ?
            await     function (err: any, results: any, fields: any) {
                if (err) {
                    alert(err.code);
                    console.log(err.code);
                } else {

                    setData(results);
                }
            });
    }
    useEffect(()=>{
        if(conn){
            getData();
        }
    },[conn])


    data.map((el : any)=>{
        let count ;
        console.log(el)
        const insertSubscriptionsQuery = `INSERT INTO subscriptions (MemberID, start_date, end_date, type, status, payment_status)
                       VALUES (?, ?, ?, ?, ?, ?)`;
        let years = el.end_date.getFullYear();
        const currentMonth = el.end_date.getMonth();
        const nextMonthDate = new Date(years, currentMonth + 1, 1); // Set day to 1 to ensure next month
        let nextMonth = nextMonthDate.getMonth() + 1;
        if (nextMonth > 12) {
            nextMonth = 1;
            years++;
        }

        const formattedNextMonth = String(nextMonth).padStart(2, '0');
        const days = String(el.end_date.getDate()).padStart(2, '0');
        const MembershipStartDateNext = `${years}-${formattedNextMonth}-${days}`;

        console.log("MembershipStartDateNext",MembershipStartDateNext)

        // SELECT MONTH(max(end_date)) FROM subscriptions where MemberID = 1 ;
        const maxDate = `SELECT MONTH(max(end_date)) as MaxMonth FROM subscriptions where MemberID = ${el.MemberID};`;
        conn.query(
            maxDate,
            (err : any, results :any) => {
                if (err) {
                    console.log(err.code);
                } else  {
                    //  8    10 === 9
                    if ( String(results[0].MaxMonth).padStart(2, '0') === formattedNextMonth){
                        console.log("results",results[0].MaxMonth);

                    }else {
                        conn.query(
                            insertSubscriptionsQuery,
                            [el.MemberID, el.end_date, MembershipStartDateNext, 'monthly', 'active', 'unpaid'],
                            (err : any, results :any) => {
                                if (err) {
                                    console.log(err.code);
                                } else {
                                    console.log(results);
                                }
                            }
                        );
                    }

                }
            }
        );

    })
    const  conLogin = ()=> <Login conn={conn} />
    const  conDash = ()=> <Dashboard conn={conn} />
    const  conMom = ()=> <Members conn={conn} />
    const  conProfil = ()=> <Profil conn={conn}   />
    const  conPaiment = ()=> <Paiment conn={conn}   />
    // @ts-ignore


    return (
        <Switch>
            <Redirect from="/" exact={true} to="/auth/sign-in" />
            {/* Auth Pages */}

            <Router
                path="/auth/sign-in"
                component={conLogin}
                layout={LayoutAuth}
            />
            <Router
                path={'/dashboard'}

                component={conDash}
                layout={Layout}
            />
            <Router
                path={'/members'}

                component={conMom}
                layout={Layout}
            /> <Router
                path={'/profile'}

                component={conProfil}
                layout={Layout}
            /><Router
                path={'/paiment'}

                component={conPaiment}
                layout={Layout}
            />

            <Router
                path="/404"
                exact
                component={ErrorPage}
                layout={LayoutEmpty}
            />
            <Redirect to="/404" />
        </Switch>
    );
};



export default  Routes;

