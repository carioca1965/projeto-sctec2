import { stdin , stdout } from "process";
import { createInterface } from "node:readline/promises";
import { readFile, writeFile } from "node:fs/promises";

function validaUsuario(nomeUsuario) {
    nomeUsuario = nomeUsuario.trim();

    if (nomeUsuario === "") {
        throw new Error("Um nome de usuário deve ser informado.");
    }

    const usuarioRegex = /^(?!.*--)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
    if (!usuarioRegex.test(nomeUsuario)) {
        throw new Error("Nome de usuário inválido.");
    }

    return nomeUsuario
}

async function buscarPerfil(username){
    const urlBase = 'https://api.github.com/users/';
    
    try {
        
        const response = await fetch(`${urlBase}${username}`)

        /*{
            "message": "Not Found",
            "documentation_url": "https://docs.github.com/rest",
            "status": "404"
            }*/

        switch (response.status) {
            case 200:
                return await response.json();
            case 400:
                throw new Error ('Requisição inválida');   
            case 404:
                throw new Error (`Usuário "${username}" não encontrado no Github`);  
            default:
                throw new Error (`Não foi possível buscar o usuário no Github ${response.status}${response.statusText}`);    
        }        
    
    } catch (error){
        if (error.name === "TypeError") {
            throw new Error("Erro de timeout - falha de conexão com o Github");
        }
        throw error;
       // console.log(error);
    }
}

async function lerArquivo() {
    try {
        const usuariosText = await readFile(`./database.json`, {encoding: "utf-8"});
        return JSON.parse(usuariosText);
    } catch (error) {
        //
        if (error.code === "ENOENT") {
            return [];//sem isso, pode gerar erro undefined
        } 
        
        console.error("Arquivo corrompido, não foi possível ler os dados.");
    }
}

async function salvarArquivo(usuario) {    
    const usuarios = await lerArquivo();  

    if (!usuarios) {
		await writeFile(`./database.json`, JSON.stringify([usuario]), {
			encoding: "utf-8",
		});
	}
    
        const usuarioExisteArquivo = usuarios.some((usuarioArquivo) => usuarioArquivo.id  === usuario.id); //some faz o equivalente ao FOR
        if (usuarioExisteArquivo) {
            console.log(`Usuário informado "${usuario.login}" já existe e não será gravado no arquivo.`);
            return;
        }       

        usuarios.push(usuario);

        await writeFile(`./database.json`, JSON.stringify(usuarios), {
            encoding: "utf-8",
        });
        
        console.log(`Usuário "${usuario.login}" de "${usuario.name ? usuario.name : "-Nome não informado-"}" incluído no arquivo com sucesso!`);
}

async function main(){
    const interfaceConsole = createInterface(stdin, stdout);

    try {
        console.log("\n________________________\n ");
        console.log(  "BUSCA DE USUÁRIOS GITHUB   ");
        console.log("\n________________________\n ");

        const respostaOperacao = await interfaceConsole.question("Digite o nome do usuário no GITHUB:\n");

        const nomeUsuario = validaUsuario(respostaOperacao);
                
        const usuario = await buscarPerfil(nomeUsuario);   
        
        const respostaGravar = await interfaceConsole.question(`Usuário "${usuario.login}" encontrado no Github. Deseja gravá-lo no arquivo? (Digite: S ou N):\n`);

        if (respostaGravar.trim().toUpperCase() !== "S") {//somente vai aceitar S ou N, nada mais
            console.log("Você optou por não gravar o usuário. Operação finalizada.");
            return;
        }       
        
        await salvarArquivo(usuario);
    
    } catch (error) {
        console.log("\nFalha ao realizar o processo: " + error.message);
    } finally {
        interfaceConsole.close();
    }
}

main();

// O programa deve pedir um usuário ok
// Caso o usuário Não exista, ou a requisição de busca falhe, o programa deve tratar os erros corretamente e mostrar ao usuário a mensagem adequada ok
// Se o usuário for encontrado, deve ser mostrado na tela (terminal), o nome e o username ok
// Perguntar ao usuário se deseja salvar ok
// Não poderá salvar usuários repetidos ok
// Não deverá sobrescrever usuários já existentes ok

//validar o tipo de informação repassada ok
//validar se foi digitado alguma coisa ok
//validar o tipo de retorno para gravar ok