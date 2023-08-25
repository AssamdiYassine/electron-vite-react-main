import * as mysql from 'mysql';

const dataConnection: mysql.ConnectionConfig = {

    host: process.env.REACT_APP_HOST,
    user: process.env.REACT_APP_USER,
    password: process.env.REACT_APP_PASSWORD,
    database: process.env.REACT_APP_DATA_BASENAME,
};

let connectionInstance: mysql.Connection | null = null;

// Function to establish a MySQL connection
export function connectToDatabase(): mysql.Connection {
    if (!connectionInstance) {
        connectionInstance = mysql.createConnection(dataConnection);
        connectionInstance.connect((err) => {
            if (err) {
                console.error(err.code, err.fatal, err.stack);
            } else {
                console.log("Connection successfully established");
            }
        });
    }
    return connectionInstance;
}

// Function to close the MySQL connection
export function closeDatabaseConnection() {
    if (connectionInstance) {
        connectionInstance.end((err) => {
            if (err) {
                console.error(err.code, err.fatal, err.stack);
            } else {
                console.log("Connection successfully closed");
            }
        });
        connectionInstance = null;
    }
}
