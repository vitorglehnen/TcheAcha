import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { styles } from './MyCasesScreen.styles';
import Header from '../../components/header/Header';
import NavBar from '../../components/navbar/NavBar';
import Menu from '../../components/menu/Menu';
import {
  getCurrentUserStatusAndProfileId,
  getCasesDashboardData,
  approveSighting,
  rejectSighting,
  markCaseAsFound,
  markCaseAsActive,
} from '../../controllers/caseController';
import { COLORS } from '../../styles/globalStyles';

const MyCasesScreen = ({ navigation }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);
  
  const [myCases, setMyCases] = useState([]);
  const [pendingSightings, setPendingSightings] = useState([]);
  
  const isFocused = useIsFocused();

  // Função para carregar todos os dados do dashboard
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Pega o ID do usuário logado
      const { profileId: pid } = await getCurrentUserStatusAndProfileId();
      if (!pid) {
        throw new Error("Usuário não encontrado.");
      }
      setProfileId(pid);

      // 2. Busca os dados do dashboard (meus casos e avistamentos pendentes)
      const { myCases, pendingSightings } = await getCasesDashboardData(pid);
      setMyCases(myCases);
      setPendingSightings(pendingSightings);

    } catch (error) {
      Alert.alert("Erro", `Não foi possível carregar seus dados: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados quando a tela entra em foco
  useEffect(() => {
    if (isFocused) {
      loadDashboardData();
    }
  }, [isFocused]);

  // Valida um avistamento
  const handleApprove = async (sightingId) => {
    try {
      await approveSighting(sightingId);
      // Remove o item da lista UI para feedback instantâneo
      setPendingSightings(prev => prev.filter(s => s.id !== sightingId));
      Alert.alert("Sucesso", "Avistamento aprovado e agora está público na timeline do caso.");
    } catch (error) {
      Alert.alert("Erro", `Não foi possível aprovar o avistamento: ${error.message}`);
    }
  };

  // Rejeita um avistamento (RF0008)
  const handleReject = async (sightingId) => {
    try {
      await rejectSighting(sightingId);
      // Remove o item da lista UI
      setPendingSightings(prev => prev.filter(s => s.id !== sightingId));
      Alert.alert("Sucesso", "Avistamento rejeitado.");
    } catch (error) {
      Alert.alert("Erro", `Não foi possível rejeitar o avistamento: ${error.message}`);
    }
  };

  // Marca um caso como ENCONTRADO
  const handleMarkAsFound = async (caseId) => {
    try {
      await markCaseAsFound(caseId);
      // Atualiza a lista UI
      setMyCases(prev => prev.map(c => c.id === caseId ? { ...c, status: 'ENCONTRADO' } : c));
      Alert.alert("Sucesso", "Caso marcado como 'Encontrado'.");
    } catch (error) {
      Alert.alert("Erro", `Não foi possível atualizar o caso: ${error.message}`);
    }
  };

  // Reabre um caso (marca como ATIVO)
  const handleMarkAsActive = async (caseId) => {
     try {
      await markCaseAsActive(caseId);
      // Atualiza a lista UI
      setMyCases(prev => prev.map(c => c.id === caseId ? { ...c, status: 'ATIVO' } : c));
      Alert.alert("Sucesso", "Caso reaberto e marcado como 'Ativo'.");
    } catch (error) {
      Alert.alert("Erro", `Não foi possível reabrir o caso: ${error.message}`);
    }
  };

  const handleEditCase = (caso) => {
    navigation.navigate('RegisterCase', { caso: caso });
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        title="Gerenciar Casos"
        description="Acompanhe seus casos e valide avistamentos"
        leftIcon="menu"
        onLeftPress={() => setMenuVisible(true)}
        showLogo={false} // Oculta o logo nesta tela
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingContainer} />
        ) : (
          <>
            {/* Seção de Notificações / Avistamentos Pendentes (RF0008) */}
            <Text style={styles.sectionTitle}>Avistamentos Pendentes</Text>
            {pendingSightings.length > 0 ? (
              pendingSightings.map(sighting => (
                <View key={sighting.id} style={styles.sightingCard}>
                  <Text style={styles.sightingCaseTitle}>
                    Avistamento para o caso: <Text style={{fontWeight: 'bold'}}>{sighting.casos.nome_desaparecido}</Text>
                  </Text>
                  <Text style={styles.sightingDesc}>{sighting.descricao}</Text>
                  {sighting.foto_url && (
                    <Image source={{ uri: sighting.foto_url }} style={styles.sightingImage} />
                  )}
                  <View style={styles.sightingActions}>
                    <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={() => handleApprove(sighting.id)}>
                      <Ionicons name="checkmark" size={18} color={COLORS.white} />
                      <Text style={styles.actionButtonText}>Validar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={() => handleReject(sighting.id)}>
                      <Ionicons name="close" size={18} color={COLORS.white} />
                      <Text style={styles.actionButtonText}>Rejeitar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyStateText}>Nenhum avistamento pendente de validação.</Text>
            )}

            {/* Seção de Meus Casos (RF0009) */}
            <Text style={styles.sectionTitle}>Meus Casos Cadastrados</Text>
            {myCases.length > 0 ? (
              myCases.map(caso => (
                <View key={caso.id} style={styles.caseCard}>
                  <View style={styles.caseCardHeader}>
                    <Text style={styles.caseName}>{caso.nome_desaparecido}</Text>
                    <View style={[styles.statusBadge, caso.status === 'ATIVO' ? styles.statusActive : styles.statusInactive]}>
                      <Text style={styles.statusText}>{caso.status}</Text>
                    </View>
                  </View>
                  <View style={styles.caseActions}>
                    <TouchableOpacity style={styles.caseButton} onPress={() => handleEditCase(caso)}>
                      <Ionicons name="pencil-outline" size={16} color={COLORS.textPrimary} />
                      <Text style={styles.caseButtonText}>Editar</Text>
                    </TouchableOpacity>
                    
                    {caso.status === 'ATIVO' ? (
                      <TouchableOpacity style={[styles.caseButton, {backgroundColor: '#f0f0f0'}]} onPress={() => handleMarkAsFound(caso.id)}>
                        <Ionicons name="checkmark-done-outline" size={16} color={COLORS.textPrimary} />
                        <Text style={styles.caseButtonText}>Marcar como Encontrado</Text>
                      </TouchableOpacity>
                    ) : (
                       <TouchableOpacity style={[styles.caseButton, {backgroundColor: '#f0f0f0'}]} onPress={() => handleMarkAsActive(caso.id)}>
                        <Ionicons name="refresh-outline" size={16} color={COLORS.textPrimary} />
                        <Text style={styles.caseButtonText}>Reabrir Caso</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyStateText}>Você ainda não cadastrou nenhum caso.</Text>
            )}
          </>
        )}
      </ScrollView>

      <NavBar
        activeScreen="ManageCases"
        onHomePress={() => navigation?.navigate('Home')}
        onAddPress={() => navigation?.navigate('RegisterCase')}
      />

      {isMenuVisible && (
        <Menu
          visible={isMenuVisible}
          onClose={() => setMenuVisible(false)}
          navigation={navigation}
        />
      )}
    </View>
  );
};

export default MyCasesScreen;