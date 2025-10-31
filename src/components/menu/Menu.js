import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { styles } from './Menu.styles';

const Menu = ({ visible, onClose, navigation }) => {

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigation.navigate('Login'); 
      onClose();
      
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menu</Text>
          
          {/* Navigation Items */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              navigation.navigate('Home');
              onClose();
            }}
          >
            <Ionicons name="home-outline" size={24} color="#1A233D" />
            <Text style={styles.menuItemText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              navigation.navigate('MyCases');
              onClose();
            }}
          >
            <Ionicons name="briefcase-outline" size={24} color="#1A233D" />
            <Text style={styles.menuItemText}>Meus Casos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              navigation.navigate('RegisterCase');
              onClose();
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color="#1A233D" />
            <Text style={styles.menuItemText}>Cadastrar Desaparecido</Text>
          </TouchableOpacity>  

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              navigation.navigate('Map');
              onClose();
            }}
          >
            <Ionicons name="map-outline" size={24} color="#1A233D" />
            <Text style={styles.menuItemText}>Mapa</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              navigation.navigate('Profile');
              onClose();
            }}
          >
            <Ionicons name="person-outline" size={24} color="#1A233D" />
            <Text style={styles.menuItemText}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              navigation.navigate('Settings');
              onClose();
            }}
          >
            <Ionicons name="settings-outline" size={24} color="#1A233D" />
            <Text style={styles.menuItemText}>Configurações</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Logout */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
            <Text style={[styles.menuItemText, { color: '#e74c3c' }]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default Menu;