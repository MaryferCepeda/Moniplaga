import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.contenedor}>
      <StatusBar style="light" />
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
      <ScrollView style={styles.contenido}>
        <View style={styles.contenedorCamara}>
          <Image 
            source={{ uri: 'https://api.a0.dev/assets/image?text=corn%20field%20with%20young%20plants%20growing%20in%20rows&aspect=16:9' }} 
            style={styles.imagenCamara} 
          />
          <View style={styles.sobreCamara}>
            <Text style={styles.textoCamara}>Cámara de Monitoreo</Text>
            <View style={styles.contenedorEnVivo}>
              <View style={styles.indicadorEnVivo} />
              <Text style={styles.textoEnVivo}>EN VIVO</Text>
            </View>
          </View>
        </View>
        <View style={styles.seccionActividad}>
          <Text style={styles.tituloActividad}>Actividad Reciente</Text>
          <TouchableOpacity style={styles.tarjetaActividad}>
            <View style={styles.contenedorIconoActividad}>
              <FontAwesome name="calendar" size={20} color="white" />
            </View>
            <View style={styles.infoActividad}>
              <Text style={styles.tituloTarjetaActividad}>Ultimo análisis: plantitas uwu</Text>
              <Text style={styles.tiempoActividad}>hace 3 días</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tarjetaActividad}>
            <View style={styles.contenedorIconoActividad}>
              <Ionicons name="eye-outline" size={22} color="white" />
            </View>
            <View style={styles.infoActividad}>
              <Text style={styles.tituloTarjetaActividad}>Avistamiento de insecto</Text>
              <Text style={styles.tiempoActividad}>hace 3 minutos</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.botonFlotante}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      <View style={styles.barraInferior}>
        <TouchableOpacity style={styles.itemNavegacion}>
          <Ionicons name="home" size={24} color="white" />
          <View style={styles.indicadorActivo} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemNavegacion}>
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
  },
  contenedorCamara: {
    height: 200,
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imagenCamara: {
    width: '100%',
    height: '100%',
  },
  sobreCamara: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoCamara: {
    color: 'white',
    fontSize: 16,
  },
  contenedorEnVivo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicadorEnVivo: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    marginRight: 5,
  },
  textoEnVivo: {
    color: 'white',
    fontWeight: 'bold',
  },
  seccionActividad: {
    padding: 15,
  },
  tituloActividad: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3a5a40',
    marginBottom: 15,
  },
  tarjetaActividad: {
    backgroundColor: '#88a47c',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contenedorIconoActividad: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoActividad: {
    flex: 1,
  },
  tituloTarjetaActividad: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  tiempoActividad: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 2,
  },
  botonFlotante: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3a5a40',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
