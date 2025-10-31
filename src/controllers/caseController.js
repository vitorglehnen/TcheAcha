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
  deleteSighting,
  fetchCasesByAutorId,
  fetchPendingSightingsForAutor,
  updateSightingStatus,
  updateCaseStatus,
  createCase,
  updateCase 
} from '../models/dao/CaseDao';
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
    const processedCases = cases.map(caso => {
      const disappearanceDate = new Date(caso.data_desaparecimento);
      const today = new Date();
      return { ...caso, diasDesaparecido: calculateDaysDifference(today, disappearanceDate) };
    });
    return processedCases;
  } catch (error) {
    console.error("Controller: Erro ao obter casos para Home:", error.message);
    throw error;
  }
};

/** Busca o status de verificação e o ID do perfil do usuário logado. */
export const getCurrentUserStatusAndProfileId = async () => {
  try {
    const profile = await fetchCurrentUserProfile();
    if (!profile) { return { isVerified: false, profileId: null }; }
    return { isVerified: profile.status_verificacao === 'APROVADO', profileId: profile.id };
  } catch (error) {
    console.error("Controller: Erro ao buscar status do usuário:", error.message);
    throw error;
  }
};

/** Obtém os detalhes completos de um caso. */
export const getCaseDetails = async (caseId, usuarioId) => {
  console.log(`Controller: Solicitando detalhes para o caso ID: ${caseId}, Usuário ID: ${usuarioId}`);
  try {
    const [caseDetails, sightings, comments] = await Promise.all([
      fetchCaseDetailsById(caseId),
      fetchSightingsByCaseId(caseId, usuarioId),
      fetchCommentsByCaseId(caseId)
    ]);
    let processedCaseDetails = caseDetails;
    if (caseDetails) {
        processedCaseDetails = { ...caseDetails, diasDesaparecido: calculateDaysDifference(new Date(), new Date(caseDetails.data_desaparecimento)) };
    }
    return { caseDetails: processedCaseDetails, sightings: sightings || [], comments: comments || [] };
  } catch (error) {
    console.error(`Controller: Erro ao obter detalhes do caso ${caseId}:`, error.message);
    throw error;
  }
};

/** Cria um novo comentário. */
export const createComment = async (caseId, autorId, conteudo) => {
  if (!conteudo || conteudo.trim() === '') { throw new Error('O comentário não pode estar vazio.'); }
  if (!caseId || !autorId) { throw new Error('Dados insuficientes para criar comentário.'); }
  try {
    return await addComment(caseId, autorId, conteudo);
  } catch (error) {
    console.error("Controller: Erro ao criar comentário:", error.message);
    throw error;
  }
};

/** Cria um novo avistamento. */
export const createSighting = async (sightingData) => {
  const { caseId, usuarioId, descricao, imageBase64, location, dataAvistamento } = sightingData;
  if (!caseId || !usuarioId || !descricao || !location || !dataAvistamento) {
    throw new Error('Dados insuficientes. Localização, data e descrição são obrigatórios.');
  }

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
      console.error("Controller: Erro no upload da imagem:", uploadError.message);
      throw new Error(`Erro ao fazer upload da foto: ${uploadError.message}`);
    }
  }

  const locationString = `POINT(${location.longitude} ${location.latitude})`;

  try {
    return await addSighting({ caseId, usuarioId, descricao, fotoUrl, dataAvistamento, locationString });
  } catch (dbError) {
    console.error("Controller: Erro ao salvar avistamento no BD:", dbError.message);
    throw dbError;
  }
};

/** Cria uma nova denúncia. */
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
    console.error("Controller: Erro ao criar denúncia:", error.message);
    throw error;
  }
};

/** Exclui um comentário do usuário. */
export const deleteUserComment = async (commentId, autorId) => {
  try {
    return await deleteComment(commentId, autorId);
  } catch (error) {
    console.error("Controller: Erro ao excluir comentário:", error.message);
    throw error;
  }
};

/** Exclui um avistamento do usuário. */
export const deleteUserSighting = async (sightingId, autorId) => {
  try {
    return await deleteSighting(sightingId, autorId);
  } catch (error) {
    console.error("Controller: Erro ao excluir avistamento:", error.message);
    throw error;
  }
};

