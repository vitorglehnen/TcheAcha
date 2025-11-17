import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { styles } from './Alert.styles';

const Alert = ({ isVisible, title, message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel', input }) => {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    if (input) {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {input && (
            <TextInput
              style={styles.input}
              placeholder={input.placeholder}
              onChangeText={setInputValue}
              value={inputValue}
            />
          )}
          <View style={styles.buttonContainer}>
            {onCancel && (
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Alert;
