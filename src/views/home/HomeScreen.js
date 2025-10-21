import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles, modalStyles } from "./HomeScreen.styles";
import NavBar from "../../components/navbar/NavBar";
import Menu from "../../components/menu/Menu";
import { supabase } from "../../lib/supabase";
import Header from "../../components/header/Header";

const mockCases = [
  {
    id: 1,
    nome_desaparecido: "Fulano de Ciclano",
    data_nascimento: "2012-12-12",
    data_desaparecimento: "2025-04-01",
    endereco_desaparecimento_formatado: "Centro, Venâncio Aires",
    diasDesaparecido: 157,
  },
  {
    id: 2,
    nome_desaparecido: "Cachorro Caramelo",
    data_nascimento: null,
    data_desaparecimento: "2025-09-20",
    endereco_desaparecimento_formatado: "Higienópolis, Porto Alegre",
    diasDesaparecido: 4,
  },
];

const HomeScreen = ({ navigation }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      setCases(mockCases);
      setLoading(false);
    };
    fetchCases();
  }, []);

  const handleAddPress = () => navigation?.navigate("RegisterMissing");
  const handleMapPress = () => navigation?.navigate("Map");

  const handleDetailsPress = async (caso) => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    // Se não houver usuário logado, mostra o modal para login/verificação
    if (!authUser) {
      setShowVerifyModal(true);
      return;
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select("status_verificacao")
      .eq("auth_user_id", authUser.id)
      .single();

    // Define os status que devem acionar o modal
    const statusesQueMostramModal = ["NAO_VERIFICADO", "REJEITADO"];

    // Se houver erro, não encontrar o usuário, ou o status for um dos definidos acima, mostra o modal
    if (
      error ||
      !data ||
      statusesQueMostramModal.includes(data.status_verificacao)
    ) {
      setShowVerifyModal(true);
      return;
    }

    // Se o status for 'APROVADO', permite a navegação
    if (data.status_verificacao === "APROVADO") {
      navigation?.navigate("CaseDetail", { casoId: caso.id });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        title="TchêAcha"
        description="Abaixo consta uma lista de desaparecidos na sua região. Nos auxilie nas buscas e venha fazer parte dessa comunidade."
        leftIcon="menu"
        onLeftPress={() => setMenuVisible(true)}
        showLogo={true}
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={handleMapPress}
          activeOpacity={0.8}
        >
          <View style={styles.mapButtonContent}>
            <Ionicons name="map-outline" size={24} color="#1A233D" />
            <Text style={styles.mapButtonTitle}>
              Acessar mapa com casos ativos
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#1A233D" />
          </View>
          <Text style={styles.mapButtonDescription}>
            Ao clicar aqui, você será redirecionado para uma tela onde consta o
            mapa com casos de desaparecimentos reais cadastrados em nosso banco
            de dados
          </Text>
        </TouchableOpacity>

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
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Nome:</Text>{" "}
                  {caso.nome_desaparecido}
                </Text>

                {caso.data_nascimento && (
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Nascimento:</Text>{" "}
                    {new Date(caso.data_nascimento).toLocaleDateString("pt-BR")}
                  </Text>
                )}

                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Desaparecimento:</Text>{" "}
                  {new Date(caso.data_desaparecimento).toLocaleDateString(
                    "pt-BR"
                  )}
                </Text>

                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>Localidade:</Text>{" "}
                  {caso.endereco_desaparecimento_formatado}
                </Text>

                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => handleDetailsPress(caso)}
                >
                  <Text style={styles.detailsButtonText}>Detalhes do Caso</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <NavBar
        activeScreen="Home"
        onAddPress={handleAddPress}
      />

      {isMenuVisible && (
        <Menu
          visible={isMenuVisible}
          onClose={() => setMenuVisible(false)}
          navigation={navigation}
        />
      )}

      {/* MODAL DE VERIFICAÇÃO */}
      <Modal
        visible={showVerifyModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowVerifyModal(false)}
      >
        <View style={modalStyles.backdrop}>
          <View style={modalStyles.container}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Você precisa ser verificado</Text>
              <Pressable onPress={() => setShowVerifyModal(false)}>
                <Text style={modalStyles.close}>✕</Text>
              </Pressable>
            </View>

            <Text style={modalStyles.message}>
              Para cadastrar ou participar de algum caso você precisa estar
              verificado. É necessário enviar alguns documentos para a análise.
            </Text>

            <View style={modalStyles.row}>
              <Pressable
                style={[modalStyles.button, modalStyles.secondary]}
                onPress={() => setShowVerifyModal(false)}>
                <Text style={modalStyles.secondaryText}>AGORA NÃO</Text>
              </Pressable>

              <Pressable
                style={[modalStyles.button, modalStyles.primary]}
                onPress={() => {
                  setShowVerifyModal(false);
                  navigation?.navigate("VerifyIdentity");
                }}
              >
                <Text style={modalStyles.primaryText}>ENVIAR</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
