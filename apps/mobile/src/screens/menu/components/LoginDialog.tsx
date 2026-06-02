import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { styles } from '../menuStyles';

type LoginDialogProps = {
  onLoginPress: (email: string, password: string) => void;
  onRegisterPress: (name: string, email: string, password: string) => void;
  loading?: boolean;
  errorMessage?: string | null;
};

export const LoginDialog: React.FC<LoginDialogProps> = ({
  onLoginPress,
  onRegisterPress,
  loading = false,
  errorMessage = null,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (isRegistering) {
      onRegisterPress(name, email, password);
    } else {
      onLoginPress(email, password);
    }
  };

  return (
    <View style={styles.dialogCard}>
      <View style={styles.dialogTextGroup}>
        <Text style={styles.dialogTitle}>
          {isRegistering ? 'Crie sua conta' : 'Faça login na plataforma'}
        </Text>
        <Text style={styles.dialogSubtitle}>
          {isRegistering ? 'Preencha os dados abaixo' : 'Conecte-se para continuar'}
        </Text>
      </View>

      {isRegistering && (
        <TextInput
          style={styles.dialogInput}
          placeholder="Seu nome"
          placeholderTextColor="#838896"
          value={name}
          onChangeText={setName}
        />
      )}

      <TextInput
        style={styles.dialogInput}
        placeholder="Seu e-mail"
        placeholderTextColor="#838896"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.dialogInput}
        placeholder="Sua senha"
        placeholderTextColor="#838896"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        style={[styles.dialogButton, { backgroundColor: '#8162FF', borderColor: '#8162FF' }, loading && styles.dialogButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.dialogButtonText}>
          {loading ? 'Aguarde...' : (isRegistering ? 'Cadastrar' : 'Entrar')}
        </Text>
        {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
      </Pressable>

      <Pressable onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.dialogLinkText}>
          {isRegistering ? 'Já tenho uma conta' : 'Ainda não tenho conta'}
        </Text>
      </Pressable>

      {!!errorMessage && (
        <Text style={styles.dialogErrorText}>{errorMessage}</Text>
      )}
    </View>
  );
};
