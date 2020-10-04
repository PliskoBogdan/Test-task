const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req, res) => { 
    console.log(req.body);
    const { name, login, password, passwordConfirm } = req.body;
    console.log(name.length);
    db.query('SELECT login FROM users WHERE login = ?', [login], async (error, results) =>{
        if(error) {
            console.log(error);
        }

        if(results.length > 0){
            return res.render('register', {
                message: 'That login is already in use'
            })
        }else if(password !== passwordConfirm){
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO users SET ?', {name: name, login: login, password: hashedPassword }, (error, results) => {
            if(error){
                console.log(error);
            }else{
                db.query('SELECT * FROM users WHERE login = ?', [login], async (error, results) =>{
                    console.log(results[0].id);
                    const id = results[0].id;
                    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }
                    res.cookie('access_token', token, cookieOptions);
                })

                return res.render('register', {
                    message: 'User register'
                });
            }
        });

        

    });
}

exports.login = async (req, res) => {
   
    try{
        const { login, password } = req.body;
        
        if(!login || !password){
            return res.status(400).render('login', {
                message: 'Please enter login or password'
            });
        }
        db.query('SELECT * FROM users WHERE login = ?', [login], async (error, results) => {
            console.log(results);
            if(!results || !(await bcrypt.compare(password, results[0].password) ) ) {
                res.status(401).render('login', {
                    message: 'login or password incorrect'
                });
            }else{
                const id = results[0].id;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log(token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                
                res.cookie('access_token', token, cookieOptions);
                res.status(200).redirect('/');
            }
        });
    }
    catch(error){
        console.log(error);
    };
};