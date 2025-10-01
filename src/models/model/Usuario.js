
class Usuario {
    constructor(id, auth_user_id, nome_completo, email, telefone, foto_perfil_url, endereco_bairro, endereco_cidade, endereco_estado) {
        this.id = id;
        this.auth_user_id = auth_user_id;
        this.nome_completo = nome_completo;
        this.email = email;
        this.telefone = telefone;
        this.foto_perfil_url = foto_perfil_url;
        this.endereco_bairro = endereco_bairro;
        this.endereco_cidade = endereco_cidade;
        this.endereco_estado = endereco_estado;
    }
}

export default Usuario;
