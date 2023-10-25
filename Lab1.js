const fs = require('fs');
const readline = require('readline');
const debtFile = 'debts.txt';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter name and amount: ', (input) => {
  const [name, amount] = input.split(' ');
  if (name && amount) {
    fs.appendFileSync(debtFile, `${name}: $${amount}\n`);
    console.log('Debt added successfully.');
  } else {
    console.log('Invalid input. Please provide name and amount.');
  }
  rl.close();
});
