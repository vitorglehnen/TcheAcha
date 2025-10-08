import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './DocumentCaptureScreen.styles';

export default function DocumentCaptureScreen() {
    const navigation = useNavigation();
    const route = useRoute(); // Para receber os parâmetros
    const [front, setFront] = useState(null);
    const [back, setBack] = useState(null);
    const allDone = !!front && !!back;

    // Acessa o status da selfie dos parâmetros da rota
    const selfieIsDone = route.params?.selfieDone || false;

    async function takePhoto(setter) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Autorize o uso da câmera para continuar.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            quality: 0.7,
            allowsEditing: false,
        });
        if (!result.canceled) {
            setter(result.assets[0]);
        }
    }

    function handleContinue() {
        if (allDone) {
            // **AJUSTE**: Navega de volta enviando o novo status do documento (true)
            // e preservando o status da selfie que foi recebido.
            navigation.navigate('VerifyIdentity', { docDone: true, selfieDone: selfieIsDone });
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Captura do documento</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.subtitle}>Posicione seu documento dentro do pontilhado.</Text>

                <View style={styles.box}>
                    {front ? (
                        <Image source={{ uri: front.uri }} style={styles.preview} resizeMode="cover" />
                    ) : (
                        <View style={styles.placeholder}><Text style={styles.placeholderText}>Lado frente</Text></View>
                    )}
                </View>
                <TouchableOpacity style={styles.cameraBtn} onPress={() => takePhoto(setFront)} activeOpacity={0.85}>
                    <Ionicons name="camera-outline" size={24} color="#000" />
                    <Text style={styles.cameraText}>Tire Foto</Text>
                </TouchableOpacity>

                <View style={[styles.box, { marginTop: 22 }]}>
                    {back ? (
                        <Image source={{ uri: back.uri }} style={styles.preview} resizeMode="cover" />
                    ) : (
                        <View style={styles.placeholder}><Text style={styles.placeholderText}>Lado verso</Text></View>
                    )}
                </View>
                <TouchableOpacity style={styles.cameraBtn} onPress={() => takePhoto(setBack)} activeOpacity={0.85}>
                    <Ionicons name="camera-outline" size={24} color="#000" />
                    <Text style={styles.cameraText}>Tire Foto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.cta, !allDone && styles.ctaDisabled]}
                    disabled={!allDone}
                    onPress={handleContinue}
                    activeOpacity={0.9}
                >
                    <Text style={styles.ctaText}>Continuar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

