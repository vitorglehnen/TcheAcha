import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./caseDetails.styles";
import Header from "../../components/header/Header";
import { useRoute } from "@react-navigation/native";
import {
  getCaseDetails,
  getCurrentUserStatusAndProfileId,
  createComment,
  createSighting,
  reportContent,   
  deleteUserComment, 
  deleteUserSighting
} from "../../controllers/caseController";
import { COLORS } from '../../styles/globalStyles';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- Componente TimelineItem ---
const TimelineItem = ({ item, type, currentProfileId, onDelete, onReport, onImagePress }) => {
  const [expanded, setExpanded] = useState(false);
  
  const isSighting = type === 'sighting';
  const isOwner = isSighting ? item.usuario_id === currentProfileId : item.autor_id === currentProfileId;
  
  const title = isSighting
    ? `Avistamento`
    : `${item.usuarios?.nome_completo || 'Usuário Anônimo'} comentou`;
  const description = isSighting ? item.descricao : item.conteudo;
  const date = isSighting ? new Date(item.data_avistamento) : new Date(item.created_at);
  const formattedDateTime = `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  const getStatusComponent = () => {
    if (isSighting && item.status !== 'VALIDADO') {
      if (item.status === 'PENDENTE') {
        return <Text style={[styles.statusIndicator, styles.pendingStatus]}>(Pendente)</Text>;
      }
      if (item.status === 'REJEITADO') {
        return <Text style={[styles.statusIndicator, styles.rejectedStatus]}>(Rejeitado)</Text>;
      }
    }
    return null;
  };

  return (
    <View style={styles.timelineItem}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
        <View style={styles.timelineHeader}>
          <Ionicons name={expanded ? "chevron-down" : "chevron-forward"} size={24} color="#ccc" />
          <Ionicons name={isSighting ? "eye-outline" : "chatbubble-outline"} size={20} color={COLORS.textPrimary} style={{ marginHorizontal: 5 }} />
          <Text style={styles.timelineTitle}>{title}</Text>
          {getStatusComponent()}
          <Text style={styles.timelineDate}>{formattedDateTime}</Text>
        </View>
        {expanded && (
          <View style={styles.timelineContent}>
            <Text style={styles.timelineDescription}>{description || (isSighting ? 'Sem descrição adicional.' : '')}</Text>
            {isSighting && item.foto_url && (
              <TouchableOpacity onPress={() => onImagePress(item.foto_url)}>
                <Image source={{ uri: item.foto_url }} style={styles.sightingImage} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
      
      {/* Botões de Ação (Denunciar/Excluir) */}
      {expanded && currentProfileId && (
        <View style={styles.timelineActions}>
          {isOwner ? (
            // Se for dono, pode excluir
            <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={16} color="#e74c3c" />
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          ) : (
            // Se não for dono, pode denunciar
            <TouchableOpacity style={styles.actionButton} onPress={onReport}>
              <Ionicons name="alert-circle-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.reportButtonText}>Denunciar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};


// --- TELA PRINCIPAL ---
const CaseDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const casoFromParams = route.params?.caso;

  const [caseDetails, setCaseDetails] = useState(casoFromParams || null);
  const [sightings, setSightings] = useState([]);
  const [comments, setComments] = useState([]);
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status do usuário
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState(null);

  // States do Comentário
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // States do Modal de Avistamento
  const [sightingModalVisible, setSightingModalVisible] = useState(false);
  const [sightingDesc, setSightingDesc] = useState("");
  const [sightingDate, setSightingDate] = useState(new Date());
  const [sightingImage, setSightingImage] = useState(null);
  const [sightingLocation, setSightingLocation] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmittingSighting, setIsSubmittingSighting] = useState(false);

  // State do Modal de Zoom de Imagem
  const [zoomModalVisible, setZoomModalVisible] = useState(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null);

  // Efeito para carregar dados do caso e status do usuário
  useEffect(() => {
    const loadData = async () => {
      const caseId = casoFromParams?.id;
      if (!caseId) {
        Alert.alert("Erro", "ID do caso não encontrado.");
        setError("ID do caso não fornecido."); setLoading(false); return;
      }
      setLoading(true); setError(null);
      try {
        const { isVerified, profileId } = await getCurrentUserStatusAndProfileId();
        setIsUserVerified(isVerified);
        setCurrentProfileId(profileId);

        const { caseDetails: fetchedDetails, sightings: fetchedSightings, comments: fetchedComments } = await getCaseDetails(caseId, profileId);

        if (!fetchedDetails) throw new Error("Detalhes do caso não encontrados.");
        
        setCaseDetails(fetchedDetails);
        setSightings(fetchedSightings);
        setComments(fetchedComments);
      } catch (err) {
        setError(err.message); Alert.alert("Erro", `Não foi possível carregar os detalhes: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [casoFromParams?.id]);

  // Efeito para montar a timeline
  useEffect(() => {
    const combinedItems = [
      ...sightings.map(s => ({ ...s, type: 'sighting', date: new Date(s.data_avistamento) })),
      ...comments.map(c => ({ ...c, type: 'comment', date: new Date(c.created_at) }))
    ].sort((a, b) => b.date - a.date);
    setTimelineItems(combinedItems);
  }, [sightings, comments]);

  
  // --- FUNÇÕES DE AÇÃO ---

  /** Abre o modal de zoom de imagem */
  const handleImageZoom = (imageUrl) => {
    setZoomedImageUrl(imageUrl);
    setZoomModalVisible(true);
  };

  /** Navega para a tela de reportar avistamento */
  const handleReportSighting = () => {
    if (!isUserVerified) {
      Alert.alert("Verificação Necessária", "Você precisa ser um usuário verificado para reportar um avistamento.");
      return;
    }
    setSightingDesc("");
    setSightingDate(new Date());
    setSightingImage(null);
    setSightingLocation(null);
    setSightingModalVisible(true);
  };

  /** Adiciona um novo comentário */
  const handleAddNewComment = async () => {
    if (newComment.trim() === "") { Alert.alert("Erro", "O comentário não pode estar vazio."); return; }
    setIsSubmittingComment(true);
    try {
      const addedComment = await createComment(caseDetails.id, currentProfileId, newComment);
      setComments(prevComments => [...prevComments, addedComment]);
      setNewComment("");
    } catch (err) {
      Alert.alert("Erro", `Não foi possível adicionar o comentário: ${err.message}`);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // --- Funções de Denúncia / Exclusão ---
  const handleReport = (item, type) => {
    if (!isUserVerified) {
      Alert.alert("Verificação Necessária", "Você precisa estar verificado para denunciar um conteúdo.");
      return;
    }
    Alert.prompt(
      `Denunciar ${type === 'CASO' ? 'Caso' : 'Conteúdo'}`,
      `Por favor, descreva o motivo da denúncia:`,
      async (motivo) => {
        if (motivo && motivo.trim().length > 0) {
          try {
            await reportContent(type, item.id, motivo, currentProfileId);
            Alert.alert("Denúncia Enviada", "Sua denúncia foi registrada e será analisada por um moderador.");
          } catch (error) {
            Alert.alert("Erro", `Não foi possível enviar a denúncia: ${error.message}`);
          }
        } else if (motivo !== null) {
          Alert.alert("Erro", "O motivo da denúncia não pode estar vazio.");
        }
      }
    );
  };

  /** Exclui um comentário */
  const handleDeleteComment = (commentId) => {
    Alert.alert(
      "Excluir Comentário",
      "Tem certeza que deseja excluir seu comentário? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: async () => {
          try {
            await deleteUserComment(commentId, currentProfileId);
            setComments(prev => prev.filter(c => c.id !== commentId));
          } catch (error) {
            Alert.alert("Erro", `Não foi possível excluir o comentário: ${error.message}`);
          }
        }}
      ]
    );
  };

  /** Exclui um avistamento */
  const handleDeleteSighting = (sightingId) => {
    Alert.alert(
      "Excluir Avistamento",
      "Tem certeza que deseja excluir seu avistamento? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: async () => {
          try {
            await deleteUserSighting(sightingId, currentProfileId);
            setSightings(prev => prev.filter(s => s.id !== sightingId));
          } catch (error) {
            Alert.alert("Erro", `Não foi possível excluir o avistamento: ${error.message}`);
          }
        }}
      ]
    );
  };

  // --- Funções do Modal de Avistamento ---

  /** Seleciona a data do avistamento */
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || sightingDate;
    setShowDatePicker(Platform.OS === 'ios');
    setSightingDate(currentDate);
  };

  /** Pede permissão e pega a localização atual */
  const handlePickLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos da sua permissão para acessar a localização.');
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setSightingLocation(location.coords);
    } catch (error) {
      Alert.alert('Erro ao pegar localização', 'Não foi possível obter a localização atual.');
    }
  };

  /** Pede permissão e abre a galeria */
  const handlePickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos da sua permissão para acessar a galeria.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      setSightingImage(result.assets[0]);
    }
  };

  /** Envia o avistamento para o Controller */
  const handleSubmitSighting = async () => {
    if (!sightingDesc.trim() || !sightingLocation || !sightingDate) {
      Alert.alert('Campos obrigatórios', 'Descrição, localização e data são obrigatórios.');
      return;
    }
    setIsSubmittingSighting(true);
    try {
      await createSighting({
        caseId: caseDetails.id,
        usuarioId: currentProfileId,
        descricao: sightingDesc,
        imageBase64: sightingImage?.base64,
        location: sightingLocation,
        dataAvistamento: sightingDate,
      });
      Alert.alert('Sucesso!', 'Seu avistamento foi enviado e aguarda validação do autor do caso.');
      setSightingModalVisible(false);
    } catch (error) {
      Alert.alert('Erro ao enviar', error.message);
    } finally {
      setIsSubmittingSighting(false);
    }
  };


  // --- RENDERIZAÇÃO ---
  return (
    <View style={styles.container}>
      <Header
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
        showLogo={false}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
          ) : error ? (
            <Text style={{ textAlign: 'center', marginTop: 50, color: 'red' }}>{`Erro ao carregar: ${error}`}</Text>
          ) : caseDetails ? (
            <>
              {/* Card Principal */}
              <View style={styles.caseCard}>
                {isUserVerified && (
                  <TouchableOpacity style={styles.reportCaseButton} onPress={() => handleReport(caseDetails, 'CASO')}>
                    <Ionicons name="alert-circle-outline" size={24} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                )}
                <View style={styles.cardHeader}>
                  <Ionicons name={caseDetails.tipo === 'ANIMAL' ? "paw-outline" : "person-outline"} size={24} color="#1A233D" />
                  <Text style={styles.caseName}>{caseDetails.nome_desaparecido}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: caseDetails.status === 'ATIVO' ? '#28a745' : '#6c757d' }]}>
                    <Text style={styles.statusText}>{caseDetails.status}</Text>
                  </View>
                </View>
                <Text style={styles.caseDescription}>{caseDetails.descricao}</Text>
                {caseDetails.midias_urls && caseDetails.midias_urls.length > 0 && (
                  <TouchableOpacity onPress={() => handleImageZoom(caseDetails.midias_urls[0])}>
                    <Image source={{ uri: caseDetails.midias_urls[0] }} style={styles.caseImage} />
                  </TouchableOpacity>
                )}
                <Text style={styles.announcementDate}>Cadastrado em: {new Date(caseDetails.created_at).toLocaleDateString('pt-BR')} por {caseDetails.usuarios?.nome_completo || 'Autor desconhecido'}</Text>
                <Text style={styles.announcementDate}>Última atualização: {new Date(caseDetails.updated_at).toLocaleDateString('pt-BR')}</Text>
                <Text style={[styles.detailText, {marginTop: 10}]}><Text style={styles.detailLabel}>Contato:</Text> {caseDetails.contato_publico}</Text>
              </View>

              {/* Botão de Reportar Avistamento */}
              {isUserVerified && (
                <View style={styles.sightingButtonContainer}>
                  <TouchableOpacity style={styles.sightingButton} onPress={handleReportSighting}>
                    <Ionicons name="eye" size={20} color={COLORS.white} />
                    <Text style={styles.sightingButtonText}>Reportar Avistamento</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Linha do Tempo */}
              <View style={styles.timelineContainer}>
                <Text style={styles.timelineSectionTitle}>Linha do Tempo</Text>
                {timelineItems.length > 0 ? (
                  timelineItems.map((item) => (
                    <TimelineItem
                      key={`${item.type}-${item.id}`}
                      item={item}
                      type={item.type}
                      currentProfileId={currentProfileId}
                      onImagePress={handleImageZoom}
                      onDelete={() => (item.type === 'comment' ? handleDeleteComment(item.id) : handleDeleteSighting(item.id))}
                      onReport={() => handleReport(item, item.type === 'comment' ? 'COMENTARIO' : 'AVISTAMENTO')}
                    />
                  ))
                ) : (
                  <Text style={{ textAlign: 'center', color: COLORS.textSecondary }}>Nenhum avistamento ou comentário ainda.</Text>
                )}
              </View>
            </>
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 50, color: 'orange' }}>Caso não encontrado.</Text>
          )}
        </ScrollView>

        {/* Input de Novo Comentário */}
        {isUserVerified && (
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Adicionar um comentário..."
              placeholderTextColor={COLORS.textSecondary}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity style={styles.commentSendButton} onPress={handleAddNewComment} disabled={isSubmittingComment}>
              {isSubmittingComment ? (<ActivityIndicator size="small" color={COLORS.primary} />) : (<Ionicons name="send" size={24} color={COLORS.primary} />)}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* --- MODAL DE AVISTAMENTO --- */}
      <Modal visible={sightingModalVisible} transparent={true} animationType="slide" onRequestClose={() => setSightingModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalBackdrop}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Reportar Avistamento</Text>
                <TouchableOpacity onPress={() => setSightingModalVisible(false)}>
                  <Ionicons name="close" size={28} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.detailLabel}>Descrição do avistamento*</Text>
              <TextInput style={styles.modalInput} placeholder="Descreva o que viu..." value={sightingDesc} onChangeText={setSightingDesc} multiline />

              <Text style={styles.detailLabel}>Data e Hora do Avistamento*</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.textPrimary} />
                <Text style={styles.modalButtonText}>{sightingDate.toLocaleString('pt-BR')}</Text>
              </TouchableOpacity>
              {showDatePicker && ( <DateTimePicker value={sightingDate} mode="datetime" is24Hour={true} display="default" onChange={onChangeDate} /> )}

              <Text style={styles.detailLabel}>Localização*</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handlePickLocation}>
                <Ionicons name="location-outline" size={20} color={COLORS.textPrimary} />
                <Text style={styles.modalButtonText}>Obter localização atual</Text>
                {sightingLocation && <Ionicons name="checkmark-circle" size={20} color="green" style={{ marginLeft: 10 }} />}
              </TouchableOpacity>
              {sightingLocation && (<Text style={styles.modalLocationText}>Lat: {sightingLocation.latitude.toFixed(4)}, Lon: {sightingLocation.longitude.toFixed(4)}</Text>)}

              <Text style={styles.detailLabel}>Foto (Opcional)</Text>
              {sightingImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: sightingImage.uri }} style={styles.modalImagePreview} />
                  <TouchableOpacity style={styles.removeImageButton} onPress={() => setSightingImage(null)}>
                    <Ionicons name="close-outline" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.modalButton} onPress={handlePickImage}>
                  <Ionicons name="camera-outline" size={20} color={COLORS.textPrimary} />
                  <Text style={styles.modalButtonText}>Adicionar foto</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitSighting} disabled={isSubmittingSighting}>
                {isSubmittingSighting ? (<ActivityIndicator color={COLORS.white} />) : (<Text style={styles.submitButtonText}>ENVIAR AVISTAMENTO</Text>)}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- MODAL DE ZOOM DE IMAGEM --- */}
      <Modal
        visible={zoomModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setZoomModalVisible(false)}
      >
        <TouchableOpacity style={styles.imageZoomBackdrop} onPress={() => setZoomModalVisible(false)} activeOpacity={1}>
          <Image source={{ uri: zoomedImageUrl }} style={styles.imageZoom} resizeMode="contain" />
          <TouchableOpacity style={styles.closeZoomButton} onPress={() => setZoomModalVisible(false)}>
            <Ionicons name="close-circle" size={32} color={COLORS.white} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CaseDetailScreen;