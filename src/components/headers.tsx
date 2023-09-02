import Clock from "./clock";
import React from "react";
 interface LayoutProps{

    title?:string;
    subtitle?:string;
}

const Headers :React.FC<LayoutProps> = (props)=>{
    const {title ,subtitle } =props
    return <>
        <div>
            <div className={'d-flex justify-content-end   '}  >
                <Clock />
            </div>
            <h1 className={'fw-bold  mb-3'}  style={{fontSize:50}}>{title} <span  className={'gradient-text'} style={{fontSize:50}} >{subtitle}</span> </h1>
        </div>
    </>
}

export default Headers;
