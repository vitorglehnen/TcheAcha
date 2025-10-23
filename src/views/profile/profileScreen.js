import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    Alert,
    TextInput,
    Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import NavBar from "../../components/navbar/NavBar";
import Header from "../../components/header/Header";
import Menu from "../../components/menu/Menu";
import { getUserData, updateUserProfile } from "../../controllers/authController";

export default function ProfileScreen({ navigation }) {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editField, setEditField] = useState("");
    const [editValue, setEditValue] = useState("");
    const [updating, setUpdating] = useState(false);

    // Carrega os dados do usuário ao montar o componente
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const data = await getUserData();
            setUserData(data);
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
            Alert.alert(
                "Erro",
                "Não foi possível carregar os dados do perfil. Tente novamente."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (field) => {
        if (field === "phone") {
            setEditField("telefone");
            setEditValue(userData.telefone || "");
        } else if (field === "name") {
            setEditField("nome_completo");
            setEditValue(userData.nome_completo || "");
        }
        setEditModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!editValue.trim()) {
            Alert.alert("Erro", "O campo não pode estar vazio");
            return;
        }

        // Validação básica de telefone
        if (editField === "telefone") {
            const phoneRegex = /^\+?[0-9\s\-()]+$/;
            if (!phoneRegex.test(editValue)) {
                Alert.alert("Erro", "Formato de telefone inválido");
                return;
            }
        }

        try {
            setUpdating(true);
            const updatedData = await updateUserProfile({
                [editField]: editValue.trim()
            });
            setUserData(updatedData);
            setEditModalVisible(false);
            Alert.alert("Sucesso", "Dados atualizados com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar dados:", error);
            Alert.alert("Erro", "Não foi possível atualizar os dados. Tente novamente.");
        } finally {
            setUpdating(false);
        }
    };

    const handleDocumentVerification = () => {
        // Se o status for NAO_VERIFICADO ou REPROVADO, redireciona para verificação
        if (userData.status_verificacao === "NAO_VERIFICADO" || 
            userData.status_verificacao === "REPROVADO") {
            navigation.navigate("VerifyIdentity");
        } else if (userData.status_verificacao === "PENDENTE") {
            Alert.alert(
                "Verificação Pendente",
                "Seus documentos estão em análise. Aguarde a aprovação."
            );
        } else if (userData.status_verificacao === "APROVADO") {
            Alert.alert(
                "Verificação Aprovada",
                "Seus documentos já foram verificados e aprovados!"
            );
        }
    };

    const getStatusVerificacaoTexto = (status) => {
        const statusMap = {
            "NAO_VERIFICADO": "não verificado",
            "PENDENTE": "pendente",
            "APROVADO": "aprovado",
            "REPROVADO": "reprovado"
        };
        return statusMap[status] || "não verificado";
    };

    const getStatusVerificacaoIcone = (status) => {
        if (status === "APROVADO") {
            return { name: "checkmark-circle", color: "#28a745" };
        } else if (status === "PENDENTE") {
            return { name: "time-outline", color: "#ffc107" };
        } else if (status === "REPROVADO") {
            return { name: "close-circle", color: "#dc3545" };
        }
        return { name: "alert-circle", color: "#6c757d" };
    };

    // Funções de placeholder para futuras implementações
    const handleGoBack = () => {
        // Lógica para voltar para a tela anterior
    };

    const handleSettings = () => {
        navigation.navigate("Settings");
    }

    // Exibe loading enquanto carrega os dados
    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" backgroundColor="#03A9F4" />
                <View style={styles.container}>
                    <Header
                        title="Perfil"
                        leftIcon="menu"
                        onLeftPress={() => setMenuVisible(true)}
                        showLogo={true}
                    />
                    <View style={[styles.profileContent, { justifyContent: 'center', alignItems: 'center' }]}>
                        <ActivityIndicator size="large" color="#03A9F4" />
                        <Text style={{ marginTop: 10, color: '#666' }}>Carregando perfil...</Text>
                    </View>
                </View>
                <NavBar
                    onHomePress={() => navigation?.navigate('Home')}
                    activeScreen="Settings"
                />
            </SafeAreaView>
        );
    }

    // Exibe mensagem se não houver dados
    if (!userData) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" backgroundColor="#03A9F4" />
                <View style={styles.container}>
                    <Header
                        title="Perfil"
                        leftIcon="menu"
                        onLeftPress={() => setMenuVisible(true)}
                        showLogo={true}
                    />
                    <View style={[styles.profileContent, { justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ color: '#666' }}>Erro ao carregar dados do perfil</Text>
                        <TouchableOpacity
                            style={{ marginTop: 20, padding: 10, backgroundColor: '#03A9F4', borderRadius: 5 }}
                            onPress={loadUserData}
                        >
                            <Text style={{ color: '#fff' }}>Tentar Novamente</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <NavBar
                    onHomePress={() => navigation?.navigate('Home')}
                    activeScreen="Settings"
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>        
            <StatusBar barStyle="light-content" backgroundColor="#03A9F4" />
            <View style={styles.container}>
                <Header
                    title="Perfil"
                    leftIcon="menu"
                    onLeftPress={() => setMenuVisible(true)}
                    showLogo={true}
                />
                {/* Conteúdo Principal */}
                <View style={styles.profileContent}>
                    {/* Avatar e Infos */}
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            {userData.foto_perfil_url ? (
                                <Image
                                    source={{ uri: userData.foto_perfil_url }}
                                    style={styles.avatarImage}
                                />
                            ) : (
                                <Ionicons name="person" size={60} color="#6c757d" />
                            )}
                        </View>
                    </View>

                    <View style={styles.userInfo}>
                        <View style={styles.userNameContainer}>
                            <Text style={styles.userName}>{userData.nome_completo || "Usuário"}</Text>
                            {userData.status_verificacao === "APROVADO" && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={20}
                                    color="#28a745"
                                    style={styles.verifiedIcon}
                                />
                            )}
                        </View>
                        <Text style={styles.userEmail}>{userData.email || "Email não informado"}</Text>
                    </View>

                    <View style={styles.casesContainer}>
                        <Text style={styles.casesNumber}>{userData.casos_envolvidos || 0}</Text>
                        <Text style={styles.casesText}>casos envolvidos</Text>
                    </View>

                    {/* Campos Editáveis */}
                    <View style={styles.editableField}>
                        <Text style={styles.fieldText}>
                            {userData.telefone || "Telefone não informado"}
                        </Text>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEdit("phone")}
                        >
                            <Text style={styles.editButtonText}>editar</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.editableField}>
                        <Text style={styles.fieldText}>
                            {userData.nome_completo || "Nome não informado"}
                        </Text>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEdit("name")}
                        >
                            <Text style={styles.editButtonText}>editar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Status Cards */}
                    <View style={styles.statusCardsContainer}>
                        <TouchableOpacity 
                            style={styles.statusCard}
                            onPress={handleDocumentVerification}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cardTitle}>Status validação dos documentos</Text>
                            <View style={styles.statusIconContainer}>
                                <Ionicons 
                                    name={getStatusVerificacaoIcone(userData.status_verificacao).name}
                                    size={40} 
                                    color={getStatusVerificacaoIcone(userData.status_verificacao).color}
                                />
                            </View>
                            <Text style={styles.statusText}>
                                {getStatusVerificacaoTexto(userData.status_verificacao)}
                            </Text>
                            {(userData.status_verificacao === "NAO_VERIFICADO" || 
                              userData.status_verificacao === "REPROVADO") && (
                                <Text style={styles.verifyHint}>Toque para verificar</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.statusCard}>
                            <Text style={styles.cardTitle}>Última verificação de localização</Text>
                            <View style={styles.statusIconContainer}>
                                <Ionicons name="time-outline" size={40} color="#333" />
                            </View>
                            <Text style={styles.statusText}>
                                {userData.ultima_localizacao ? 
                                    new Date(userData.ultima_localizacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 
                                    "Não disponível"
                                }
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            {/* Bottom Navigation */}
            <NavBar
                onHomePress={() => navigation?.navigate('Home')}
                activeScreen="Settings"
            />

            {isMenuVisible && (
                <Menu
                visible={isMenuVisible}
                onClose={() => setMenuVisible(false)}
                navigation={navigation}
                />
            )}

            {/* Modal de Edição */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editField === "telefone" ? "Editar Telefone" : "Editar Nome"}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setEditModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        
                        <TextInput
                            style={styles.input}
                            value={editValue}
                            onChangeText={setEditValue}
                            placeholder={editField === "telefone" ? "+55 51 99999-9999" : "Nome Completo"}
                            keyboardType={editField === "telefone" ? "phone-pad" : "default"}
                            autoFocus
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveEdit}
                                disabled={updating}
                            >
                                {updating ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Salvar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}