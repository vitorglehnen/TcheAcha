import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

const userData = {
    name: "Fulano de tal",
    email: "emaildofulano@gmail.com",
    phone: "+55 51 99999-9999",
    cases: 0,
    avatarUrl: null,
    verified: true,
    documentStatus: "aprovado",
    lastLocationTime: "17:22",
};

export default function ProfileScreen({ navigation }) {
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#03A9F4" />
            <View style={styles.container}>
                {/* Cabeçalho */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                     <Text style={styles.headerTitle}>Seu Perfil</Text>
                     <TouchableOpacity onPress={handleSettings}>
                        <Ionicons name="settings-outline" size={28} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Conteúdo Principal */}
                <View style={styles.profileContent}>
                    {/* Avatar e Infos */}
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            {userData.avatarUrl ? (
                                <Image
                                    source={{ uri: userData.avatarUrl }}
                                    style={styles.avatarImage}
                                />
                            ) : (
                                <Ionicons name="person" size={60} color="#6c757d" />
                            )}
                        </View>
                    </View>

                    <View style={styles.userInfo}>
                        <View style={styles.userNameContainer}>
                            <Text style={styles.userName}>{userData.name}</Text>
                            {userData.verified && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={20}
                                    color="#28a745"
                                    style={styles.verifiedIcon}
                                />
                            )}
                        </View>
                        <Text style={styles.userEmail}>{userData.email}</Text>
                    </View>

                    <View style={styles.casesContainer}>
                        <Text style={styles.casesNumber}>{userData.cases}</Text>
                        <Text style={styles.casesText}>casos envolvidos</Text>
                    </View>

                    {/* Campos Editáveis */}
                    <View style={styles.editableField}>
                        <Text style={styles.fieldText}>{userData.phone}</Text>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEdit("phone")}
                        >
                            <Text style={styles.editButtonText}>editar</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.editableField}>
                        <Text style={styles.fieldText}>{userData.name}</Text>
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
                                <Ionicons name="checkmark-circle" size={40} color="#28a745" />
                            </View>
                            <Text style={styles.statusText}>{userData.documentStatus}</Text>
                        </View>

                        <View style={styles.statusCard}>
                            <Text style={styles.cardTitle}>Última verificação de localização</Text>
                            <View style={styles.statusIconContainer}>
                                <Ionicons name="time-outline" size={40} color="#333" />
                            </View>
                            <Text style={styles.statusText}>{userData.lastLocationTime}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}