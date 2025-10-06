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
import NavBar from '../../components/navbar/NavBar';
import Menu from '../../components/menu/Menu';
import { supabase } from '../../lib/supabase';
import Header from '../../components/header/Header';

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
  const [isMenuVisible, setMenuVisible] = useState(false);  

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      setCases(mockCases);
      setLoading(false);
    };
    fetchCases();
  }, []);

  const handleAddPress = () => navigation?.navigate("RegisterMissing");
  const handleProfilePress = () => navigation?.navigate("Profile");
  const handleMapPress = () => navigation?.navigate("Map");

  return (
    <View style={styles.mainContainer}>
      <Header 
        title="TchêAcha"
        description="Abaixo consta uma lista de desaparecidos na sua região. Nos auxilie nas buscas e venha fazer parte dessa comunidade."
        leftIcon="menu"
        onLeftPress={() => setMenuVisible(true)}
        showLogo={true}
      />
      
      {/* Conteúdo com Rolagem */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <br /> 
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
        onAddPress={handleAddPress}
        onProfilePress={handleProfilePress}
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


export default HomeScreen;