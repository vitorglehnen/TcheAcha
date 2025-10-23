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

const BeforeLogin = ({ navigation }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect busca os dados reais ao montar a tela
  useEffect(() => {
    const loadCases = async () => {
      setLoading(true);
      try {
        console.log("BeforeLogin: Buscando casos públicos...");
        const fetchedCases = await getActiveCasesForHome(); // Usa o controller
        setCases(fetchedCases || []); // Garante que seja um array
        console.log("BeforeLogin: Casos públicos carregados.");
      } catch (error) {
        console.error("BeforeLogin: Erro ao carregar casos:", error.message);
        Alert.alert("Erro", "Não foi possível carregar os casos no momento.");
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
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
          // Mostra indicador de carregamento
          <ActivityIndicator size="large" color={styles.title.color} style={{ marginTop: 50 }} />
        ) : cases.length > 0 ? (
          // Mapeia os casos reais buscados
          cases.map((caso) => (
            <View key={caso.id} style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                  Desaparecido(a) há {caso.diasDesaparecido} dias
                </Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.imagePlaceholder}>
                  {/* TODO: Adicionar lógica para mostrar imagem real se existir */}
                  <Ionicons name="person" size={40} color="#ccc" />
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Nome:</Text> {caso.nome_desaparecido}
                  </Text>
                  {/* Nascimento não é selecionado no DAO, caso precise, adicione lá */}
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Desaparecimento:</Text> {new Date(caso.data_desaparecimento).toLocaleDateString('pt-BR')}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Localidade:</Text> {caso.endereco_desaparecimento_formatado}
                  </Text>
                  <TouchableOpacity
                    style={styles.auxilieButton}
                    onPress={handleAuxiliePress} // Chama a função que pede login
                  >
                    <Text style={styles.auxilieButtonText}>AUXILIE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          // Mensagem se não houver casos
          <Text style={{ textAlign: 'center', marginTop: 50, color: styles.description.color }}>
            Nenhum caso ativo encontrado no momento.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default BeforeLogin;