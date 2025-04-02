import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function InicioSesion() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const navegacion = useNavigation();

  const manejarInicioSesion = () => {
    console.log('Inicio de sesión simulado');
    navegacion.replace('Pagina_Principal');
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.tarjeta}>
        <View style={estilos.contenedorEncabezado}>
          <Text style={estilos.textoBienvenida}>Bienvenido a</Text>
          <Text style={estilos.nombreApp}>MoliPlaga</Text>
        </View>

        <Text style={estilos.textoInicioSesion}>Inicio de Sesión</Text>
        <View style={estilos.contenedorEntrada}>
          <View style={estilos.contenedorIcono}>
            <Ionicons name="mail-outline" size={22} color="#7A7A7A" />
          </View>
          <TextInput
            style={estilos.entrada}
            placeholder="Correo electrónico"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={estilos.contenedorEntrada}>
          <View style={estilos.contenedorIcono}>
            <Ionicons name="lock-closed-outline" size={22} color="#7A7A7A" />
          </View>
          <TextInput
            style={estilos.entrada}
            placeholder="Contraseña"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry={!mostrarContrasena}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setMostrarContrasena(!mostrarContrasena)}
            style={estilos.contenedorIconoOjo}
          >
            <Ionicons
              name={mostrarContrasena ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#7A7A7A"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
  style={estilos.olvidoContraseña} 
  onPress={() => navegacion.navigate('Recuperar')}
>
  <Text style={estilos.textoOlvidoContraseña}>¿Olvidaste tu contraseña?</Text>
</TouchableOpacity>


        <TouchableOpacity style={estilos.botonInicioSesion} onPress={manejarInicioSesion}>
          <Text style={estilos.textoBotonInicioSesion}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={estilos.redireccionRegistro} 
          onPress={() => navegacion.replace('Registro')}
        >
          <Text style={estilos.textoRedireccion}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>

      <View style={estilos.bottomNav}>
        <TouchableOpacity style={estilos.bottomNavItem}>
          <Text style={[estilos.bottomNavText, estilos.activeText]}>Inicio de Sesión</Text>
          <View style={estilos.activeIndicator} />
        </TouchableOpacity>
        <TouchableOpacity
          style={estilos.bottomNavItem}
          onPress={() => navegacion.replace('Registro')}
        >
          <Text style={estilos.bottomNavText}>Registro</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#2A5B3E',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tarjeta: {
    backgroundColor: '#B6D0B9',
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 25,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  contenedorEncabezado: {
    alignItems: 'center',
    marginBottom: 20,
  },
  textoBienvenida: {
    fontSize: 26,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  nombreApp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  textoInicioSesion: {
    fontSize: 20,
    color: 'white',
    marginVertical: 15,
  },
  contenedorEntrada: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    height: 50,
    paddingHorizontal: 5,
  },
  contenedorIcono: {
    paddingHorizontal: 10,
  },
  entrada: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
    paddingHorizontal: 5,
  },
  contenedorIconoOjo: {},
  botonInicioSesion: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  textoBotonInicioSesion: {
    color: '#4F6F52',
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
  olvidoContraseña: {
    marginTop: 0,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  textoOlvidoContraseña: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  redireccionRegistro: {
    marginTop: 10,
  },
  textoRedireccion: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
