 import React, {useEffect, useMemo, useState} from "react";
import { useTable } from "react-table";
import Table from 'react-bootstrap/Table'
 import  ReactPaginate from 'react-paginate'
import  Button from'react-bootstrap/Button'
 import AutorenewIcon from '@material-ui/icons/Autorenew';
import SearchIcon from '@material-ui/icons/Search';
import DateRangeCalendar from "../../components/daterangepicker/DateRangeCalendar";
 import  Select from '../../components/select'

import PaidModal from "./paidModal"
import Headers from "../../components/headers";
import { connectToDatabase, closeDatabaseConnection } from '../../database'; // Import the TypeScript module


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

const Index: React.FC = () => {


      const [data, setData] = useState([]);
     const [totalmember, setTotalMember] = useState(null);
     const [totalPersonPaid, setTotalPersonPaid] = useState(null);
     const [totalPrice, setTotalPrice] = useState(null);
     const [persNotPaid, setPersNotPaid] = useState(null);
    const [selectDate, setSelectDate] = useState('');
    const [showPaid, setShowPaid] = useState(false);
    const [rowId, setRowId] = useState<number>(0);
    const [idMember, setIdMember] = useState<number>(0);
    console.log(totalPersonPaid,totalPrice)
    const handlePaidClose = () => setShowPaid(false);
    const getMaxMemberID = async ()=> {
        try {
            const connection = await connectToDatabase();

            const [results] = await connection.query('SELECT ifnull(  COUNT(MemberID) , 0 )  AS MaxMemberID FROM Members');

            if (Array.isArray(results) && results.length > 0) {
                // Assuming results is an array of RowDataPacket objects
                // @ts-ignore
                results.map((result ) => {
                        // @ts-ignore
                    setTotalMember(result.MaxMemberID)
                    }
                );
                await closeDatabaseConnection();
            } else {
                console.error('No results found or unexpected query result format');
            }
        } catch (error) {
            console.error(error);
        }
    }
    const getTotalPrice = async ()=>{
        try {
            const connection = await connectToDatabase();

            const [results] = await connection.query(`SELECT ifnull( SUM(Price) , 0 ) as totalPrice  FROM Paiment WHERE MONTH(PaymentDate) =  MONTH( '${selectDate}') and YEAR(PaymentDate) = YEAR('${selectDate}') `);

            if (Array.isArray(results) && results.length > 0) {
                // Assuming results is an array of RowDataPacket objects
                // @ts-ignore
                results.map((result ) => {
                        // @ts-ignore
                    setTotalPrice(result.totalPrice)
                    }
                );
                await closeDatabaseConnection();
            } else {
                console.error('No results found or unexpected query result format');
            }
        } catch (error) {
            console.error(error);
        }



    }
    const getTotalPersonPaid = async ()=>{
        try {
            const connection = await connectToDatabase();

            const [results] = await connection.query(`SELECT ifnull( COUNT( MemberID ) , 0 ) as totalPersonPaid  FROM Paiment WHERE MONTH(PaymentDate) =  MONTH('${selectDate}') and YEAR(PaymentDate) = YEAR('${selectDate}');`);

            if (Array.isArray(results) && results.length > 0) {
                // Assuming results is an array of RowDataPacket objects
                // @ts-ignore
                results.map((result ) => {
                        // @ts-ignore
                    setTotalPersonPaid(result.totalPersonPaid)
                    }
                );
                await closeDatabaseConnection();
            } else {
                console.error('No results found or unexpected query result format');
            }
        } catch (error) {
            console.error(error);
        }

}
    const getPersNotPaid = async ()=>{
        try {
            const connection = await connectToDatabase();

            const [results] = await connection.query(`SELECT ifnull( COUNT( MemberID ) , 0 ) as PersNotPaid   FROM subscriptions where payment_status = "unpaid"  and MONTH(end_date) = month('${selectDate}' ) and YEAR(end_date) = YEAR('${selectDate}'  ) ;`);

            if (Array.isArray(results) && results.length > 0) {
                // Assuming results is an array of RowDataPacket objects
                // @ts-ignore
                results.map((result ) => {
                        // @ts-ignore
                    setPersNotPaid(result.PersNotPaid)
                    }
                );
                await closeDatabaseConnection();
            } else {
                console.error('No results found or unexpected query result format');
            }
        } catch (error) {
            console.error(error);
        }



    }
    const getTable = async ()=>{
        try {
            const connection = await connectToDatabase();

            const [results] = await connection.query(`SELECT m.MemberID, m.name , m.phone ,m.whatsappPhone ,m.gender,c.name as CategoryName ,s.subscription_id ,s.start_date , s.end_date ,s.payment_status FROM subscriptions s, Members m ,Category c WHERE s.MemberID = m.MemberID AND c.Category_id = m.Category_id AND  payment_status = "unpaid" AND MONTH(end_date) <= MONTH('${selectDate}') AND YEAR(end_date) <= YEAR('${selectDate}')AND day(end_date) <= day('${selectDate}') order by m.MemberID ;`);


                // @ts-ignore
            setData(results);

                await closeDatabaseConnection();

        } catch (error) {
            console.error(error);
        }


    }
    useEffect(()=>{
        getTable()
    },[selectDate])

    useEffect(() => {
        getMaxMemberID();
        getTotalPrice();
        getTotalPersonPaid();
        getPersNotPaid();
    }, [selectDate,showPaid]);


    const formatDate = (date: Date): string => {
        return date.toLocaleDateString(); // Adjust formatting as needed
    };

    const handelId = (id:number,idMem : number)=>{
        setRowId(id);
        setIdMember(idMem)
        setShowPaid(true);
    }
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Filter the data based on the search query
    const filteredData = useMemo(() => {
        return data.filter(item => {
            // @ts-ignore
            return item.name.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [data, searchQuery]);


    const columns = React.useMemo(
        () => [

            {
                Header: "Name",
                accessor: "name",
            },

            {
                Header: "Phone",
                accessor: "phone",
            },
            {
                Header: "WhatsApp Phone",
                accessor: "whatsappPhone",
            },

            {
                Header: " Start Date",
                accessor: "start_date",
                Cell: ({ value }: { value: string }) => formatDate(new Date(value)) ,

            } ,{
                Header: " End Date",
                accessor: "end_date",
                Cell: ({ value }: { value: string }) => formatDate(new Date(value)) ,

            }, {
                Header: "Gender",
                accessor: "gender",
            }, {
                Header: "Category",
                accessor: "CategoryName",
            },{
                Header: "payment status",
                accessor: "payment_status",

                Cell : ({ value , row }: { value: string , row?: any }) =>{
                    return <>
                        { value === "unpaid" ?
                            <Button className="p-2 px-4 rounded  fs-6  border-0 shadow-sm"
                                    style={{ backgroundColor:'#ffe2e5' ,color:'#f74e60'}}
                                    onClick={()=>{handelId(row.original.subscription_id , row.original.MemberID)}} >
                           {value}
                            </Button>

                     :
                        <span className=" p-2 rounded   fs-6" style={{ backgroundColor:'#caf7f5' ,color:'#1bc5be'}}> {value}</span>
                        }
                    </>

                }
            },

        ],
        []
    );



    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable<Record<string, any>>({ columns,data: filteredData});


    const itemsPerPage = 7;
    const [currentPage, setCurrentPage] = useState(0);


    const pageCount = Math.ceil(rows.length / itemsPerPage);

    const handlePageChange = (selectedPage : any) => {
        setCurrentPage(selectedPage.selected);
    };

    const startIndex = currentPage * itemsPerPage;
    const displayedRows = rows.slice(startIndex, startIndex + itemsPerPage);

    const PageClick = async (data:any) => {
        // let currentPage = data.selected + 1;
        // const dataPage = await fetchData(currentPage);
        // setData(dataPage);
        console.log('click it ')
        console.log(data)

    };


    return (
        <>
            <Headers title={ 'Welcome To '} subtitle={'FormePro' } />
            <div  className={'row '}>
            <div className={ 'd-flex justify-content-center align-items-center col-md-8'}>
                <div className={'col  '}>
                <div className="card card-body bg-dark align-items-center justify-content-center border-0  mb-4 shadow-sm   "
                     style={{borderRadius:'15px' , width:'70%', margin: "auto" , height: '200px' }}>
                        <div className={'fw-lighter gradient-text-dark '} style={{fontSize:35}}>
                            All Membres
                        </div>
                        <div  className={'d-flex justify-content-center  fw-bold  text-white' } style={{fontSize:35}}>
                            {totalmember}
                        </div>
            </div>
                <div className="card card-body align-items-center  bg-dark justify-content-center px-3 border-0 shadow-sm   " style={{borderRadius:'15px'  , width:'70%',    margin: "auto",height: '200px'}}>
                    <div className={'fw-lighter gradient-text-dark  '} style={{fontSize:35}}>
                        Members Paid
                    </div>
                    <div  className={'d-flex justify-content-center  fw-bold  text-white' } style={{fontSize:35}}>
                        {totalPersonPaid}
                    </div>
            </div>
                </div>
                <div className={'col '}>
                <div className="card card-body align-items-center bg-dark justify-content-center px-3   mb-4 border-0 shadow-sm  " style={{borderRadius:'15px'  , width:'70%',    margin: "auto",height: '200px'}}>
                    <div className={'fw-lighter gradient-text-dark  '} style={{fontSize:35}}>
                      Monthly Revenue
                    </div>
                    <div  className={'d-flex justify-content-center  fw-bold  text-white' } style={{fontSize:35}}>
                        {totalPrice}  MDH
                    </div>
                </div>
                    <div className="card card-body align-items-center bg-dark justify-content-center px-3 border-0 shadow-sm  " style={{borderRadius:'15px'  , width:'70%',    margin: "auto",height: '200px'}}>
                        <div className={'fw-lighter gradient-text-dark  '} style={{fontSize:35}}>
                           Unpaid Memberships
                        </div>
                        <div  className={'d-flex justify-content-center  fw-bold  text-white' } style={{fontSize:35}}>
                            {persNotPaid}
                        </div>
            </div>
                </div>
            </div>
            <div className={'col-md-4'}>
                        <DateRangeCalendar setSelectDate={setSelectDate}/>
            </div>
            </div>

<div className={'row '}>
            <div className="card card-body align-items-center justify-content-center px-0 mt-5 shadow-sm  border-0" style={{borderRadius:'15px'}}>
                    <div className="react-bootstrap-table table-responsive w-100">
                    <div className={'p-2 pb-3 d-flex justify-content-between'} >

                        <div/>
                            <div className="form position-relative  d-flex align-items-center "style={{ width:350, marginLeft:100}} >
                                <div className={ '  position-absolute  top-3 left-0 px-2'}>
                               <SearchIcon/>
                               </div>
                                <input type="text" className="  form-control form-input  py-2 " placeholder="Search by name   " style={{paddingLeft :35,    borderRadius: '30px  '
                                }}
                                       value={searchQuery}
                                       onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div>
                                <Button variant="white" className={'mx-5'} onClick={()=>{getTable()}}><AutorenewIcon/> Refresh</Button>
                                {/*<Button variant="dark" className={'me-5'}><AddIcon/> Ajouter Member</Button>*/}
                            </div>
                    </div>

<div   style={{ height: '300px', overflow: 'auto' }} >


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
                        {displayedRows.map((row:any) => {
                            prepareRow(row);
                            return (
                                <tr key={row.id}  {...row.getRowProps()} >
                                    {row.cells.map((cell:any) => (
                                        <td {...cell.getCellProps()} key={cell.column.id} className={'p-4 text-center fw-normal'}>
                                            {cell.render("Cell")}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}

                        {/*{data.map((item)=>{*/}
                        {/*return  <TableRow  item={item} />*/}
                        {/*})}*/}

                        </tbody>
                    </Table>
</div>
                        <div className={'d-flex justify-content-between px-5  '}>
                        <div/>
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            onPageChange={handlePageChange}
                            containerClassName={"pagination mb-0 align-items-center"}
                            pageClassName={"page-item  "}
                            pageLinkClassName={"page-link "}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active "}
                        />

                        <Select />
                        </div>

                    </div>

        </div>

    <PaidModal show={showPaid} onHide={handlePaidClose} id={rowId} handeldata={getTable} idMember={idMember}/>
</div>
        </>
    );
};

export default Index;
