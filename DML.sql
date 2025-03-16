-- Group 57: Thomas Carpenter, Yesenia Matamoros
-- Project: Snoopy’s Snazzy Styles Management System
-- Project Step 3 Draft


-- -----------------------------------------------------
-- Employees table queries
-- -----------------------------------------------------

-- Select all employees
SELECT * FROM Employees;

-- Select specific employee
SELECT * FROM Employees WHERE employeeID = :idInput;

-- Get employee's data to populate a dropdown for associating with a session 
SELECT employeeID, name FROM Employees;

-- Add new employee
INSERT INTO Employees (name, hourly_wage, years_experience, phone_number, email, address, is_active
) VALUES (
    :nameInput,
    :wageInput,
    :experienceInput,
    :phoneInput,
    :emailInput,
    :addressInput,
    :activeInput
);

-- Update employee
UPDATE Employees SET 
    name = :nameInput, 
    hourly_wage = :wageInput, 
    years_experience = :experienceInput, 
    phone_number= :phoneInput,
    email = :emailInput, 
    address = :addressInput, 
    is_active = :activeInput
WHERE employeeID = :idInput;

-- Delete employee
DELETE FROM Employees WHERE employeeID = :employee_ID_selected_from_employee_page;

-- -----------------------------------------------------
-- Schedules table queries
-- -----------------------------------------------------

-- Select all schedules
SELECT Schedules.scheduleID, Employees.employeeID, Employees.name, Schedules.start, Schedules.end FROM Schedules
JOIN Employees ON Schedules.employee_id = Employees.employeeID;

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
GROUP BY Schedules.scheduleID;

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
GROUP BY Schedules.scheduleID;

-- Insert new schedule
INSERT INTO Schedules(
    employee_id,
    start,
    end
) VALUES (
    :idInput,
    :startInput,
    :endInput
);

-- Updating a schedule by id
UPDATE Schedules SET 
    employee_id = :idInput, 
    start = :startInput, 
    end = :endInput
WHERE scheduleID = :idInput;

-- Deleting a schedule
DELETE FROM Schedules WHERE scheduleID = :schedule_ID_selected_from_schedule_page;

-- -----------------------------------------------------
-- Services table queries
-- -----------------------------------------------------
-- Select all services
SELECT * FROM Services;

-- Select services for dropdowns
SELECT serviceID, service_name FROM Services;

-- Select specific service
SELECT serviceID FROM Services WHERE service_name = :service_name_input;

-- Insert new service
INSERT INTO Services(
    service_name,
    service_duration,
    price
) VALUES (
    :nameInput,
    :durationInput,
    :priceInput
);

-- Update service
UPDATE Services SET 
    service_name = :nameInput, 
    service_duration = :durationInput, 
    price = :priceInput
WHERE serviceID = :idInput;

-- Delete service
DELETE FROM Services WHERE serviceID = :service_ID_selected_from_service_page


-- -----------------------------------------------------
-- Dogs table queries
-- -----------------------------------------------------
-- Select all dogs
SELECT * FROM Dogs;

-- Select specific dog
SELECT * FROM Dogs WHERE dogID = :idInput;

-- Getdog's data to populate a dropdown for associating with a session
SELECT dogID, name FROM Dogs

-- Add new dog
INSERT INTO Dogs(
    name,
    age
    breed,
    size_lbs, 
    groomer_notes
) VALUES (
    :nameInput,
    :ageInput,
    :breedInput,
    :sizeInput, 
    :notesInput
);

-- Update dog information
UPDATE Dogs SET 
    name = :nameInput, 
    age = :ageInput, 
    breed = :breedInput, 
    size_lbs= :sizeInput,
    groomer_notes = :notesInput, 
WHERE dogID = :idInput;

-- Delete dog
DELETE FROM Dogs WHERE dogID = :dog_ID_selected_from_dog_page;


-- -----------------------------------------------------
-- Clients table queries
-- -----------------------------------------------------

-- Select all clients
SELECT * FROM Clients;

-- Get client's data to populate a dropdown for associating with a session
SELECT clientID, name FROM Clients

-- Add new client
INSERT INTO Clients(
    name,
    phone_number,
    contact_method, 
    email
) VALUES (
    :nameInput,
    :phoneInput,
    :contactInput,
    :emailInput
);

-- Update client information
UPDATE Clients SET 
    name = :nameInput, 
    phone_number = :phoneInput, 
    contact_method = :contactInput, 
    email = :emailInput, 
WHERE clientID = :idInput;

-- Delete client
DELETE FROM Clients WHERE ClientID = :client_ID_selected_from_client_page;

-- -----------------------------------------------------
-- Sessions table queries
-- -----------------------------------------------------

-- Select all sessions
SELECT Sessions.sessionID, Employees.name, Clients.name, Dogs.name, Sessions.session_time, Sessions.actual_duration, Sessions.total_price, Sessions.status FROM Sessions
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
    :employee_id_from_dropdown_Input,
    :client_id_from_dropdown_Input,
    :dog_id_from_dropdown_Input,
    :timeInput, 
    :durationInput, 
    :priceInput,
    :statusInput
);

-- Update session information
UPDATE Sessions SET 
    employee_ID = :employeeInput, 
    client_ID = :clientInput, 
    dog_ID = :dogInput, 
    session_time= :timeInput,
    actual_duration = :durationInput,
    status= :statusInput,
WHERE sessionID = :idInput;

-- Delete session
DELETE FROM Sessions WHERE sessionID = :sessions_ID_selected_from_session_page;

-- -----------------------------------------------------
-- SessionServices table queries
-- -----------------------------------------------------

-- Select all SessionServices
SELECT SessionServices.session_id, Services.service_name FROM SessionServices JOIN Services ON Services.serviceID = SessionServices.service_id;

-- Add new SessionServices
INSERT INTO SessionServices(
    session_id,
    service_id
) VALUES (
    :session_id_input,
    :service_id_from_dropdown
);

-- Delete SessionsServices
DELETE FROM SessionServices WHERE session_id = :session_id_input AND service_id = :service_id_input;
