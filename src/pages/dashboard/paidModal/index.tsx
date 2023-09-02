import React, { useState as UseState } from "react";
import { Modal } from "react-bootstrap";
import { connectToDatabase, closeDatabaseConnection } from '../../../database';

import SVG from "react-inlinesvg";
 import  Virifie from '../../../assets/verifier.png'
interface DeleteDemoModalProps {
    show: boolean;
    onHide: () => void;
    id: any;
    idMember: any;
    handeldata: () => void;

}
const index: React.FC<DeleteDemoModalProps> =  (props) => {
    const currentDate = new Date();
    const { show,handeldata , onHide, id,  idMember } = props;

    async function updateSubscriptionPaymentStatus(id:number) {
        try {
            const connection = await connectToDatabase();

            await connection.query(`UPDATE subscriptions SET payment_status = 'paid' WHERE subscription_id = ${id}`);

            handeldata();

        } catch (error) {
            console.error(error);
        }



    }
    async function InsertPayment (id:number) {
        try {
            const connection = await connectToDatabase();

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
             await connection.query(insertQuery,values );

             handeldata();
               await closeDatabaseConnection();

        } catch (error) {
            console.error(error);
        }

    }
    const handlePaid = async () => {
       await updateSubscriptionPaymentStatus(id)
            .then(() => {

                console.log('Subscription payment status updated successfully.');

            })
            .catch((error) => {
                console.error('Error updating subscription payment status:', error);
            });

      await  InsertPayment(idMember);
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
