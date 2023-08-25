import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { yupResolver } from '@hookform/resolvers/yup';
import React, {ChangeEvent, useCallback, useEffect, useRef, useState} from 'react';
import * as locales from 'date-fns/locale';
import fr from 'date-fns/locale/fr';
import { registerLocale, setDefaultLocale } from 'react-datepicker';

import {Controller, useController, useForm} from 'react-hook-form';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Logo from '../../assets/Logo.svg'
import ClearIcon from '@material-ui/icons/Clear';
import { Calendar } from 'react-date-range';

 import 'react-datepicker/dist/react-datepicker.css';

//  Date Picker init
registerLocale('fr', fr);
setDefaultLocale('fr');


interface Member {
    name: string;
    email: string;
    phone: string;
    whatsappPhone: string;
    DateOfBirth: Date;
    gender: string;
    CategoryName: string;
    categorie?:string;
    MembershipStartDate: Date;
    ProfilePicture?: Blob;
}

interface  types {
    show: any;
    handleClose: () => void;
    getTable: () => void;
    onSubmit?: (data: Member) => void;
    initialData?: Member;
    is?:string;
    conn?: any;
    category? : any[];
    rowId?:number;
}
const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    whatsappPhone: Yup.string().required('WhatsApp Phone is required'),
    DateOfBirth: Yup.date().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required'),
    categorie: Yup.string().required('Category is required'),
     MembershipStartDate: Yup.date().required('Membership Start Date is required'),
    ProfilePicture: Yup.string().required('Profile Picture is required'),
    // You might need to adjust the validation for ProfilePicture if needed
});


