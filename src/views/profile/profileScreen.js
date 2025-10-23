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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import NavBar from "../../components/navbar/NavBar";
import Header from "../../components/header/Header";
import Menu from "../../components/menu/Menu";
import { getUserData } from "../../controllers/authController";

export default function ProfileScreen({ navigation }) {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    // Funções de placeholder para futuras implementações
    const handleGoBack = () => {
        // Lógica para voltar para a tela anterior
    };

    const handleEdit = (field) => {
        console.log(`Editar campo: ${field}`);
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
                            {userData.verificado && (
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
                        <View style={styles.statusCard}>
                            <Text style={styles.cardTitle}>Status validação dos documentos</Text>
                            <View style={styles.statusIconContainer}>
                                <Ionicons 
                                    name="checkmark-circle" 
                                    size={40} 
                                    color={userData.documentos_verificados ? "#28a745" : "#ffc107"} 
                                />
                            </View>
                            <Text style={styles.statusText}>
                                {userData.documentos_verificados ? "aprovado" : "pendente"}
                            </Text>
                        </View>

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
        </SafeAreaView>
    );
}