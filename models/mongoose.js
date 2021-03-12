// MongoDB with Mongoose

const mongoose = require("mongoose");
const connectionString = 'mongodb+srv://bookstore_user:mybhGSgSscz9g2a@cluster0.vscne.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const Schema = mongoose.schema;
// create users Schema to structure user data on the database
const userDataSchema = new Schema({
    // *
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verificationCode: {
        type: String,
        required: true,
        unique: true
    },
    verified: {
        type: Boolean,
        required: true
    }
}); // * shorter:
// const userDataSchema = new mongoose.Schema(...

// create users model to be used to query the users on database
// require the collection name in our database and the schema 
const Users = mongoose.model('users', usersSchema)


// connect function

function connect() {
    return new Promise((resolve, reject) => {
        // check if connection to database is already established
        if(mongoose.connection.readyState === 1) {
            resolve();
        } else {
            // try to establish the connection
            mongoose.connect(connectionString, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            }).then(() => {
                // connection established
                resolve();
            }).catch(error => {
                // connection could not be established with error
                reject(error);
            })
        }
    })
}



// mongoose.connect("mongodb://localhost:27017/bookstore_for_loginverification", {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// });
