import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import styles from "./MapScreen.styles";
import { useLocation } from "../../utils/locationHook";
import { getUserData } from "../../controllers/authController";
import { getActiveCasesForHome } from "../../controllers/caseController";

// Coordenadas padrão - Porto Alegre
const DEFAULT_REGION = {
  latitude: -30.0346,
  longitude: -51.2177,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

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
  const mapRef = useRef(null);
  const { location, getLocation } = useLocation();
  
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
  
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [initialRegion, setInitialRegion] = useState(DEFAULT_REGION);

  // Carrega localização do usuário e dados ao montar
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // 1. Obter dados do usuário
      const user = await getUserData();
      setUserData(user);
      console.log("MapScreen: Usuário carregado:", user?.nome_completo);

      // 2. Obter localização
      const loc = await getLocation();
      if (loc) {
        const userRegion = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setInitialRegion(userRegion);
        console.log("MapScreen: Localização do usuário obtida");
        
        // Move o mapa para a localização do usuário
        if (mapRef.current) {
          mapRef.current.animateToRegion(userRegion, 1000);
        }
      } else {
        console.log("MapScreen: Usando localização padrão (Porto Alegre)");
      }

      // 3. Buscar casos próximos
      const fetchedCases = await getActiveCasesForHome(
        loc?.coords.latitude,
        loc?.coords.longitude,
        100 // Buscar mais casos para o mapa
      );
      
      // Converte os casos para o formato do mapa
      const mappedCases = fetchedCases
        .filter(caso => caso.localizacao_desaparecimento) // Apenas casos com localização
        .map(caso => {
          console.log("MapScreen: Processando caso:", caso.nome_desaparecido);
          console.log("MapScreen: Localização raw:", caso.localizacao_desaparecimento);
          
          // Parse da localização Geography (formato: POINT(longitude latitude))
          const locString = String(caso.localizacao_desaparecimento);
          const match = locString.match(/POINT\(([^ ]+) ([^ ]+)\)/);
          
          if (!match) {
            console.warn("MapScreen: Formato de localização inválido para caso:", caso.nome_desaparecido);
            return null;
          }
          
          const longitude = parseFloat(match[1]);
          const latitude = parseFloat(match[2]);
          
          console.log("MapScreen: Coordenadas parseadas:", { latitude, longitude });
          
          if (isNaN(latitude) || isNaN(longitude)) {
            console.warn("MapScreen: Coordenadas inválidas (NaN) para caso:", caso.nome_desaparecido);
            return null;
          }

          // Pega a primeira foto do array midias_urls
          const foto = caso.midias_urls && caso.midias_urls.length > 0 
            ? caso.midias_urls[0] 
            : null;

          const mappedCase = {
            id: caso.id,
            nome: caso.nome_desaparecido,
            tipo: caso.tipo || 'PESSOA',
            dataNascimento: caso.data_desaparecimento,
            diasDesaparecido: caso.diasDesaparecido,
            latitude,
            longitude,
            foto,
            caseData: caso, // Mantém dados completos para navegação
          };
          
          console.log("MapScreen: Caso mapeado com sucesso:", mappedCase.nome);
          return mappedCase;
        })
        .filter(Boolean); // Remove casos inválidos

      console.log(`MapScreen: ${mappedCases.length} casos carregados no mapa`);
      setCases(mappedCases);
      setFilteredCases(mappedCases);

    } catch (error) {
      console.error("MapScreen: Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os casos no mapa.");
    } finally {
      setLoading(false);
    }
  };

  const handleCasePress = (caso) => {
    setSelectedCase(caso);
  };

  const handleCloseDetails = () => {
    setSelectedCase(null);
  };

  const handleViewDetails = () => {
    if (!userData) {
      Alert.alert(
        "Login Necessário",
        "Você precisa fazer login para ver os detalhes do caso.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Fazer Login", onPress: () => navigation.navigate("Login") },
        ]
      );
      return;
    }

    if (userData.status_verificacao !== "APROVADO") {
      Alert.alert(
        "Verificação Necessária",
        "Você precisa ter seus documentos validados para ver os detalhes dos casos.",
        [
          { text: "OK", style: "default" },
        ]
      );
      return;
    }

    // Usuário está validado, navegar para detalhes
    // Passa o objeto caso completo (caseData) em vez de apenas o ID
    navigation.navigate("CaseDetails", { 
      caso: {
        id: selectedCase.id,
        ...selectedCase.caseData
      }
    });
    setSelectedCase(null);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const applyFilters = () => {
    console.log("MapScreen: Aplicando filtros:", filters);
    
    let filtered = [...cases];

    // Filtro por tipo
    if (filters.tipoPessoa && !filters.tipoAnimal) {
      filtered = filtered.filter(c => c.tipo === 'PESSOA');
    } else if (filters.tipoAnimal && !filters.tipoPessoa) {
      filtered = filtered.filter(c => c.tipo === 'ANIMAL');
    }

    // Filtro por idade (calculada a partir da data de nascimento)
    if (filters.idadeMin || filters.idadeMax) {
      const min = parseInt(filters.idadeMin) || 0;
      const max = parseInt(filters.idadeMax) || 999;
      
      filtered = filtered.filter(c => {
        const birthDate = new Date(c.dataNascimento);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        return age >= min && age <= max;
      });
    }

    // Filtro por tempo de desaparecimento
    if (filters.tempoMin || filters.tempoMax) {
      const min = parseInt(filters.tempoMin) || 0;
      const max = parseInt(filters.tempoMax) || 99999;
      
      filtered = filtered.filter(c => {
        return c.diasDesaparecido >= min && c.diasDesaparecido <= max;
      });
    }

    console.log(`MapScreen: ${filtered.length} casos após filtros`);
    setFilteredCases(filtered);
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
    setFilteredCases(cases); // Restaura todos os casos
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

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#03A9F4" />
          <Text style={styles.loadingText}>Carregando casos...</Text>
        </View>
      )}

      {/* Mapa com react-native-maps */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={darkMapStyle}
        initialRegion={initialRegion}
      >
        {/* Marcadores dos casos */}
        {filteredCases.map((caso) => (
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
                  <Ionicons 
                    name={caso.tipo === 'ANIMAL' ? 'paw' : 'person'} 
                    size={24} 
                    color="#fff" 
                  />
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
        {(filters.tipoPessoa || filters.tipoAnimal || filters.idadeMin || filters.idadeMax || filters.tempoMin || filters.tempoMax) && (
          <View style={styles.filterBadge} />
        )}
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
            Desaparecimento: {new Date(selectedCase.dataNascimento).toLocaleDateString('pt-BR')}
          </Text>
          <View style={styles.caseDetailsBadge}>
            <Text style={styles.caseDetailsBadgeText}>
              Desaparecido há {selectedCase.diasDesaparecido} dias
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.caseDetailsButton}
            onPress={handleViewDetails}
          >
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