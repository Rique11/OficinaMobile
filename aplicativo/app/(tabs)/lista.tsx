import React, { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth } from '../firebase'; 
import { db } from '../firebase';   
export default function TabTwoScreen() {
  //Tarefas Parte 2 firebase
  type Tarefa = {
    id: string;
    titulo: string;
    prioridade: string;
    prazo: string;
    concluida: boolean;
  };

const [tarefas, setTarefas] = useState<Tarefa[]>([]);
 /* const [tarefas, setTarefas] = useState([     //PARTE 1
    {
      id: 'a',  //Usar String pq o firebase usa String pra ID 
      titulo: 'Comprar mantimentos',
      prioridade: 'Alta',
      prazo: '12/05/2025',
      concluida: false,
    },
    {
      id: 'b',
      titulo: 'Finalizar relatório',
      prioridade: 'Média',
      prazo: '14/05/2025',
      concluida: false,
    }, 
    {
      id:'c',
      titulo: 'Ligar para o Mike',
      prioridade: 'Baixa',
      prazo: '15/05/2025',
      concluida: false,
    },
    {
      id: 'd',
      titulo: 'Passear com o cachorro',
      prioridade: 'Média',
      prazo: 'Hoje',
      concluida: false,
    },
  ]);*/
 
useEffect(() => {  //PARTE 2 
  const carregarTarefas = async () => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'tarefas'), where('uid', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    const lista = querySnapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id, // firebase cria Id como string
        titulo: data.titulo || '',
        prioridade: data.prioridade || '',
        prazo: data.prazo ? new Date(data.prazo).toLocaleDateString('pt-BR') : '',
        concluida: data.concluida, 
      };
    });
   
    setTarefas(lista);
  };

  carregarTarefas();
},);
  // Logica para Concluir tarefa 
  const alternarConclusao = async (id: string) => {
    //PARTE 1 
    const novasTarefas = tarefas.map((tarefa) =>
      tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
    );
    setTarefas(novasTarefas);
    //FIM PARTE 1 

    //PARTE 2 FIREBASE
      const tarefaAtualizada = novasTarefas.find((tarefa) => tarefa.id === id);

    if (tarefaAtualizada) {
      try {
        const tarefaRef = doc(db, "tarefas", id);
        await updateDoc(tarefaRef, {
          concluida: tarefaAtualizada.concluida,
        });
      } catch (error) {
        console.error("Erro ao atualizar tarefa no Firebase:", error);
      }
    }
    //PARTE 2 FIREBASE
  };

  //Logica para Remover tarefa
  const removerTarefa = async (id: string) => {     
    //PARTE 1
    const novasTarefas = tarefas.filter((tarefa) => tarefa.id !== id);
    setTarefas(novasTarefas);
    //FIM PARTE 1

    //PARTE 2 FIREBASE    
    try {
      const tarefaRef = doc(db, "tarefas", id);
      await deleteDoc(tarefaRef);
    } catch (error) {
      console.error("Erro ao deletar tarefa no Firebase:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
         {/*Header com logo*/} 
        <Image
          source={require('../../assets/images/logoTherion.jpg')}
          style={styles.reactLogo}
          contentFit="contain"
          transition={1000}
        />
      </View>
      {/* Corpo com o quadrado com borda arredondada branco*/}
      <View style={styles.corpo}>
          <Text style = {{fontSize: 20, fontWeight: 'bold', color: Colors.Therion.background, justifyContent: 'center', alignSelf:'center'}}>Lista de Tarefas</Text>
        {/*Mapemento das tarefas*/}
        {tarefas.map((tarefa) => (
          <View key={tarefa.id} style={styles.itemContainer}>
            <TouchableOpacity onPress={() => alternarConclusao(tarefa.id)}>
              {/* Logica para alternar o botao de concluido */}
              <View style={[styles.circle, tarefa.concluida && styles.circleDone]}>
                {tarefa.concluida && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </TouchableOpacity>
            {/* Tarefas mapeadas e mostrando dados de 1 por 1 */}
            <View style={styles.textContainer}>
              <Text style={[styles.itemText, tarefa.concluida && styles.itemTextDone]}>
                {tarefa.titulo}
              </Text>
              <Text style={styles.subText}>Prioridade: {tarefa.prioridade}</Text>
              <Text style={styles.subText}>Prazo: {tarefa.prazo}</Text>
            </View>
            {/* Logica para remoção no X */}
            <TouchableOpacity onPress={() => removerTarefa(tarefa.id)}>
              <Text style={styles.removeButton}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Therion.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
    marginTop: 50,
  },
  corpo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    alignSelf: 'center',
    width: '90%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#aaa',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  circleDone: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkMark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  itemTextDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  subText: {
    fontSize: 13,
    color: '#666',
  },
  removeButton: {
    fontSize: 18,
    color: '#aaa',
    paddingHorizontal: 6,
  },
});
