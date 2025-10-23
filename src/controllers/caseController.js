import {
  fetchActiveCases,
  fetchCaseDetailsById,
  fetchSightingsByCaseId,
  fetchCommentsByCaseId
} from '../models/dao/CaseDao.js';

/** Calcula a diferença em dias entre duas datas. */
const calculateDaysDifference = (date1, date2) => {
  const diffTime = Math.abs(date1 - date2);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/** Obtém a lista de casos ativos processados para a HomeScreen. */
export const getActiveCasesForHome = async () => {
  console.log("Controller: Solicitando casos ativos...");
  try {
    const cases = await fetchActiveCases();
    if (!cases) return [];

    const processedCases = cases.map(caso => {
      const disappearanceDate = new Date(caso.data_desaparecimento);
      const today = new Date();
      return { ...caso, diasDesaparecido: calculateDaysDifference(today, disappearanceDate) };
    });
    console.log("Controller: Casos processados para a Home.");
    return processedCases;
  } catch (error) {
    console.error("Controller: Erro ao obter casos para Home:", error.message);
    throw error;
  }
};

/**
 * Obtém os detalhes completos de um caso, incluindo avistamentos e comentários.
 * @param {string} caseId O UUID do caso.
 * @returns {Promise<object>} Um objeto contendo { caseDetails, sightings, comments }.
 * @throws {Error} Lança um erro se alguma das buscas no DAO falhar.
 */
export const getCaseDetails = async (caseId) => {
  console.log(`Controller: Solicitando detalhes para o caso ID: ${caseId}`);
  try {
    // Busca os dados em paralelo para otimizar
    const [caseDetails, sightings, comments] = await Promise.all([
      fetchCaseDetailsById(caseId),
      fetchSightingsByCaseId(caseId),
      fetchCommentsByCaseId(caseId)
    ]);

    // Calcula dias desaparecido para este caso específico
    let processedCaseDetails = caseDetails;
    if (caseDetails) {
        const disappearanceDate = new Date(caseDetails.data_desaparecimento);
        const today = new Date();
        processedCaseDetails = {
            ...caseDetails,
            diasDesaparecido: calculateDaysDifference(today, disappearanceDate)
        };
    }

    console.log(`Controller: Detalhes completos obtidos para o caso ${caseId}.`);
    return {
      caseDetails: processedCaseDetails,
      sightings: sightings || [], // Garante que seja sempre um array
      comments: comments || []   // Garante que seja sempre um array
    };

  } catch (error) {
    console.error(`Controller: Erro ao obter detalhes do caso ${caseId}:`, error.message);
    throw error; // Re-lança para ser tratado pela View
  }
};