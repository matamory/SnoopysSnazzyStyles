-- -----------------------------------------------------
-- Employees table queries
-- -----------------------------------------------------

-- Select all employees
SELECT * FROM Employees;

-- Select specific employee
SELECT * FROM Employees WHERE employeeID = :idInput;

-- Add new employee
INSERT INTO Employees (
    name, 
    hourly_wage,
    years_experience,
    phone_number,
    email,
    address,
    is_active
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
DELETE FROM Employees WHERE employeeID = :idInput;

-- -----------------------------------------------------
-- Schedules table queries
-- -----------------------------------------------------

-- Select all schedules
SELECT Schedules.scheduleID, Employees.name, Schedules.start, Schedules.end FROM Schedules
JOIN Employees ON Schedules.employee_id = Employees.employeeID;

-- Select schedules based on date
SELECT Schedules.scheduleID, Employees.name, Schedules.start, Schedules.end FROM Schedules
JOIN Employees ON Schedules.employee_id = Employees.employeeID 
WHERE DATE(Schedules.start) = :dateInput;

-- Select schedules based on date range
SELECT Schedules.scheduleID, Employees.name, Schedules.start, Schedules.end FROM Schedules
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
DELETE FROM Schedules WHERE scheduleID = :idInput;

-- -----------------------------------------------------
-- Services table queries
-- -----------------------------------------------------
-- Select all services
SELECT * FROM Services;

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
DELETE FROM Services WHERE serviceID = :idInput


