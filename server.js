const db = require('./db/connection');
const inquirer = require("inquirer");
const DB = require('./db/index.js');
const cTable = require('console.table');



function startQuestions() {
  inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "This application allows you to create, update, delete and view employee records.  See below for a list of options.",
      choices: [
        {
          name:"View all employees",
          value:"employees"
        },
        {
          name:"View all departments",
          value: "departments"
        },
        {
          name:"View all roles",
          value:"roles"
        },
        {
          name:"Add Employee",
          value:"add_emp"
        },
        {
          name:"Add Department",
          value:"add_dep"
        },
        {
          name:"Add Role",
          value:"add_role"
        },
        {
          name:"Update Employee Role",
          value:"update_role"
        },
        {
          name: "EXIT",
          value: "exit"
        }
      ]
    }
  ]).then (res => {
    const option = res.option
    switch(option) {
      case "employees":
        viewEmp()
        break;

      case "departments":
        viewDep()
        break;

      case "roles":
        viewRoles()
        break;

      case "add_emp":
        addEmp()
        break;

      case "add_dep":
        addDept()
        break;

      case "add_role":
        addRole()
        break;

      case "update_role":
        updateEmpRole()
        break;

      case "exit":
        console.log("Thank you! Good bye.");
        break;
      default:
        console.log("default");
    }
  });
}

function viewEmp () {
  DB.findAllEmployees ().then(([rows]) => {
    let employees = rows
    console.table(employees)
    startQuestions()
  })
} 

function viewDep () {
  DB.findAllDept ().then(([rows]) => {
    let department = rows
    console.table(department)
    startQuestions()
  })
} 

function viewRoles () {
  DB.findAllRoles ().then(([rows]) => {
    let roles = rows
    console.table(roles)
    startQuestions()
  })
}

async function addEmp() {
  const managers = await DB.getManagers()
    console.table(managers [0] )
  const managerMap = await managers[0].map(({ id, first_name, last_name, })=> ( {
    name: `${first_name} ${last_name}`,
    value: id
  })
)
  managerMap.unshift({
    name: "none",
    value: null
  })

  inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "New employee first name?"
    },
    {
      name: "last_name",
      type: "input",
      message: "New employee last name?",
    },
    {
      name: "role_id",
      type: "input",
      message: "Employee Role ID?"
    },
    {
      name: "manager_id",
      type: "list",
      message: "Please select employee's manager.",
      choices: managerMap
    },
  ])
  .then(res => {
      console.table(res);
    DB.addEmp(res)
      .then(() => console.table(`Added ${res.first_name} ${res.last_name} to the database`))
      .then(() => startQuestions())
  })
}

function addDept() {
  inquirer.prompt([
    {
      name: "name",
      message: "Please provide the new department name?"
    }
  ])
    .then(res => {
      let name = res;
      DB.addDept(name)
        .then(() => console.table(`${name.name} department added to the database.`))
        .then(() => startQuestions())
  })
}

async function addRole() {

  const departments = await db.promise().query('SELECT * FROM department');
  const departmentMap = await departments[0].map(({id, name}) => ({
    name: name, 
    value: id
  }));

  inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "Please provide the name of the new role?"
    },
    {
      name: "salary",
      type: "input",
      message: "What is the associatted salary?",
    },
    {
      name: "department_id",
      type: "list",
      choices: departmentMap,
      message: "Which department would you like to add the role to?"
    }
  ])
  .then(res => {
      console.table(res);
    DB.addRole(res)
      .then(() => console.table(`New role ${res.title} added to the database.`))
      .then(() => startQuestions())
  })
}

  async function updateEmpRole () {
    const employees = await db.promise().query(`SELECT * FROM employee`);
    const employeesMap = await employees[0].map(({id, first_name, last_name, role_id, manager_id}) => ({
      name: `${first_name} ${last_name}`,
      value: id
    })
  )

    const roles = await db.promise().query(`SELECT * FROM role`);
    const rolesMap = await roles[0].map(({id, title, salary, department_id}) => ({
      name: title,
      value: id
    })
  )

    const employeeData = await inquirer.prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Which employee would you like to edit?',
        choices: employeesMap
      },
      {
        type: 'list',
        name:'role_id',
        message: 'What is their new role?',
        choices: rolesMap
      }
    ])
    await db.promise().query(`UPDATE employee SET role_id = ${employeeData.role_id} WHERE id= ${employeeData.id}`);
  startQuestions();
}

startQuestions();