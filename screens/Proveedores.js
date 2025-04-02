import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TarjetaDeContacto = ({ nombre, edad, especialidad, contacto, urlImagen }) => (
  <View style={estilos.tarjetaDeContacto}>
    <Image 
      source={{ uri: urlImagen }} 
      style={estilos.imagenDeContacto}
    />

    <View style={estilos.infoDeContacto}>
      <Text style={estilos.nombreDeContacto}>Nombre: {nombre}</Text>
      <Text style={estilos.detalleDeContacto}>Edad: {edad} años</Text>
      <Text style={estilos.detalleDeContacto}>{especialidad}</Text>
      <Text style={estilos.detalleDeContacto}>Contacto: {contacto}</Text>
    </View>
    <TouchableOpacity style={estilos.botonLlamada}>
      <Ionicons name="chatbubbles" size={24} color="white" />
    </TouchableOpacity>
  </View>
);

const PantallaProveedores = () => {
  const contactos = [
    {
      nombre: 'El gato loco',
      edad: 40,
      especialidad: 'Experto en exterminar arañas',
      contacto: '55-64-32-17',
      urlImagen: 'https://us-tuna-sounds-images.voicemod.net/50fb108b-3121-4b42-a712-a26e59a66cb0-1673411269000.png'
    },
    {
      nombre: 'Juan Romero',
      edad: 35,
      especialidad: 'Experto en exterminar avispas',
      contacto: '55-43-52-58',
      urlImagen: 'https://i.ytimg.com/vi/qykA-iNaXdE/mqdefault.jpg'
    },
    {
      nombre: 'Leslie Martínez',
      edad: 27,
      especialidad: 'Experta en exterminar moscas',
      contacto: '55-87-95-23',
      urlImagen: 'https://img.freepik.com/fotos-premium/gerente-equipo-inicio-mujer-ceo-negocios-reunion-empresa-oficina-exito-corporativo-motivacion-laboral-profesional-carrera-gestion-liderazgo-trabajo-personal-feliz-empoderamiento-femenino-jefe_590464-83691.jpg'
    },
    {
      nombre: 'Mabel Carbajal',
      edad: 28,
      especialidad: 'Experta en exterminar arañas',
      contacto: '55-47-68-84',
      urlImagen: 'https://www.shutterstock.com/image-photo/smiling-middle-aged-business-woman-260nw-2451544865.jpg'
    }
  ];

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.encabezado}>
        <Text style={estilos.titulo}>MoniPlaga</Text>
        <Text style={estilos.subtitulo}>Detector de plagas</Text>
        <TouchableOpacity style={estilos.botonNotificaciones}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={estilos.tituloDeSeccion}>Contactos sugeridos</Text>

      <ScrollView style={estilos.contenedorDeContactos}>
        {contactos.map((contacto, index) => (
          <TarjetaDeContacto key={index} {...contacto} />
        ))}
      </ScrollView>

      {/* Barra Inferior y Botón Flotante */}
      <TouchableOpacity style={estilos.botonFlotante}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      <View style={estilos.barraInferior}>
        <TouchableOpacity style={estilos.itemNavegacion}>
          <Ionicons name="home" size={24} color="white" />
          <View style={estilos.indicadorActivo} />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.itemNavegacion}>
          <Feather name="phone" size={24} color="white" />
        </TouchableOpacity>
        <View style={estilos.contenedorBotonCentral}>
          <TouchableOpacity style={estilos.botonCentral}>
            <Ionicons name="camera-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={estilos.itemNavegacion}>
          <MaterialIcons name="history" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.itemNavegacion}>
          <Feather name="user" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  encabezado: {
    backgroundColor: '#2e7d32',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'column',
  },
  titulo: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: 'white',
    fontSize: 16,
  },
  botonNotificaciones: {
    position: 'absolute',
    right: 20,
    top: 50,
  },
  tituloDeSeccion: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    color: '#333',
  },
  contenedorDeContactos: {
    flex: 1,
    padding: 10,
  },
  tarjetaDeContacto: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagenDeContacto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  infoDeContacto: {
    flex: 1,
  },
  nombreDeContacto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detalleDeContacto: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  botonLlamada: {
    backgroundColor: '#2e7d32',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Nueva barra inferior y botones flotantes
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

export default PantallaProveedores;
