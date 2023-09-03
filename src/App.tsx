import * as React from "react";

 import './App.scss'

require('dotenv').config();
import Pec from './156169.svg'
import * as crypto from 'crypto';

 import Routes from "./pages";
import {closeDatabaseConnection, connectToDatabase} from "@/database";
import {useEffect, useState} from "react";

 console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function App() : JSX.Element  {
    const [key, setKEY] = useState<string>('');
  let  defaultKey  : string ='))-Vvao=[C1jVuTSH-,(8=XF|o]>CY^,1kXrHz8)F%gY((Of2^B:+vGH=&%kWD<sUN_A+a*4Uhmhl<ThL^6JE@[l7[sS=0*GU$xQwQs3;TWQGK&Z7.9I|XCtA,%B}W}Z$Ke|Yr1z#d}.9q.4OaffHf,p&7DBhxsb'

//
//
//     function generateSecureKey(length: number): string {
//         const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
//         const secureKey = Array.from(crypto.randomFillSync(new Uint8Array(length)))
//             .map(byte => characters[byte % characters.length])
//             .join('');
//         return secureKey;
//     }
//
// // Specify the desired key length (e.g., 16 characters)
//     const keyLength = 160;
//
//     const secureKey = generateSecureKey(keyLength);
//     console.log("Generated Secure Key:", secureKey);
//
    const getKey = async ()=>{
        try {
            const connection = await connectToDatabase();
            const [results] = await connection.query(`SELECT * FROM securite `);
            // @ts-ignore
            setKEY(results[0].Key)
            await closeDatabaseConnection();
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>{
        getKey();
    },[])

    return (
        <>
            {
                key === defaultKey
                ?
                    <div className={'bodyLayout'}>
                        <Routes/>
                    </div>
                    :      <div className={'bodyLayout text-center  d-flex justify-content-center align-items-center'}>
                    <div >
                        <div>
                            <img src={Pec} width={200}  className={'py-5'}/>
                        </div>
                        <h1 > You are not authorized to use this application.</h1>
                        <h2> please contact Assamdi yassine</h2>
                        <h3> Number: +212 6 75 26 96 16</h3>
                    </div>
                    </div>
            }
        </>
    );

}

export default App





