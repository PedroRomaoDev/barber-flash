import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { styles } from '../menuStyles';

export type AuthSubmitData = {
  mode: 'login' | 'register';
  email: string;
  password: string;
  name?: string;
};

type LoginDialogProps = {
  onSubmit: (data: AuthSubmitData) => void;
  loading?: boolean;
  errorMessage?: string | null;
};

export const LoginDialog: React.FC<LoginDialogProps> = ({
  onSubmit,
  loading = false,
  errorMessage = null,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    onSubmit({ mode, email, password, name });
  };

  return (
    <View style={styles.dialogCard}>
      <View style={styles.dialogTextGroup}>
        <Text style={styles.dialogTitle}>
          {mode === 'login' ? 'Faça login na plataforma' : 'Crie sua conta'}
        </Text>
        <Text style={styles.dialogSubtitle}>
          {mode === 'login' ? 'Conecte-se usando seu e-mail e senha' : 'Preencha os dados abaixo para se cadastrar'}
        </Text>
      </View>

      <View style={{ gap: 12, marginTop: 16, width: '100%' }}>
        {mode === 'register' && (
          <TextInput
            style={{ backgroundColor: '#1E1E22', color: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#26272B' }}
            placeholder="Seu nome"
            placeholderTextColor="#838896"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}
        <TextInput
          style={{ backgroundColor: '#1E1E22', color: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#26272B' }}
          placeholder="E-mail"
          placeholderTextColor="#838896"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={{ backgroundColor: '#1E1E22', color: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#26272B' }}
          placeholder="Senha"
          placeholderTextColor="#838896"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <Pressable
        style={[
          styles.dialogButton,
          { backgroundColor: '#8162FF', borderColor: '#8162FF', paddingVertical: 12, marginTop: 16 },
          loading && styles.dialogButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={[styles.dialogButtonText, { fontFamily: 'Nunito_700Bold', color: '#FFF' }]}>
          {mode === 'login' ? 'Entrar' : 'Cadastrar'}
        </Text>
        {loading && <ActivityIndicator size="small" color="#FFFFFF" style={{ marginLeft: 8 }} />}
      </Pressable>

      <Pressable
        style={{ marginTop: 16, alignItems: 'center' }}
        onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
      >
        <Text style={{ color: '#8162FF', fontSize: 14 }}>
          {mode === 'login' ? 'Ainda não tem conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
        </Text>
      </Pressable>

      {!!errorMessage && (
        <Text style={styles.dialogErrorText}>{errorMessage}</Text>
      )}
    </View>
  );
};
