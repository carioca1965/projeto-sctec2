export interface UsuarioGithub {
    id: number;
    login: string;
    name: string | null;
    html_url: string;
    public_repos: number;
    followers: number;
}