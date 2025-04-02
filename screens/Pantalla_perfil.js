import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, StyleSheet,TextInput, Text, TouchableOpacity, View } from 'react-native';

export default function PerfilScreen() {
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
            <View style={styles.content}>
            <Text style={styles.sectionTitle}>Información de la cuenta</Text>
            <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>

            {/* Información del usuario */}
            <View style={styles.userInfo}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput style={styles.input} value="Elmer Figueroa Arce" editable={false} />
            <Text style={styles.label}>Teléfono</Text>
            <TextInput style={styles.input} value="+52 5571983169" editable={false} />
            <Text style={styles.label}>Dirección</Text>
            <TextInput style={styles.input} value="Av. Alfredo V. Bonfil T-132" editable={false} />
            <Text style={styles.label}>Referencias</Text>
            <TextInput style={styles.input} value="Caja de cartón afuera de las unidades" editable={false} />
            </View>
            
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    
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
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3a5a40',
    marginBottom: 15,
    textAlign: 'center',
  },
  editButton: {
    alignSelf: 'flex-end',
  },
  editText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  userInfo: {
    marginVertical: 15,
  },
  label: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  timestamp: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute', // Posiciona el botón en un lugar fijo.
    bottom: 80,           // Altura sobre la barra inferior.
    right: 20,            // Margen desde el borde derecho.
    zIndex: 10,           // Asegura que el botón esté sobre otros elementos.
  },
  
  logoutText: {
    color: '#fff',
    fontSize: 16,
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
