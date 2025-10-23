import { supabase } from '../../lib/supabase';

/**
 * Busca casos ativos no banco de dados Supabase para a HomeScreen.
 */
export const fetchActiveCases = async () => {
  console.log("DAO: Buscando casos ativos...");
  const { data, error } = await supabase
    .from('casos')
    .select(`
      id,
      nome_desaparecido,
      data_desaparecimento,
      endereco_desaparecimento_formatado,
      midias_urls,
      caracteristicas
    `)
    .eq('status', 'ATIVO')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("DAO: Erro ao buscar casos ativos:", error.message);
    throw new Error(`Erro ao buscar casos ativos: ${error.message}`);
  }
  console.log("DAO: Casos ativos encontrados:", data ? data.length : 0);
  return data;
};

/**
 * Busca os detalhes completos de um caso específico pelo ID.
 * @param {string} caseId O UUID do caso.
 * @returns {Promise<object|null>} Detalhes do caso ou null se não encontrado/erro.
 * @throws {Error} Lança um erro se a consulta falhar.
 */
export const fetchCaseDetailsById = async (caseId) => {
  console.log(`DAO: Buscando detalhes do caso ID: ${caseId}`);
  if (!caseId) throw new Error("ID do caso é inválido.");

  const { data, error } = await supabase
    .from('casos')
    .select(`
      *,
      usuarios ( nome_completo )
    `) // Pega todos os campos do caso e o nome do autor
    .eq('id', caseId)
    .single(); // Espera apenas um resultado

  if (error) {
    console.error(`DAO: Erro ao buscar detalhes do caso ${caseId}:`, error.message);
    // Trata erro de "nenhuma linha" como "não encontrado"
    if (error.code === 'PGRST116') {
        throw new Error(`Caso com ID ${caseId} não encontrado.`);
    }
    throw new Error(`Erro ao buscar detalhes do caso: ${error.message}`);
  }
  console.log(`DAO: Detalhes do caso ${caseId} encontrados.`);
  return data;
};

/**
 * Busca todos os avistamentos associados a um caso específico.
 * @param {string} caseId O UUID do caso.
 * @returns {Promise<Array|null>} Lista de avistamentos ou null em caso de erro.
 * @throws {Error} Lança um erro se a consulta falhar.
 */
export const fetchSightingsByCaseId = async (caseId) => {
  console.log(`DAO: Buscando avistamentos para o caso ID: ${caseId}`);
   if (!caseId) throw new Error("ID do caso é inválido.");

  const { data, error } = await supabase
    .from('avistamentos')
    .select(`
      *,
      usuarios ( nome_completo )
    `) // Pega dados do avistamento e nome do usuário que reportou (se houver)
    .eq('caso_id', caseId)
    .order('data_avistamento', { ascending: false }); // Ordena pelos mais recentes

  if (error) {
    console.error(`DAO: Erro ao buscar avistamentos do caso ${caseId}:`, error.message);
    throw new Error(`Erro ao buscar avistamentos: ${error.message}`);
  }
  console.log(`DAO: Avistamentos encontrados para ${caseId}:`, data ? data.length : 0);
  return data;
};

/**
 * Busca todos os comentários associados a um caso específico.
 * @param {string} caseId O UUID do caso.
 * @returns {Promise<Array|null>} Lista de comentários ou null em caso de erro.
 * @throws {Error} Lança um erro se a consulta falhar.
 */
export const fetchCommentsByCaseId = async (caseId) => {
  console.log(`DAO: Buscando comentários para o caso ID: ${caseId}`);
   if (!caseId) throw new Error("ID do caso é inválido.");
     
  const { data, error } = await supabase
    .from('comentarios')
    .select(`
      *,
      usuarios ( nome_completo, foto_perfil_url )
    `) // Pega dados do comentário e nome/foto do autor
    .eq('caso_id', caseId)
    .order('created_at', { ascending: true }); // Ordena do mais antigo para o mais novo (timeline)

  if (error) {
    console.error(`DAO: Erro ao buscar comentários do caso ${caseId}:`, error.message);
    throw new Error(`Erro ao buscar comentários: ${error.message}`);
  }
  console.log(`DAO: Comentários encontrados para ${caseId}:`, data ? data.length : 0);
  return data;
};