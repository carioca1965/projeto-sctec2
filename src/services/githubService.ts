import { UsuarioGithub }
from "../interfaces/UsuarioGithub";

export async function buscarPerfil(
    username: string
): Promise<UsuarioGithub> {

    const urlBase =
        "https://api.github.com/users/";

    try {

        const response = await fetch(
            `${urlBase}${username}`,
            {
                headers: {
                    "User-Agent": "carioca1965"
                }
            }
        );

        switch (response.status) {

            case 200:

                return (
                    await response.json()
                ) as UsuarioGithub;

            case 404:

                throw new Error(
                    `Usuário "${username}" não encontrado.`
                );

            default:

                throw new Error(
                    `Erro ${response.status}`
                );
        }

    } catch (error: any) {

        if (error.name === "TypeError") {

            throw new Error(
                "Erro de conexão."
            );
        }

        throw error;
    }
}