const readlinePromises = require("node:readline/promises");
const { stdin, stdout } = require("process"); //standardIn E standardOut -> entrada padrão e saída padrão

async function main() {
  const terminalWindow = readlinePromises.createInterface(stdin, stdout);

  const nome = await terminalWindow.question("Qual é sua idade?");

  const response = await fetch(`https://api.github.com/users/${nome}`);
  const json = await response.json(); // 

  console.log(json);

  terminalWindow.close();
}

main();
