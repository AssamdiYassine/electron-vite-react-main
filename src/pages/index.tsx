//Dependencies
import React, {useEffect, useState} from "react";
import * as ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider
} from 'react-router-dom'



// Layouts
import LayoutAuth from "../Layout/LayoutAuth";
import LayoutEmpty from "../Layout/LayoutEmpty";
import Layout from "../Layout/layout";
import Login from './login'
import Dashboard from "./dashboard";
import Members from "./members";
import Profil from "./members/profile";
import Paiment from "./paiment";
import ErrorPage from './error'
import {closeDatabaseConnection, connectToDatabase} from '../../../../Documents/electron-vite-react-main/src/database';
import {Query} from "mysql";
import {toDate} from "date-fns";
// const router = createBrowserRouter([

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<LayoutAuth />}>
            <Route index element={<Login />} />
            <Route path="root" element={<Layout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="members" element={<Members />} />
            </Route>
            <Route path="*" element={<Login />} />
        </Route>
    )
)
const Routes:React.FC = (props) => {
//
//     const [data, setData] = useState([]);
//
//     const getData= async ()=>{
//         try {
//             const connection = await connectToDatabase();
//             const getQuery = ` SELECT s.MemberID,  s.end_date FROM subscriptions s  where  MONTH(s.end_date) <= MONTH(CURRENT_DATE()) AND YEAR(s.end_date) <= YEAR(CURRENT_DATE());`;
//
//
//          const [results ] =   await connection.query(getQuery  );
//             // @ts-ignore
//             setData(results);
//
//             await closeDatabaseConnection();
//
//         } catch (error) {
//             console.error(error);
//         }
//
//     }
//     useEffect(()=>{
//             getData();
//     },[])
//
//
// const insertSubscriptionsQuery = async  (MemberID : any , dateStart :any  , dateEnd :any  )=> {
//     try {
//         const connection = await connectToDatabase();
//          const insertSubscriptionsQuery = `INSERT INTO subscriptions (MemberID, start_date, end_date, type, status, payment_status)
//                        VALUES (?, ?, ?, ?, ?, ?)`;
//
//
//         await connection.query(insertSubscriptionsQuery , [MemberID, dateStart, dateEnd, 'monthly', 'active', 'unpaid'], );
//
//
//         await closeDatabaseConnection();
//
//     } catch (error) {
//         console.error(error);
//     }
//
// }
//
//
//
//     const MaxMonth = async (MemberID: any): Promise<any> => {
//         try {
//             const connection = await connectToDatabase();
//             const maxDate = `SELECT MONTH(max(end_date)) as MaxMonth FROM subscriptions where MemberID = ${MemberID};`;
//         const [results]  =  await connection.query(maxDate  );
//
//             // @ts-ignore
//             return  results[0].MaxMonth;
//
//
//         } catch (error) {
//             console.error(error);
//         }
//         await closeDatabaseConnection();
//     };
//
//
//     const CountValidite  = async  ( DateOf: any , MemberID :any )  => {
//         try {
//             const connection = await connectToDatabase();
//             const ValideQ = `SELECT ifnull(COUNT(*) , 0) as countValid FROM subscriptions WHERE end_date = "${DateOf}" AND MemberID = ${MemberID} ;`;
//
//
//             const [results]  =  await connection.query(ValideQ);
//
//             // @ts-ignore
//             return  results[0].countValid;
//         } catch (error) {
//             console.error(error);
//         }
//         await closeDatabaseConnection();
//
// }
//
// const MaxDate  = async  ( MemberID: any )=> {
//     try {
//         const connection = await connectToDatabase();
//         const MaxDate = ` SELECT max(end_date)  as maxDate   FROM subscriptions WHERE    MemberID =${MemberID} ;`;
//         const [results]  =  await connection.query(MaxDate);
//         // @ts-ignore
//         return  results[0].maxDate;
//     } catch (error) {
//         console.error(error);
//     }
//     await closeDatabaseConnection();
// }
//
// const isExist  = async  ( MemberID: any , endDate :any  )=> {
//     try {
//         const connection = await connectToDatabase();
//         const isExist = ` SELECT ifnull(COUNT(*) , 0) as isExist FROM subscriptions WHERE  end_date = ${endDate} AND  MemberID =${MemberID} ;`;
//         const [results]  =  await connection.query(isExist);
//         // @ts-ignore
//         return  results[0].isExist;
//     } catch (error) {
//         console.error(error);
//     }
//     await closeDatabaseConnection();
//
// }
//
// const handelAllMembers = async (data : any )=>{
//
//     const currentDate = new Date();
//     let years  = currentDate.getFullYear();
//     let currentM= currentDate.getMonth();
//     let nextM = new Date(years, currentM + 1, 1); // Set day to 1 to ensure next month
//     let nextMo = nextM.getMonth() + 1;
//     if (nextMo > 12) {
//         nextMo = 1;
//         years++;
//     }
//     const formattedNextMonth  = String(nextMo).padStart(2, '0');
//      const MaxMonthin = await MaxMonth(data.MemberID);
//     console.log('MaxMonthin------------------------',MaxMonthin)
//
//     if ( String(MaxMonthin).padStart(2, '0') === formattedNextMonth){
//         console.log("this date in last subscriptions = date now ")
//     }else{
//         const yearDate  = data.end_date.getFullYear();
//         const monthDate  = String(data.end_date.getMonth() + 2).padStart(2, '0');
//         const dayDate  = String(data.end_date.getDate()).padStart(2, '0');
//         const DateOf  = `${yearDate}-${monthDate}-${dayDate}`;
//        const ValidInser = await CountValidite(DateOf , data.MemberID)
//         console.log('ValidInser',ValidInser)
//
//         if (ValidInser === 0 ){
//             const  _date :number =  nextM.getMonth() -  data.end_date.getMonth();
//
//             console.log("_date",_date)
//
//             for (let i=0  ; i< _date ; i++ ){
//
//                 const lastDateIn : any    = await MaxDate(data.MemberID)
//                 const yearDate = lastDateIn.getFullYear();
//                 const monthDate = String(lastDateIn.getMonth() + 1).padStart(2, '0');
//                 const dayDate = String(lastDateIn.getDate()).padStart(2, '0');
//                 const DateOfM = `${yearDate}-${monthDate}-${dayDate}`;
//                 console.log("DateOfM----------", DateOfM, data.MemberID);
//
//                 // next month
//                 let yearDateNext = lastDateIn.getFullYear();
//                 let monthDateNext = String(lastDateIn.getMonth() + 1 + 1).padStart(2, '0');
//                 let dayDateNext = String(lastDateIn.getDate()).padStart(2, '0');
//
//                 if (monthDateNext > '12') {
//                     monthDateNext = '01';
//                     yearDateNext++;
//                 }
//                 const DateOfNext = `${yearDateNext}-${monthDateNext}-${dayDateNext}`;
//                 console.log("DateOfNext----------", DateOfNext, data.MemberID);
//
//                 const ExistSup = await isExist(data.MemberID ,DateOfNext )
//
//                 // if (ExistSup === 0 ){
//                 //
//                 // }
//                 await insertSubscriptionsQuery(data.MemberID,DateOfM,DateOfNext);
//
//
//
//             }
//
//         }
//
//
//
//     }
//
//
// }
//     data.map(async (el : any)=>{
//         console.log(el)
//       await  handelAllMembers(el)
//     });



    return (
        <RouterProvider router={router} />


    );
};



export default  Routes;

