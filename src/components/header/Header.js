import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Header.styles';

/**
 * Componente de Cabeçalho reutilizável.
 * @param {object} props
 * @param {string} props.title - O título principal a ser exibido.
 * @param {string} props.description - A descrição a ser exibida abaixo do título.
 * @param {function} props.onLeftPress - Função para o ícone da esquerda.
 * @param {string} props.leftIcon - Nome do ícone da esquerda (ex: 'menu', 'arrow-back').
 * @param {boolean} props.showLogo - Define se o logo deve ser exibido.
 */
const Header = ({ title, description, onLeftPress, leftIcon, showLogo = true }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Linha superior com ícones e logo */}
      <View style={styles.headerTopRow}>
        <View style={styles.leftIconContainer}>
          {leftIcon && (
            <TouchableOpacity onPress={onLeftPress}>
              <Ionicons name={leftIcon} size={32} color="#1A233D" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.rightContentContainer}>
          {showLogo && (
            <Image 
              source={require('../../../assets/logo.png')} 
              style={styles.logo} 
            />
          )}
        </View>
      </View>

      {/* Título e Descrição (renderizados se existirem) */}
      {title && <Text style={styles.title}>{title}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};

export default Header;