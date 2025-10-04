import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './BeforeLogin.styles';

const mockCases = [
  {
    id: 1,
    nome_desaparecido: 'Fulano de ciclano',
    data_nascimento: '2012-12-12',
    data_desaparecimento: '2025-04-01',
    endereco_desaparecimento_formatado: 'Centro, Venâncio Aires',
    diasDesaparecido: 157,
  },
  {
    id: 2,
    nome_desaparecido: 'Fulano de ciclano',
    data_nascimento: '2012-12-12',
    data_desaparecimento: '2025-04-01',
    endereco_desaparecimento_formatado: 'Centro, Venâncio Aires',
    diasDesaparecido: 157,
  },
  {
    id: 3,
    nome_desaparecido: 'Fulano de ciclano',
    data_nascimento: '2012-12-12',
    data_desaparecimento: '2025-04-01',
    endereco_desaparecimento_formatado: 'Centro, Venâncio Aires',
    diasDesaparecido: 157,
  },
];

const BeforeLogin = ({ navigation }) => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    // Simula carregamento de casos públicos
    setCases(mockCases);
  }, []);

  const handleLogin = () => {
    navigation?.navigate('Login');
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
        {cases.map((caso) => (
          <View key={caso.id} style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>
                Essa pessoa está desaparecida a {caso.diasDesaparecido} dias
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
                {caso.data_nascimento && (
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Nascimento:</Text> {new Date(caso.data_nascimento).toLocaleDateString('pt-BR')}
                  </Text>
                )}
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Desaparecimento:</Text> {new Date(caso.data_desaparecimento).toLocaleDateString('pt-BR')}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Localidade:</Text> {caso.endereco_desaparecimento_formatado}
                </Text>
                <TouchableOpacity 
                  style={styles.auxilieButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.auxilieButtonText}>AUXILIE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default BeforeLogin;