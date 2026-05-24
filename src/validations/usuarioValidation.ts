export function validaUsuario(
    nomeUsuario: string
): string {

    nomeUsuario = nomeUsuario.trim();

    if (nomeUsuario === "") {

        throw new Error(
            "Um nome de usuário deve ser informado."
        );
    }

    const usuarioRegex =
        /^(?!.*--)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

    if (!usuarioRegex.test(nomeUsuario)) {

        throw new Error(
            "Nome de usuário inválido."
        );
    }

    return nomeUsuario;
}