// App.js

/*========================================================================================
    SETUP
==========================================================================================*/

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

/*========================================================================================
    ROUTES
==========================================================================================*/

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



//===============================================================================================


app.get('/clientsSel', function(req, res)
    {  
        let query1 = "SELECT * FROM Clients;";                     // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    });

app.get('/dogsSel', function(req, res)
    {  
        let query1 = "SELECT * FROM Dogs;";                     // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    });   

app.get('/clientsDogsSel', function(req, res)
    {  
        let query1 = "SELECT ClientsDogs.clientsDogsID, Clients.clientID, Dogs.dogID, Clients.name AS clientName, Dogs.name as dogName FROM ClientsDogs JOIN Clients ON ClientsDogs.client_id = Clients.clientID JOIN Dogs ON ClientsDogs.dog_id = Dogs.dogID;";                     // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    });   

app.get('/sessionsSel', function(req, res)
    {  
        let query1 = "SELECT Sessions.sessionID, Employees.employeeID, Clients.clientID, Dogs.dogID, Employees.name as employeeName, Clients.name AS clientName, Dogs.name as dogName, Sessions.session_time, TIME_TO_SEC(Sessions.actual_duration) as actual_duration, Sessions.total_price, Sessions.status FROM Sessions JOIN Employees ON Sessions.employee_id = Employees.employeeID JOIN Clients ON Sessions.client_id = Clients.clientID JOIN Dogs ON Sessions.dog_id = Dogs.dogID;";                     // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    });    

app.get('/servicesSel', function(req, res)
    {  
        let query1 = "SELECT serviceID, service_name, TIME_TO_SEC(service_duration) as service_duration, price FROM Services;";                     // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    });   

app.get('/sessionServicesSel', function(req, res)
    {  
        let query1 = "SELECT SessionServices.session_id, Services.service_name FROM SessionServices JOIN Services ON Services.serviceID = SessionServices.service_id ORDER BY session_id;";                     // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    });   

app.get('/employeesSel', function(req, res)
    {  
        let query1 = "SELECT * FROM Employees;";                     // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    });       
    
app.get('/schedulesSel', function(req, res)
    {  
        let query1 = "SELECT Schedules.scheduleID, Employees.employeeID, Employees.name, Schedules.start, Schedules.end FROM Schedules\
            JOIN Employees ON Schedules.employee_id = Employees.employeeID\
            ORDER BY Schedules.start;";                     // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            console.log(rows);
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    }); 


//===============================================================================================


app.get('/employeesDropdown', function(req, res)
    {  
        let query1 = "SELECT employeeID, name FROM Employees;";                     // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    });       

app.get('/clientsDropdown', function(req, res)
    {  
        let query1 = "SELECT clientID, name FROM Clients;";                     // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    });    

app.get('/dogsDropdown', function(req, res)
    {  
        let query1 = "SELECT dogID, name FROM Dogs;";                     // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    });    

app.get('/serviceDropdown', function(req, res)
    {  
        let query1 = "SELECT serviceID, service_name FROM Services;";                     // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    });                                                        
                                             

app.get('/sessionDropdown', function(req, res)
    {  
        let query1 = "SELECT sessionID FROM Sessions;";                     // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    });                                                        
                                             

app.get('/schedulesAvailability/:startDate?/:endDate?', function(req, res)
    {  // Capture the incoming data
        let startDate = req.params.startDate;
        let endDate = req.params.endDate;
        let dateFilter = '';
        // Adjusting the query statement
        if (startDate !== undefined) {
            dateFilter = `WHERE DATE(Schedules.start) >= date '` + startDate + "'";
            if (endDate !== undefined) {
                dateFilter += ` AND DATE(Schedules.end) <= date '` + endDate + "'";
            };
        };
        let query1 = `SELECT Schedules.scheduleID, Employees.name, DATE(Schedules.start) AS date, TIME(Schedules.start) AS start, TIME(MIN(Session1.session_start)) AS session_start, MIN(Session1.session_end) AS session_end, \
                TIME(MIN(Session2.session_start)) AS session_start1, MIN(Session2.session_end) AS session_end1, TIME(MIN(Session3.session_start)) AS session_start2, MIN(Session3.session_end) AS session_end2, \
                TIME(MIN(Session4.session_start)) AS session_start3, MIN(Session4.session_end) AS session_end3, TIME(MIN(Session5.session_start)) AS session_start4, MIN(Session5.session_end) AS session_end4, \
                TIME(MIN(Session6.session_start)) AS session_start5, MIN(Session6.session_end) AS session_end5, TIME(MIN(Session7.session_start)) AS session_start6, MIN(Session7.session_end) AS session_end6, TIME(Schedules.end) FROM Schedules\
            JOIN Employees ON Schedules.employee_id = Employees.employeeID \
            LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions \
                JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id\
                JOIN Services ON Services.serviceID = SessionServices.service_id \
                GROUP BY Sessions.sessionID) AS Session1 ON Session1.employee_id = Employees.employeeID AND Session1.session_start >= Schedules.start AND Session1.session_start < Schedules.end\
            LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions \
                JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id\
                JOIN Services ON Services.serviceID = SessionServices.service_id \
                GROUP BY Sessions.sessionID) AS Session2 ON Session2.employee_id = Employees.employeeID AND Session2.session_start >= Schedules.start AND Session2.session_start < Schedules.end AND Session1.session_start < Session2.session_start\
            LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions \
                JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id\
                JOIN Services ON Services.serviceID = SessionServices.service_id \
                GROUP BY Sessions.sessionID) AS Session3 ON Session3.employee_id = Employees.employeeID AND Session3.session_start >= Schedules.start AND Session3.session_start < Schedules.end AND Session2.session_start < Session3.session_start\
            LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions \
                JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id\
                JOIN Services ON Services.serviceID = SessionServices.service_id \
                GROUP BY Sessions.sessionID) AS Session4 ON Session4.employee_id = Employees.employeeID AND Session4.session_start >= Schedules.start AND Session4.session_start < Schedules.end AND Session3.session_start < Session4.session_start\
            LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions \
                JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id\
                JOIN Services ON Services.serviceID = SessionServices.service_id \
                GROUP BY Sessions.sessionID) AS Session5 ON Session5.employee_id = Employees.employeeID AND Session5.session_start >= Schedules.start AND Session5.session_start < Schedules.end AND Session4.session_start < Session5.session_start\
            LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions \
                JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id\
                JOIN Services ON Services.serviceID = SessionServices.service_id \
                GROUP BY Sessions.sessionID) AS Session6 ON Session6.employee_id = Employees.employeeID AND Session6.session_start >= Schedules.start AND Session6.session_start < Schedules.end AND Session5.session_start < Session6.session_start\
            LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions \
                JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id\
                JOIN Services ON Services.serviceID = SessionServices.service_id \
                GROUP BY Sessions.sessionID) AS Session7 ON Session7.employee_id = Employees.employeeID AND Session7.session_start >= Schedules.start AND Session7.session_start < Schedules.end AND Session6.session_start < Session7.session_start\
            ${dateFilter}\
            GROUP BY Schedules.scheduleID\
            ORDER BY Schedules.start;`;   

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            res.send(JSON.stringify(rows));                     // Return query as JSON string
        })                                                      
    });    


//===============================================================================================

app.post('/add-client-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Capture NULL values
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Clients (name, phone_number, contact_method, email) VALUES ('${data.name}', '${data.phone}', '${data.contact}', '${data.email}')`;
    db.pool.query(query1, function(error, rows, fields){
    
        // Check to see if there was an error
        if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                res.send(rows);
            }
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
            res.send(rows);
        }
    })
});

app.post('/add-clientsDogs-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Capture NULL values
    
    // Create the query and run it on the database
    query1 = `INSERT INTO ClientsDogs (client_id, dog_id) VALUES ('${data.client}', '${data.dog}')`;
    db.pool.query(query1, function(error, rows, fields){
    
        // Check to see if there was an error
        if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                res.send(rows);
            }
        })
});    

app.post('/add-sessions-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let dur = data.duration;
    if (dur !== 'null'){
        dur = `SEC_TO_TIME(${data.duration})`
    }
    // Capture NULL values
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Sessions (employee_id, client_id, dog_id, session_time, actual_duration, total_price, status) VALUES ('${data.employee}','${data.client}','${data.dog}','${data.time}',${dur},'${data.price}','${data.status}')`;
    db.pool.query(query1, function(error, rows, fields){
    
        // Check to see if there was an error
        if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {   
                query2 = "SELECT MAX(sessionID) FROM Sessions;"
                db.pool.query(query2, function(error, rows, fields){
                    res.send(JSON.stringify(rows));
                })
            }
        })
});    

app.post('/add-sessionsService', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO SessionServices(
                    session_id,
                    service_id
                ) VALUES (
                    ?,
                    ?
                );`;
    db.pool.query(query1, [data.session_id, data.service_id], function(error, rows, fields){
    
        // Check to see if there was an error
        if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                res.send(rows);
            }

    })
});    

app.post('/add-schedule', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values

    // Create the query and run it on the database
    query1 = `INSERT INTO Schedules (employee_id, start, end) VALUES (${data.employeeID}, '${data.startTime}', '${data.endTime}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.send(rows);
        }
    })
});

app.post('/add-employee', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values

    // Create the query and run it on the database
    query1 = `INSERT INTO Employees (name, hourly_wage, years_experience, phone_number, email, address, is_active) VALUES \
        ('${data.name}', '${data.wage}', '${data.experience}', '${data.phone}', '${data.email}', '${data.address}', '${data.active}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.send(rows);
        }
    })
});

app.post('/add-service', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Services(service_name, service_duration, price) VALUES \
        ('${data.service_name}', SEC_TO_TIME(${data.service_duration}), ${data.price});`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.send(rows);
        }
    })
});

//===============================================================================================


app.delete('/delete-dog', function(req,res, next){
    let data = req.body;
    let dog_ID = parseInt(data.id);
    console.log(dog_ID);
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

app.delete('/delete-employee', function(req,res, next){
    let data = req.body;
    let employee_ID = parseInt(data.id);
    console.log(employee_ID);
    let deleteEmployee= `DELETE FROM Employees WHERE employeeID = ?`;

        db.pool.query(deleteEmployee, [employee_ID], function(error, rows, fields) {
  
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                    res.sendStatus(204);
            }
        })
    }
);

app.delete('/delete-schedule', function(req,res, next){
    let data = req.body;
    let schedule_ID = parseInt(data.id);
    console.log(schedule_ID);
    let deleteSchedule= `DELETE FROM Schedules WHERE scheduleID = ?`;

        db.pool.query(deleteSchedule, [schedule_ID], function(error, rows, fields) {
  
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                    res.sendStatus(204);
            }
        })
    }
);

app.delete('/delete-service', function(req,res, next){
    let data = req.body;
    let service_ID = parseInt(data.id);
    let deleteDog= `DELETE FROM Services WHERE serviceID = ?`;
  
        db.pool.query(deleteDog, [service_ID], function(error, rows, fields) {
  
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                    res.sendStatus(204);
            }
        })
    }
);

app.delete('/delete-client-ajax', function(req,res, next){
    let data = req.body;
    let client_ID = parseInt(data.id);
    console.log(client_ID);
    let deleteClient= `DELETE FROM Clients WHERE clientID = ?`;
  

        db.pool.query(deleteClient, [client_ID], function(error, rows, fields) {
  
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                    res.sendStatus(204);
            }
        })
    }
);

app.delete('/delete-clientsDogs-ajax', function(req,res, next){
    let data = req.body;
    let clientDog_ID = parseInt(data.id);
    console.log(clientDog_ID);
    let deleteClientDog= `DELETE FROM ClientsDogs WHERE clientsDogsID = ?`;
  

        db.pool.query(deleteClientDog, [clientDog_ID], function(error, rows, fields) {
  
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                    res.sendStatus(204);
            }
        })
    }
);

app.delete('/delete-sessions-ajax', function(req,res, next){
    let data = req.body;
    let session_ID = parseInt(data.id);
    console.log(session_ID);
    let deleteSession= `DELETE FROM Sessions WHERE sessionID = ?`;
  

        db.pool.query(deleteSession, [session_ID], function(error, rows, fields) {
  
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                    res.sendStatus(204);
            }
        })
    }
);

app.delete('/delete-sessionService', function(req,res, next){
    let data = req.body;
    let session_ID = parseInt(data.session_id);
    let service_name = data.service_name;
    let serviceIdQuery = `SELECT serviceID FROM Services WHERE service_name = ?;`
    let deleteSession= `DELETE FROM SessionServices WHERE session_id = ? AND service_id = ?;`;
  

        db.pool.query(serviceIdQuery, [service_name], function(error, rows, fields) {
            let service_ID = rows[0]['serviceID'];
            console.log(service_ID);
            db.pool.query(deleteSession, [session_ID, service_ID], function(error, rows, fields) {
  
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                        res.sendStatus(204);
                }
            })
        })
    }
);


//===============================================================================================

app.put('/put-employee', function(req,res, next){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `UPDATE Employees SET 
                name = '${data.name}', 
                hourly_wage = '${data.wage}', 
                years_experience = '${data.experience}', 
                phone_number= '${data.phone}',
                email = '${data.email}', 
                address = '${data.address}', 
                is_active = '${data.active}'
            WHERE employeeID = ${data.id};`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.send(rows);
        }
    })
});

app.put('/put-dog-ajax', function(req,res, next){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let breed = (data.breed);
    if (breed == "null"){
        breed = null;
    }

    let groomer_notes = (data.groomer_notes);
    if (groomer_notes == "null"){
        groomer_notes = null;
    }

    // Create the query and run it on the database
    query1 = `UPDATE Dogs SET 
                name = '${data.name}', 
                age = '${data.age}', 
                breed = '${breed}', 
                size_lbs= '${data.size}',
                groomer_notes = '${groomer_notes}' 
            WHERE dogID = ${data.id};`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.send(rows);
        }
    })
});

app.put('/put-schedule', function(req,res, next){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data.start)
    // Create the query and run it on the database
    query1 = `UPDATE Schedules SET 
                employee_id = '${data.name}', 
                start = '${data.start}', 
                end = '${data.end}'
            WHERE scheduleID = ${data.id};`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.send(rows);
        }
    })
});

