import { supabase } from "../lib/supabase";
import { decode } from "base64-arraybuffer";

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.warn("Erro no supabase.auth.signInWithPassword:", error);
    throw new Error(error.message);
  }

  if (!data.session) {
    console.warn("Login falhou: Nenhuma sessão retornada.");
    throw new Error("Login failed: No session returned.");
  }

  return data;
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const getUserData = async () => {
  try {
    // Primeiro, obtém o usuário autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn("Erro ao obter usuário autenticado:", authError);
      throw new Error("Usuário não autenticado");
    }

    // Busca os dados completos do usuário na tabela usuarios
    const { data: userData, error: dbError } = await supabase
      .from("usuarios")
      .select("*, role")
      .eq("auth_user_id", user.id)
      .single();

    if (dbError) {
      console.warn("Erro ao buscar dados do usuário:", dbError);
      throw new Error(dbError.message);
    }

    console.log(
      "Dados do usuário obtidos:",
      userData.nome_completo,
      "Role:",
      userData.role
    );
    return userData;
  } catch (error) {
    console.warn("Erro em getUserData:", error);
    throw error;
  }
};

export const updateUserProfile = async (updates) => {
  try {
    // Obtém o usuário autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn("Erro ao obter usuário autenticado:", authError);
      throw new Error("Usuário não autenticado");
    }

    // Atualiza os dados na tabela usuarios
    const { data, error: updateError } = await supabase
      .from("usuarios")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("auth_user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.warn("Erro ao atualizar perfil do usuário:", updateError);
      throw new Error(updateError.message);
    }

    console.log("Perfil atualizado com sucesso:", data);
    // Retorna os dados do perfil E o email do auth.user
    return { ...data, email: user.email };
  } catch (error) {
    console.warn("Erro em updateUserProfile:", error);
    throw error;
  }
};

/**
 * Faz upload da foto de perfil e atualiza o 'foto_perfil_url'.
 * @param {string} imageBase64 - A imagem em formato base64.
 * @param {string} profileId - O ID do perfil do usuário (da tabela 'usuarios').
 */
export const uploadProfilePicture = async (imageBase64, profileId) => {
  console.log("Controller: Fazendo upload da foto de perfil...");
  if (!imageBase64 || !profileId) {
    throw new Error("Imagem ou ID do perfil inválido.");
  }

  try {
    const fileExt = "jpg";
    // Define um nome de arquivo único para o usuário, substituindo qualquer foto anterior
    const fileName = `public/${profileId}.${fileExt}`;
    const arrayBuffer = decode(imageBase64);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars") // Nome do seu Bucket no Storage
      .upload(fileName, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: true, // true = substitui o arquivo se já existir
      });

    if (uploadError) throw uploadError;

    // Obtém a URL pública da imagem (com um timestamp para evitar cache)
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(uploadData.path, {
        // Adiciona um timestamp para forçar o React Native a recarregar a imagem
        transform: { lastUpdated: Date.now() },
      });

    const newAvatarUrl = publicUrlData.publicUrl;
    console.log("Controller: Upload concluído, URL:", newAvatarUrl);

    // Salva a nova URL no perfil do usuário
    const updatedUser = await updateUserProfile({
      foto_perfil_url: newAvatarUrl,
    });
    return updatedUser;
  } catch (error) {
    console.error(
      "Controller: Erro no upload da foto de perfil:",
      error.message
    );
    throw new Error(`Erro ao fazer upload da foto: ${error.message}`);
  }
};

