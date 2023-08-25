 import Modal from 'react-bootstrap/Modal';

 import React, {useEffect, useState} from 'react';
 import Form from 'react-bootstrap/Form';
import {useTable} from "react-table";
import Table from "react-bootstrap/Table";
 import QRCode from 'qrcode.react';
import  { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
 import en from 'date-fns/locale/en-US';
 import {Paper, Typography} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
}));

registerLocale('en', en);
interface Member {
    name: string;
    email: string;
    phone: string;
    whatsappPhone: string;
    DateOfBirth: Date;
    gender: string;
    CategoryName: string;
    Category_id?:number;
    MembershipStartDate: Date;
    ProfilePicture?: string;
    QRcode:string,
}
interface  sub {
    start_date?: Date;
    end_date? : Date;
    type?:string;
    status  ?:string;
    payment_status  ?:string;
}

interface Props {
    rowId?:number;
    show?: any;
    handleClose?: () => void;
    conn?: any; // Update this type to match the MySQL connection type
}

const profile:React.FC<Props> = (props)=> {
    const {conn ,show  ,handleClose ,   rowId } = props
    const [informtion, setInformtion] = useState<Member | any>([]);
    const [data, setData] = useState<sub | any>([]);

    const initialData: Member = {
        name: informtion.name,
        email: informtion.email,
        phone: informtion.phone,
        whatsappPhone: informtion.whatsappPhone,
        DateOfBirth: new Date(informtion.DateOfBirth),
        gender: informtion.gender,
        CategoryName: informtion.CategoryName,
        MembershipStartDate: new Date(informtion.MembershipStartDate),
        ProfilePicture: informtion.ProfilePicture,
        QRcode: informtion.QRcode,

    };



    useEffect(()=>{
        getSubscriptions();
        getMemberData();
    },[rowId])

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString(); // Adjust formatting as needed
    };

    const getMemberData = async ()=>{
        await  conn.query(
            {
                sql: `SELECT m.* ,c.name as CategoryName FROM Members m ,Category c WHERE  c.Category_id = m.Category_id AND c.Category_id AND m.isDeleted=0  AND m.MemberID=${rowId}`,
                timeout: 40 * 1000, // 40s
            },
            [0], // values to replace ?
            await     function (err: any, results: any, fields: any) {
                if (err) {
                    alert(err.code);
                    console.log(err.code);
                } else {
                    results.map((el : any)=>setInformtion(el) )

                }
            });
    }


    const getSubscriptions = async ()=>{
        await  conn.query(
            {
                sql: `SELECT * FROM MALAKIDB.subscriptions s where s.MemberID = ${rowId}`,
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

    const columns = React.useMemo(
        () => [
            {
                Header: "start_date",
                accessor: "start_date",
                Cell: ({ value }: { value: string }) => formatDate(new Date(value)) ,
            }, {
                Header: "end_date",
                accessor: "end_date",
                Cell: ({ value }: { value: string }) => formatDate(new Date(value)) ,
            },
            {
                Header: "type",
                accessor: "type",
            },
            {
                Header: "status",
                accessor: "status",
            },
            {
                Header: "payment_status",
                accessor: "payment_status",
                Cell : ({ value }: { value: string }) =>{
                    return <>
                        { value === "unpaid" ?
                            <span className="   p-2 px-4 rounded  fs-6" style={{ backgroundColor:'#ffe2e5' ,color:'#f74e60'}}>{value}</span>
                            :
                            <span className=" p-2 rounded   fs-6" style={{ backgroundColor:'#caf7f5' ,color:'#1bc5be'}}> {value}</span>
                        }
                    </>

                }

            }
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable<Record<string, any>>({ columns,  data  });


    const classes = useStyles();

    return <>
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            size={'xl'}

        >
            <Form  >
                <Modal.Header closeButton>

                        <h5 className="flex-grow-1 text-start   fw-bold">
                            Profil member
                        </h5>


                </Modal.Header>
                <Modal.Body   >

                            <div className={'row '}>
                                <div className={' '}>
                                    <div  className={'row '} >



                                        <div className={'col-8 d-flex justify-content-start '}>
                                            <div className={'  w-100  d-flex  p-3 '}>

                                                <div  className="col-6  px-5    align-items-center justify-content-center" >
                                                        <Form.Group >
                                                            <Form.Label >Name</Form.Label>
                                                        </Form.Group>
                                                        <Form.Group >
                                                            <Form.Label>Email</Form.Label>
                                                        </Form.Group>
                                                        <Form.Group >
                                                            <Form.Label>Phone</Form.Label>
                                                        </Form.Group>
                                                        <Form.Group >
                                                            <Form.Label>WhatsApp Phone</Form.Label>
                                                        </Form.Group>
                                                        <Form.Group >
                                                            <Form.Label>Date of Birth</Form.Label>
                                                        </Form.Group>
                                                        <Form.Group >
                                                            <Form.Label>Gender</Form.Label>
                                                        </Form.Group>
                                                        <Form.Group >
                                                            <Form.Label>Category</Form.Label>
                                                        </Form.Group>
                                                        <Form.Group >
                                                            <Form.Label>Membership Start Date</Form.Label>
                                                        </Form.Group>

                                                </div>
                                                <div className={'col-1'}>
                                                    <Form.Group >
                                                        <Form.Label>:</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group >
                                                        <Form.Label>:</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group >
                                                        <Form.Label>:</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group  >
                                                        <Form.Label>:</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group  >
                                                        <Form.Label>:</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group  >
                                                        <Form.Label>:</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group  >
                                                        <Form.Label>:</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group  >
                                                        <Form.Label>:</Form.Label>
                                                    </Form.Group>

                                                </div>
                                                <div  className="col-6  px-5    align-items-center justify-content-center" >
                                                    <Form.Group  >
                                                        <Form.Label>{initialData.name}</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group  >
                                                        <Form.Label>{initialData.email}</Form.Label>
                                                    </Form.Group >
                                                    <Form.Group  >
                                                        <Form.Label>{initialData.name}</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group  >
                                                        <Form.Label>{initialData.whatsappPhone}</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group  >

                                                        <Form.Label>{formatDate(initialData.DateOfBirth)}</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group >
                                                        <Form.Label>{initialData.gender}</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group  >
                                                        <Form.Label>{initialData.CategoryName}</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group  >
                                                        <Form.Label>{formatDate(initialData.MembershipStartDate)}</Form.Label>
                                                    </Form.Group>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={'col-3 d-flex justify-content-center'}>

                                            <label
                                                htmlFor="identity_file"
                                                className="col-12 dropzone-msg dz-message needsclick d-flex align-items-center justify-content-center  "
                                            >
                                                <div className="  dropzone-secondary dropzone-clickable p-15 rounded row d-flex flex-column  justify-content-center align-items-center">

                                                        <div
                                                        >
                                                            <div className="  p-1">
                                                                <div>

                                                                    <img
                                                                        src={initialData.ProfilePicture}
                                                                        width={'300px'}

                                                                        className={'rounded'}
                                                                     alt={""}/>
                                                                </div>
                                                            </div>


                                                            <div className=" mt-5 row d-flex flex-column  justify-content-center align-items-center p-1">
                                                                <div >

                                                                    <QRCode value={initialData.QRcode} size={200} />

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>


                                            </label>


                                        </div>

                                    </div>
                                    <div className={'row'}>


                                        <div className={'py-5 d-flex'}>
                                            <div  className={'px-5'}>
                                        <Paper className={classes.root}>
                                        <Typography variant="h5" component="h3">
                                            Assurance  :    <span className=" p-2 rounded   fs-6" style={{ backgroundColor:'#caf7f5' ,color:'#1bc5be'}}> Paid</span>
                                        </Typography>

                                        </Paper>

                                            </div>
                                            <div>
                                                <Paper className={classes.root}>
                                                    <Typography variant="h5" component="h3">
                                                        Assurance  :    <span className=" p-2 rounded   fs-6" style={{ backgroundColor:'#caf7f5' ,color:'#1bc5be'}}> Paid</span>
                                                    </Typography>

                                                </Paper>
                                            </div>

                                            </div>

                                    </div>
                                    <div className={'row   d-flex justify-content-start'}>
                                        <h2>All subscription  </h2>
                                        <Table  {...getTableProps()} className="table table table-head-custom table-vertical-center overflow-hidden">
                                            <thead >
                                            {headerGroups.map((headerGroup :any) => (
                                                <tr {...headerGroup.getHeaderGroupProps()}    className={' rounded  '}  >
                                                    {headerGroup.headers.map((column :any) => (
                                                        <th {...column.getHeaderProps()}  className={'bg-dark text-white fs-6 fw-light   text-center'}   >
                                                            {column.render("Header")}
                                                        </th>
                                                    ))}
                                                </tr>
                                            ))}
                                            </thead>
                                            <tbody  {...getTableBodyProps()} >


                                            {rows.map((row:any) => {
                                                prepareRow(row);
                                                return (
                                                    <tr key={row.subscription_id}  {...row.getRowProps()} >
                                                        {row.cells.map((cell:any) => (
                                                            <td {...cell.getCellProps()} key={cell.column.id} className={'p-4 text-center fw-normal'}>
                                                                {cell.render("Cell")}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </Table>

                                    </div>
                                </div>

                            </div>


                </Modal.Body>


            </Form>
        </Modal>
    </>
}

export  default  profile ;
