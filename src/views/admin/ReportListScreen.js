import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Header from "../../components/header/Header";
import { supabase } from "../../lib/supabase";
import styles from "./Admin.styles";
import { useIsFocused } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ReportListScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchReports();
    }
  }, [isFocused]);

  const fetchReports = async () => {
    setLoading(true);
    // Busca denúncias ABERTAS e junta o nome de quem denunciou (da tabela usuarios)
    const { data, error } = await supabase
      .from("denuncias")
      .select(
        `
        id, 
        created_at,
        tipo_conteudo,
        id_conteudo,
        motivo,
        status,
        usuarios ( nome_completo )
      `
      )
      .eq("status", "ABERTA")
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert(
        "Erro",
        "Não foi possível buscar as denúncias: " + error.message
      );
    } else {
      setReports(data);
    }
    setLoading(false);
  };

  // Função para lidar com clique (você pode expandir isso)
  const handleReportPress = (report) => {
    Alert.alert(
      "Revisar Denúncia",
      `ID Conteúdo: ${report.id_conteudo}\nTipo: ${report.tipo_conteudo}\n\nMotivo: ${report.motivo}\n\n(Ação de moderar ainda não implementada)`
    );
    // Aqui você navegaria para uma tela de detalhes da denúncia
    // navigation.navigate('ReportDetail', { reportId: report.id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleReportPress(item)}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.itemText}>Denúncia de {item.tipo_conteudo}</Text>
        <Text style={styles.itemSubText} numberOfLines={2}>
          Motivo: {item.motivo}
        </Text>
        <Text
          style={[
            styles.itemSubText,
            { fontSize: 12, color: "#999", marginTop: 5 },
          ]}
        >
          Por: {item.usuarios?.nome_completo || "Usuário desconhecido"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#222" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Denúncias"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
        showLogo={false}
      />
      {loading ? (
        <ActivityIndicator size="large" style={styles.loadingContainer} />
      ) : (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 15 }}
          ListEmptyComponent={
            <Text style={styles.emptyStateText}>Nenhuma denúncia aberta.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ReportListScreen;
