-- Group 57: Thomas Carpenter, Yesenia Matamoros
-- Project: Snoopy’s Snazzy Styles Management System
-- Project Step 3 Draft


SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Create Dogs Table
-- -----------------------------------------------------

CREATE OR REPLACE TABLE Dogs (
    dogID int AUTO_INCREMENT UNIQUE NOT NULL,
    name varchar(128) NOT NULL,
    age int NOT NULL,
    breed varchar(64),
    size_lbs int NOT NULL,
    groomer_notes varchar(256),
    PRIMARY KEY (dogID)
);

-- -----------------------------------------------------
-- Create Clients Table
-- -----------------------------------------------------

CREATE OR REPLACE TABLE Clients (
    clientID int AUTO_INCREMENT UNIQUE NOT NULL,
    name varchar(128) NOT NULL,
    phone_number varchar(18) NOT NULL,
    contact_method ENUM('Call', 'Text') NOT NULL,
    email varchar(128),
    PRIMARY KEY (clientID)
);

-- -----------------------------------------------------
-- Create Employees table
-- -----------------------------------------------------

CREATE OR REPLACE TABLE Employees (
    employeeID int AUTO_INCREMENT UNIQUE NOT NULL,
    name varchar(128) NOT NULL,
    hourly_wage decimal(10,2) NOT NULL,
    years_experience int NOT NULL,
    phone_number varchar(18) NOT NULL,
    email varchar(128) NOT NULL,
    address varchar(128) NOT NULL,
    is_active boolean NOT NULL,
    PRIMARY KEY (employeeID)
);

-- -----------------------------------------------------
-- Create Sessions table
-- -----------------------------------------------------

CREATE OR REPLACE TABLE Sessions (
    sessionID int AUTO_INCREMENT UNIQUE NOT NULL,
    employee_id int,
    client_id int,
    dog_id int,
    session_time timestamp NOT NULL,
    actual_duration time,
    total_price decimal(10,2) NOT NULL,
    status ENUM("Pending", "Completed", "Canceled", "No Show") NOT NULL,
    PRIMARY KEY (sessionID),
    FOREIGN KEY (employee_id) REFERENCES Employees(employeeID) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES Clients(clientID) ON DELETE SET NULL,
    FOREIGN KEY (dog_id) REFERENCES Dogs(dogID) ON DELETE SET NULL
);

-- -----------------------------------------------------
-- Create Schedules table 
-- -----------------------------------------------------

