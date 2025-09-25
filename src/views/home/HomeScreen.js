import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './HomeScreen.styles';
import NavBar from '../../components/NavBar';
import { supabase } from '../../lib/supabase';

const mockCases = [
  {
    id: 1,
    nome_desaparecido: 'Fulano de Ciclano',
    data_nascimento: '2012-12-12',
    data_desaparecimento: '2025-04-01',
    endereco_desaparecimento_formatado: 'Centro, Venâncio Aires',
    diasDesaparecido: 157,
  },
  {
    id: 2,
    nome_desaparecido: 'Cachorro Caramelo',
    data_nascimento: null,
    data_desaparecimento: '2025-09-20',
    endereco_desaparecimento_formatado: 'Higienópolis, Porto Alegre',
    diasDesaparecido: 4,
  },
];

const HomeScreen = ({ navigation }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      setCases(mockCases);
      setLoading(false);
    };
    fetchCases();
  }, []);

  const handleAddPress = () => navigation?.navigate("Cadastrar Caso");
  const handleProfilePress = () => navigation?.navigate("Meu Perfil");

  return (
    <View style={styles.mainContainer}>
      {/* Cabeçalho Fixo com Ícone de Menu */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity 
            style={styles.menuIcon}
            onPress={() => console.log("Botão de menu pressionado")}
          >
            <Ionicons name="menu" size={32} color="#1A233D" />
          </TouchableOpacity>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} />
        </View>
      </View>
      
      {/* Conteúdo com Rolagem */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>TchêAcha</Text>
        <Text style={styles.description}>
          Abaixo consta uma lista de desaparecidos na sua região.
          Nos auxilie nas buscas e venha fazer parte dessa comunidade.
        </Text>
        
        {/* Lista de Casos */}
        {cases.map((caso) => (
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
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Nome:</Text> {caso.nome_desaparecido}</Text>
                {caso.data_nascimento && <Text style={styles.detailText}><Text style={styles.detailLabel}>Nascimento:</Text> {new Date(caso.data_nascimento).toLocaleDateString('pt-BR')}</Text>}
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Desaparecimento:</Text> {new Date(caso.data_desaparecimento).toLocaleDateString('pt-BR')}</Text>
                <Text style={styles.detailText}><Text style={styles.detailLabel}>Localidade:</Text> {caso.endereco_desaparecimento_formatado}</Text>
                <TouchableOpacity style={styles.auxilieButton}>
                  <Text style={styles.auxilieButtonText}>AUXILIE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Barra de Navegação */}
      <NavBar
        activeScreen="Home"
        onProfilePress={handleProfilePress}
      />
    </View>
  );
};


export default HomeScreen;