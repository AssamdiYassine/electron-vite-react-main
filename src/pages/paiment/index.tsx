import React from "react";
import Headers from "@/components/headers";

interface Props {

    conn?: any; // Update this type to match the MySQL connection type
}

const  Paiment:React.FC<Props> = (props)=>{
    const  { conn } = props
    return <>
        <Headers title={ 'Espace '} subtitle={'Paiment' } />
    <h1>paiment</h1>
    </>
}

export default Paiment ;
