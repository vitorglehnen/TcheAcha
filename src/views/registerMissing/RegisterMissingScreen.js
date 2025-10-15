import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
//import * as ImagePicker from "expo-image-picker";
import styles from "./styles";
import Header from "../../components/header/Header";
import Menu from "../../components/menu/Menu";

export default function RegisterMissingScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("PESSOA");
  const [status, setStatus] = useState("ATIVO");
  const [name, setName] = useState("");
  const [characteristics, setCharacteristics] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [image, setImage] = useState(null);
  const [isMenuVisible, setMenuVisible] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const [isMenuVisible, setMenuVisible] = useState(false);
    
    if (status !== "granted") {
      alert("Desculpe, precisamos de permissão para acessar suas fotos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {

    console.log({
      title,
      type,
      status,
      name,
      characteristics,
      description,
      location,
      contact,
      image,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header
        title="Cadastrar Desaparecido"
        description="Abaixo consta uma lista de desaparecidos na sua região. Nos auxilie nas buscas e venha fazer parte dessa comunidade."
        leftIcon="menu"
        onLeftPress={() => setMenuVisible(true)}
        showLogo={true}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Title Input */}
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Digite o título"
          placeholderTextColor="#999"
        />

        {/* Type and Status Row */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Tipo:</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={styles.picker}
                onPress={() => {
                  // Toggle between PESSOA and ANIMAL
                  setType(type === "PESSOA" ? "ANIMAL" : "PESSOA");
                }}
              >
                <Text style={styles.pickerText}>{type}</Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>Status:</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={styles.picker}
                onPress={() => {
                  // Toggle between ATIVO and INATIVO
                  setStatus(status === "ATIVO" ? "INATIVO" : "ATIVO");
                }}
              >
                <Text style={[styles.pickerText, styles.statusActive]}>
                  {status}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Name Input */}
        <Text style={styles.label}>Nome desaparecido</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite o nome"
          placeholderTextColor="#999"
        />

        {/* Characteristics Input */}
        <Text style={styles.label}>Características do desaparecido(a)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={characteristics}
          onChangeText={setCharacteristics}
          placeholder="Descreva as características"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Description Input */}
        <Text style={styles.label}>Descrição do caso</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descreva o caso"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Location Input */}
        <Text style={styles.label}>Localização desaparecimento</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Digite a localização"
          placeholderTextColor="#999"
        />

        {/* Contact Input */}
        <Text style={styles.label}>Contato público:</Text>
        <TextInput
          style={styles.input}
          value={contact}
          onChangeText={setContact}
          placeholder="(51) 9 9999-9999"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />

        {/* Upload Photo */}
        <Text style={styles.label}>Carregar foto:</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>Upload mídia</Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image }} style={styles.previewImage} />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleSubmit}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {isMenuVisible && (
        <Menu
          visible={isMenuVisible}
          onClose={() => setMenuVisible(false)}
          navigation={navigation}
        />
      )}
    </View>
  );
}
