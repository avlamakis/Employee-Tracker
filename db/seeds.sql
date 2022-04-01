INSERT INTO department
    (department_name)
VALUES
    ('Operations'),
    ('Analystics'),
    ('Marketing'),
    ('Executive');

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('General Manager', 5000000, 1),
    ('Coach', 9000000, 1),
    ('Team Analyst', 600000, 2),
    ('Team Lead Analyst', 800000, 2),
    ('Media Lead', 400000, 3),
    ('Media Specialist', 3000000, 3),
    ('CEO', 20000000, 4),

INSERT INTO employee
    (first_name, last_name, roles_id, manager_id)
VALUES
    ('Sam', 'Presti', 1, 4),
    ('Jerry', 'Sloan', 2, 1),
    ('Donovan', 'Mitchell', 3, 2),
    ('Larry', 'Miller', 4, NULL),
    ('Rudy', 'Gobert', 5, 3),
    ('Karl', 'Malone', 6, 2)
    ('John', 'Stockton', 7, NULL);