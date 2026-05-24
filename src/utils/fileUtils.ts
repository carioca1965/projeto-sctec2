import {
    readFile,
    writeFile
} from "node:fs/promises";

import { UsuarioGithub }
from "../interfaces/UsuarioGithub";

export async function lerArquivo():
Promise<UsuarioGithub[]> {

    try {

        const usuariosText =
            await readFile(
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
            "Arquivo corrompido."
        );
    }
}

export async function salvarArquivo(
    usuario: UsuarioGithub
): Promise<void> {

    const usuarios =
        await lerArquivo();

    const usuarioExisteArquivo =
        usuarios.some(
            (usuarioArquivo) =>
                usuarioArquivo.id === usuario.id
        );

    if (usuarioExisteArquivo) {

        console.log(
            `Usuário "${usuario.login}" já existe.`
        );

        return;
    }

    usuarios.push(usuario);

    await writeFile(
        "./database.json",
        JSON.stringify(
            usuarios,
            null,
            2
        ),
        {
            encoding: "utf-8"
        }
    );

    console.log(
        `Usuário "${usuario.login}" salvo com sucesso!`
    );
}