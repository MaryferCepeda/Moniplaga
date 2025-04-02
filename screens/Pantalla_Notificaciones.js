import React from 'react';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotificacionesScreen() {
  return (
    <View style={styles.contenedor}>
      <StatusBar style="light" />
      
      {/* Encabezado */}
      <View style={styles.cabecera}>
        <View>
          <Text style={styles.tituloCabecera}>MoniPlaga</Text>
          <Text style={styles.subtituloCabecera}>Detector de plagas</Text>
        </View>
        <View style={styles.iconosCabecera}>
          <TouchableOpacity style={styles.botonIcono}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.botonIcono}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de notificaciones */}

      <ScrollView style={styles.contenido}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
        </View>
        <TouchableOpacity style={styles.tarjetaNotificacion}>
          <View style={styles.iconoNotificacion}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </View>
          <View style={styles.infoNotificacion}>
            <Text style={styles.tituloNotificacion}>Último análisis: plantitas uwu</Text>
            <Text style={styles.tiempoNotificacion}>hace 3 días</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tarjetaNotificacion}>
          <View style={styles.iconoNotificacion}>
            <Ionicons name="eye-outline" size={24} color="white" />
          </View>
          <View style={styles.infoNotificacion}>
            <Text style={styles.tituloNotificacion}>Avistamiento de insecto</Text>
            <Text style={styles.tiempoNotificacion}>hace 3 minutos</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tarjetaNotificacion}>
          <View style={styles.iconoNotificacion}>
            <Ionicons name="leaf-outline" size={24} color="white" />
          </View>
          <View style={styles.infoNotificacion}>
            <Text style={styles.tituloNotificacion}>Revisión de plantas nuevas</Text>
            <Text style={styles.tiempoNotificacion}>hace 7 días</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tarjetaNotificacion}>
          <View style={styles.iconoNotificacion}>
            <Ionicons name="bug-outline" size={24} color="white" />
          </View>
          <View style={styles.infoNotificacion}>
            <Text style={styles.tituloNotificacion}>Detección de plaga en cultivo</Text>
            <Text style={styles.tiempoNotificacion}>hace 2 semanas</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Barra de navegación */}
      <View style={styles.barraInferior}>
        <TouchableOpacity style={styles.itemNavegacion}>
          <Ionicons name="home" size={24} color="white" />
          <View style={styles.indicadorActivo} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemNavegacion}>
          <Feather name="phone" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.contenedorBotonCentral}>
          <TouchableOpacity style={styles.botonCentral}>
            <Ionicons name="camera-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.itemNavegacion}>
          <MaterialIcons name="history" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemNavegacion}>
          <Feather name="user" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cabecera: {
    backgroundColor: '#3a5a40',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tituloCabecera: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtituloCabecera: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  iconosCabecera: {
    flexDirection: 'row',
  },
  botonIcono: {
    marginLeft: 15,
  },
  contenido: {
    flex: 1,
    padding: 15,
  },
  tarjetaNotificacion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#88a47c',
    marginBottom: 10,
    borderRadius: 8,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3a5a40',
    marginBottom: 15,
    textAlign: 'center',
  },
  iconoNotificacion: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3a5a40',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoNotificacion: {
    flex: 1,
  },
  tituloNotificacion: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tiempoNotificacion: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 5,
  },
  barraInferior: {
    height: 60,
    backgroundColor: '#3a5a40',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  itemNavegacion: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 60,
  },
  indicadorActivo: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
    marginTop: 4,
  },
  botonCentral: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0e813c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 34,
  },

});
