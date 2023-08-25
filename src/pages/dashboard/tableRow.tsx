import React from "react";

interface Member {
    id: number;
    name: string;
    email: string;
    phone: string;
    whatsappPhone: string;
    DateOfBirth: Date;
    MembershipStartDate: Date;
    ProfilePicture: Blob;
}
interface props {
    item ?: any ;
}
const TableRow:React.FC<props> = (props) =>{
    const { item} = props;

    console.log(item)
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString(); // Adjust formatting as needed
    };
    return <>
        <tr>
            {/*<td  className={'p-4 text-center fw-normal'}>*/}
            {/*    {item.id }*/}
            {/*</td>    <td  className={'p-4 text-center fw-normal'}>*/}
            {/*    {item.name }*/}
            {/*</td>    <td  className={'p-4 text-center fw-normal'}>*/}
            {/*    {item.email }*/}
            {/*</td>    <td  className={'p-4 text-center fw-normal'}>*/}
            {/*    {item.phone }*/}
            {/*</td>    <td  className={'p-4 text-center fw-normal'}>*/}
            {/*    {item.whatsappPhone }*/}
            {/*</td>    <td  className={'p-4 text-center fw-normal'}>*/}
            {/*{formatDate(new Date(item.MembershipStartDate))}*/}
            {/*</td>    <td  className={'p-4 text-center fw-normal'}>*/}
            {/*<img src={URL.createObjectURL(item.ProfilePicture)} alt="Profile" />*/}
            {/*</td>*/}

        </tr>

    </>
}

export  default TableRow;
