import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from 'sonner-native';
import InicioSesion from './screens/InicioSesion';
import Pantalla_Principal from "./screens/Pantalla_Principal";
import RecuperarContraseña from './screens/Recuperar Contraseña';
import Registro from './screens/Registro';
  
  const Stack = createNativeStackNavigator();
  
  function RootStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#2A5B3E' } 
        }}
      >
    
        <Stack.Screen name="InicioSesion" component={InicioSesion} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Recuperar" component={RecuperarContraseña} />
        <Stack.Screen name="Home" component={Pantalla_Principal} />
        
        
        
      </Stack.Navigator>
    );
  }
