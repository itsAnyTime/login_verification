// MongoDB with Mongoose
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const emailToken = require("generate-sms-verification-code");
const connectionString = 'mongodb+srv://bookstore_user:mybhGSgSscz9g2a@cluster0.vscne.mongodb.net/bookstore_for_loginverification?retryWrites=true&w=majority'

const Schema = mongoose.Schema;

// create users Schema to structure user data on the database
const usersSchema = new Schema({
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
const Users = mongoose.model('users', usersSchema);


// connect function

// goes to else
// mongoose.connect("mongodb://localhost:27017/bookstore_for_loginverification", {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// });

function connect() {
    return new Promise((resolve, reject) => {
        // check if connection to database is already established
        if (mongoose.connection.readyState === 1) {
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

// bcrypt / hash
function addUser(name, email, password) {
    // return promise (advantage of promises instead of try and catch: you can see where exactly an err occurs)
    return new Promise((resolve, reject) => {
        connect().then(() => {
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                // default is 10, bigger = slower
                if (!err) {
                    // save to data base
                    const verificationCode = emailToken(16, { type: 'number' });
                    const newUser = new Users({
                        name,
                        email,
                        password: hashedPassword,
                        verificationCode,
                        verified: false
                    });
                    newUser.save().then(() => {
                        resolve();
                    }).catch(error => {
                        if (error.code === 11000) {
                            reject(3) // user already exist
                        } else {
                            reject(error)
                        }
                    })
                } else {
                    reject(err)
                }
            })
        }).catch(error => {
            reject(error); // database connection error
        })
    })
}

module.exports = {
    addUser
}