import { stdin, stdout } from "process";
import { createInterface } from "node:readline/promises";
import { readFile, writeFile } from "node:fs/promises";

interface UsuarioGithub {
    id: number;
    login: string;
    name: string | null;
    html_url: string;
    public_repos: number;
    followers: number;
}

function validaUsuario(nomeUsuario: string): string {
    nomeUsuario = nomeUsuario.trim();

    if (nomeUsuario === "") {
        throw new Error("Um nome de usuário deve ser informado.");
    }

    const usuarioRegex =
        /^(?!.*--)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

    if (!usuarioRegex.test(nomeUsuario)) {
        throw new Error("Nome de usuário inválido.");
    }

    return nomeUsuario;
}

async function buscarPerfil(
    username: string
): Promise<UsuarioGithub> {
    const urlBase = "https://api.github.com/users/";

    try {
        const response = await fetch(`${urlBase}${username}`, {
            headers: {
                "User-Agent": "carioca1965"
            }
        });

        switch (response.status) {
            case 200:
                return (await response.json()) as UsuarioGithub;

            case 400:
                throw new Error("Requisição inválida.");

            case 404:
                throw new Error(
                    `Usuário "${username}" não encontrado no GitHub.`
                );

            default:
                throw new Error(
                    `Erro ao buscar usuário: ${response.status} ${response.statusText}`
                );
        }

    } catch (error: any) {

        if (error.name === "TypeError") {
            throw new Error(
                "Erro de conexão com o GitHub."
            );
        }

        throw error;
    }
}

async function lerArquivo(): Promise<UsuarioGithub[]> {

    try {

        const usuariosText = await readFile(
            "./database.json",
            {
                encoding: "utf-8"
            }
        );

        return JSON.parse(usuariosText);

    } catch (error: any) {

        if (error.code === "ENOENT") {
            return [];
        }

        throw new Error(
            "Arquivo corrompido. Não foi possível ler os dados."
        );
    }
}

async function salvarArquivo(
    usuario: UsuarioGithub
): Promise<void> {

    const usuarios = await lerArquivo();

    const usuarioExisteArquivo = usuarios.some(
        (usuarioArquivo) =>
            usuarioArquivo.id === usuario.id
    );

    if (usuarioExisteArquivo) {

        console.log(
            `Usuário "${usuario.login}" já existe no arquivo.`
        );

        return;
    }

    usuarios.push({
        id: usuario.id,
        login: usuario.login,
        name: usuario.name,
        html_url: usuario.html_url,
        public_repos: usuario.public_repos,
        followers: usuario.followers
    });

    await writeFile(
        "./database.json",
        JSON.stringify(usuarios, null, 2),
        {
            encoding: "utf-8"
        }
    );

    console.log(
        `\nUsuário "${usuario.login}" salvo com sucesso!`
    );
}

async function main(): Promise<void> {

    const interfaceConsole = createInterface({
        input: stdin,
        output: stdout
    });

    try {

        console.log("\n===============================");
        console.log(" BUSCA DE USUÁRIOS GITHUB ");
        console.log("===============================\n");

        const respostaOperacao =
            await interfaceConsole.question(
                "Digite o nome do usuário no GitHub:\n"
            );

        const nomeUsuario =
            validaUsuario(respostaOperacao);

        const usuario =
            await buscarPerfil(nomeUsuario);

        console.log("\nUsuário encontrado:\n");

        console.log(
            `Nome: ${usuario.name ?? "Não informado"}`
        );

        console.log(
            `Login: ${usuario.login}`
        );

        console.log(
            `GitHub: ${usuario.html_url}`
        );

        console.log(
            `Repositórios Públicos: ${usuario.public_repos}`
        );

        console.log(
            `Seguidores: ${usuario.followers}`
        );

        const respostaGravar =
            await interfaceConsole.question(
                "\nDeseja salvar este usuário no arquivo? (S/N):\n"
            );

        const resposta =
            respostaGravar.trim().toUpperCase();

        if (resposta !== "S" && resposta !== "N") {
            throw new Error(
                "Resposta inválida. Digite apenas S ou N."
            );
        }

        if (resposta === "N") {

            console.log(
                "\nOperação finalizada sem salvar."
            );

            return;
        }

        await salvarArquivo(usuario);

    } catch (error: any) {

        console.log(
            `\nFalha ao realizar o processo: ${error.message}`
        );

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