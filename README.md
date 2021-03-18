# login with verification

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