import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './VerifyIdentityScreen.styles'; // Seus estilos locais

// Importando sua instância do Supabase
import { supabase } from '../../lib/supabase'; // Ajuste o caminho se for diferente

export default function VerifyIdentityScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    // Estado para controlar a conclusão de cada etapa
    const [docOk, setDocOk] = useState(route.params?.docDone || false);
    const [selfieOk, setSelfieOk] = useState(route.params?.selfieDone || false);

    // Estado para controlar o feedback de carregamento no botão
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efeito para atualizar o estado quando o usuário volta das telas de captura
    useEffect(() => {
        if (route.params?.docDone !== undefined) {
            setDocOk(route.params.docDone);
        }
        if (route.params?.selfieDone !== undefined) {
            setSelfieOk(route.params.selfieDone);
        }
    }, [route.params]);

    // O botão principal só é habilitado quando ambas as etapas são concluídas
    const canContinue = useMemo(() => docOk && selfieOk, [docOk, selfieOk]);

    // Função para enviar os dados e navegar
    const handleSendForVerification = async () => {
        if (!canContinue || isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Pega o usuário autenticado no Supabase
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                Alert.alert("Erro de Autenticação", "Não foi possível identificar o usuário. Por favor, faça login novamente.");
                setIsSubmitting(false);
                return;
            }

            // Atualiza a tabela 'usuarios' com o status 'PENDENTE'
            // Usando a coluna 'auth_user_id' como no seu arquivo HomeScreen.js
            const { error: updateError } = await supabase
                .from('usuarios')
                .update({ status_verificacao: 'PENDENTE' })
                .eq('auth_user_id', user.id);

            if (updateError) {
                // Se houver um erro, lança para o bloco catch
                throw updateError;
            }

            Alert.alert("Sucesso!", "Seus documentos foram enviados para análise. Você será redirecionado para a tela inicial.");

            // Navega para a HomeScreen e reseta o histórico de navegação
            // para que o usuário não possa voltar para a tela de verificação
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });

        } catch (error) {
            console.error("Erro ao enviar para verificação:", error.message);
            Alert.alert("Erro", "Não foi possível enviar seus documentos para verificação. Tente novamente mais tarde.");
        } finally {
            // Garante que o estado de submissão seja resetado
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Verificação de identidade</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Card do Documento de Identidade */}
                <TouchableOpacity
                    style={styles.card}
                    activeOpacity={0.85}
                    // Passa o estado atual para a próxima tela para não perdê-lo
                    onPress={() => navigation.navigate('DocumentCapture', { docDone: docOk, selfieDone: selfieOk })}
                >
                    <View style={styles.cardLeft}>
                        <Ionicons name="id-card-outline" size={28} color="#000" />
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={styles.cardTitle}>Documento de Identidade</Text>
                        <Text style={styles.cardSubtitle}>Foto da sua CNH ou RG</Text>
                    </View>
                    <View style={styles.cardRight}>
                        {docOk
                            ? <Ionicons name="checkmark-circle" size={24} color="green" />
                            : <View style={styles.circle} />
                        }
                    </View>
                </TouchableOpacity>

                {/* Card da Selfie */}
                <TouchableOpacity
                    style={styles.card}
                    activeOpacity={0.85}
                    // Passa o estado atual para a próxima tela para não perdê-lo
                    onPress={() => navigation.navigate('SelfieCapture', { docDone: docOk, selfieDone: selfieOk })}
                >
                    <View style={styles.cardLeft}>
                        <Ionicons name="camera-outline" size={28} color="#000" />
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={styles.cardTitle}>Selfie</Text>
                        <Text style={styles.cardSubtitle}>Tire uma foto do seu rosto</Text>
                    </View>
                    <View style={styles.cardRight}>
                        {selfieOk
                            ? <Ionicons name="checkmark-circle" size={24} color="green" />
                            : <View style={styles.circle} />
                        }
                    </View>
                </TouchableOpacity>

                {/* Botão de Ação Principal */}
                <TouchableOpacity
                    style={[styles.primaryBtn, (!canContinue || isSubmitting) && styles.primaryBtnDisabled]}
                    onPress={handleSendForVerification}
                    disabled={!canContinue || isSubmitting}
                    activeOpacity={0.9}
                >
                    <Text style={styles.primaryText}>
                        {isSubmitting ? 'Enviando...' : 'Enviar para Verificação'}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.hint}>
                    Ao continuar, seus documentos serão enviados para análise. Após aprovação, você poderá cadastrar ou auxiliar em casos no TchêAcha.
                </Text>
            </ScrollView>
        </View>
    );
}

