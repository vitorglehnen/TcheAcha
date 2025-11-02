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
import { styles } from './BeforeLogin.styles';
import { getActiveCasesForHome } from '../../controllers/caseController';
import { useLocation } from '../../utils/locationHook';

const BeforeLogin = ({ navigation }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { location, loading: locationLoading, error: locationError, getLocation } = useLocation();

  useEffect(() => {
    const fetchLocationAndCases = async () => {
      // Obter localização
      console.log("BeforeLogin: Solicitando localização do usuário...");
      const loc = await getLocation(); // Usa o getLocation do hook
      if (loc) {
        console.log("BeforeLogin: Localização obtida:", loc.coords);
      } else if (locationError) {
        console.log("BeforeLogin: Erro ao obter localização:", locationError);
      }

      // Buscar casos
      setLoading(true);
      try {
        console.log("BeforeLogin: Buscando casos públicos...");
        const fetchedCases = await getActiveCasesForHome();
        setCases(fetchedCases || []);
        console.log("BeforeLogin: Casos públicos carregados.");
      } catch (error) {
        console.error("BeforeLogin: Erro ao carregar casos:", error.message);
        Alert.alert("Erro", "Não foi possível carregar os casos no momento.");
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndCases();
  }, []); // Roda apenas uma vez

  const handleLogin = () => {
    navigation?.navigate('Login');
  };

  const handleAuxiliePress = () => {
    Alert.alert(
      "Login Necessário",
      "Para auxiliar ou ver mais detalhes, por favor, faça o login ou crie uma conta.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Fazer Login", onPress: handleLogin }
      ]
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* Cabeçalho Fixo */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>TchêAcha</Text>
            <Text style={styles.description}>
              Abaixo consta uma lista de desaparecidos na sua região.{'\n'}
              Nos auxilie nas buscas e venha fazer parte dessa comunidade
            </Text>
          </View>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Botão ENTRAR */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>ENTRAR</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo com Rolagem - Lista de Casos */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#03A9F4" style={{ marginTop: 50 }} />
        ) : cases.length > 0 ? (
          cases.map((caso) => (
            <View key={caso.id} style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                  Desaparecido(a) há {caso.diasDesaparecido} dias
                </Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="person" size={40} color="#ccc" />
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Nome:</Text> {caso.nome_desaparecido}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Desaparecimento:</Text> {new Date(caso.data_desaparecimento).toLocaleDateString('pt-BR')}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Localidade:</Text> {caso.endereco_desaparecimento_formatado}
                  </Text>
                  <TouchableOpacity
                    style={styles.auxilieButton}
                    onPress={handleAuxiliePress}
                  >
                    <Text style={styles.auxilieButtonText}>AUXILIE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#666' }}>
            Nenhum caso ativo encontrado no momento.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default BeforeLogin;