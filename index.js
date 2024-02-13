const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

// TODO: Write Code to gather information about the development team members, and render the HTML file.

const team = [];
//prompt for the Manager
const addManager = () => {
	return inquirer
		.prompt([
			{
				type: "input",
				name: "name",
				message: "What is the team manager's name?",
			},
			{
				type: "input",
				name: "id",
				message: "What is the team manager's ID.",
			},
			{
				type: "input",
				name: "email",
				message: "What is the team manager's email.",
			},
			{
				type: "input",
				name: "officeNumber",
				message: "What is the team manager's office number",
			},
		])
		.then((data) => {
			const { name, id, email, officeNumber } = data;
			const manager = new Manager(name, id, email, officeNumber);

			team.push(manager);
		
		});
};

//prompt for the other members
async function addTeamMember() {
	const askRole = await inquirer.prompt([
		{
			type: "list",
			name: "role",
			message: "Please choose your employee's role",
			choices: ["Engineer", "Intern"],
		},
	]);
	return inquirer
		.prompt([
			{
				type: "input",
				name: "name",
				message: `What is the name of the ${askRole.role}?`,
			},
			{
				type: "input",
				name: "id",
				message: `Please enter the ${askRole.role}'s ID.`,
			},
			{
				type: "input",
				name: "email",
				message: `Please enter the ${askRole.role}'s email.`,
			},
			{
				type: "input",
				name: "github",
				message: `Please enter the ${askRole.role}'s github username.`,
				when: () => askRole.role === "Engineer",
			},
			{
				type: "input",
				name: "school",
				message: `Please enter the ${askRole.role}'s school`,
				when: () => askRole.role === "Intern",
			},
			{
				type: "confirm",
				name: "confirmAddNew",
				message: "Would you like to add more team members?",
				default: false,
			},
		])
		.then((data) => {
			// data for employee types

			let { name, id, email, github, school, confirmAddNew } = data;
			let employee;
			console.log(askRole.role);
			if (askRole.role === "Engineer") {
				employee = new Engineer(name, id, email, github);
			} else if (askRole.role === "Intern") {
				employee = new Intern(name, id, email, school);
			}

			team.push(employee);

			if (confirmAddNew) {
				return addTeamMember(team);
			} else {
				return team;
			}
		});
}
writeFile = (data) => {
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR);
	}

	fs.writeFile(outputPath, data, (err) => {
		if (err) {
			console.log(err);
			return;
		} else {
			console.log(
				"Profile created check the output folder for the team.html file"
			);
		}
	});
};

function init() {
	console.log("Please Build your Team.");
	addManager()
		.then(addTeamMember)
		.then((team) => {
			return render(team);
		})
		.then((data) => {
			console.log(outputPath);
			return writeFile(data);
		});
}

init();
