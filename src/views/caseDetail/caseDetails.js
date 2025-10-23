import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./caseDetails.styles";
import Header from "../../components/header/Header";
import { useRoute } from "@react-navigation/native";
import { getCaseDetails } from "../../controllers/caseController";

// Componente TimelineItem (CORRIGIDO para mostrar Data e Hora)
const TimelineItem = ({ item, type }) => {
  const [expanded, setExpanded] = useState(false);
  const isSighting = type === 'sighting';
  const title = isSighting
    ? `Avistamento` // Simplificado, a data vai ao lado
    : `${item.usuarios?.nome_completo || 'Usuário Anônimo'} comentou`;
  const description = isSighting ? item.descricao : item.conteudo;
  const date = isSighting ? new Date(item.data_avistamento) : new Date(item.created_at);

  // Formata a data e hora
  const formattedDateTime = `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <TouchableOpacity
      style={styles.timelineItem}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.timelineHeader}>
        <Ionicons name={expanded ? "chevron-down" : "chevron-forward"} size={24} color="#ccc" />
        <Ionicons name={isSighting ? "eye-outline" : "chatbubble-outline"} size={20} style={{ marginHorizontal: 5 }} />
        <Text style={styles.timelineTitle}>{title}</Text>
        {/* Mostra a data e hora formatadas */}
        <Text style={styles.timelineDate}>{formattedDateTime}</Text>
      </View>
      {expanded && (
        <View style={styles.timelineContent}>
          <Text style={styles.timelineDescription}>{description || (isSighting ? 'Sem descrição adicional.' : '')}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const CaseDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const casoFromParams = route.params?.caso;

  const [caseDetails, setCaseDetails] = useState(casoFromParams || null);
  const [sightings, setSightings] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      const caseId = casoFromParams?.id;
      if (!caseId) {
          Alert.alert("Erro", "ID do caso não encontrado nos parâmetros.");
          setError("ID do caso não fornecido.");
          setLoading(false);
          return;
      }

      setLoading(true);
      setError(null);
      try {
        const { caseDetails: fetchedDetails, sightings: fetchedSightings, comments: fetchedComments } = await getCaseDetails(caseId);
        if (!fetchedDetails) throw new Error("Detalhes do caso não encontrados.");
        setCaseDetails(fetchedDetails);
        setSightings(fetchedSightings);
        setComments(fetchedComments);
      } catch (err) {
        setError(err.message);
        Alert.alert("Erro", `Não foi possível carregar os detalhes: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [casoFromParams?.id]);

  const timelineItems = [...sightings.map(s => ({ ...s, type: 'sighting', date: new Date(s.data_avistamento) })),
                         ...comments.map(c => ({ ...c, type: 'comment', date: new Date(c.created_at) }))]
                        .sort((a, b) => b.date - a.date);

  return (
    <View style={styles.container}>
      <Header
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
        showLogo={false}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 50 }} />
        ) : error ? (
          <Text style={{ textAlign: 'center', marginTop: 50, color: 'red' }}>{`Erro ao carregar: ${error}`}</Text>
        ) : caseDetails ? (
          <>
            {/* Card Principal */}
            <View style={styles.caseCard}>
              <View style={styles.cardHeader}>
                <Ionicons name={caseDetails.tipo === 'ANIMAL' ? "paw-outline" : "person-outline"} size={24} color="#1A233D" />
                <Text style={styles.caseName}>{caseDetails.nome_desaparecido}</Text>
                <View style={[styles.statusBadge, { backgroundColor: caseDetails.status === 'ATIVO' ? '#28a745' : '#6c757d' }]}>
                  <Text style={styles.statusText}>{caseDetails.status}</Text>
                </View>
              </View>
              <Text style={styles.caseDescription}>{caseDetails.descricao}</Text>
              {caseDetails.midias_urls && caseDetails.midias_urls.length > 0 && (
                <Image source={{ uri: caseDetails.midias_urls[0] }} style={styles.caseImage} />
              )}
              <Text style={styles.announcementDate}>
                Cadastrado em: {new Date(caseDetails.created_at).toLocaleDateString('pt-BR')} por {caseDetails.usuarios?.nome_completo || 'Autor desconhecido'}
              </Text>
               <Text style={styles.announcementDate}>
                Última atualização: {new Date(caseDetails.updated_at).toLocaleDateString('pt-BR')}
              </Text>
               <Text style={[styles.detailText, {marginTop: 10}]}>
                <Text style={styles.detailLabel}>Contato:</Text> {caseDetails.contato_publico}
              </Text>
               {/* TODO: Renderizar 'caseDetails.caracteristicas' */}
            </View>

            {/* Linha do Tempo */}
            <View style={styles.timelineContainer}>
              <Text style={styles.timelineSectionTitle}>Linha do Tempo</Text>
              {timelineItems.length > 0 ? (
                timelineItems.map((item) => (
                  <TimelineItem key={`${item.type}-${item.id}`} item={item} type={item.type} />
                ))
              ) : (
                <Text style={{ textAlign: 'center' }}>Nenhum avistamento ou comentário ainda.</Text>
              )}
            </View>
          </>
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 50, color: 'orange' }}>Caso não encontrado.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default CaseDetailScreen;