//Faz upload dos documentos de verificação (frente, verso, selfie)
//e atualiza as URLs na tabela 'usuarios'.
export const uploadVerificationDocuments = async (
  docFrenteBase64,
  docVersoBase64,
  selfieBase64,
  profileId
) => {
  console.log("Controller: Fazendo upload dos documentos de verificação...");
  if (!docFrenteBase64 || !docVersoBase64 || !selfieBase64 || !profileId) {
    throw new Error("Dados de verificação incompletos.");
  }

  try {
    const bucketName = "documentos_verificacao";
    const fileExt = "jpg";

    // Define os caminhos dos arquivos usando o profileId como pasta
    const selfieFileName = `${profileId}/selfie.${fileExt}`;
    const docFrenteFileName = `${profileId}/doc_frente.${fileExt}`;
    const docVersoFileName = `${profileId}/doc_verso.${fileExt}`;

    // Converte de base64 para ArrayBuffer
    const selfieBuffer = decode(selfieBase64);
    const docFrenteBuffer = decode(docFrenteBase64);
    const docVersoBuffer = decode(docVersoBase64);

    const uploadOptions = { contentType: "image/jpeg", upsert: true };

    // Faz os uploads em paralelo
    const [selfieUpload, frenteUpload, versoUpload] = await Promise.all([
      supabase.storage
        .from(bucketName)
        .upload(selfieFileName, selfieBuffer, uploadOptions),
      supabase.storage
        .from(bucketName)
        .upload(docFrenteFileName, docFrenteBuffer, uploadOptions),
      supabase.storage
        .from(bucketName)
        .upload(docVersoFileName, docVersoBuffer, uploadOptions),
    ]);

    if (selfieUpload.error) throw selfieUpload.error;
    if (frenteUpload.error) throw frenteUpload.error;
    if (versoUpload.error) throw versoUpload.error;

    // Obtém as URLs públicas (ou URLs assinadas, se preferir mais segurança)
    const { data: selfieUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(selfieUpload.data.path);
    const { data: frenteUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(frenteUpload.data.path);
    const { data: versoUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(versoUpload.data.path);

    const updates = {
      documento_verificacao_url: selfieUrlData.publicUrl,
      doc_frente_url: frenteUrlData.publicUrl,
      doc_verso_url: versoUrlData.publicUrl,
    };

    console.log("Controller: Caminhos salvos para atualização:", updates);

    // Salva as novas URLs no perfil do usuário
    await updateUserProfile(updates);
    return updates;
  } catch (error) {
    console.warn("Controller: Erro no upload dos documentos:", error.message);
    throw new Error(`Erro ao fazer upload: ${error.message}`);
  }
};

export const signUp = async (nome, email, senha) => {
  console.log("Iniciando processo de signUp para:", { email, nome });

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email,
    password: senha,
    options: {
      data: {
        full_name: nome,
      },
    },
  });

  if (authError) {
    console.warn("Erro no supabase.auth.signUp:", authError);
    throw new Error(authError.message);
  }

  if (!authData.user) {
    console.warn(
      "Falha na autenticação: Nenhum usuário retornado após signUp."
    );
    throw new Error("Authentication failed: No user data returned.");
  }

  console.log("Usuário criado no Auth, ID:", authData.user.id);
  console.log("Inserindo usuário na tabela 'usuarios'...");

  const { error: dbError } = await supabase.from("usuarios").insert([
    {
      auth_user_id: authData.user.id,
      nome_completo: nome,
      email: email,
    },
  ]);

  if (dbError) {
    console.warn("Erro ao inserir usuário no banco de dados:", dbError);
    throw new Error(dbError.message);
  }

  console.log("Usuário inserido com sucesso na tabela 'usuarios'.");
  return authData;
};

export const sendPasswordResetEmail = async (email) => {
  console.log(`Solicitando redefinição de senha para: ${email}`);
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.warn("Erro ao enviar e-mail de redefinição de senha:", error);
    throw new Error(error.message);
  }

  console.log("E-mail de redefinição de senha enviado com sucesso.");
};

export const updateUserPassword = async (newPassword) => {
  console.log("Atualizando a senha do usuário...");
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    console.warn("Erro ao atualizar a senha:", error);
    throw new Error(error.message);
  }

  console.log("Senha atualizada com sucesso.");
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.warn("Erro ao fazer logout:", error);
    throw error;
  }
};
