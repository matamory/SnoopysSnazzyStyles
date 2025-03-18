-- Group 57: Thomas Carpenter, Yesenia Matamoros
-- Project: Snoopy’s Snazzy Styles Management System


-- -----------------------------------------------------
-- Employees table queries
-- -----------------------------------------------------

-- Select all employees
SELECT * FROM Employees;

-- Get employee's data to populate a dropdown for associating with a session 
SELECT employeeID, name FROM Employees;

-- Add new employee
INSERT INTO Employees (name, hourly_wage, years_experience, phone_number, email, address, is_active
) VALUES (
    :name,
    :wage,
    :experience,
    :phone,
    :email,
    :address,
    :active

);

-- Update employee
UPDATE Employees SET 
    name = :name, 
    hourly_wage = :wage, 
    years_experience = :experience, 
    phone_number= :phone,
    email = :email, 
    address = :address, 
    is_active = :active
WHERE employeeID = :id;

-- Delete employee
DELETE FROM Employees WHERE employeeID = :id;

-- -----------------------------------------------------
-- Schedules table queries
-- -----------------------------------------------------

-- Select all schedules
SELECT Schedules.scheduleID, Employees.employeeID, Employees.name, Schedules.start, Schedules.end FROM Schedules
JOIN Employees ON Schedules.employee_id = Employees.employeeID
ORDER BY Schedules.start;

-- Select schedules based on date
SELECT Schedules.scheduleID, Employees.employeeID, Employees.name, Schedules.start, Schedules.end FROM Schedules
JOIN Employees ON Schedules.employee_id = Employees.employeeID 
WHERE DATE(Schedules.start) = :dateInput;

-- Select schedules based on date range
SELECT Schedules.scheduleID, Employees.employeeID, Employees.name, Schedules.start, Schedules.end FROM Schedules
JOIN Employees ON Schedules.employee_id = Employees.employeeID 
WHERE DATE(Schedules.start) >= :fDateInput AND DATE(Schedules.end) <= :lDateInput;

-- Select filtered schedules on date(Probably a more efficiant way, but this works... So...)
SELECT Schedules.scheduleID, Employees.name, DATE(Schedules.start) AS date, TIME(Schedules.start) AS start, TIME(MIN(Session1.session_start)) AS session_start, MIN(Session1.session_end) AS session_end, 
    TIME(MIN(Session2.session_start)) AS session_start, MIN(Session2.session_end) AS session_end, TIME(MIN(Session3.session_start)) AS session_start, MIN(Session3.session_end) AS session_end, 
    TIME(MIN(Session4.session_start)) AS session_start, MIN(Session4.session_end) AS session_end, TIME(MIN(Session5.session_start)) AS session_start, MIN(Session5.session_end) AS session_end, 
    TIME(MIN(Session6.session_start)) AS session_start, MIN(Session6.session_end) AS session_end, TIME(MIN(Session7.session_start)) AS session_start, MIN(Session7.session_end) AS session_end, TIME(Schedules.end) FROM Schedules
JOIN Employees ON Schedules.employee_id = Employees.employeeID 
LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions 
    JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id
    JOIN Services ON Services.serviceID = SessionServices.service_id 
    GROUP BY Sessions.sessionID) AS Session1 ON Session1.employee_id = Employees.employeeID AND Session1.session_start >= Schedules.start AND Session1.session_start < Schedules.end
LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions 
    JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id
    JOIN Services ON Services.serviceID = SessionServices.service_id 
    GROUP BY Sessions.sessionID) AS Session2 ON Session2.employee_id = Employees.employeeID AND Session2.session_start >= Schedules.start AND Session2.session_start < Schedules.end AND Session1.session_start < Session2.session_start
LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions 
    JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id
    JOIN Services ON Services.serviceID = SessionServices.service_id 
    GROUP BY Sessions.sessionID) AS Session3 ON Session3.employee_id = Employees.employeeID AND Session3.session_start >= Schedules.start AND Session3.session_start < Schedules.end AND Session2.session_start < Session3.session_start
LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions 
    JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id
    JOIN Services ON Services.serviceID = SessionServices.service_id 
    GROUP BY Sessions.sessionID) AS Session4 ON Session4.employee_id = Employees.employeeID AND Session4.session_start >= Schedules.start AND Session4.session_start < Schedules.end AND Session3.session_start < Session4.session_start
LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions 
    JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id
    JOIN Services ON Services.serviceID = SessionServices.service_id 
    GROUP BY Sessions.sessionID) AS Session5 ON Session5.employee_id = Employees.employeeID AND Session5.session_start >= Schedules.start AND Session5.session_start < Schedules.end AND Session4.session_start < Session5.session_start
LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions 
    JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id
    JOIN Services ON Services.serviceID = SessionServices.service_id 
    GROUP BY Sessions.sessionID) AS Session6 ON Session6.employee_id = Employees.employeeID AND Session6.session_start >= Schedules.start AND Session6.session_start < Schedules.end AND Session5.session_start < Session6.session_start
LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions 
    JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id
    JOIN Services ON Services.serviceID = SessionServices.service_id 
    GROUP BY Sessions.sessionID) AS Session7 ON Session7.employee_id = Employees.employeeID AND Session7.session_start >= Schedules.start AND Session7.session_start < Schedules.end AND Session6.session_start < Session7.session_start
WHERE DATE(Schedules.start) = :dateInput
GROUP BY Schedules.scheduleID
ORDER BY Schedules.start;

-- Select filtered schedules on date(Probably a more efficiant way, but this works... So...)
SELECT Schedules.scheduleID, Employees.name, DATE(Schedules.start) AS date, TIME(Schedules.start) AS start, TIME(MIN(Session1.session_start)) AS session_start, MIN(Session1.session_end) AS session_end, 
    TIME(MIN(Session2.session_start)) AS session_start, MIN(Session2.session_end) AS session_end, TIME(MIN(Session3.session_start)) AS session_start, MIN(Session3.session_end) AS session_end, 
    TIME(MIN(Session4.session_start)) AS session_start, MIN(Session4.session_end) AS session_end, TIME(MIN(Session5.session_start)) AS session_start, MIN(Session5.session_end) AS session_end, 
    TIME(MIN(Session6.session_start)) AS session_start, MIN(Session6.session_end) AS session_end, TIME(MIN(Session7.session_start)) AS session_start, MIN(Session7.session_end) AS session_end, TIME(Schedules.end) FROM Schedules
JOIN Employees ON Schedules.employee_id = Employees.employeeID 
LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions 
    JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id
    JOIN Services ON Services.serviceID = SessionServices.service_id 
    GROUP BY Sessions.sessionID) AS Session1 ON Session1.employee_id = Employees.employeeID AND Session1.session_start >= Schedules.start AND Session1.session_start < Schedules.end
LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions 
    JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id
    JOIN Services ON Services.serviceID = SessionServices.service_id 
    GROUP BY Sessions.sessionID) AS Session2 ON Session2.employee_id = Employees.employeeID AND Session2.session_start >= Schedules.start AND Session2.session_start < Schedules.end AND Session1.session_start < Session2.session_start
LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions 
    JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id
    JOIN Services ON Services.serviceID = SessionServices.service_id 
    GROUP BY Sessions.sessionID) AS Session3 ON Session3.employee_id = Employees.employeeID AND Session3.session_start >= Schedules.start AND Session3.session_start < Schedules.end AND Session2.session_start < Session3.session_start
LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions 
    JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id
    JOIN Services ON Services.serviceID = SessionServices.service_id 
    GROUP BY Sessions.sessionID) AS Session4 ON Session4.employee_id = Employees.employeeID AND Session4.session_start >= Schedules.start AND Session4.session_start < Schedules.end AND Session3.session_start < Session4.session_start
LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions 
    JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id
    JOIN Services ON Services.serviceID = SessionServices.service_id 
    GROUP BY Sessions.sessionID) AS Session5 ON Session5.employee_id = Employees.employeeID AND Session5.session_start >= Schedules.start AND Session5.session_start < Schedules.end AND Session4.session_start < Session5.session_start
LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions 
    JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id
    JOIN Services ON Services.serviceID = SessionServices.service_id 
    GROUP BY Sessions.sessionID) AS Session6 ON Session6.employee_id = Employees.employeeID AND Session6.session_start >= Schedules.start AND Session6.session_start < Schedules.end AND Session5.session_start < Session6.session_start
LEFT JOIN (SELECT Sessions.employee_id, Sessions.session_time AS session_start, ADDTIME(TIME(Sessions.session_time), SUM(Services.service_duration)) AS session_end FROM Sessions 
    JOIN SessionServices ON Sessions.sessionID = SessionServices.session_id
    JOIN Services ON Services.serviceID = SessionServices.service_id 
    GROUP BY Sessions.sessionID) AS Session7 ON Session7.employee_id = Employees.employeeID AND Session7.session_start >= Schedules.start AND Session7.session_start < Schedules.end AND Session6.session_start < Session7.session_start
WHERE DATE(Schedules.start) >= :fDateInput AND DATE(Schedules.end) <= :lDateInput
GROUP BY Schedules.scheduleID
ORDER BY Schedules.start;

-- Insert new schedule
INSERT INTO Schedules(
    employee_id,
    start,
    end
) VALUES (
    :employeeID,
    :startTime,
    :endTime
);

-- Updating a schedule by id
UPDATE Schedules SET 
    employee_id = :name, 
    start = :start, 
    end = :end
WHERE scheduleID = :id;

-- Deleting a schedule
DELETE FROM Schedules WHERE scheduleID = :id;

-- -----------------------------------------------------
-- Services table queries
-- -----------------------------------------------------
-- Select all services
SELECT serviceID, service_name, TIME_TO_SEC(service_duration) as service_duration, price FROM Services;

-- Select services for dropdowns
SELECT serviceID, service_name FROM Services;

-- Service ID query
SELECT serviceID FROM Services WHERE service_name = ?;

-- Insert new service
INSERT INTO Services(
    service_name,
    service_duration,
    price
) VALUES (
    :service_name,
    SEC_TO_TIME(:service_duration),
    :price
);

-- Update service
UPDATE Services SET 
    service_name = :service_name, 
    service_duration = SEC_TO_TIME(:service_duration), 
    price = :price
WHERE serviceID = :id;

-- Delete service
DELETE FROM Services WHERE serviceID = :id;


-- -----------------------------------------------------
-- Dogs table queries
-- -----------------------------------------------------
-- Select all dogs
SELECT * FROM Dogs;


-- Getdog's data to populate a dropdown for associating with a session
SELECT Dogs.dogID, Dogs.name FROM Dogs JOIN ClientsDogs ON ClientsDogs.dog_id = Dogs.dogID WHERE ClientsDogs.client_id = :client;

-- Add new dog
INSERT INTO Dogs(
    name,
    age
    breed,
    size_lbs, 
    groomer_notes
) VALUES (
    :name,
    :age,
    :breed,
    :size_lbs, 
    :groomer_notes
);

-- Update dog information
UPDATE Dogs SET 
    name = :name, 
    age = :age, 
    breed = :breed, 
    size_lbs= :size,
    groomer_notes = :groomer_notes, 
WHERE dogID = :id;

-- Delete dog
DELETE FROM Dogs WHERE dogID = :id;


-- -----------------------------------------------------
-- Clients table queries
-- -----------------------------------------------------

-- Select all clients
SELECT * FROM Clients;

