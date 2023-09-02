import mysql from 'mysql2/promise';

const dataConnection: mysql.ConnectionOptions = {
    host: "127.0.0.1",
    user: "yassine",
    password: "pluS@2023",
    database: "MALAKIDB",
};

let connectionInstance: mysql.Connection | null = null;

// Function to establish a MySQL connection
export async function connectToDatabase(): Promise<mysql.Connection> {
    if (!connectionInstance) {
        connectionInstance = await mysql.createConnection(dataConnection);

        try {
            await connectionInstance.connect();
            console.log("Connection successfully established");
        } catch (err) {
            console.error(err);
        }
    }
    return connectionInstance;
}
// Function to close the MySQL connection
export async function closeDatabaseConnection() {
    if (connectionInstance) {
        try {
            await connectionInstance.end();
            console.log("Connection successfully closed");
        } catch (err) {
            console.error(err);
        }
        connectionInstance = null;
    }
}
