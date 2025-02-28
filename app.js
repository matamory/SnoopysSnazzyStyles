// App.js
/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 6595;                 // Set a port number at the top so it's easy to change in the future


const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


// Database
var db = require('./db-connector')

/*
    ROUTES
*/
// Defining base routes as html pages
app.get('/',  async function(req, res)
    {   
        res.render("index.html");        
    });                                                       

app.get('/dogs',  async function(req, res)
    {   
        res.render("dogs.html");        
    });                                                       

app.get('/employees',  async function(req, res)
    {   
        res.render("employees.html");        
    });                                                       

app.get('/clients',  async function(req, res)
    {   
        res.render("clients.html");        
    });                                                       

app.get('/services',  async function(req, res)
    {   
        res.render("services.html");        
    });                                                       

app.get('/sessions',  async function(req, res)
    {   
        res.render("sessions.html");        
    });                                                       

app.get('/schedules',  async function(req, res)
    {   
        res.render("schedules.html");        
    });                                                       

app.get('/clientsDogs',  async function(req, res)
    {   
        res.render("clientsDogs.html");        
    });                                                       

app.get('/dogsSel', function(req, res)
    {  
        let query1 = "SELECT * FROM Dogs;";                     // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    });                                                        


app.post('/add-dog-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let breed = (data.breed);
    if (breed == "null"){
        breed = null;
    }
    else {
        breed =`'${breed}'`;
    }

    let groomer_notes = (data.groomer_notes);
    if (groomer_notes == "null"){
        groomer_notes = null;
    }
    else {
        groomer_notes =`'${groomer_notes}'`;
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Dogs (name, age, breed, size_lbs, groomer_notes) VALUES ('${data.name}', '${data.age}', ${breed}, '${data.size_lbs}', ${groomer_notes})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Dogs;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-dog-ajax', function(req,res, next){
    let data = req.body;
    let dog_ID = parseInt(data.id);
    let deleteDog= `DELETE FROM Dogs WHERE dogID = ?`;
  

        db.pool.query(deleteDog, [dog_ID], function(error, rows, fields) {
  
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                    res.sendStatus(204);
            }
        })
    }
);

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});