import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

type FeedbackModalProps = {
  visible: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, type, title, message, onClose }) => {
  const isSuccess = type === 'success';
  const iconName = isSuccess ? 'check-circle' : 'alert-circle';
  const iconColor = isSuccess ? '#00B37E' : '#F75A68';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Feather name={iconName} size={48} color={iconColor} style={styles.icon} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Entendi</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  container: {
    backgroundColor: '#1A1B1F',
    width: '100%',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#26272B'
  },
  icon: {
    marginBottom: 16
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  message: {
    color: '#838896',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24
  },
  button: {
    backgroundColor: '#8162FF',
    width: '100%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16
  }
});