CREATE OR REPLACE TABLE Schedules (
    scheduleID int AUTO_INCREMENT UNIQUE NOT NULL,
    employee_id int NOT NULL,
    start timestamp NOT NULL,
    end timestamp NOT NULL,
    PRIMARY KEY (scheduleID),
    FOREIGN KEY (employee_id) REFERENCES Employees(employeeID) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Create Services table
-- -----------------------------------------------------

CREATE OR REPLACE TABLE Services(
    serviceID int AUTO_INCREMENT UNIQUE NOT NULL,
    service_name varchar(128) NOT NULL,
    service_duration time NOT NULL,
    price decimal(10,2) NOT NULL,
    PRIMARY KEY (serviceID)
);

-- -----------------------------------------------------
-- Create ClientsDogs intersection table 
-- -----------------------------------------------------

CREATE OR REPLACE TABLE ClientsDogs(
    clientsDogsID int AUTO_INCREMENT UNIQUE NOT NULL,
    client_id int NOT NULL,
    dog_id int NOT NULL,
    PRIMARY KEY (clientsDogsID),
    FOREIGN KEY (client_id) REFERENCES Clients(clientID) ON DELETE CASCADE,
    FOREIGN KEY (dog_id) REFERENCES Dogs(dogID) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Create SessionServices intersection table
-- -----------------------------------------------------

CREATE OR REPLACE TABLE SessionServices (
    session_id int NOT NULL,
    service_id int NOT NULL,
    PRIMARY KEY (session_id, service_id),
    FOREIGN KEY (session_id) REFERENCES Sessions(sessionID) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Services(serviceID) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Insert Dogs sample data
-- -----------------------------------------------------

INSERT INTO Dogs(name,age,breed,size_lbs,groomer_notes) 
VALUES 
    ("Fido", 3, "Labrador Retriever", 64, "A very good boy"),
    ("Nalla", 10, NULL, 13, NULL),
    ("Ferdinand the Destroyer", 1, "Chihuahua", 7, "Take extra caution with this one..."), 
    ("Leoford", 0, "Lhasa Apso", 1, "Still a puppy"), 
    ("Lucky", 16, NULL, 25, "Likes chin scratches");


-- -----------------------------------------------------
-- Insert Employees sample data
-- -----------------------------------------------------

INSERT INTO Employees(name, hourly_wage, years_experience, phone_number, email, address, is_active) 
VALUES 
    ("Matija Tristin", 18.20, 3, "(555)-555-5555", "matijatri@gmail.com", "123 Georga Ln", 1), 
    ("Marley Kirby", 17, 1, "(503)-777-7777", "marleykir@gmail.com", "6 Main St.", 1), 
    ("Zikomo Apoorva", 23.80, 10, "(900)-999-9999", "zikomoapo@gmail.com", "700 Fall St.", 0), 
    ("Quincy Ketut", 15.90, 0, "(111)-111-1111", "quincyket@gmail.com", "64 Sycamore Ave", 1), 
    ("Diede Sovanna", 20, 5, "(900)-999-9999", "diedesov@gmail.com", "700 Fall St.", 1);

-- -----------------------------------------------------
-- Insert Clients sample data
-- -----------------------------------------------------

INSERT INTO Clients(name, phone_number, contact_method, email) 
VALUES 
    ("Nzinga Fumnanya", "(222)-221-2222", "Text", "nzingafum@gmail.com"),
    ("Pat Yonah", "(444)-444-4444", "Call", "patyon@gmail.com"), 
    ("Karuna Yarden", "(333)-333-3333", "Text","karunayar@gmail.com");

-- -----------------------------------------------------
-- Insert ClientsDogs sample data
-- -----------------------------------------------------

INSERT INTO ClientsDogs(
    client_id,
    dog_id
) VALUES (
    (SELECT clientID FROM Clients WHERE name = "Nzinga Fumnanya"),
    (SELECT dogID FROM Dogs WHERE name = "Fido")
), (
    (SELECT clientID FROM Clients WHERE name = "Pat Yonah"),
    (SELECT dogID FROM Dogs WHERE name = "Fido")
), (
    (SELECT clientID FROM Clients WHERE name = "Pat Yonah"),
    (SELECT dogID FROM Dogs WHERE name = "Lucky")
), (
    (SELECT clientID FROM Clients WHERE name = "Pat Yonah"),
    (SELECT dogID FROM Dogs WHERE name = "Leoford")
), (
    (SELECT clientID FROM Clients WHERE name = "Karuna Yarden"),
    (SELECT dogID FROM Dogs WHERE name = "Ferdinand the Destroyer")
), (
    (SELECT clientID FROM Clients WHERE name = "Karuna Yarden"),
    (SELECT dogID FROM Dogs WHERE name = "Nalla")
);

-- -----------------------------------------------------
-- Insert Schedules sample data
-- -----------------------------------------------------

INSERT INTO Schedules(
    employee_id,
    start,
    end
) VALUES (
    (SELECT employeeID FROM Employees WHERE name = "Diede Sovanna"),
    "2025-1-05 09:00:00",
    "2025-1-05 17:00:00"
), (
    (SELECT employeeID FROM Employees WHERE name = "Diede Sovanna"),
    "2025-2-05 09:00:00",
    "2025-2-05 17:00:00"
), (
    (SELECT employeeID FROM Employees WHERE name = "Matija Tristin"),
    "2025-2-05 07:00:00",
    "2025-2-05 15:00:00"
), (
    (SELECT employeeID FROM Employees WHERE name = "Matija Tristin"),
    "2025-8-05 07:00:00",
    "2025-8-05 12:00:00"
), (
    (SELECT employeeID FROM Employees WHERE name = "Marley Kirby"),
    "2025-1-05 11:00:00",
    "2025-1-05 20:00:00"
), (
    (SELECT employeeID FROM Employees WHERE name = "Marley Kirby"),
    "2025-2-05 11:00:00",
    "2025-2-05 20:00:00"
), (
    (SELECT employeeID FROM Employees WHERE name = "Quincy Ketut"),
    "2025-2-05 11:00:00",
    "2025-2-05 20:00:00"
);

-- -----------------------------------------------------
-- Insert Services sample data
-- -----------------------------------------------------

INSERT INTO Services(service_name, service_duration, price) 
VALUES 
    ("Nail Trim", 3000, 20), 
    ("Puppy Cut", 10000, 50),
    ("Basic Cut: Fluffy Breeds", 20000, 90),
    ("Basic Cut: Short Coats", 10000, 70);

-- -----------------------------------------------------
-- Insert Sessions sample data
-- -----------------------------------------------------

INSERT INTO Sessions(employee_id, client_id, dog_id, session_time, actual_duration, total_price, status) 
VALUES (
    (SELECT employeeID FROM Employees WHERE name = "Diede Sovanna"),
    (SELECT clientID FROM Clients WHERE name = "Pat Yonah"),
    (SELECT dogID FROM Dogs WHERE name = "Leoford"),
    "2025-1-05 09:00:00",
    13000,
    70,
    "Completed"
), (
    (SELECT employeeID FROM Employees WHERE name = "Diede Sovanna"),
    (SELECT clientID FROM Clients WHERE name = "Nzinga Fumnanya"),
    (SELECT dogID FROM Dogs WHERE name = "Fido"),
    "2025-1-05 11:00:00",
    NULL,
    70,
    "Canceled"
), (
    (SELECT employeeID FROM Employees WHERE name = "Matija Tristin"),
    (SELECT clientID FROM Clients WHERE name = "Pat Yonah"),
    (SELECT dogID FROM Dogs WHERE name = "Lucky"),
    "2025-2-05 08:00:00",
    3000,
    20,
    "Completed"
), (
    (SELECT employeeID FROM Employees WHERE name = "Marley Kirby"),
    (SELECT clientID FROM Clients WHERE name = "Karuna Yarden"),
    (SELECT dogID FROM Dogs WHERE name = "Ferdinand the Destroyer"),
    "2025-2-05 08:30:00",
    30000,
    110,
    "Completed"
);

-- -----------------------------------------------------
-- Insert SessionServices sample data
-- -----------------------------------------------------

INSERT INTO SessionServices(session_id, service_id) 
VALUES (
    (SELECT sessionID FROM Sessions WHERE session_time = "2025-1-05 09:00:00" and employee_id = (SELECT employeeID FROM Employees WHERE name = "Diede Sovanna")),
    (SELECT serviceID FROM Services WHERE service_name = "Nail Trim")
), (
    (SELECT sessionID FROM Sessions WHERE session_time = "2025-1-05 09:00:00" and employee_id = (SELECT employeeID FROM Employees WHERE name = "Diede Sovanna")),
    (SELECT serviceID FROM Services WHERE service_name = "Puppy Cut")
), (
    (SELECT sessionID FROM Sessions WHERE session_time = "2025-1-05 11:00:00" and employee_id = (SELECT employeeID FROM Employees WHERE name = "Diede Sovanna")),
    (SELECT serviceID FROM Services WHERE service_name = "Basic Cut: Short Coats")
), (
    (SELECT sessionID FROM Sessions WHERE session_time = "2025-2-05 08:00:00" and employee_id = (SELECT employeeID FROM Employees WHERE name = "Matija Tristin")),
    (SELECT serviceID FROM Services WHERE service_name = "Nail Trim")
), (
    (SELECT sessionID FROM Sessions WHERE session_time = "2025-2-05 08:30:00" and employee_id = (SELECT employeeID FROM Employees WHERE name = "Marley Kirby")),
    (SELECT serviceID FROM Services WHERE service_name = "Nail Trim")
), (
    (SELECT sessionID FROM Sessions WHERE session_time = "2025-2-05 08:30:00" and employee_id = (SELECT employeeID FROM Employees WHERE name = "Marley Kirby")),
    (SELECT serviceID FROM Services WHERE service_name = "Basic Cut: Fluffy Breeds")
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;