import React, { useState as UseState } from "react";
import { Modal } from "react-bootstrap";

import SVG from "react-inlinesvg";
 import  Virifie from '../../assets/verifier.png'
interface DeleteDemoModalProps {
    show: boolean;
    onHide: () => void;
    id: any;
    idMember: any;
    handeldata: () => void;
    conn?:any;
}
const index: React.FC<DeleteDemoModalProps> =  (props) => {
    const currentDate = new Date();
    const { show,handeldata , onHide, id, conn , idMember } = props;
    console.log("idMember",idMember)
    console.log("id",id)
    async function updateSubscriptionPaymentStatus(id:number) {

        const connection = await conn;

        try {
            const updateQuery = 'UPDATE subscriptions SET payment_status = ? WHERE subscription_id = ?';
            await connection.query(updateQuery, ['paid', id]);
        } catch (error) {
            console.log(error);
        }
    }
    async function InsertPayment (id:number) {

        const connection = await conn;


        const yearPaymentDate = currentDate.getFullYear();
        const monthPaymentDate = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dayPaymentDate = String(currentDate.getDate()).padStart(2, '0');
        const PaymentDate = `${yearPaymentDate}-${monthPaymentDate}-${dayPaymentDate}`;

        const values = [
            idMember,
            PaymentDate,
            100
        ];

        const insertQuery = `
      INSERT INTO Paiment (MemberID,PaymentDate,Price)
      VALUES (?, ?, ?);
    `;
        await  connection.query(insertQuery, values, (err: any| null, results?: any) => {
            if (err) {
                console.error('Error inserting data:', err);
            } else {
                console.log('Data inserted successfully:', results);
            }

        });
    }
    const handlePaid = async () => {
        updateSubscriptionPaymentStatus(id)
            .then(() => {
                console.log('Subscription payment status updated successfully.');
            })
            .catch((error) => {
                console.error('Error updating subscription payment status:', error);
            });
        InsertPayment(idMember);
        onHide();
        handeldata();
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
                    Paid member
                </Modal.Title>
                <div className="btn btn-success text-white" onClick={() => onHide()}>
                    x
                </div>
            </Modal.Header>
            <Modal.Body>
        <span className="d-flex justify-content-center  ">
          <img
              style={{width:'100px'}}
              src={Virifie}
          />
        </span>
                <h3 className="d-flex justify-content-center pt-5">
                    Are you sure you want to make it paid ?
                </h3>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
                <button
                    onClick={() => handlePaid()}
                    type="button"
                    className="btn btn-success px-5  "
                >
                   Paid
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
