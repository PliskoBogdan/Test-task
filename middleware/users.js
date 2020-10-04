const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

module.exports = (req, res) => {
    
   db.query('SELECT name, login FROM users', async (error, results) => {
    
    if(error){
       
        console.log(error);
    }else{
        let name = [];
        let login = [];
        
        results.forEach(element => {              
               name.push([element.name])
            })

        results.forEach(element => {             
            login.push([element.login])
        })

            res.render('index', {
                name,
                login
                
            })     
    }
      
   });
  
}