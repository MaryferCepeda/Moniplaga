
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Registro() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    contrasena: '',
    confirmarContrasena: '',
  });
  const navegacion = useNavigation();

  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const manejarRegistro = () => {
    if (Object.values(formulario).some((campo) => campo.trim() === '')) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    if (!validarCorreo(formulario.correo)) {
      Alert.alert('Error', 'Ingresa un correo válido');
      return;
    }

    if (formulario.contrasena !== formulario.confirmarContrasena) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    Alert.alert('Éxito', 'Registro exitoso');
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      <ScrollView contentContainerStyle={estilos.contenidoScroll}>
        <View style={estilos.tarjeta}>
          <Text style={estilos.titulo}>Regístrate en MoniPlaga</Text>

          <View style={estilos.contenedorEntrada}>
            {['Nombre', 'Correo electrónico', 'Teléfono', 'Contraseña', 'Confirma contraseña'].map((campo, index) => (
              <View key={index}>
                <Text style={estilos.etiqueta}>{campo}</Text>
                <TextInput
                  style={estilos.entrada}
                  placeholder={`Ingresa tu ${campo.toLowerCase()}`}
                  keyboardType={campo.includes('Correo') ? 'email-address' : campo.includes('Teléfono') ? 'phone-pad' : 'default'}
                  secureTextEntry={campo.includes('Contraseña')}
                  value={formulario[campo.toLowerCase().replace(/ /g, '')]}
                  onChangeText={(texto) => setFormulario({ ...formulario, [campo.toLowerCase().replace(/ /g, '')]: texto })}
                />
              </View>
            ))}
          </View>

          <TouchableOpacity style={estilos.boton} onPress={manejarRegistro}>
            <Text style={estilos.textoBoton}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={estilos.bottomNav}>
        <TouchableOpacity style={estilos.bottomNavItem} onPress={() => navegacion.navigate('InicioSesion')}>
          <Text style={estilos.bottomNavText}>Inicio de Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.bottomNavItem}>
          <Text style={[estilos.bottomNavText, estilos.activeText]}>Registro</Text>
          <View style={estilos.activeIndicator} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#2A5B3E',
  },
  contenidoScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 100,
  },
  tarjeta: {
    backgroundColor: '#B6D0B9',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A5B3E',
    marginBottom: 20,
  },
  contenedorEntrada: {
    width: '100%',
    gap: 10,
  },
  etiqueta: {
    fontSize: 16,
    color: '#666',
    marginBottom: -5,
  },
  entrada: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  boton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  bottomNavItem: {
    alignItems: 'center',
    minWidth: 100,
  },
  bottomNavText: {
    fontSize: 16,
    color: '#666',
  },
  activeText: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
    marginTop: 5,
  },
});
