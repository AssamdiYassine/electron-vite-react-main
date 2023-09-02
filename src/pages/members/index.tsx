import Clock from "../../components/clock";
import SearchIcon from "@material-ui/icons/Search";
import Button from "react-bootstrap/Button";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import AddIcon from "@material-ui/icons/Add";
import Table from "react-bootstrap/Table";
import ReactPaginate from "react-paginate";
import Select from "../../components/select";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useTable} from "react-table";
import Modal from 'react-bootstrap/Modal'
 import {Dropdown} from "react-bootstrap";
import  AddMember from './addMember'
 import Headers from "../../components/headers";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import DeleteModal from "../../components/deleteModal";
import {string} from "yup";
import blobUtil from 'blob-util';
import Profile from "./profile";
import { connectToDatabase, closeDatabaseConnection } from '../../../../../Documents/electron-vite-react-main/src/database';


interface LoginProps {

}

interface Member {
    name: string;
    cin: string;
    phone: string;
    whatsappPhone: string;
    DateOfBirth: Date;
    gender: string;
    CategoryName: string;
    Category_id:number;
    MembershipStartDate: Date;
    ProfilePicture?: Blob;
}

interface Item {
    name: string;
    code: number | null | undefined;
}

const Index:React.FC<LoginProps> = (props)=> {

     const [showProfile, setShowProfile] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showDelete, setShowDelet] = useState(false);
    const [ DeleteId, setDeletId] = useState(false);

    const [data, setData] = useState([]);
     const [rowId, setrowId] = useState<number>(0);

    const [category, setCategory] = useState([]);

    const handleDeleteClose = () => setShowDelet(false);
    const handleCloseProfile = () => setShowProfile(false);
    const handleCloseAddMember= () => setShowAddMember(false);

    const handleShow = () => {
        setShowProfile(true);
    }

    const handleShowAddMember = () => {
        setShowAddMember(true);
    }

    const [searchQuery, setSearchQuery] = useState<string>('');
    console.log("------",data)
    // Filter the data based on the search query
    const filteredData = useMemo(() => {
        return data.filter(item => {
            // @ts-ignore
            return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.QRcode !== null && item.QRcode !== undefined && item.QRcode.toString().toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [data, searchQuery]);


const handelProfile = (id:number) => {
    setrowId(id)
    setShowProfile(true);
}
    useEffect(()=>{
        getTable();
        getCategory();
    },[])
    // @ts-ignore

    const getTable = async ()=>{
        try {
            const connection = await connectToDatabase();

            const [results] = await connection.query(`SELECT m.* ,c.name as CategoryName FROM Members m ,Category c WHERE  c.Category_id = m.Category_id AND m.isDeleted=0`);


            // @ts-ignore
            setData(results);

            await closeDatabaseConnection();

        } catch (error) {
            console.error(error);
        }

    }

    const getCategory = async ()=>{
        try {
            const connection = await connectToDatabase();

            const [results] = await connection.query(`SELECT *  FROM  Category`);


            // @ts-ignore
            setCategory(results);

            await closeDatabaseConnection();

        } catch (error) {
            console.error(error);
        }

    }

 const getWithCategory  = async (el :any)=>{
     try {
         const connection = await connectToDatabase();

         const [results] = await connection.query(`SELECT m.name , m.cin,m.phone , m.whatsappPhone , m.DateOfBirth ,m.gender ,c.name as CategoryName FROM Members m ,Category c WHERE  c.Category_id = m.Category_id AND c.Category_id=${el} AND m.isDeleted=0`);


         // @ts-ignore
         setData(results);

         await closeDatabaseConnection();

     } catch (error) {
         console.error(error);
     }

    }
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString(); // Adjust formatting as needed
    };
const handelDelete=(id :any)=>{
    setDeletId(id);
    setShowDelet(true);
}

    //
    // {
    //     Header: "ProfilePicture",
    //         accessor: "ProfilePicture",
    //     Cell: ({ value }: { value: any }) => {
    //     const base64String = btoa(new Uint8Array(value).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    //     console.log(base64String)
    //     return (
    //         <div>
    //             {value ? (
    //                 <img src={value} alt="Profile Picture" width={60} style={{borderRadius:30}} />
    //             ) : (
    //                 <p>No profile picture available.</p>
    //             )}
    //         </div>
    //     );
    //
    //
    // },
    //
    // },

    const columns = React.useMemo(
        () => [

            {
                Header: "Name",
                accessor: "name",
                Cell: ({ value }: { value: string }) => {
                    return <div  style={{width:'120px'}}>
                        {value}
                    </div>

                },

            },
            {
                Header: "CIN",
                accessor: "cin",
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
                Header: "Date of Birth",
                accessor: "DateOfBirth",
                Cell: ({ value }: { value: string }) => formatDate(new Date(value)) ,

            },
            {
                Header: "Membership Start Date",
                accessor: "MembershipStartDate",
                Cell: ({ value }: { value: string }) => formatDate(new Date(value)) ,

            }, {
                Header: "Gender",
                accessor: "gender",
            },
            {
                Header: "Category",
                accessor: "CategoryName",
            }, {
                Header: "QRcode",
                accessor: "QRcode",
            },
            {
                Header: "Action",
                accessor: "",
                Cell : ({ row }: { row?: any }) =>{
                    return <>
                        <Button  variant={"light"}  className={'me-1'} onClick={()=>{
                            console.log(row?.original.MemberID);
                            handelProfile(row?.original.MemberID as number);

                        }}>
                            <RemoveRedEyeIcon style={{ color: '#000' }}/>
                        </Button> <Button  variant={"light"}  className={'me-1'}>
                            <EditIcon style={{ color: '#05CDFF' }}/>
                        </Button>
                        <Button variant={"light"}  onClick={()=>handelDelete(row?.original.MemberID)}>
                            <DeleteIcon  style={{ color: '#f74e60' }}/>
                        </Button>
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
    return<>
        <Headers title={ 'Espace '} subtitle={'Members' } />
        <div>
            <div className={'row '}>
                <div className="card card-body align-items-center justify-content-center px-0 mt-5 shadow-sm  border-0" style={{borderRadius:'15px'}}>
                    <div className="react-bootstrap-table table-responsive w-100">
                        <div className={'p-2 pb-3 d-flex justify-content-between'} >
                            <Dropdown >
                                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                    Select category
                                </Dropdown.Toggle>

                                <Dropdown.Menu variant={"dark"}>
                                    {category.map((el:any)=>
                                        <div key={el.Category_id}>
                                         <Dropdown.Item href="#/action-1" onClick={()=>getWithCategory(el.Category_id)} >{el.name}</Dropdown.Item>
                                        </div>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                            <div className="form position-relative  d-flex align-items-center "style={{ width:350, marginLeft:100}} >
                                <div className={ '  position-absolute  top-3 left-0 px-2'}>

                                    <SearchIcon/>
                                </div>
                                <input type="text" className="  form-control form-input  py-2 " placeholder="Search by name or QR code  "
                                       style={{paddingLeft :35,    borderRadius: '30px  '
                                }}
                                       value={searchQuery}
                                       onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div>
                                <Button variant="white" className={'mx-5'} onClick={getTable}><AutorenewIcon/> Refresh</Button>
                                <Button variant="dark" className={'me-5'} onClick={handleShowAddMember}><AddIcon/> Add Member</Button>
                            </div>
                        </div>
                        <div  style={{ height: '700px', overflow: 'auto' }}>


                         <Table  {...getTableProps()} className="table table table-head-custom table-vertical-center overflow-hidden" >
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
                                    <tr key={row.MemberID}  {...row.getRowProps()} >
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

            </div>

            <AddMember show={showAddMember} handleClose={handleCloseAddMember}   category={category} getTable={getTable} />
            <Profile show={showProfile} handleClose={handleCloseProfile}   rowId={rowId}/>
            <DeleteModal show={showDelete} onHide={handleDeleteClose}  id={DeleteId} handeldata={getTable} />
        </div>

    </>
}

export  default Index ;
