import { supabase } from "../lib/supabase";

export const signIn = async (email, password) => {
  // console.log("Tentando fazer login com:", { email });
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Erro no supabase.auth.signInWithPassword:", error);
    throw new Error(error.message);
  }

  if (!data.session) {
    console.error("Login falhou: Nenhuma sessão retornada.");
    throw new Error("Login failed: No session returned.");
  }

  // console.log("Login bem-sucedido, sessão:", data.session);
  return data;
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    console.error("Erro ao autenticar com Google:", error.message);
    throw error;
  }

  return data;
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
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
    console.error("Erro no supabase.auth.signUp:", authError);
    throw new Error(authError.message);
  }

  if (!authData.user) {
    console.error("Falha na autenticação: Nenhum usuário retornado após signUp.");
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
    console.error("Erro ao inserir usuário no banco de dados:", dbError);
    throw new Error(dbError.message);
  }

  console.log("Usuário inserido com sucesso na tabela 'usuarios'.");
  return authData;
};

export const sendPasswordResetEmail = async (email) => {
  console.log(`Solicitando redefinição de senha para: ${email}`);
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.error("Erro ao enviar e-mail de redefinição de senha:", error);
    throw new Error(error.message);
  }

  console.log("E-mail de redefinição de senha enviado com sucesso.");
};

export const updateUserPassword = async (newPassword) => {
  console.log("Atualizando a senha do usuário...");
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    console.error("Erro ao atualizar a senha:", error);
    throw new Error(error.message);
  }

  console.log("Senha atualizada com sucesso.");
};