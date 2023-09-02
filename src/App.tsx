import * as React from "react";
 import './App.scss'
require('dotenv').config();
 import Routes from "./pages";
 console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)
function App() : JSX.Element  {

    return (
        <>
                <div className={'bodyLayout'}>
                    <Routes/>
                </div>
        </>
    );

}

export default App





