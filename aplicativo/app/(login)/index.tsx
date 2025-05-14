import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; 

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

const handleLogin = async () => {
  if (!email || !senha) {
    Alert.alert('Erro', 'Preencha todos os campos!');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    console.log('Usuário logado:', user.email);
    Alert.alert('Sucesso', `Bem-vindo(a), ${user.displayName || 'usuário'}!`);
    router.replace('/(tabs)/adicionarTarefa');
  } catch (error: any) {
    console.log('Erro no login:', error);
    Alert.alert('Erro no login', error.message || 'Tente novamente.');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/registro')}>
        <Text style={styles.link}>Não tem conta? Registre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    height: 50,
    borderColor: Colors.Therion.background,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  botao: {
    backgroundColor: Colors.Therion.background,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 16, color: Colors.Therion.background, textAlign: 'center' },
});