app.put('/put-service', function(req,res, next){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // Create the query and run it on the database
    query1 = `UPDATE Services SET 
                service_name = '${data.service_name}', 
                service_duration = SEC_TO_TIME(${data.service_duration}), 
                price = ${data.price}
            WHERE serviceID = ${data.id};`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.send(rows);
        }
    })
});

app.put('/put-client-ajax', function(req,res,next){
    let data = req.body;

    let id = parseInt(data.clientID);
    console.log(id);
    let name = data.name;
    let phone = data.phone;
    let contact = data.contact;
    let email = data.email;
  
     let queryUpdateClient = `
        UPDATE Clients 
        SET name = ?, phone_number = ?, contact_method = ?, email = ?
        WHERE clientID = ?`;
  
          // Run the 1st query
    db.pool.query(queryUpdateClient, [name, phone, contact, email, id ], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.send(rows);
        }

    })
});

app.put('/put-clientDog-ajax', function(req,res,next){
    let data = req.body;

    let id = parseInt(data.clientDogID);
    console.log(id);
    let client = data.client;
    let dog = data.dog;
  
     let queryUpdateClientDog = `
        UPDATE ClientsDogs 
        SET client_id = ?, dog_id = ?
        WHERE clientsDogsID = ?`;
  
          // Run the 1st query
    db.pool.query(queryUpdateClientDog, [client, dog, id ], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.send(rows);
        }

    })
});

app.put('/put-session-ajax', function(req,res,next){
    let data = req.body;

    query1 = `UPDATE Sessions SET employee_id = '${data.employee}', client_id = '${data.client}', dog_id = '${data.dog}', session_time = '${data.time}', actual_duration = SEC_TO_TIME(${data.duration}), total_price = '${data.price}', status = '${data.stat}' WHERE sessionID =${data.id}`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error){
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.send(rows);
        }
    })


    /*let id = parseInt(data.id);
    
    let employee = data.employee;
    let client = data.client;
    let dog = data.dog;
    let time = data.time;
    let duration =  SEC_TO_TIME(data.duration);
    let price = data.price;
    let stat = data.stat;
  
     let queryUpdateSession = `UPDATE Sessions SET 
                            employee_id = ?, 
        client_id = ?, dog_id = ?, session_time = ?, actual_duration = ?, total_price = ?, status = ?
        WHERE sessionID = ?`;*/



  
          // Run the 1st query
    //db.pool.query(queryUpdateSession, [employee, client, dog, time, duration, price, stat, id ], function(error, rows, fields){
        /*if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.send(rows);
        }

    })*/
});
/*========================================================================================
    LISTENER
==========================================================================================*/


app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});