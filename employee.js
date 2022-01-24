'use strict';

// List the dependencies here.
const mysql = require('mysql2');
const inquirer = require('inquirer');

require('console.table');

const promptMessages = {
    viewAllEmployees: "View All Employees",
    viewByDepartment: "View All Employees By Department",
    viewByManager: "View All Employees By Manager",
    addEmployee: "Add An Employee",
    removeEmployee: "Remove An Employee",
    updateroles: "Update Employee roles",
    updateEmployeeManager: "Update Employee Manager",
    viewAllroless: "View All roless",
    exit: "Exit"
};


// Create the connection to MySQL WorkBench
const connection = mysql.createConnection(
  {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Alexthunder35!",
    database: "employees_db",
  }
);
connection.connect((err) => {
  if (err) throw err;
  prompt();
});

function prompt() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                promptMessages.viewAllEmployees,
                promptMessages.viewByDepartment,
                promptMessages.viewByManager,
                promptMessages.viewAllroless,
                promptMessages.addEmployee,
                promptMessages.removeEmployee,
                promptMessages.updateroles,
                promptMessages.exit
            ]
        })
        .then(answer => {
            console.log('answer', answer);
            switch (answer.action) {
                case promptMessages.viewAllEmployees:
                    viewAllEmployees();
                    break;

                case promptMessages.viewByDepartment:
                    viewByDepartment();
                    break;

                case promptMessages.viewByManager:
                    viewByManager();
                    break;

                case promptMessages.addEmployee:
                    addEmployee();
                    break;

                case promptMessages.removeEmployee:
                    remove('delete');
                    break;

                case promptMessages.updateroles:
                    remove('roles');
                    break;

                case promptMessages.viewAllroless:
                    viewAllroless();
                    break;

                case promptMessages.exit:
                    connection.end();
                    break;
            }
        });
}

function viewAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN roles ON (roles.id = employee.roles_id)
    INNER JOIN department ON (department.id = roles.department_id)
    ORDER BY employee.id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW ALL EMPLOYEES');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

function viewByDepartment() {
    const query = `SELECT department.name AS department, roles.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN roles ON (roles.id = employee.roles_id)
    LEFT JOIN department ON (department.id = roles.department_id)
    ORDER BY department.name;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY DEPARTMENT');
        console.log('\n');
        console.table(res);
        prompt();
    });
}


function viewByManager() {
    const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, roles.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN roles ON (roles.id = employee.roles_id && employee.manager_id != 'NULL')
    INNER JOIN department ON (department.id = roles.department_id)
    ORDER BY manager;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY MANAGER');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

function viewAllroless() {
    const query = `SELECT roles.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN roles ON (roles.id = employee.roles_id)
    LEFT JOIN department ON (department.id = roles.department_id)
    ORDER BY roles.title;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY roles');
        console.log('\n');
        console.table(res);
        prompt();
    });

}

async function addEmployee() {
    const addname = await inquirer.prompt(askName());
    connection.query('SELECT roles.id, roles.title FROM roles ORDER BY roles.id;', async (err, res) => {
        if (err) throw err;
        const { roles } = await inquirer.prompt([
            {
                name: 'roles',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the employee roles?: '
            }
        ]);
        let rolesId;
        for (const row of res) {
            if (row.title === roles) {
                rolesId = row.id;
                continue;
            }
        }
        connection.query('SELECT * FROM employee', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: 'Choose the employee Manager: '
                }
            ]);
            let managerId;
            let managerName;
            if (manager === 'none') {
                managerId = null;
            } else {
                for (const data of res) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerId);
                        console.log(managerName);
                        continue;
                    }
                }
            }
            console.log('Employee has been added. Please view all employee to verify...');
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: addname.first,
                    last_name: addname.last,
                    roles_id: rolesId,
                    manager_id: parseInt(managerId)
                },
                (err, res) => {
                    if (err) throw err;
                    prompt();

                }
            );
        });
    });

}
function remove(input) {
    const promptQ = {
        yes: "yes",
        no: "no I don't (view all employees on the main option)"
    };
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "In order to proceed an employee, an ID must be entered. View all employees to get" +
                " the employee ID. Do you know the employee ID?",
            choices: [promptQ.yes, promptQ.no]
        }
    ]).then(answer => {
        if (input === 'delete' && answer.action === "yes") removeEmployee();
        else if (input === 'roles' && answer.action === "yes") updateroles();
        else viewAllEmployees();



    });
};

async function removeEmployee() {

    const answer = await inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Enter the employee ID you want to remove:  "
        }
    ]);

    connection.query('DELETE FROM employee WHERE ?',
        {
            id: answer.first
        },
        function (err) {
            if (err) throw err;
        }
    )
    console.log('Employee has been removed on the system!');
    prompt();

};

function askId() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the employe ID?:  "
        }
    ]);
}


async function updateroles() {
    const employeeId = await inquirer.prompt(askId());

    connection.query('SELECT roles.id, roles.title FROM roles ORDER BY roles.id;', async (err, res) => {
        if (err) throw err;
        const { roles } = await inquirer.prompt([
            {
                name: 'roles',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the new employee roles?: '
            }
        ]);
        let rolesId;
        for (const row of res) {
            if (row.title === roles) {
                rolesId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee 
        SET roles_id = ${rolesId}
        WHERE employee.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
            console.log('roles has been updated..')
            prompt();
        });
    });
}

function askName() {
    return ([
        {
            name: "first",
            type: "input",
            message: "Enter the first name: "
        },
        {
            name: "last",
            type: "input",
            message: "Enter the last name: "
        }
    ]);
}