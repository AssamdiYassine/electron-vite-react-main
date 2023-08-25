import { Document, Page, Text, View ,Image, PDFViewer , PDFDownloadLink } from '@react-pdf/renderer';
import QRCode from 'qrcode.react';
import React, {ChangeEvent, useCallback, useEffect, useRef, useState} from 'react';
import Logo from "@/assets/Logo.svg";
import Modal from "react-bootstrap/Modal";
interface  types {
    momberData: any;
    QRCodeG: any;
    show?:Boolean;
    handleClose?: ()=> void;
}

const  PDF : React.FC<types> = ({show, momberData , QRCodeG , handleClose })=>{

    return <>
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            size={'lg'}

        >

                <Modal.Header closeButton>
                    <div className="d-flex align-items-center justify-content-end px-6  ">
                        <h5 className="flex-grow-1 text-start   fw-bold">
                            Add Member informations
                        </h5>
                    </div>

                </Modal.Header>

        <PDFViewer width="1000" height="600">
            <Document>
                <Page>
                    <View>
                        <Image
                            src={Logo}
                            style={{ width: 100, height: 100 }}
                        />
                        <Text>{momberData.name}</Text>
                        <Text>{momberData.email}</Text>
                        <Text>{momberData.phone}</Text>
                        <Text>{momberData.DateOfBirth}</Text>
                        <Text>{momberData.gender}</Text>
                        <Text>{momberData.CategoryName}</Text>
                        <QRCode value={QRCodeG} size={100} />
                    </View>
                </Page>
            </Document>
        </PDFViewer>

        </Modal>

    </>
}

export  default  PDF ;