/** Busca os dados para o dashboard "Gerenciar Casos". */
export const getCasesDashboardData = async (autorId) => {
  if (!autorId) throw new Error("ID do autor é inválido para buscar dados.");
  try {
    const [myCases, pendingSightings] = await Promise.all([
      fetchCasesByAutorId(autorId),
      fetchPendingSightingsForAutor(autorId)
    ]);
    return { myCases: myCases || [], pendingSightings: pendingSightings || [] };
  } catch (error) {
    console.error("Controller: Erro ao buscar dados do dashboard:", error.message);
    throw error;
  }
};

/** Aprova um avistamento pendente. */
export const approveSighting = async (sightingId) => {
  try {
    return await updateSightingStatus(sightingId, 'VALIDADO');
  } catch (error) {
    console.error("Controller: Erro ao aprovar avistamento:", error.message);
    throw error;
  }
};

/** Rejeita um avistamento pendente. */
export const rejectSighting = async (sightingId) => {
  try {
    return await updateSightingStatus(sightingId, 'REJEITADO');
  } catch (error) {
    console.error("Controller: Erro ao rejeitar avistamento:", error.message);
    throw error;
  }
};

/** Marca um caso como ENCONTRADO. */
export const markCaseAsFound = async (caseId) => {
  try {
    return await updateCaseStatus(caseId, 'ENCONTRADO');
  } catch (error) {
    console.error("Controller: Erro ao marcar caso como encontrado:", error.message);
    throw error;
  }
};

/** Cancela (reabre) um caso. */
export const markCaseAsActive = async (caseId) => {
  try {
    return await updateCaseStatus(caseId, 'ATIVO');
  } catch (error) {
    console.error("Controller: Erro ao reabrir caso:", error.message);
    throw error;
  }
};

/** Faz o upload de uma imagem para o bucket 'casos' no Storage. */
export const uploadCaseMedia = async (imageBase64, autorId) => {
  console.log("Controller: Fazendo upload da mídia do caso...");
  if (!imageBase64 || !autorId) {
    throw new Error("Imagem ou ID do autor inválido para upload.");
  }
  try {
    const fileExt = 'jpg';
    const fileName = `public/${autorId}/${Date.now()}.${fileExt}`;
    const arrayBuffer = decode(imageBase64);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('casos') // Bucket de storage para mídias de casos
      .upload(fileName, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('casos')
      .getPublicUrl(uploadData.path);
    
    console.log("Controller: Upload de mídia concluído:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;

  } catch (error) {
    console.error("Controller: Erro no upload da mídia do caso:", error.message);
    throw new Error(`Erro ao fazer upload da mídia: ${error.message}`);
  }
};

/** Salva um caso (cria um novo ou atualiza um existente). */
export const saveCase = async (formData, existingCase, userProfile) => {
  console.log("Controller: Salvando caso...");
  const { profileId, isVerified } = userProfile;

  if (!isVerified) { throw new Error("Usuário não verificado."); }
  if (!formData.title || !formData.name || !formData.description || !formData.contact || !formData.location || !formData.date) {
    throw new Error("Por favor, preencha todos os campos obrigatórios.");
  }

  let mediaUrls = existingCase?.midias_urls || [];

  if (formData.imageBase64) {
    try {
      const newImageUrl = await uploadCaseMedia(formData.imageBase64, profileId);
      mediaUrls = [newImageUrl];
    } catch (error) {
      throw error;
    }
  }

  let locationString = 'POINT(0 0)'; // Ponto padrão caso a formatação falhe
  const parts = formData.location.split(',');
  if (parts.length === 2) {
      const lat = parts[0].trim();
      const lon = parts[1].trim();
      locationString = `POINT(${lon} ${lat})`;
  } else {
      console.warn(`Formato de localização inválido: "${formData.location}". Usando POINT(0 0).`);
  }

  const caseData = {
    titulo: formData.title,
    tipo: formData.type,
    status: formData.status,
    nome_desaparecido: formData.name,
    caracteristicas: { info: formData.characteristics },
    descricao: formData.description,
    localizacao_desaparecimento: locationString,
    endereco_desaparecimento_formatado: formData.enderecoFormatado,
    data_desaparecimento: formData.date.toISOString(),
    contato_publico: formData.contact,
    midias_urls: mediaUrls,
    autor_id: profileId,
  };

  try {
    if (existingCase) {
      delete caseData.autor_id;
      const updatedCase = await updateCase(existingCase.id, caseData);
      return updatedCase;
    } else {
      const newCase = await createCase(caseData);
      return newCase;
    }
  } catch (dbError) {
    throw dbError;
  }
};