const  AddMember: React.FC<types> = (props)=> {
const {show , handleClose ,getTable  ,is,conn ,category,  rowId } = props
    const [step, setStep] = useState(0);
    const [momberData, setMomberData] = useState<any>([]);
    const [QRCodeG, setQRCodeG] = useState('');
    const [dateDateOfBirth, setDateDateOfBirth] = useState<Date | undefined>(undefined);
    const [dateMembershipStartDate, setDateMembershipStartDate] = useState<Date | undefined>(undefined);


    let [BrandcompanyThumbnail, setBrandcompanyThumbnail] = useState<any>(null);

    const { register,  handleSubmit,control, formState: { errors },reset,setValue,getValues } = useForm<Member>({
        resolver: yupResolver(schema),
    });


    useEffect(()=>{
        getTable()
    },[])



    useEffect(()=>{
        setValue("ProfilePicture" ,BrandcompanyThumbnail  );

    },[BrandcompanyThumbnail])
    // @ts-ignore




    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let file = e.target.files?.[0];
        const MAX_WIDTH = 300; // Define the maximum width for the resized image
        try {
            if (file) {
                if (file.size > 5242880) {
                    console.log('ovver size image ')
                    // NotificationManager.warning(
                    //     "",
                    //     "La taille du fichier ne doit pas dépasser 5MB",
                    //     10000
                    // );
                } else {

                    let reader = new FileReader();
                    reader.onloadend = () => {
                        const image = new Image();
                        image.src = reader.result as string;

                        image.onload = () => {
                            const canvas = document.createElement('canvas');
                            let width = image.width;
                            let height = image.height;

                            if (width > MAX_WIDTH) {
                                height = (height * MAX_WIDTH) / width;
                                width = MAX_WIDTH;
                            }

                            canvas.width = width;
                            canvas.height = height;

                            const ctx = canvas.getContext('2d');
                            ctx?.drawImage(image, 0, 0, width, height);

                            const resizedDataUrl = canvas.toDataURL('image/jpeg'); // Use 'image/png' for PNG format

                            // Now you can set the resized image as the thumbnail
                            setBrandcompanyThumbnail(resizedDataUrl);
                        };
                    };

                    reader.readAsDataURL(file);


                    // let reader = new FileReader();
                    // reader.onloadend = () => {
                    //     // @ts-ignore
                    //
                    //     setBrandcompanyThumbnail(reader.result as string );
                    //     // setBrandcompanyThumbnail(reader.result as string);
                    //
                    //     // @ts-ignore
                    //
                    // };
                    // reader.readAsDataURL(file);

                }
            }
        } catch (error) {
            console.log(error);
        }
    };



    const handleClear = () => {
        reset(); // Clear the form fields
    };
    const onSubmit = async (data:any) => {
        setMomberData(data);
        // MembershipStartDate
        let year = data.MembershipStartDate.getFullYear();
        let month = String(data.MembershipStartDate.getMonth() + 1).padStart(2, '0');
        let day = String(data.MembershipStartDate.getDate()).padStart(2, '0');

        //   29 30 31 /7   ===>  1 /8

        if (day === '29' || '30' || '31' ){
            day = '01';
            month = String(data.MembershipStartDate.getMonth() + 2).padStart(2, '0');
            if (month > '12') {
                month = '01';
                year++;
            }
        }
        const MembershipStartDate = `${year}-${month}-${day}`;
        console.log("MembershipStartDate",MembershipStartDate)
         // MembershipStartDateNext

        let years = year;
        const currentMonth =month;
        const nextMonthDate = new Date(year, currentMonth + 1, 1); // Set day to 1 to ensure next month
        let nextMonth = nextMonthDate.getMonth() + 1;
        if (nextMonth > 12) {
            nextMonth = 1;
            years++;
        }

        const formattedNextMonth = String(nextMonth).padStart(2, '0');
        const days = String(day).padStart(2, '0');
        const MembershipStartDateNext = `${years}-${formattedNextMonth}-${days}`;




        // DateOfBirth
        const yearDateOfBirth = data.DateOfBirth.getFullYear();
        const monthDateOfBirth = String(data.DateOfBirth.getMonth() + 1).padStart(2, '0');
        const dayDateOfBirth = String(data.DateOfBirth.getDate()).padStart(2, '0');
        const DateOfBirth = `${yearDateOfBirth}-${monthDateOfBirth}-${dayDateOfBirth}`;

        const randomNum = Math.floor(Math.random() * 10000);

        const QRCodeGeni =  `${randomNum}${yearDateOfBirth}${monthDateOfBirth}${dayDateOfBirth}`;
        setQRCodeG(QRCodeGeni);
        const values = [
            data.name,
            data.email,
            data.phone,
            data.whatsappPhone,
            DateOfBirth,
            data.gender,
            data.categorie,
            MembershipStartDate,
            data.ProfilePicture,
            0,
            QRCodeGeni

        ];

        const insertQuery = `
      INSERT INTO Members (Name, Email, Phone, whatsappPhone,  DateOfBirth,Gender , Category_id, MembershipStartDate,  ProfilePicture, isDeleted,QRcode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);
    `;


        await  conn.query(insertQuery, values, (err: any| null, results?: any) => {
                if (err) {
                    console.error('Error inserting data:', err);
                } else {
                    console.log('Data inserted successfully:', results);
                }
                // conn.end(); // Don't forget to close the connection
            });

         const insertSubscriptionsQuery = `INSERT INTO subscriptions (MemberID, start_date, end_date, type, status, payment_status)
                       VALUES (?, ?, ?, ?, ?, ?)`;


        await  conn.query('SELECT Max(MemberID) AS MaxMemberID  FROM Members;', values, (err: any| null, results?: any) => {
            if (err) {
                console.error('Error inserting data:', err);
            } else {

                const maxMemberID = results[0].MaxMemberID;

                     conn.query(
                    insertSubscriptionsQuery,
                    [maxMemberID, MembershipStartDate, MembershipStartDateNext, 'monthly', 'active', 'paid'],
                    (err : any, results :any) => {
                        if (err) {
                            console.log(err.code);
                        } else {
                            console.log(results);
                        }
                    }
                );
            }
         });

        getTable();
        handleClear();
        handleClose();
        setStep(1);
    console.log('Inserted')
 };


    return<>
    <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        size={'lg'}

    >
        <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
         <div className="d-flex align-items-center justify-content-end px-6  ">
                <h5 className="flex-grow-1 text-start   fw-bold">
                    Add Member informations
                </h5>
            </div>

        </Modal.Header>
        <Modal.Body className={  'bg-white  z-2 '  }>

            {step === 0  ?<>


            <label
                htmlFor="identity_file"
                className="col-12 dropzone-msg dz-message needsclick d-flex align-items-center justify-content-center  "
            >
                {BrandcompanyThumbnail ? (
                    <div className="  dropzone-secondary dropzone-clickable   rounded">
                        <div className="col-12 position-relative">
                            <div
                                className="   btn p-0  h-250px  w-350px"
                                style={{
                                    background: "rgba(255, 255, 255, 0.2)",
                                    borderRadius: "16px",
                                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                                    backdropFilter: "blur(5px)",
                                }}
                            >
                                <div className=" row d-flex flex-column  justify-content-center align-items-center p-1">
                                    <div>
                          <span
                              style={{
                                  display: BrandcompanyThumbnail ? "flex" : "none",
                                  top: -10,
                                  right: -10,
                                  zIndex: 1000,
                              }}
                              className="position-absolute btn btn-xs btn-icon btn-circle btn-danger p-1 btn-hover-text-primary btn-shadow"
                              onClick={() => {
                                  setBrandcompanyThumbnail(undefined);

                              }}
                          >
                            <ClearIcon />
                          </span>
                                        <img
                                            src={BrandcompanyThumbnail}
                                            width={'200px'}
                                            className={'rounded'}
                                        />
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                ) : (
                    <>
                        <Form.Group controlId="ProfilePicture" >
                        <div className="dropzone dropzone-default dropzone-secondary dropzone-clickable p-15">
                            <input
                                type="file"
                                className="d-none"
                                accept=".png, .jpg, .jpeg, "
                                id="identity_file"
                                onChange={(e)=>handleFile(e)}
                            />
                            <h5 className="">
                                Upload picture
                            </h5>
                            <span className="fs-6">
                      Taille de fichier maximale : 5 Mo
                    </span>
                        </div>
                         <div className={'d-flex justify-content-center pt-3'}>
                                <p className="text-danger">{errors.ProfilePicture?.message}</p>
                        </div>
                        </Form.Group>
                    </>
                )}
            </label>
            <div

                className="col-12  px-5    align-items-center justify-content-center  "
            >
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" {...register('name')}  />
                    <p className="text-danger">{errors.name?.message}</p>
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" {...register('email')} />
                    <p className="text-danger">{errors.email?.message}</p>
                </Form.Group>

                <Form.Group controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" {...register('phone')} />
                    <p className="text-danger">{errors.phone?.message}</p>
                </Form.Group>

                <Form.Group controlId="whatsappPhone">
                    <Form.Label>WhatsApp Phone</Form.Label>
                    <Form.Control type="text" {...register('whatsappPhone')} />
                    <p className="text-danger">{errors.whatsappPhone?.message}</p>
                </Form.Group>

                <Row>
                    <Col>
                        <div className=" ">
                            <label htmlFor="birthdate" className="inline-block">
                                Date Of Birth *
                            </label>

                            <div className=" flex  flex-col">
                                <Controller
                                    control={control}
                                    name={'DateOfBirth'}
                                    render={({ field: { onChange, value, ref } }) => {

                                        return (



                                                        <Calendar
                                                            ref={ref}

                                                            locale={locales.fr}
                                                            date={dateDateOfBirth}
                                                            onChange={(newDate: Date) => {
                                                                setDateDateOfBirth(newDate);

                                                                onChange(
                                                                    `${newDate.getFullYear()}-${`0${
                                                                        newDate.getMonth() + 1
                                                                    }`.slice(-2)}-${`0${newDate.getDate()}`.slice(
                                                                        -2
                                                                    )}`
                                                                );

                                                            }}
                                                            color={'primary'}
                                                            maxDate={new Date()}
                                                        />


                                        );
                                    }}
                                />
                                <p className="text-danger">{errors.DateOfBirth?.message}</p>

                             </div>
                        </div>
                    </Col>
                    <Col>
                        <div className="">
                            <label htmlFor="MembershipStartDate" className="mb-[10px] inline-block">
                                Member ship Start Date *
                            </label>

                            <div className=" flex  flex-col">
                                <Controller
                                    control={control}
                                    name={'MembershipStartDate'}
                                    render={({ field: { onChange, value, ref } }) => {

                                        return (

                                            <div className="  ">

                                                <Calendar
                                                    ref={ref}

                                                    locale={locales.fr}
                                                    date={dateMembershipStartDate}
                                                    onChange={(newDate: Date) => {
                                                        setDateMembershipStartDate(newDate);

                                                        onChange(
                                                            `${newDate.getFullYear()}-${`0${
                                                                newDate.getMonth() + 1
                                                            }`.slice(-2)}-${`0${newDate.getDate()}`.slice(
                                                                -2
                                                            )}`
                                                        );

                                                    }}
                                                    color={'primary'}
                                                    maxDate={new Date()}
                                                />
                                            </div>

                                        );
                                    }}
                                />
                                <p className="text-danger">{errors.DateOfBirth?.message}</p>

                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                <Form.Group controlId="categorie">
                    <Form.Label>Category</Form.Label>

                    <Form.Control as="select" {...register('categorie')}>
                        <option value="">Select Gender</option>
                        {category?.map((el)=> <option value={el.Category_id } key={el.Category_id}>{el.name}</option>)}


                    </Form.Control>

                    <p className="text-danger">{errors.categorie?.message}</p>
                </Form.Group>
                </Col>
                    <Col>
                        <Form.Group controlId="gender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Control as="select" {...register('gender')}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>

                            </Form.Control>
                            <p className="text-danger">{errors.gender?.message}</p>
                        </Form.Group>



                {/*    <Form.Group controlId="MembershipStartDate">*/}
                {/*    <Form.Label>Membership Start Date</Form.Label>*/}
                {/*    <Controller*/}
                {/*        name="MembershipStartDate"*/}
                {/*        control={control}*/}
                {/*        render={({ field }) => (*/}
                {/*            <DatePicker*/}
                {/*                {...field}*/}

                {/*                onChange={(date) => field.onChange(date)}*/}
                {/*                value={'01/02/2023'}*/}

                {/*            />*/}
                {/*        )}*/}
                {/*    />*/}
                {/*     <Form.Group  >*/}
                {/*    </Form.Group>*/}
                {/*    <p className="text-danger">{errors.MembershipStartDate?.message}</p>*/}
        </Col>
                </Row>
            </div>
            </>  : null }
            {step === 1  ?<>

            </> : null }
        </Modal.Body>
        <Modal.Footer>


            <Button variant="secondary" onClick={()=>{ handleClose(); handleClear(); setStep(0);}}  >
                Close
            </Button>
            <Button variant="dark" type="submit" >Add Member  </Button>


        </Modal.Footer>

        </Form>
    </Modal>

    </>

}


export  default   AddMember;


