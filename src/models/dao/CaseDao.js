import { supabase } from "../../lib/supabase";

/**
 * Busca casos ativos no banco de dados Supabase para a HomeScreen.
 */
export const fetchActiveCases = async () => {
  const { data, error } = await supabase.from('casos').select('id, nome_desaparecido, data_desaparecimento, endereco_desaparecimento_formatado, midias_urls, caracteristicas').eq('status', 'ATIVO').order('created_at', { ascending: false });
  if (error) { console.error("DAO: Erro ao buscar casos ativos:", error.message); throw new Error(`Erro ao buscar casos ativos: ${error.message}`); }
  return data;
};

/**
 * Busca o ID do perfil e o status de verificação do usuário logado.
 */
export const fetchCurrentUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { console.log("DAO: Nenhum usuário logado."); return null; }
  const { data: profile, error } = await supabase.from('usuarios').select('id, status_verificacao').eq('auth_user_id', user.id).single();
  if (error) { console.error("DAO: Erro ao buscar perfil de usuário:", error.message); return null; }
  return profile;
};

/**
 * Busca os detalhes completos de um caso específico pelo ID.
 */
export const fetchCaseDetailsById = async (caseId) => {
  if (!caseId) throw new Error("ID do caso é inválido.");
  const { data, error } = await supabase.from('casos').select(`*, usuarios ( nome_completo )`).eq('id', caseId).single();
  if (error) {
    if (error.code === 'PGRST116') { throw new Error(`Caso com ID ${caseId} não encontrado.`); }
    throw new Error(`Erro ao buscar detalhes do caso: ${error.message}`);
  }
  return data;
};

/**
 * Busca avistamentos de um caso.
 * - Todos os 'VALIDADO'.
 * - 'PENDENTE' ou 'REJEITADO' apenas se pertencerem ao usuário logado.
 * @param {string} caseId O UUID do caso.
 * @param {string} usuarioId O UUID do usuário logado (da tabela 'usuarios').
 * @returns {Promise<Array|null>} Lista de avistamentos.
 */
export const fetchSightingsByCaseId = async (caseId, usuarioId) => {
  if (!caseId) throw new Error("ID do caso é inválido.");

  let query = supabase
    .from('avistamentos')
    .select(`*, usuarios ( nome_completo )`)
    .eq('caso_id', caseId);

  if (usuarioId) {
    // Se o usuário está logado, busca (VALIDADO) OU (seus próprios PENDENTE/REJEITADO)
    query = query.or(
      `status.eq.VALIDADO,and(usuario_id.eq.${usuarioId},status.in.(PENDENTE,REJEITADO))`
    );
  } else {
    // Se for visitante, busca apenas VALIDADOS
    query = query.eq('status', 'VALIDADO');
  }

  const { data, error } = await query.order('data_avistamento', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar avistamentos: ${error.message}`);
  }
  return data;
};

/**
 * Busca todos os comentários associados a um caso.
 */
export const fetchCommentsByCaseId = async (caseId) => {
  if (!caseId) throw new Error("ID do caso é inválido.");
  const { data, error } = await supabase.from('comentarios').select(`*, usuarios ( nome_completo, foto_perfil_url )`).eq('caso_id', caseId).order('created_at', { ascending: true });
  if (error) { throw new Error(`Erro ao buscar comentários: ${error.message}`); }
  return data;
};

/**
 * Adiciona um novo comentário a um caso.
 */
export const addComment = async (caseId, autorId, conteudo) => {
  if (!caseId || !autorId || !conteudo) { throw new Error('Dados insuficientes para adicionar comentário.'); }
  const { data, error } = await supabase.from('comentarios').insert([{ caso_id: caseId, autor_id: autorId, conteudo: conteudo, is_atualizacao_oficial: false }]).select('*, usuarios ( nome_completo, foto_perfil_url )').single();
  if (error) { throw new Error(`Erro ao adicionar comentário: ${error.message}`); }
  return data;
};

/**
 * Adiciona um novo avistamento com status 'PENDENTE'.
 */
export const addSighting = async (sightingData) => {
  const { data, error } = await supabase.from('avistamentos').insert([{ caso_id: sightingData.caseId, usuario_id: sightingData.usuarioId, localizacao_avistamento: sightingData.locationString, descricao: sightingData.descricao, foto_url: sightingData.fotoUrl, data_avistamento: sightingData.dataAvistamento, status: 'PENDENTE' }]).select().single();
  if (error) { throw new Error(`Erro ao salvar avistamento: ${error.message}`); }
  return data;
};

/**
 * Adiciona uma nova denúncia.
 * @param {object} reportData - { denunciante_id, tipo_conteudo, id_conteudo, motivo }
 */
export const addReport = async (reportData) => {
  const { error } = await supabase.from('denuncias').insert([
    {
      denunciante_id: reportData.denunciante_id,
      tipo_conteudo: reportData.tipo_conteudo,
      id_conteudo: reportData.id_conteudo,
      motivo: reportData.motivo,
      status: 'ABERTA'
    }
  ]);
  if (error) { throw new Error(`Erro ao criar denúncia: ${error.message}`); }
  return true;
};

/**
 * Exclui um comentário.
 * @param {string} commentId - ID do comentário
 * @param {string} autorId - ID do usuário que está tentando excluir
 */
export const deleteComment = async (commentId, autorId) => {
  const { error } = await supabase.from('comentarios')
    .delete()
    .eq('id', commentId)
    .eq('autor_id', autorId); // Garante que só o autor pode excluir

  if (error) { throw new Error(`Erro ao excluir comentário: ${error.message}`); }
  return true;
};

/**
 * Exclui um avistamento.
 * @param {string} sightingId - ID do avistamento
 * @param {string} autorId - ID do usuário que está tentando excluir
 */
export const deleteSighting = async (sightingId, autorId) => {
  const { error } = await supabase.from('avistamentos')
    .delete()
    .eq('id', sightingId)
    .eq('usuario_id', autorId); // Garante que só o autor pode excluir

  if (error) { throw new Error(`Erro ao excluir avistamento: ${error.message}`); }
  return true;
};