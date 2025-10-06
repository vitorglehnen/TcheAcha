import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './NavBar.styles';

const NavBar = ({ onHomePress, onAddPress, onProfilePress, activeScreen }) => {
  // Cria um array com os componentes de botão que devem ser visíveis
  const visibleButtons = [];

  if (onHomePress) {
    visibleButtons.push(
      <TouchableOpacity key="home" style={styles.navButton} onPress={onHomePress}>
        <Ionicons 
          name={activeScreen === 'Home' ? "home" : "home-outline"} 
          size={28} 
          style={styles.icon} 
        />
      </TouchableOpacity>
    );
  }
  if (onAddPress) {
    visibleButtons.push(
      <TouchableOpacity key="add" style={[styles.navButton, styles.plusButton]} onPress={onAddPress}>
        <Ionicons name="add" size={32} style={styles.plusIcon} />
      </TouchableOpacity>
    );
  }
  if (onProfilePress) {
    visibleButtons.push(
      <TouchableOpacity key="profile" style={styles.navButton} onPress={onProfilePress}>
        <Ionicons 
          name={activeScreen === 'Profile' ? "person" : "person-outline"} 
          size={28} 
          style={styles.icon} 
        />
      </TouchableOpacity>
    );
  }

  // Se não houver botões para mostrar, não renderiza nada
  if (visibleButtons.length === 0) {
    return null;
  }

  // Determina o estilo de alinhamento com base na quantidade de botões
  const justifyContent = visibleButtons.length === 1 ? 'center' : 'space-around';

  return (
    <View style={[styles.navBar, { justifyContent }]}>
      {visibleButtons}
    </View>
  );
};

export default NavBar;