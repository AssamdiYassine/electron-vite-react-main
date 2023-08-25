import React, { useState, useEffect } from 'react';


function App() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formattedTime = time.toLocaleTimeString();
    const options :any = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = time.toLocaleDateString('fr-FR', options);
    return (
                <div className={' rounded-full  bg-white p-2 d-flex justify-content-center align-items-center shadow mb-4'} style={{width:'300px', borderRadius:'20px'}}>
                    <div>
                    <div  className={'d-flex justify-content-center  fw-bold  fs-3'}>
                        {formattedTime}
                    </div>
                    <div className={'fw-lighter fs-5'}>
                        {formattedDate}
                    </div>
                    </div>
                </div>
    );
}

export default App;
