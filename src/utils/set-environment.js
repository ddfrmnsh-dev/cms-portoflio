const fs = require("fs");
const environment = process.argv[2];
const envContent = fs.readFileSync(`./environments/.env.${environment}`);
fs.writeFileSync(".env", envContent);
