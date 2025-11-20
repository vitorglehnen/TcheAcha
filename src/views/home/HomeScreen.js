import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles, modalStyles } from "./HomeScreen.styles";
import NavBar from "../../components/navbar/NavBar";
import Menu from "../../components/menu/Menu";
import { supabase } from "../../lib/supabase";
import Header from "../../components/header/Header";
import { getActiveCasesForHome } from "../../controllers/caseController";
import Alert from '../../components/alert/Alert';

const HomeScreen = ({ navigation }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // State for custom alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertOnConfirm, setAlertOnConfirm] = useState(() => () => {});
  const [alertOnCancel, setAlertOnCancel] = useState(null);
  const [alertConfirmText, setAlertConfirmText] = useState('OK');
  const [alertCancelText, setAlertCancelText] = useState('Cancel');

  const showAlertMessage = (title, message, onConfirm = () => setShowAlert(false), onCancel = null, confirmText = 'OK', cancelText = 'Cancel') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOnConfirm(() => onConfirm);
    setAlertOnCancel(onCancel ? () => onCancel : null);
    setAlertConfirmText(confirmText);
    setAlertCancelText(cancelText);
    setShowAlert(true);
  };

  // useEffect agora busca os dados reais
  useEffect(() => {
    const loadCases = async () => {
      setLoading(true); // Inicia o carregamento
      try {
        console.log("HomeScreen: Buscando casos...");
        const fetchedCases = await getActiveCasesForHome(); // Chama o controller
        setCases(fetchedCases || []); // Garante que cases seja um array
        console.log("HomeScreen: Casos carregados no estado.");
      } catch (error) {
        console.error("HomeScreen: Erro ao carregar casos:", error.message);
        showAlertMessage(
          "Erro",
          "Não foi possível carregar os casos. Tente novamente mais tarde."
        );
        setCases([]); // Limpa os casos em caso de erro
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []); // Roda apenas uma vez quando o componente monta

  const handleAddPress = () => navigation?.navigate("RegisterCase");
  const handleMapPress = () => navigation?.navigate("Map");

  const handleDetailsPress = async (caso) => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) {
      // Se não estiver logado (embora não deva acontecer nesta tela), mostra modal
      setShowVerifyModal(true);
      return;
    }

    // Busca o status do usuário no banco
    const { data, error } = await supabase
      .from("usuarios")
      .select("status_verificacao")
      .eq("auth_user_id", authUser.id)
      .single();

    if (error || !data) {
      // Se der erro ou não achar o perfil, mostra modal de verificação por precaução
      setShowVerifyModal(true);
      return;
    }

    // Lógica de verificação refinada
    const status = data.status_verificacao;

    if (status === "APROVADO") {
      // 1. APROVADO: Navega para os detalhes
      navigation?.navigate("CaseDetail", { caso });
    } else if (status === "PENDENTE") {
      // 2. PENDENTE: Mostra alerta informativo
      showAlertMessage(
        "Análise Pendente",
        "Seu perfil ainda está sendo analisado. Você será notificado quando for aprovado."
      );
    } else {
      // 3. NAO_VERIFICADO ou REJEITADO: Mostra modal para iniciar verificação
      setShowVerifyModal(true);
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

        {/* Indicador de Carregamento */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={styles.title.color}
            style={{ marginTop: 50 }}
          />
        ) : // Lista de Casos (renderiza somente se não estiver carregando)
        cases.length > 0 ? (
          cases.map((caso) => (
            <View key={caso.id} style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>
                  {/* Usando o campo calculado 'diasDesaparecido' */}
                  Desaparecido(a) há {caso.diasDesaparecido} dias
                </Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.imagePlaceholder}>
                  {/* TODO: Usar a primeira imagem de caso.midias_urls se existir */}
                  <Ionicons name="person" size={40} color="#ccc" />
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.detailText}>
                    <Text style={styles.detailLabel}>Nome:</Text>{" "}
                    {caso.nome_desaparecido}
                  </Text>
                  {/* Nota: data_nascimento não foi selecionada no DAO, remover ou adicionar lá */}
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
                    <Text style={styles.detailsButtonText}>
                      Detalhes do Caso
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          // Mensagem se não houver casos e não estiver carregando
          <Text
            style={{
              textAlign: "center",
              marginTop: 50,
              color: styles.description.color,
            }}
          >
            Nenhum caso ativo encontrado no momento.
          </Text>
        )}
      </ScrollView>

      {/* Na Home, não mostramos o botão Home na NavBar */}
      <NavBar
        activeScreen="Home"
        onAddPress={handleAddPress}
        // onProfilePress não precisa ser passado aqui se for acessível pelo menu
      />

      {isMenuVisible && (
        <Menu
          visible={isMenuVisible}
          onClose={() => setMenuVisible(false)}
          navigation={navigation}
        />
      )}

      {/* Modal de Verificação */}
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
                onPress={() => setShowVerifyModal(false)}
              >
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
      <Alert
        isVisible={showAlert}
        title={alertTitle}
        message={alertMessage}
        onConfirm={alertOnConfirm}
        onCancel={alertOnCancel}
        confirmText={alertConfirmText}
        cancelText={alertCancelText}
      />
    </View>
  );
};

export default HomeScreen;
