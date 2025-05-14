import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';  


export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    //console.log("Auth:", auth);
    if (!email || !senha || !nome) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    console.log(email,senha, nome)
    //Parte firebase
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
  
      // Atualiza o perfil do usuário com o nome
      await updateProfile(userCredential.user, {
        displayName: nome,
      });
  
      Alert.alert('Sucesso', 'Registrado com sucesso!');
      router.replace('/(login)');
    } catch (error: any) {
      console.log('Erro no registro:', error);
      Alert.alert('Erro no registro', error.message || 'Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro</Text>

      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry />

      <TouchableOpacity style={styles.botao} onPress={handleRegister}>
        <Text style={styles.botaoTexto}>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(login)')}>
        <Text style={styles.link}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff'  },
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
