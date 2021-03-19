# login with verification

http://localhost:3000/login

- checkt, ob Eingaben korrekt sind (Name, Email, Password)
- localhost 3000

Modules:
    npm init -y
    npm i express ejs mongoose

index.html -> index.ejs -> and change all public link path's to "/

--

MongoDB:
db name: bookstore_for_loginverification
collection: users

clickpath 1: in Mongo Atlas: Clusters/Collection -> Create Database -> bookstore_for_loginverification
https://cloud.mongodb.com/v2/6038d12eb8fbe9386c927406#metrics/replicaSet/6038d1d9c311d954a6c909b3/explorer/blog_with_osman/comments/find)

create db user (for security reason)  	

    readWrite@bookstore_for_loginverification

clickpath 2: database access -> add new database user -> password (is choosed) -> add user name "bookstore_user" and a password -> Grant specific privileges (for temporary user and read write)
set to "readWrite" and the name of database
optional: temporary user

to connect:
clusters / connect / connect your application
copy the link to your code:

    mongodb+srv://<username>:<password>@cluster0.vscne.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

    (goes to /models/mongoose.js)

--

write mongoose.js

--

modificate main.css:
delete 2nd form of signup-form's  // we do not need them
delete the "form" of login.ejs line 169 and 174

add id's to input's 

    <!-- <form action="#"> -->
        <input id="regName" type="text" placeholder="Name"/>
        <input id="regEmail" type="email" placeholder="Email Address"/>
        <input id="regPassword" type="password" placeholder="Password"/>
        <button id="regBtn" type="submit" class="btn btn-default">Signup</button>
    <!-- </form> -->

--

modify login.js:
add
// get html dom elements

    <script>
        const regBtn = document.getElementById('regBtn');
        const regName = document.getElementById('regName');
        const regEmail = document.getElementById('regEmail');
        const regPassword = document.getElementById('regPassword');

        // add click event listener 
            regBtn.addEventListener('click', () => {
                // send user data to server side using fetch

                const sendData = {
                    name: regName.value,
                    email: regEmail.value,
                    password: regPassword.value
                }
            })
        </script>

break (somthing missing)

copy parley files to new parsley folder

add to login.ejs
    <link rel="stylesheet" href="/parsley/parsley.css">

add 
    required data-parsley-length="[5, 25]" to input fields

add language

    // de -> german language
    <script src="/parsley/i18n/de.js"></script> 


add to line 184

     <div id="signupDiv" class="signup-form" data-parsley-validate>


change the (regBtn.addEventListener...) part to:

    regBtn.addEventListener('click', () => {
        // send user data to server side using fetch
        let valid = $('#signupDiv').parsley().validate({force: true});

        const sendData = {
            name: regName.value,
            email: regEmail.value,
            password: regPassword.value
        }
    })

test it:
-> login page and click on signup should show you "This value is required."

problems solving:

parsley folder needs to be in public, and the i18n folder too
remove the css stylesheet from login.ejs
    <!-- <link rel="stylesheet" href="/parsley/parsley.css"> -->


end of login.ejs should look like this: 

                <script src="/parsley/parsley.js"></script>

                    <!-- german language -->
                    <!-- <script src="/parsley/i18n/de.js"></script>  -->
                    <!-- english language -->
                    <script src="/parsley/i18n/en.js"></script> 

                    <script> // after break stuff
                        // get html dom elements
                        const regBtn = document.getElementById('regBtn');
                        const regName = document.getElementById('regName');
                        const regEmail = document.getElementById('regEmail');
                        const regPassword = document.getElementById('regPassword');

                        // add click event listener 
                        regBtn.addEventListener('click', () => {
                            // send user data to server side using fetch
                            let valid = $('#signupDiv').parsley().validate({force: true});

                            const sendData = {
                                name: regName.value,
                                email: regEmail.value,
                                password: regPassword.value
                            }
                        })
                    </script>
                </body>

                </html>


19.3.21
https://www.npmjs.com/package/bcrypt

what is "salt"

npm i brcypt


in mongoose.js require bcrypt and add function addUser:

    const bcrypt = require("bcrypt")

    // bcrypt / hash
    function addUser(name, email, password) {
        connect().then(() => {
            // return promise
            return new Promise((resolve, reject) => {
                bcrypt.hash(password, 'FBW8', (err, hashedPassword) => {
                    if (!err) {
                        // save to data base
                    } else {
                        reject(err)
                    }
                })
            })
        })
    }

npm i generate-sms-verification-code

const emailToken = require("generate-sms-verification-code");

    function addUser(name, email, password) {
        connect().then(() => {
            // return promise (advantage of promises instead of try and catch: you can see where exactly an err occurs)
            return new Promise((resolve, reject) => {
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    if (!err) {
                        // save to data base
                        const verificationCode = emailToken(16, {type: 'number'});
                        const newUser = new User({
                            name, 
                            email, 
                            password: hashedPassword,
                            verificationCode,
                            verified: false
                        });
                        newUser.save().then(() => {
                            resolve();
                        }).catch(error => {
                            reject(error)
                        })
                    } else {
                        reject(err)
                    }
                })
            }).catch(error => {
                reject(error);
            })
        })
    }




before

    // create a route to get register data
    app.post('/signup', (req, res) => {
        // serverside too
        console.log(req.body);
        res.json(1);
    });

change it to

        // create a route to get register data
    app.post('/signup', (req, res) => {
        // serverside too
        console.log(req.body);

        const { name, email, password } = req.body;
        db.addUser(name, email, password).then(() => {
            res.json(1);
        }).catch(error => {
            console.log(error);
            res.json(2);
        })
    })


to avoid error "code: 11000" -> reject(3)
in db.js

        newUser.save().then(() => {
            resolve();
        }).catch(error => {
            if(error.code === 11000) {
                reject(3) // user already exist
            } else {
                reject(error)
            }
        })


and in app.js

    // responses map
    // 1. registration is down
    // 2. unknown error
    // 3. user email already exist 

    // create a route to get register data
    app.post('/signup', (req, res) => {
        // serverside too
        console.log(req.body);

        const { name, email, password } = req.body;
        db.addUser(name, email, password).then(() => {
            res.json(1);  // all is good
        }).catch(error => {
            console.log(error);
            if(error === 3) {
                res.json(3);  
            } else {
                res.json(2);
            }
        })
    })


    in login.ejs change this

                fetch('/signup', {
                method: 'POST',
                headers: {
                    'content-type' : 'application/json'
                },
                body: JSON.stringify(sendData)
            }).then(response => {
                if(response.status === 200) {
                    response.json().then(data => {
                        if(data === 1) {
                            console.log("success");
                        } else
                        console.log('failed');
                    })
                }
            }


 to use switch

        if (response.status === 200) {
            response.json().then(data => {                           
                //     if(data === 1) {
                //         console.log("success");
                //     } else
                //     console.log('failed');
                switch (data) {
                    case 1:
                        console.log("success");
                        break;
                    case 2:
                        console.log("unknown error");
                        break;
                    case 3:
                        console.log("email already exist");
                        break;

                    default:
                        break;
                }
            })
        }


for example devtools now shows: 

    success
or

    email already exist

if we try to signup a new user with same email
(on login page: http://localhost:3000/login)