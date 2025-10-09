import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./caseDetails.styles";
import Header from "../../components/header/Header";
import NavBar from "../../components/navbar/NavBar";
import Menu from "../../components/menu/Menu";

const mockCaseData = {
  name: "Fulano de tal",
  status: "ATIVO",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  imageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/SC_Internacional_Brazil_Logo.svg/250px-SC_Internacional_Brazil_Logo.svg.png",
  announcementDate: "10:10 a.m. - 12/12/2012",
};

const mockSightings = [
  {
    id: 1,
    title: "Edenílson",
    description: "Bah o guri era gente boa, pena que não quer jogar bola mais",
  },
  { id: 2, title: "Pavón", description: "Pero que sí, pero que no" },
  {
    id: 3,
    title: "Primeiro avistamento após anúncio",
    description: "Visto pela primeira vez após o anúncio oficial.",
  },
];

const TimelineItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.timelineItem}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.timelineHeader}>
        <Ionicons
          name={expanded ? "chevron-down" : "chevron-forward"}
          size={24}
          color="#ccc"
        />
        <Text style={styles.timelineTitle}>{item.title}</Text>
      </View>
      {expanded && (
        <View style={styles.timelineContent}>
          <Text style={styles.timelineDescription}>{item.description}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const CaseDetailScreen = ({ navigation }) => {
  const [caseData] = useState(mockCaseData);
  const [sightings] = useState(mockSightings);
  const [isMenuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Cabeçalho Customizado */}
      {
        <Header
          title="Detalhes do Caso"
          description="Acompanhe o caso"
          navigation={navigation}
          leftIcon="menu"
          onLeftPress={() => setMenuVisible(true)}
        />
      }

      <ScrollView>
        {/* Card Principal */}
        <View style={styles.caseCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-outline" size={24} color="#1A233D" />
            <Text style={styles.caseName}>{caseData.name}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{caseData.status}</Text>
            </View>
          </View>
          <Text style={styles.caseDescription}>{caseData.description}</Text>
          <Image source={{ uri: caseData.imageUrl }} style={styles.caseImage} />
          <Text style={styles.announcementDate}>
            Data do anúncio: {caseData.announcementDate}
          </Text>
        </View>

        {/* Timeline de Avistamentos */}
        <View style={styles.timelineContainer}>
          {sightings.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <NavBar
        activeScreen="CaseDetail"
        onHomePress={() => navigation?.navigate("Home")}
      />

      {isMenuVisible && (
        <Menu
          visible={isMenuVisible}
          onClose={() => setMenuVisible(false)}
          navigation={navigation}
        />
      )}
    </View>
  );
};

export default CaseDetailScreen;
