import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import styles from "./RegisterCaseScreen.styles";
import Header from "../../components/header/Header";
import Menu from "../../components/menu/Menu";
import { useRoute } from "@react-navigation/native";
import { getCurrentUserStatusAndProfileId, saveCase } from "../../controllers/caseController";
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../styles/globalStyles';

const TIPO_CASO = { PESSOA: "PESSOA", ANIMAL: "ANIMAL" };
const STATUS_CASO = { ATIVO: "ATIVO", ENCONTRADO: "ENCONTRADO", CANCELADO: "CANCELADO" };

export default function RegisterCaseScreen({ navigation }) {
  const route = useRoute();
  const existingCase = route.params?.caso || null; 
  const isEditMode = !!existingCase;

  const [title, setTitle] = useState(existingCase?.titulo || "");
  const [type, setType] = useState(existingCase?.tipo || TIPO_CASO.PESSOA);
  const [status, setStatus] = useState(existingCase?.status || STATUS_CASO.ATIVO);
  const [name, setName] = useState(existingCase?.nome_desaparecido || "");
  const [characteristics, setCharacteristics] = useState(existingCase?.caracteristicas?.info || "");
  const [description, setDescription] = useState(existingCase?.descricao || "");
  
  const [location, setLocation] = useState(
    existingCase?.localizacao_desaparecimento?.coordinates ? 
    `${existingCase.localizacao_desaparecimento.coordinates[1]}, ${existingCase.localizacao_desaparecimento.coordinates[0]}` 
    : ""
  );
  const [enderecoFormatado, setEnderecoFormatado] = useState(existingCase?.endereco_desaparecimento_formatado || "");
  
  const [date, setDate] = useState(existingCase ? new Date(existingCase.data_desaparecimento) : new Date());
  const [contact, setContact] = useState(existingCase?.contato_publico || "");
  
  const [image, setImage] = useState(existingCase?.midias_urls?.[0] || null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const profile = await getCurrentUserStatusAndProfileId();
        setUserProfile(profile);
        if (!profile || !profile.isVerified) {
          Alert.alert(
            "Verificação Necessária",
            "Você precisa ser um usuário verificado para criar ou editar um caso.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível verificar seu status. Tente novamente.");
        navigation.goBack();
      }
    };
    loadUserData();
  }, [navigation]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Desculpe, precisamos de permissão para acessar suas fotos!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    if (!title || !name || !description || !contact || !location || !enderecoFormatado) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    setLoading(true);
    try {
      const formData = {
        title, type, status, name, characteristics, description,
        location,
        enderecoFormatado,
        date, contact, imageBase64,
      };

      const savedCase = await saveCase(formData, existingCase, userProfile);
      
      Alert.alert(
        "Sucesso!",
        `Caso ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso.`,
        [{ text: "OK", onPress: () => navigation.navigate('MyCases') }]
      );

      navigation
    
    } catch (error) {
      console.error("Erro ao salvar caso:", error);
      Alert.alert("Erro ao Salvar", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={isEditMode ? "Editar Caso" : "Cadastrar Caso"}
        leftIcon="menu"
        onLeftPress={() => setMenuVisible(true)}
        showLogo={false}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Título*</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ex: João desapareceu no Bairro Centro" placeholderTextColor="#999" />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Tipo*:</Text>
            <TouchableOpacity style={styles.picker} onPress={() => setType(type === TIPO_CASO.PESSOA ? TIPO_CASO.ANIMAL : TIPO_CASO.PESSOA)}>
              <Text style={styles.pickerText}>{type}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Status*:</Text>
            <TouchableOpacity style={styles.picker} onPress={() => setStatus(status === STATUS_CASO.ATIVO ? STATUS_CASO.ENCONTRADO : STATUS_CASO.ATIVO)}>
              <Text style={[styles.pickerText, status === 'ATIVO' && styles.statusActive]}>{status}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Nome do Desaparecido(a)*</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Digite o nome" placeholderTextColor="#999" />
        
        <Text style={styles.label}>Data do Desaparecimento*</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.datePickerText}>{date.toLocaleDateString('pt-BR')}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={date} mode="date" is24Hour={true} display="default" onChange={onChangeDate} />
        )}

        <Text style={styles.label}>Características (opcional)</Text>
        <TextInput style={[styles.input, styles.textArea]} value={characteristics} onChangeText={setCharacteristics} placeholder="Cor do cabelo, altura, raça do animal, etc." placeholderTextColor="#999" multiline numberOfLines={4} />

        <Text style={styles.label}>Descrição do Caso*</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Descreva o que aconteceu, roupas, etc." placeholderTextColor="#999" multiline numberOfLines={4} />

        <Text style={styles.label}>Coordenadas (Lat, Lon)*</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Ex: -29.4645, -51.9688"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
        
        <Text style={styles.label}>Endereço Formatado*</Text>
         <TextInput
          style={styles.input}
          value={enderecoFormatado}
          onChangeText={setEnderecoFormatado}
          placeholder="Ex: Rua João da Silva, Bairro Centro, Lajeado"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Contato Público (Telefone/WhatsApp)*</Text>
        <TextInput style={styles.input} value={contact} onChangeText={setContact} placeholder="(51) 9 9999-9999" placeholderTextColor="#999" keyboardType="phone-pad" />

        <Text style={styles.label}>Foto Principal:</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>{image ? "Trocar Imagem" : "Carregar Imagem"}</Text>
        </TouchableOpacity>

        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => { setImage(null); setImageBase64(null); }}>
              <Ionicons name="close" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={[styles.fab, loading && styles.fabDisabled]} 
        onPress={handleSubmit}
        disabled={loading || !userProfile?.isVerified}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Ionicons name={isEditMode ? "save" : "add"} size={32} color="#fff" />
        )}
      </TouchableOpacity>

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