-- Get client's data to populate a dropdown for associating with a session
SELECT clientID, name FROM Clients;

-- Add new client
INSERT INTO Clients(
    name,
    phone_number,
    contact_method, 
    email
) VALUES (
    :name,
    :phone,
    :contact,
    :email
);

-- Update client information
UPDATE Clients SET 
    name = :name, 
    phone_number = :phone, 
    contact_method = :contact, 
    email = :email, 
WHERE clientID = :id;

-- Delete client
DELETE FROM Clients WHERE ClientID = :id;

-- -----------------------------------------------------
-- Sessions table queries
-- -----------------------------------------------------

-- Select all sessions
SELECT Sessions.sessionID, Sessions.sessionID, Employees.employeeID, Clients.clientID, Dogs.dogID, Employees.name as employeeName, Clients.name AS clientName, Dogs.name as dogName, Sessions.session_time, TIME_TO_SEC(Sessions.actual_duration) as actual_duration, Sessions.total_price, Sessions.status FROM Sessions 
JOIN Employees ON Sessions.employee_id = Employees.employeeID 
JOIN Clients ON Sessions.client_id = Clients.clientID 
JOIN Dogs ON Sessions.dog_id = Dogs.dogID;

-- Select sessions based on date
SELECT Sessions.sessionID, Employees.name, Clients.name, Dogs.name, Sessions.session_time, Sessions.actual_duration, Sessions.total_price, Sessions.status FROM Sessions
JOIN Employees ON Sessions.employee_id = Employees.employeeID
JOIN Clients ON Sessions.client_id = Clients.clientID
JOIN Dogs ON Sessions.dog_id = Dogs.dogID
WHERE DATE(Sessions.start) = :dateInput;

-- Select sessions for dropdowns
SELECT sessionID FROM Sessions;

-- Add new session
INSERT INTO Sessions(
    employee_ID,
    client_id,
    dog_id,
    session_time, 
    actual_duration, 
    total_price,
    status
) VALUES (
    :employee,
    :client,
    :dog,
    :time, 
    SEC_TO_TIME(:duration), 
    :price,
    :status
);

-- Update session information
UPDATE Sessions SET 
    employee_id= :employee, 
    client_id = :client, 
    dog_id = :dog, 
    session_time= :time,
    actual_duration = SEC_TO_TIME(:duration),
    total_price = :price,
    status= :stat,
WHERE sessionID = :id;

-- Delete session
DELETE FROM Sessions WHERE sessionID = :id;

-- -----------------------------------------------------
-- SessionServices table queries
-- -----------------------------------------------------

-- Select all SessionServices
SELECT SessionServices.session_id, Services.service_name FROM SessionServices 
JOIN Services ON Services.serviceID = SessionServices.service_id 
ORDER BY session_id;

-- Add new SessionServices
INSERT INTO SessionServices(
    session_id,
    service_id
) VALUES (
    :session_id,
    :service_id
);

-- Delete SessionsServices
DELETE FROM SessionServices WHERE session_id = :session_id AND service_id = :service_id;

-- -----------------------------------------------------
-- ClientsDogs table queries
-- -----------------------------------------------------


-- Select all ClientsDogs
SELECT ClientsDogs.clientsDogsID, Clients.clientID, Dogs.dogID, Clients.name AS clientName, Dogs.name as dogName FROM ClientsDogs JOIN Clients ON ClientsDogs.client_id = Clients.clientID 
JOIN Dogs ON ClientsDogs.dog_id = Dogs.dogID;


-- Add new ClientsDogs
INSERT INTO ClientsDogs(
    client_id,
    dog_id
) VALUES (
    :client,
    :dog
);

-- Update ClientsDogs information
UPDATE ClientsDogs SET 
    client_id= :client, 
    dog_id = :dog, 
WHERE clientsDogsID = :id;


-- Delete ClientsDogs
DELETE FROM ClientsDogs WHERE clientsDogsID = :id;