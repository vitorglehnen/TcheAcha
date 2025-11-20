import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { styles } from './MapPickerScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS } from '../../styles/globalStyles';

// Importa o MapView condicionalmente
let MapView, PROVIDER_GOOGLE;
if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  MapView = maps.default;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
}

// Ponto inicial (Pode ser o centro do RS, ou Lajeado)
const initialRegion = {
  latitude: -29.4645,
  longitude: -51.9688,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapPickerScreen({ navigation, route }) {
  // Pega o nome da tela que chamou (ex: 'RegisterCase' ou 'CaseDetail')
  const { returnScreen } = route.params;

  const mapRef = useRef(null);
  const [pickedLocation, setPickedLocation] = useState(initialRegion);

  // Atualiza o estado com a localização do centro do mapa
  const handleRegionChange = (region) => {
    setPickedLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  // Botão para pular para a localização atual do usuário
  const goToMyLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não é possível buscar sua localização. Ative nas configurações.');
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01, // Zoom mais próximo
        longitudeDelta: 0.01,
      };
      mapRef.current?.animateToRegion(region, 1000); // Anima o mapa
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter la localização atual.');
    }
  };

  // Confirma a localização e volta para a tela anterior com os dados
  const handleConfirmLocation = () => {
    if (pickedLocation) {
      // Retorna para a tela que chamou, passando 'pickedLocation' como parâmetro
      navigation.navigate(returnScreen, { pickedLocation: pickedLocation });
    } else {
      Alert.alert("Erro", "Não foi possível selecionar a localização.");
    }
  };

  // Se for web, mostra o aviso
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webPlaceholderContainer}>
        <Text style={styles.webPlaceholderText}>
          O seletor de mapa não está disponível na versão web.
        </Text>
        <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.goBack()}>
          <Text style={styles.confirmButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChange} // Pega o centro do mapa
      />
      
      {/* Pino Fixo no Centro (Estilo Uber/iFood) */}
      <View style={styles.markerFixed}>
        <Ionicons name="location" size={48} color={COLORS.primary} />
      </View>

      {/* Botão de "Minha Localização" */}
      <TouchableOpacity style={styles.myLocationButton} onPress={goToMyLocation}>
        <Ionicons name="locate-outline" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>

      {/* Botão de Confirmação */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
        <Text style={styles.confirmButtonText}>Confirmar Localização</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}