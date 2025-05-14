import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

//PARTE 1 Primeiro Passo Codando
export default function TabLayout() {

  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: Colors.Therion.tint, // Muda cor do ícone quando está ativo com base na cor do tema OBS Olhar o arquivo Colors
        tabBarInactiveTintColor: "#ffa6c4", // Muda cor do ícone quando não está ativo
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
            backgroundColor: '#FFF' // Cor de fundo da barra de navegação
          },
        }),
      }}>
      <Tabs.Screen
        name="adicionarTarefa" // Tela de adicionar tarefa
        options={{ 
          title: 'Adicionar Tarefa',
          tabBarIcon: ({ color }) => <MaterialIcons name='add-task' size={22} color={color} />, //Icone de adicionar tarefa
        }}
      />
      <Tabs.Screen
        name="lista" //Tela de lista de tarefas
        options={{
          title: 'Lista de Tarefas',
          tabBarIcon: ({ color }) => <FontAwesome5 size={20} name="tasks" color={color} />,  //icone de lista de tarefas
        }}
      />
    </Tabs>
  );
}
