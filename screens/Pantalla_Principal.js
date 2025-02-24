import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';

export default function MoniPlagaApp() {
  const [pestanaActiva, setPestanaActiva] = useState('home');
  const [imagenSeleccionada] = useState(null);

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <View style={estilos.contenedorPrincipal}>
        <ScrollView style={estilos.contenedor}>
          <LinearGradient
            colors={['#2E7D32', '#4CAF50']}
            style={estilos.cabecera}
          >
            <View style={estilos.contenidoCabecera}>
              <View>
                <Text style={estilos.tituloCabecera}>MoniPlaga</Text>
                <Text style={estilos.subtituloCabecera}>Identificación de Plagas</Text>
              </View>
              <View style={estilos.iconosCabecera}>

                <TouchableOpacity style={estilos.botonIcono}>
                  <Ionicons name="notifications-outline" size={24} color="white" />
                  <View style={estilos.insigniaNotificacion}>
                    <Text style={estilos.textoInsignia}>1</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={estilos.botonIcono}>
                <MaterialCommunityIcons name="account-outline" size={24} color="white" />
                </TouchableOpacity>

              </View>
            </View>
          </LinearGradient>

          <View style={estilos.contenido}>
            <View style={estilos.contenedorMonitor}>
              <Image 
                source={{ uri: 'https://api.a0.dev/assets/image?text=security%20camera%20monitoring%20farm%20field%20with%20crops&aspect=16:9' }}
                style={estilos.imagenMonitor}
              />
              <View style={estilos.superposicionMonitor}>
                <Text style={estilos.textoMonitor}>Cámara de Monitoreo</Text>
                <View style={estilos.indicadorEnVivo}>
                  <View style={estilos.puntoEnVivo} />
                  <Text style={estilos.textoEnVivo}>EN VIVO</Text>
                </View>
              </View>
            </View>

            {imagenSeleccionada && (
              <View style={estilos.seccionResultado}>
                <Image 
                  source={{ uri: imagenSeleccionada }}
                  style={estilos.imagenPrevia}
                />
                <View style={estilos.tarjetaAnalisis}>
                  <Text style={estilos.tituloAnalisis}>Análisis de Plaga</Text>
                  <Text style={estilos.tipoPlaga}>Tipo: Gorgojo del Maíz</Text>
                  <Text style={estilos.nivelRiesgo}>Nivel de Riesgo: Alto</Text>
                  <Text style={estilos.descripcion}>
                    Esta plaga puede causar daños significativos a los cultivos de maíz. 
                    Se recomienda acción inmediata.
                  </Text>
                </View>
              </View>
            )}

            <View style={estilos.actividadReciente}>
              <Text style={estilos.tituloReciente}>Actividad Reciente</Text>
              <View style={estilos.tarjetaActividad}>
                <MaterialCommunityIcons name="calendar-check" size={24} color="#2E7D32" />
                <View style={estilos.contenidoActividad}>
                  <Text style={estilos.textoActividad}>Último análisis: Gorgojo en Maíz</Text>
                  <Text style={estilos.fechaActividad}>Hace 2 días</Text>
                </View>
              </View>
              <View style={estilos.tarjetaActividad}>
                <MaterialCommunityIcons name="phone-check" size={24} color="#2E7D32" />
                <View style={estilos.contenidoActividad}>
                  <Text style={estilos.textoActividad}>Contacto con exterminador</Text>
                  <Text style={estilos.fechaActividad}>Hace 3 días</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={estilos.navInferior}>
          <TouchableOpacity 
            style={[estilos.itemNav, pestanaActiva === 'home' && estilos.itemNavActivo]}
            onPress={() => setPestanaActiva('home')}
          >
            <MaterialCommunityIcons 
              name="home" 
              size={24} 
              color={pestanaActiva === 'home' ? '#2E7D32' : '#666'} 
            />
            <Text style={[estilos.textoNav, pestanaActiva === 'home' && estilos.textoNavActivo]}>Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[estilos.itemNav, pestanaActiva === 'history' && estilos.itemNavActivo]}
            onPress={() => setPestanaActiva('history')}
          >
            <MaterialCommunityIcons 
              name="history" 
              size={24} 
              color={pestanaActiva === 'history' ? '#2E7D32' : '#666'} 
            />
            <Text style={[estilos.textoNav, pestanaActiva === 'history' && estilos.textoNavActivo]}>Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.botonCamara}>
            <MaterialCommunityIcons name="camera" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[estilos.itemNav, pestanaActiva === 'exterminator' && estilos.itemNavActivo]}
            onPress={() => setPestanaActiva('exterminator')}
          >
            <MaterialCommunityIcons 
              name="phone" 
              size={24} 
              color={pestanaActiva === 'exterminator' ? '#2E7D32' : '#666'} 
            />
            <Text style={[estilos.textoNav, pestanaActiva === 'exterminator' && estilos.textoNavActivo]}>Exterminador</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[estilos.itemNav, pestanaActiva === 'settings' && estilos.itemNavActivo]}
            onPress={() => setPestanaActiva('settings')}
          >
            <MaterialCommunityIcons 
              name="cog" 
              size={24} 
              color={pestanaActiva === 'settings' ? '#2E7D32' : '#666'} 
            />
            <Text style={[estilos.textoNav, pestanaActiva === 'settings' && estilos.textoNavActivo]}>Ajustes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contenedorPrincipal: {
    flex: 1,
    position: 'relative',
  },
  contenedor: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  cabecera: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  contenidoCabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tituloCabecera: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtituloCabecera: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  iconosCabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botonIcono: {
    position: 'relative',
    padding: 4,
  },
  insigniaNotificacion: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoInsignia: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contenido: {
    padding: 16,
    paddingBottom: 80,
  },
  contenedorMonitor: {
    position: 'relative',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  imagenMonitor: {
    width: '100%',
    height: '100%',
  },
  superposicionMonitor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoMonitor: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  indicadorEnVivo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  puntoEnVivo: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  textoEnVivo: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  seccionResultado: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagenPrevia: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  tarjetaAnalisis: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  tituloAnalisis: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  tipoPlaga: {
    fontSize: 16,
    color: '#333',
  },
  nivelRiesgo: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: '600',
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actividadReciente: {
    marginTop: 20,
  },
  tituloReciente: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tarjetaActividad: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contenidoActividad: {
    marginLeft: 12,
    flex: 1,
  },
  textoActividad: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  fechaActividad: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  navInferior: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingBottom: 0, // Se elimina el padding inferior extra
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemNav: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  itemNavActivo: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  textoNav: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  textoNavActivo: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  botonCamara: {
    backgroundColor: '#2E7D32',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  }
});
