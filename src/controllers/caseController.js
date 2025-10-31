import {
  fetchActiveCases,
  fetchCurrentUserProfile,
  fetchCaseDetailsById,
  fetchSightingsByCaseId,
  fetchCommentsByCaseId,
  addComment,
  addSighting,
  addReport,
  deleteComment,
  deleteSighting 
} from '../models/dao/CaseDao.js';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';

/** Calcula a diferença em dias entre duas datas. */
const calculateDaysDifference = (date1, date2) => {
  const diffTime = Math.abs(date1 - date2);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/** Obtém a lista de casos ativos processados para a HomeScreen. */
export const getActiveCasesForHome = async () => {
  try {
    const cases = await fetchActiveCases();
    if (!cases) return [];
    const processedCases = cases.map(caso => ({ ...caso, diasDesaparecido: calculateDaysDifference(new Date(), new Date(caso.data_desaparecimento)) }));
    return processedCases;
  } catch (error) { throw error; }
};

/** Busca o status de verificação e o ID do perfil do usuário logado. */
export const getCurrentUserStatusAndProfileId = async () => {
  try {
    const profile = await fetchCurrentUserProfile();
    if (!profile) { return { isVerified: false, profileId: null }; }
    return { isVerified: profile.status_verificacao === 'APROVADO', profileId: profile.id };
  } catch (error) { throw error; }
};

/**
 * Obtém os detalhes completos de um caso.
 * Agora busca os avistamentos com base no ID do usuário.
 */
export const getCaseDetails = async (caseId, usuarioId) => {
  try {
    // Busca os dados em paralelo
    const [caseDetails, sightings, comments] = await Promise.all([
      fetchCaseDetailsById(caseId),
      fetchSightingsByCaseId(caseId, usuarioId), // Passa o usuarioId para o DAO
      fetchCommentsByCaseId(caseId)
    ]);

    let processedCaseDetails = caseDetails;
    if (caseDetails) {
        processedCaseDetails = { ...caseDetails, diasDesaparecido: calculateDaysDifference(new Date(), new Date(caseDetails.data_desaparecimento)) };
    }
    return { caseDetails: processedCaseDetails, sightings: sightings || [], comments: comments || [] };
  } catch (error) {
    throw error;
  }
};

/** Cria um novo comentário. */
export const createComment = async (caseId, autorId, conteudo) => {
  if (!conteudo || conteudo.trim() === '') { throw new Error('O comentário não pode estar vazio.'); }
  if (!caseId || !autorId) { throw new Error('Dados insuficientes para criar comentário.'); }
  try { return await addComment(caseId, autorId, conteudo); }
  catch (error) { throw error; }
};

/** Cria um novo avistamento. */
export const createSighting = async (sightingData) => {
  const { caseId, usuarioId, descricao, imageBase64, location, dataAvistamento } = sightingData;
  if (!caseId || !usuarioId || !descricao || !location || !dataAvistamento) { throw new Error('Dados insuficientes. Localização, data e descrição são obrigatórios.'); }

  let fotoUrl = null;
  if (imageBase64) {
    try {
      const fileExt = 'jpg';
      const fileName = `${usuarioId}/${caseId}_${Date.now()}.${fileExt}`;
      const arrayBuffer = decode(imageBase64); 
      const { data: uploadData, error: uploadError } = await supabase.storage.from('avistamentos').upload(fileName, arrayBuffer, { contentType: 'image/jpeg', upsert: false });
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage.from('avistamentos').getPublicUrl(uploadData.path);
      fotoUrl = publicUrlData.publicUrl;
    } catch (uploadError) {
      throw new Error(`Erro ao fazer upload da foto: ${uploadError.message}`);
    }
  }

  const locationString = `POINT(${location.longitude} ${location.latitude})`;

  try {
    return await addSighting({ caseId, usuarioId, descricao, fotoUrl, dataAvistamento, locationString });
  } catch (dbError) { throw dbError; }
};

/**
 * Cria uma nova denúncia.
 * @param {'CASO' | 'COMENTARIO' | 'USUARIO'} tipo - O tipo de conteúdo
 * @param {string} idConteudo - O UUID do conteúdo a ser denunciado
 * @param {string} motivo - A razão da denúncia
 * @param {string} denuncianteId - O ID do perfil ('usuarios') de quem denuncia
 */
export const reportContent = async (tipo, idConteudo, motivo, denuncianteId) => {
  if (!tipo || !idConteudo || !motivo || !denuncianteId) {
    throw new Error('Dados insuficientes para criar denúncia.');
  }
  try {
    return await addReport({
      denunciante_id: denuncianteId,
      tipo_conteudo: tipo,
      id_conteudo: idConteudo,
      motivo: motivo
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Exclui um comentário do usuário.
 */
export const deleteUserComment = async (commentId, autorId) => {
  try {
    return await deleteComment(commentId, autorId);
  } catch (error) {
    throw error;
  }
};

/**
 * Exclui um avistamento do usuário.
 */
export const deleteUserSighting = async (sightingId, autorId) => {
  try {
    return await deleteSighting(sightingId, autorId);
  } catch (error) {
    throw error;
  }
};