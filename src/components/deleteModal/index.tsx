import React, { useState as UseState } from "react";
import { Modal } from "react-bootstrap";
import { connectToDatabase, closeDatabaseConnection } from '../../../../../Documents/electron-vite-react-main/src/database';

import SVG from "react-inlinesvg";
 import  worninf from '../../../public/verifier.png'
interface DeleteDemoModalProps {
    show: boolean;
    onHide: () => void;
    id?: any;
    handeldata: () => void;
    conn?:any;
}

const index: React.FC<DeleteDemoModalProps> = (props) => {
    const { show,handeldata , onHide, id } = props;
 // You might need to specify the type for useParams()

    const handleDelete = async () => {
        try {
            const connection = await connectToDatabase();

            await connection.query(`Update Members set isdeleted = 1 where MemberID =${id}  `);

            onHide();
            handeldata();

        } catch (error) {
            console.error(error);
        }


    };

    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete member
                </Modal.Title>
                <div className="btn btn-dark text-white" onClick={() => onHide()}>
                    x
                </div>
            </Modal.Header>
            <Modal.Body>
        <span className="d-flex justify-content-center  ">
          <SVG
              style={{width:'100px'}}
              src={worninf}
              fill="#ffa800"
          />
        </span>
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
                   Delete Momber
                </button>
                <button
                    onClick={() => onHide()}
                    type="button"
                    className="btn btn-light text-dark"
                >
                    Cancel
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default index;
