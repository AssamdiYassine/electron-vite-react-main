 import Modal from 'react-bootstrap/Modal';
import PaidModal from "../../components/paidModal";
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
import Delete from '../../components/deleteModal'
 import Button from "react-bootstrap/Button";
const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
    },
}));
 import { connectToDatabase, closeDatabaseConnection } from '../../../../../Documents/electron-vite-react-main/src/database';
 import {string} from "yup";
 import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";
 import EditIcon from "@material-ui/icons/Edit";
 import DeleteIcon from "@material-ui/icons/Delete";
 import SVG from "react-inlinesvg";
 import worninf from "../../../public/verifier.png";
registerLocale('en', en);
interface Member {
    name: string;
    cin: string;
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
 }

const profile:React.FC<Props> = (props)=> {
    const {show  ,handleClose ,   rowId } = props
    const [informtion, setInformtion] = useState<Member | any>([]);
    const [data, setData] = useState<sub | any>([]);
    const [InsurancePayment, setInsurancePayment] = useState<sub | any>([]);
    console.log("----InsurancePayment---",InsurancePayment)
    const [showP, setShowP] = useState(false);
    const [showD, setShowD] = useState(false);
    const [showPartial, setShowPartial] = useState(false);
    const [IdS, setIdS] = useState<number>(0);
    const [DeleteID, setDeleteID] = useState<number>(0);

    const [error, setError] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [paymentValue, setPaymentValue] = useState(0);
    const [showPaid, setShowPaid] = useState(false);
    console.log(selectedOption)
    const handleOptionChange = (event : any) => {
        setSelectedOption(event.target.value);
    };

    const handlePaidClose = () => setShowP(false);



    const initialData: Member = {
        name: informtion.name,
        cin: informtion.cin,
        phone: informtion.phone,
        whatsappPhone: informtion.whatsappPhone,
        DateOfBirth: new Date(informtion.DateOfBirth),
        gender: informtion.gender,
        CategoryName: informtion.CategoryName,
        MembershipStartDate: new Date(informtion.MembershipStartDate),
        ProfilePicture: informtion.ProfilePicture,
        QRcode: informtion.QRcode,

    };





    const formatDate = (date: Date): string => {
        return date.toLocaleDateString(); // Adjust formatting as needed
    };

    const getMemberData = async ()=>{
        try {
            const connection = await connectToDatabase();

          const [results] = await connection.query(`SELECT m.* ,c.name as CategoryName FROM Members m ,Category c WHERE  c.Category_id = m.Category_id AND c.Category_id AND m.isDeleted=0  AND m.MemberID=${rowId}`);
            // @ts-ignore
                results.map((result ) => {

                    setInformtion(result)
                    });

                await closeDatabaseConnection();

        } catch (error) {
            console.error(error);
        }

     }


    const getSubscriptions = async ()=>{
        try {
            const connection = await connectToDatabase();

            const [results] = await connection.query(`SELECT * FROM subscriptions s where s.MemberID = ${rowId}`);
            setData(results);
                await closeDatabaseConnection();

        } catch (error) {
            console.error(error);
        }

    }
    const getInsurancePayment = async ()=>{

        try {
        const connection = await connectToDatabase();

        const [results] = await connection.query(`SELECT * FROM  InsurancePayments where MemberID  = ${rowId}`);
        setInsurancePayment(results);
        await closeDatabaseConnection();

    } catch (error) {
        console.error(error);
    }

    }
    const currentDate = new Date();
    const yearPaymentDate = currentDate.getFullYear();
    const monthPaymentDate = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayPaymentDate = String(currentDate.getDate()).padStart(2, '0');
    const PaymentDate = `${yearPaymentDate}-${monthPaymentDate}-${dayPaymentDate}`;

    const handelInsurance = async ()=>{
        if (selectedOption === "Paid"){
            try {
                const connection = await connectToDatabase();
                const values2 = [
                    rowId,
                    200,
                    PaymentDate,
                    'Paid'

                ];
                const InsurancePayments = `
                              INSERT INTO InsurancePayments (MemberID,PaymentAmount,PaymentDate,Status)
                              VALUES (?, ?, ?,?);
                            `;

                 await connection.query(InsurancePayments, values2);
               await getInsurancePayment();


            } catch (error) {
                console.error(error);
            }

        }

        if (selectedOption === "Partial"){
            if (paymentValue < 200 && paymentValue >0){
                try {
                    const connection = await connectToDatabase();
                    const values2 = [
                        rowId,
                        paymentValue,
                        PaymentDate,
                        'Partial'
                    ];
                    const InsurancePayments = `
                              INSERT INTO InsurancePayments (MemberID,PaymentAmount,PaymentDate,Status)
                              VALUES (?, ?, ?,?);
                            `;

                    await connection.query(InsurancePayments, values2);
                   await getInsurancePayment();


                } catch (error) {
                    console.error(error);
                }
            }else{
                setError("please add value under the 200 dh ")
            }
        }
        setShowPaid(false);
    }
    console.log('InsurancePayment.PaymentID',InsurancePayment[0]?.PaymentID)
    const  handelPartial = async ()=>{

        try {
            const connection = await connectToDatabase();

            const InsurancePayments = `
                              UPDATE InsurancePayments SET PaymentAmount = ${200} ,PaymentDate = '${PaymentDate}',  Status = 'Paid'  WHERE PaymentID = ${InsurancePayment[0]?.PaymentID} `;

            await connection.query(InsurancePayments);


             await getInsurancePayment();
            setShowPartial(false);
        } catch (error) {
            console.error(error);
        }



    }
   const  getDeleteId = (id :number)=>{
        setDeleteID(id);
        setShowD(true)
    }
     const  handleDelete = async ()=>{

        try {
            const connection = await connectToDatabase();

            const InsurancePayments = ` delete from subscriptions where subscription_id =${DeleteID}`;

            await connection.query(InsurancePayments);


             await getSubscriptions();
            setShowD(false);
        } catch (error) {
            console.error(error);
        }



    }


    useEffect(()=>{
        getSubscriptions();
        getMemberData();
        getInsurancePayment();
    },[rowId])

    const handelId = (id:number)=>{
        setIdS(id);

        setShowP(true);
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
                Cell : ({ value , row }: { value: string , row?: any }) =>{
                    return <>



                        { value === "unpaid" ?
                            <Button className="p-2 px-4 rounded  fs-6  border-0 shadow-sm"
                                    style={{ backgroundColor:'#ffe2e5' ,color:'#f74e60'}}
                                    onClick={()=>{handelId(row.original.subscription_id)}} >
                                {value}
                            </Button>

                            :
                            <span className=" p-2 rounded   fs-6" style={{ backgroundColor:'#caf7f5' ,color:'#1bc5be'}}> {value}</span>
                        }

                    </>

                }

            },
            {
                Header: "Action",
                accessor: "",
                Cell : ({ row }: {   row?: any }) =>{

                    return <>

                        {row?.original.payment_status === "unpaid" ?

                                <Button variant={"light"}  onClick={()=>getDeleteId(row?.original.subscription_id)}>
                                    <DeleteIcon  style={{ color: '#f74e60' }}/>
                                </Button>


                            : null }

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
                                                            <Form.Label>Cin</Form.Label>
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
                                                        <Form.Label>{initialData.cin}</Form.Label>
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
                                       {InsurancePayment.length === 0 ?
                                                 <>
                                                 <Paper className={classes.root}>
                                                <Typography variant="h5" component="h3">
                                                    <div className={'d-flex justify-content-around align-items-center'}>
                                             <span className={'px-2'}>   Assurance  :   </span>    <Button className=" p-2 rounded  px-4    fs-6  border-0 shadow-sm   fs-6"
                                                                        style={{ backgroundColor:'#ffe2e5' ,color:'#f74e60'}}
                                                onClick={()=>setShowPaid(true)}
                                                > Unpaid</Button>
                                                        { showPaid ?  <>

                                                     <Form.Group controlId="InsurancePayment" className={'px-5'}>
                                                         <Form.Label>Insurance Payment</Form.Label>
                                                         <Form.Control as="select"    onChange={handleOptionChange}>
                                                             <option value="">Select Payment</option>
                                                             <option value="Paid">Paid</option>
                                                             <option value="Partial">Partial</option>
                                                         </Form.Control>
                                                     </Form.Group>
                                                            <div>


                                                     {selectedOption === 'Partial' && (
                                                         <Form.Group controlId="InsuranceValue">
                                                             <Form.Label>  Payment value</Form.Label>
                                                             <Form.Control type="number" max={199}  onChange={(e :any)=>{ setPaymentValue(e.target.value)}}  />
                                                         </Form.Group>
                                                     )}
                                                        <h6 className={'text-danger'}>{error}</h6>
                                                            </div>
                                                         <div className={'px-5'} >
                                                             <Button className="  rounded  px-4  btn-dark border-0 shadow-sm h-10   fs-6"
                                                                     onClick={()=>handelInsurance()}
                                                             > Valide</Button>
                                                         </div>

                                                            </>
                                                    : null }
                                                        </div>
                                                 </Typography>
                                                     </Paper>
                                    </>
                                           :

                                          InsurancePayment.map((el :any,index : any)=>{
                                                console.log("----el---",el)
                                                return <>
                                                <Paper className={classes.root} key={el.PaymentID} style={{display:"flex"}}>

                                                <Typography variant="h5" component="h3" className={"px-2"}>
                                                    Assurance  :   {  el.Status === "Paid" ? <Button className=" p-2 rounded  px-4    fs-6  border-0 shadow-sm  fs-6" style={{ backgroundColor:'#caf7f5' ,color:'#1bc5be'}}> {el.Status}</Button> : el.Status === "Partial" ?
                                                    <> <Button onClick={()=>{setShowPartial(true)}}
                                                               className="  p-2 rounded  px-4    fs-6  border-0 shadow-sm   fs-6"
                                                               style={{ backgroundColor:'#fff4de' ,color:'#ffa800'}}> {el.Status}</Button>

                                                       </>
                                                    : null}
                                                </Typography>

                                                <Typography variant="h5" component="h3" className={"px-2"}>
                                                    date  :   {  el.Status === "Paid" ? <span className=" p-2 rounded   fs-6" style={{ backgroundColor:'#caf7f5' ,color:'#1bc5be'}}> {formatDate(new Date(el.PaymentDate))}</span> : el.Status === "Partial" ? <span className=" p-2 rounded   fs-6" style={{ backgroundColor:'#fff4de' ,color:'#ffa800'}}>{formatDate(new Date(el.PaymentDate))}</span> : null}
                                                </Typography>

                                                <Typography variant="h5" component="h3" className={"px-2"}>
                                                    Payment Amount  :   {  el.Status === "Paid" ? <span className=" p-2 rounded   fs-6" style={{ backgroundColor:'#caf7f5' ,color:'#1bc5be'}}>  {el.PaymentAmount} Dh</span> : el.Status === "Partial" ? <span className=" p-2 rounded   fs-6" style={{ backgroundColor:'#fff4de' ,color:'#ffa800'}}>  {el.PaymentAmount} Dh</span> : null}
                                                </Typography>
                                                    {showPartial  ?  <div className={'px-3  d-flex align-items-center'}>
                                                        <h6 className={'text-success pe-3'}>change to Paid </h6>
                                                        <Button onClick={()=>{handelPartial()}}
                                                                className="  p-2 rounded  px-4 btn  btn-dark   fs-6  border-0 shadow-sm   fs-6"
                                                        > Valide</Button>
                                                    </div> : null }
                                                </Paper>
                                                </>
                                            })



                                        }

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
        <PaidModal show={showP} handeldata={getSubscriptions} id={IdS} idMember={rowId} onHide={ handlePaidClose} />
        <Modal
            show={showD}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete subscriptions
                </Modal.Title>
                <div className="btn btn-dark text-white" onClick={() => setShowD(false)}>
                    x
                </div>
            </Modal.Header>
            <Modal.Body>

                <h3 className="d-flex justify-content-center pt-5">
                    Are you sure you want to delete?
                </h3>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
                <button
                    onClick={() => handleDelete()}
                    type="button"
                    className="btn btn-warning p-2 text-dark "
                >
                    Delete this subscription
                </button>
                <button
                    onClick={() =>setShowD(false)}
                    type="button"
                    className="btn btn-light text-dark"
                >
                    Cancel
                </button>
            </Modal.Footer>
        </Modal>
    </>
}

export  default  profile ;
