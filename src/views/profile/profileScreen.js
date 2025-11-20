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
    TextInput,
    Modal,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from  "./profileScreen.styles";
import Header from "../../components/header/Header";
import Menu from "../../components/menu/Menu";
import { getUserData, updateUserProfile, uploadProfilePicture } from "../../controllers/authController";
import * as ImagePicker from 'expo-image-picker'; 
import Alert from '../../components/alert/Alert';

export default function ProfileScreen({ navigation }) {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editField, setEditField] = useState("");
    const [editValue, setEditValue] = useState("");
    const [updating, setUpdating] = useState(false);

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
            showAlertMessage("Erro", "Não foi possível carregar os dados do perfil.");
        } finally {
            setLoading(false);
        }
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showAlertMessage('Permissão negada', 'Precisamos de acesso à sua galeria para trocar a foto.');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, aspect: [1, 1], quality: 0.5, base64: true,
        });
        if (!result.canceled) {
            setUpdating(true);
            try {
                const updatedUser = await uploadProfilePicture(result.assets[0].base64, userData.id);
                setUserData(updatedUser);
                showAlertMessage("Sucesso", "Foto de perfil atualizada!");
            } catch (error) {
                showAlertMessage("Erro", `Não foi possível atualizar sua foto: ${error.message}`);
            } finally {
                setUpdating(false);
            }
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
        if (!editValue.trim() && editField !== "telefone") { 
            showAlertMessage("Erro", "O campo não pode estar vazio");
            return;
        }
        setUpdating(true);
        try {
            const updatedData = await updateUserProfile({ [editField]: editValue.trim() || null });
            setUserData(updatedData);
            setEditModalVisible(false);
            showAlertMessage("Sucesso", "Dados atualizados com sucesso!");
        } catch (error) {
            showAlertMessage("Erro", "Não foi possível atualizar os dados.");
        } finally {
            setUpdating(false);
        }
    };

    const handleDocumentVerification = () => {
        if (userData.status_verificacao === "NAO_VERIFICADO" || userData.status_verificacao === "REPROVADO") {
            navigation.navigate("VerifyIdentity");
        } else if (userData.status_verificacao === "PENDENTE") {
            showAlertMessage("Verificação Pendente", "Seus documentos estão em análise.");
        } else if (userData.status_verificacao === "APROVADO") {
            showAlertMessage("Verificação Aprovada", "Seus documentos já foram verificados!");
        }
    };

    const getStatusVerificacaoTexto = (status) => {
        const statusMap = { "NAO_VERIFICADO": "não verificado", "PENDENTE": "pendente", "APROVADO": "aprovado", "REPROVADO": "reprovado" };
        return statusMap[status] || "não verificado";
    };

    const getStatusVerificacaoIcone = (status) => {
        if (status === "APROVADO") return { name: "checkmark-circle", color: "#28a745" };
        if (status === "PENDENTE") return { name: "time-outline", color: "#ffc107" };
        if (status === "REPROVADO") return { name: "close-circle", color: "#dc3545" };
        return { name: "alert-circle", color: "#6c757d" };
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Header title="Perfil" leftIcon="menu" onLeftPress={() => setMenuVisible(true)} showLogo={true} />
                    <View style={[styles.profileContent, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
                        <ActivityIndicator size="large" color="#03A9F4" />
                        <Text style={{ marginTop: 10, color: '#666' }}>Carregando perfil...</Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
    if (!userData) {
         return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Header title="Perfil" leftIcon="menu" onLeftPress={() => setMenuVisible(true)} showLogo={true} />
                    <View style={[styles.profileContent, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
                        <Text style={{ color: '#666' }}>Erro ao carregar dados do perfil.</Text>
                        <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: '#03A9F4', borderRadius: 5 }} onPress={loadUserData}>
                            <Text style={{ color: '#fff' }}>Tentar Novamente</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
                <ScrollView 
                    style={{ flex: 1 }} 
                    contentContainerStyle={styles.profileContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Avatar e Infos */}
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            {updating ? (
                                <ActivityIndicator color="#03A9F4" />
                            ) : userData.foto_perfil_url ? (
                                <Image
                                    source={{ uri: userData.foto_perfil_url }}
                                    style={styles.avatarImage}
                                />
                            ) : (
                                <Ionicons name="person" size={60} color="#6c757d" />
                            )}
                        </View>
                        <TouchableOpacity style={styles.avatarEditButton} onPress={handlePickImage} disabled={updating}>
                            <Ionicons name="camera" size={16} style={styles.avatarEditIcon} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.userInfo}>
                        <View style={styles.userNameContainer}>
                            <Text style={styles.userName}>{userData.nome_completo || "Usuário"}</Text>
                            {userData.status_verificacao === "APROVADO" && (
                                <Ionicons name="checkmark-circle" size={20} color="#28a745" style={styles.verifiedIcon} />
                            )}
                        </View>
                        <Text style={styles.userEmail}>{userData.email || "Email não informado"}</Text>
                    </View>

                    {/* Campos Editáveis */}
                    <View style={styles.editableField}>
                        <Text style={styles.fieldText}>
                            {userData.telefone || "Telefone não informado"}
                        </Text>
                        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit("phone")}>
                            <Text style={styles.editButtonText}>editar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.editableField}>
                        <Text style={styles.fieldText}>
                            {userData.nome_completo || "Nome não informado"}
                        </Text>
                        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit("name")}>
                            <Text style={styles.editButtonText}>editar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Status Cards */}
                    <View style={styles.statusCardsContainer}>
                        <TouchableOpacity style={styles.statusCard} onPress={handleDocumentVerification} activeOpacity={0.7}>
                            <Text style={styles.cardTitle}>Status validação dos documentos</Text>
                            <View style={styles.statusIconContainer}>
                                <Ionicons 
                                    name={getStatusVerificacaoIcone(userData.status_verificacao).name}
                                    size={40} 
                                    color={getStatusVerificacaoIcone(userData.status_verificacao).color}
                                />
                            </View>
                            <Text style={styles.statusText}>{getStatusVerificacaoTexto(userData.status_verificacao)}</Text>
                            {(userData.status_verificacao === "NAO_VERIFICADO" || userData.status_verificacao === "REPROVADO") && (
                                <Text style={styles.verifyHint}>Toque para verificar</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.statusCard}>
                            <Text style={styles.cardTitle}>Última verificação de localização</Text>
                            <View style={styles.statusIconContainer}>
                                <Ionicons name="time-outline" size={40} color="#333" />
                            </View>
                            <Text style={styles.statusText}>
                                {userData.ultima_localizacao ? new Date(userData.ultima_localizacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : "Não disponível"}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>                

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
                            <Text style={styles.modalTitle}>{editField === "telefone" ? "Editar Telefone" : "Editar Nome"}</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.closeButton}>
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
                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveEdit} disabled={updating}>
                                {updating ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Salvar</Text>}
                            </TouchableOpacity>
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
        </SafeAreaView>
    );
}