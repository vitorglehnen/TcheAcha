import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import styles from "./MapScreen.styles";

// Mock data - casos no mapa
const mockMapCases = [
  {
    id: 1,
    nome: "Paulo César Tinga",
    dataNascimento: "05/10/2004",
    diasDesaparecido: 365,
    latitude: -30.0346,
    longitude: -51.2177,
    foto: null,
  },
  {
    id: 2,
    nome: "Maria da Silva",
    dataNascimento: "12/03/1998",
    diasDesaparecido: 180,
    latitude: -30.0277,
    longitude: -51.2287,
    foto: null,
  },
  {
    id: 3,
    nome: "João Santos",
    dataNascimento: "20/07/2010",
    diasDesaparecido: 45,
    latitude: -30.0466,
    longitude: -51.2096,
    foto: null,
  },
];

// Dark mode map style
const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#242f3e" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#746855" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#242f3e" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

export default function MapScreen({ navigation }) {
  const [selectedCase, setSelectedCase] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    tipoPessoa: false,
    tipoAnimal: false,
    idadeMin: "",
    idadeMax: "",
    tempoMin: "",
    tempoMax: "",
  });

  const handleCasePress = (caso) => {
    setSelectedCase(caso);
  };

  const handleCloseDetails = () => {
    setSelectedCase(null);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const applyFilters = () => {
    console.log("Filtros aplicados:", filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      tipoPessoa: false,
      tipoAnimal: false,
      idadeMin: "",
      idadeMax: "",
      tempoMin: "",
      tempoMax: "",
    });
    setShowFilters(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Mapa de Desaparecimentos</Text>
        </View>
      </View>

      {/* Mapa com react-native-maps */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={darkMapStyle}
        initialRegion={{
          latitude: -30.0346,
          longitude: -51.2177,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marcadores dos casos */}
        {mockMapCases.map((caso) => (
          <Marker
            key={caso.id}
            coordinate={{
              latitude: caso.latitude,
              longitude: caso.longitude,
            }}
            onPress={() => handleCasePress(caso)}
          >
            <View style={styles.customMarker}>
              <View style={styles.markerCircle}>
                {caso.foto ? (
                  <Image source={{ uri: caso.foto }} style={styles.markerImage} />
                ) : (
                  <Ionicons name="person" size={24} color="#fff" />
                )}
              </View>
              <View style={styles.markerPointer} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Botão de Filtro */}
      <TouchableOpacity style={styles.filterButton} onPress={toggleFilters}>
        <Ionicons name="filter" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Card de Detalhes do Caso Selecionado */}
      {selectedCase && (
        <View style={styles.caseDetailsCard}>
          <View style={styles.caseDetailsHeader}>
            <Text style={styles.caseDetailsName}>{selectedCase.nome}</Text>
            <TouchableOpacity onPress={handleCloseDetails}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <Text style={styles.caseDetailsDate}>
            Nascido em: {selectedCase.dataNascimento}
          </Text>
          <View style={styles.caseDetailsBadge}>
            <Text style={styles.caseDetailsBadgeText}>
              Desaparecido a {selectedCase.diasDesaparecido} dias
            </Text>
          </View>
          <TouchableOpacity style={styles.caseDetailsButton}>
            <Text style={styles.caseDetailsButtonText}>Ver mais detalhes</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de Filtros */}
      <Modal
        visible={showFilters}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleFilters}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterPanel}>
            <Text style={styles.filterTitle}>Painel de Filtros</Text>

            {/* Tipo */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Tipo:</Text>
              <View style={styles.checkboxGroup}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() =>
                    setFilters({ ...filters, tipoPessoa: !filters.tipoPessoa })
                  }
                >
                  <View
                    style={[
                      styles.checkbox,
                      filters.tipoPessoa && styles.checkboxChecked,
                    ]}
                  >
                    {filters.tipoPessoa && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>Pessoa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() =>
                    setFilters({ ...filters, tipoAnimal: !filters.tipoAnimal })
                  }
                >
                  <View
                    style={[
                      styles.checkbox,
                      filters.tipoAnimal && styles.checkboxChecked,
                    ]}
                  >
                    {filters.tipoAnimal && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>Animal</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Idade */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Idade:</Text>
              <View style={styles.rangeInputs}>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Min"
                  keyboardType="numeric"
                  value={filters.idadeMin}
                  onChangeText={(text) =>
                    setFilters({ ...filters, idadeMin: text })
                  }
                />
                <Text style={styles.rangeSeparator}>-</Text>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Max"
                  keyboardType="numeric"
                  value={filters.idadeMax}
                  onChangeText={(text) =>
                    setFilters({ ...filters, idadeMax: text })
                  }
                />
              </View>
            </View>

            {/* Tempo de desaparecimento */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Tempo de desaparecimento:</Text>
              <View style={styles.rangeInputs}>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Min (dias)"
                  keyboardType="numeric"
                  value={filters.tempoMin}
                  onChangeText={(text) =>
                    setFilters({ ...filters, tempoMin: text })
                  }
                />
                <Text style={styles.rangeSeparator}>-</Text>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Max (dias)"
                  keyboardType="numeric"
                  value={filters.tempoMax}
                  onChangeText={(text) =>
                    setFilters({ ...filters, tempoMax: text })
                  }
                />
              </View>
            </View>

            {/* Botões */}
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Ionicons name="close-circle" size={28} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Ionicons name="checkmark-circle" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}