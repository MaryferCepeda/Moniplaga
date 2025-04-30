import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import {
  ActivityIndicator, Alert, Animated, BackHandler, Dimensions, Easing, Image, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

// Configuración de Crop.health API
const CROP_HEALTH_API_KEY = 
const CROP_HEALTH_API_URL = 

const STORAGE_KEY = "moniplaga_recent_analyses"

export default function HomeScreen() {
  const navigation = useNavigation()
  const [capturedImage, setCapturedImage] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [tempImage, setTempImage] = useState(null)
  const [hasPermission, setHasPermission] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [recentAnalyses, setRecentAnalyses] = useState([])
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const [spinAnim] = useState(new Animated.Value(0))
  const [fadeAnim] = useState(new Animated.Value(0))
  const [selectedTab, setSelectedTab] = useState("general") // Para la navegación por pestañas en detalles
  const [rawApiResponse, setRawApiResponse] = useState(null) // Para guardar la respuesta completa de la API

  // Cargar análisis recientes al iniciar
  useEffect(() => {
    loadRecentAnalyses()
  }, [])

  // Cargar análisis guardados desde AsyncStorage
  const loadRecentAnalyses = async () => {
    try {
      const storedAnalyses = await AsyncStorage.getItem(STORAGE_KEY)
      if (storedAnalyses) {
        setRecentAnalyses(JSON.parse(storedAnalyses))
      }
    } catch (error) {
      console.log("Error al cargar análisis recientes:", error)
    }
  }

  // Guardar un nuevo análisis
  const saveAnalysis = async (image, result, rawResponse) => {
    try {
      const newAnalysis = {
        id: Date.now().toString(),
        image: image,
        result: result,
        rawResponse: rawResponse, // Guardar la respuesta completa
        timestamp: new Date().toISOString(),
      }

      const updatedAnalyses = [newAnalysis, ...recentAnalyses].slice(0, 10) // Mantener solo los 10 más recientes
      setRecentAnalyses(updatedAnalyses)
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses))
    } catch (error) {
      console.log("Error al guardar análisis:", error)
    }
  }

  useEffect(() => {
    ;(async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      setHasPermission(status === "granted")
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Necesitamos acceso a la cámara para esta función", [{ text: "OK" }])
      }
    })()
  }, [])

  useEffect(() => {
    const backAction = () => {
      if (showDetailsModal) {
        setShowDetailsModal(false)
        return true
      }
      if (showPreviewModal) {
        setShowPreviewModal(false)
        return true
      }
      return false
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)

    return () => backHandler.remove()
  }, [showPreviewModal, showDetailsModal])

  // Animación de rotación para el indicador de carga
  useEffect(() => {
    if (isAnalyzing) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start()
    } else {
      spinAnim.setValue(0)
    }
  }, [isAnalyzing])

  // Animación de entrada para el modal de detalles
  useEffect(() => {
    if (showDetailsModal) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      fadeAnim.setValue(0)
    }
  }, [showDetailsModal])

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  // Función para abrir la cámara directamente
  const handleOpenCamera = async () => {
    if (!hasPermission) {
      Alert.alert("Permiso denegado", "Necesitamos acceso a la cámara para esta función", [{ text: "OK" }])
      return
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setTempImage(result.assets[0].uri)
        setShowPreviewModal(true)
      }
    } catch (error) {
      console.log("Error al tomar la foto:", error)
      Alert.alert("Error", "No se pudo tomar la foto")
    }
  }

  // Función para abrir la galería
  const handleOpenGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setTempImage(result.assets[0].uri)
        setShowPreviewModal(true)
      }
    } catch (error) {
      console.log("Error al abrir la galería:", error)
      Alert.alert("Error", "No se pudo abrir la galería")
    }
  }

  // Función para analizar la imagen con Crop.health API
  const analyzeImage = async () => {
    if (!tempImage) return

    setIsAnalyzing(true)
    setAnalysisResult(null)
    setRawApiResponse(null)

    try {
      // Convertir la imagen a base64
      const base64Image = await convertImageToBase64(tempImage)

      console.log("Enviando solicitud a la API...")

      // Preparar los datos para la API de Crop.health
      const data = {
        images: [base64Image],
        similar_images: true,
      }

      // Hacer la petición a la API de Crop.health
      const response = await fetch(CROP_HEALTH_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": CROP_HEALTH_API_KEY,
        },
        body: JSON.stringify(data),
      })

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        console.log("Error en la respuesta:", response.status)
        const errorText = await response.text()
        console.log("Texto del error:", errorText)
        throw new Error(`Error en la API: ${response.status}`)
      }

      const responseText = await response.text()
      console.log("Respuesta recibida, primeros 100 caracteres:", responseText.substring(0, 100))

      let result
      try {
        result = JSON.parse(responseText)
        // Guardar la respuesta completa para depuración
        setRawApiResponse(result)
        console.log("Respuesta completa de la API:", JSON.stringify(result, null, 2))
      } catch (parseError) {
        console.log("Error al parsear JSON:", parseError)
        console.log("Texto recibido (primeros 200 caracteres):", responseText.substring(0, 200))
        throw new Error("Error al parsear la respuesta de la API")
      }

      console.log("Respuesta procesada correctamente")

      // Verificar si tenemos resultados de clasificación en disease.suggestions
      if (
        result.result &&
        result.result.disease &&
        result.result.disease.suggestions &&
        result.result.disease.suggestions.length > 0
      ) {
        // Adaptar el formato de los datos para que funcione con el código existente
        const adaptedResult = {
          ...result,
          result: {
            ...result.result,
            classification_results: result.result.disease.suggestions.map((suggestion) => ({
              name: suggestion.name,
              probability: suggestion.probability,
              common_names: suggestion.common_names || [],
              description: suggestion.details ? { value: `Scientific name: ${suggestion.scientific_name}` } : null,
              treatment: suggestion.treatment || { summary: "No hay tratamiento disponible" },
              similar_images: suggestion.similar_images || [],
            })),
          },
        }

        console.log(
          "Datos adaptados para la UI:",
          JSON.stringify(adaptedResult.result.classification_results[0], null, 2),
        )

        setAnalysisResult(adaptedResult)
        setCapturedImage(tempImage)
        setShowPreviewModal(false)

        // Guardar el análisis en el historial con los datos originales
        await saveAnalysis(tempImage, adaptedResult, result)

        // Mostrar el modal de detalles
        setSelectedAnalysis({
          image: tempImage,
          result: adaptedResult,
          rawResponse: result, // Guardar la respuesta original completa
          timestamp: new Date().toISOString(),
        })
        setShowDetailsModal(true)
      } else {
        console.log("No se encontraron resultados de clasificación en el formato esperado")
        console.log("Estructura de la respuesta:", JSON.stringify(result, null, 2))
        Alert.alert("No se pudo identificar", "No pudimos identificar ninguna plaga en la imagen", [{ text: "OK" }])
      }
    } catch (error) {
      console.log("Error al analizar la imagen:", error)
      Alert.alert("Error", `No se pudo analizar la imagen: ${error.message}`, [{ text: "OK" }])
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Función para convertir imagen a base64
  const convertImageToBase64 = async (uri) => {
    try {
      const response = await fetch(uri)
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result
          // Eliminar el prefijo "data:image/jpeg;base64," para obtener solo el string base64
          resolve(base64String.split(",")[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.log("Error al convertir imagen a base64:", error)
      throw error
    }
  }

  // Función para descartar la imagen
  const discardImage = () => {
    setTempImage(null)
    setShowPreviewModal(false)
  }

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "hace unos segundos"
    if (diffMins < 60) return `hace ${diffMins} minutos`
    if (diffHours < 24) return `hace ${diffHours} horas`
    if (diffDays < 7) return `hace ${diffDays} días`

    return date.toLocaleDateString()
  }

  // Función para mostrar detalles de un análisis
  const showAnalysisDetails = (analysis) => {
    setSelectedAnalysis(analysis)
    setSelectedTab("general") // Resetear a la pestaña general
    setShowDetailsModal(true)
  }

  // Renderizar un elemento de actividad reciente
  const renderActivityItem = (item, index) => {
    // Obtener el resultado principal (el de mayor probabilidad)
    const mainResult = item.result.result.classification_results[0]
    const plagaDetectada = mainResult.name || "Plaga desconocida"
    const confianza = Math.round(mainResult.probability * 100)

    return (
      <TouchableOpacity
        key={index}
        style={styles.tarjetaActividad}
        onPress={() => showAnalysisDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.activityImageContainer}>
          <Image source={{ uri: item.image }} style={styles.activityImage} />
        </View>
        <View style={styles.infoActividad}>
          <Text style={styles.tituloTarjetaActividad}>{plagaDetectada}</Text>
          <Text style={styles.confianzaText}>Confianza: {confianza}%</Text>
          <Text style={styles.tiempoActividad}>{formatDate(item.timestamp)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.7)" />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.contenedor}>
      <StatusBar style="light" />

      {/* Pantalla principal */}
      <View style={styles.cabecera}>
        <View>
          <Text style={styles.tituloCabecera}>MoniPlaga</Text>
          <Text style={styles.subtituloCabecera}>Detector de plagas</Text>
        </View>
        <View style={styles.iconosCabecera}>
          <TouchableOpacity onPress={() => navigation.navigate("Notificaciones")}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.contenido}>
        <View style={styles.contenedorCamara}>
          <Image
            source={
              capturedImage
                ? { uri: capturedImage }
                : {
                    uri: "https://api.a0.dev/assets/image?text=corn%20field%20with%20young%20plants%20growing%20in%20rows&aspect=16:9",
                  }
            }
            style={styles.imagenCamara}
          />
          <View style={styles.sobreCamara}>
            <Text style={styles.textoCamara}>Cámara de Monitoreo</Text>
          </View>
        </View>

        {/* Botones de cámara y galería */}
        <View style={styles.botonesCaptura}>
          <TouchableOpacity style={styles.botonCaptura} onPress={handleOpenCamera} activeOpacity={0.8}>
            <Ionicons name="camera-outline" size={24} color="white" />
            <Text style={styles.textoBotonCaptura}>Tomar foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonCaptura} onPress={handleOpenGallery} activeOpacity={0.8}>
            <Ionicons name="images-outline" size={24} color="white" />
            <Text style={styles.textoBotonCaptura}>Galería</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.seccionActividad}>
          <Text style={styles.tituloActividad}>Actividad Reciente</Text>

          {recentAnalyses.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="leaf-outline" size={50} color="#3a5a40" style={styles.emptyStateIcon} />
              <Text style={styles.emptyStateText}>No hay análisis recientes</Text>
              <Text style={styles.emptyStateSubtext}>Toma una foto para comenzar a analizar plagas</Text>
            </View>
          ) : (
            recentAnalyses.map((item, index) => renderActivityItem(item, index))
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.botonFlotante} onPress={handleOpenCamera} activeOpacity={0.8}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      <View style={styles.barraInferior}>
        <TouchableOpacity style={styles.itemNavegacion}>
          <Ionicons name="home" size={24} color="white" />
          <View style={styles.indicadorActivo} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemNavegacion} onPress={() => navigation.navigate("Exterminadores")}>
          <Feather name="phone" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.contenedorBotonCentral}>
          <TouchableOpacity style={styles.botonCentral} onPress={handleOpenCamera} activeOpacity={0.8}>
            <Ionicons name="camera-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.itemNavegacion}>
          <MaterialIcons name="history" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemNavegacion} onPress={() => navigation.navigate("Perfil")}>
          <Feather name="user" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal de previsualización de imagen */}
      <Modal
        visible={showPreviewModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setShowPreviewModal(false)
        }}
      >
        <View style={styles.previewContainer}>
          <StatusBar style="light" />
          <SafeAreaView style={styles.previewContent}>
            {/* Cabecera de previsualización */}
            <View style={styles.cameraHeader}>
              <TouchableOpacity style={styles.cameraBackButton} onPress={discardImage}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>

              <View style={styles.cameraTitle}>
                <Text style={styles.cameraTitleText}>Previsualización</Text>
              </View>

              <TouchableOpacity style={styles.cameraOptionButton} onPress={analyzeImage} disabled={isAnalyzing}>
                <Ionicons name="checkmark" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Imagen capturada */}
            <View style={styles.previewImageContainer}>
              {tempImage && <Image source={{ uri: tempImage }} style={styles.previewImage} resizeMode="contain" />}

              {/* Animación de carga durante el análisis */}
              {isAnalyzing && (
                <View style={styles.loadingOverlay}>
                  <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
                    <Ionicons name="leaf-outline" size={40} color="#0e813c" />
                  </Animated.View>
                  <Text style={styles.loadingText}>Analizando imagen...</Text>
                  <Text style={styles.loadingSubText}>Buscando plagas y enfermedades</Text>
                </View>
              )}
            </View>

            {/* Texto informativo */}
            <View style={styles.cameraInfoContainer}>
              <Text style={styles.cameraInfoText}>¿Deseas analizar esta imagen para detectar plagas?</Text>
            </View>

            {/* Botones de acción */}
            <View style={styles.previewActions}>
              <TouchableOpacity style={styles.previewActionButton} onPress={discardImage} activeOpacity={0.8}>
                <Ionicons name="trash-outline" size={24} color="white" />
                <Text style={styles.previewActionText}>Descartar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.previewActionButton, styles.previewActionButtonPrimary]}
                onPress={analyzeImage}
                disabled={isAnalyzing}
                activeOpacity={0.8}
              >
                {isAnalyzing ? (
                  <>
                    <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />
                    <Text style={styles.previewActionText}>Analizando...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={24} color="white" />
                    <Text style={styles.previewActionText}>Analizar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Modal de detalles de análisis */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setShowDetailsModal(false)
        }}
      >
        {selectedAnalysis && (
          <View style={styles.detailsContainer}>
            <StatusBar style="light" />
            <SafeAreaView style={styles.detailsContent}>
              {/* Cabecera de detalles */}
              <View style={styles.detailsHeader}>
                <TouchableOpacity
                  style={styles.detailsBackButton}
                  onPress={() => setShowDetailsModal(false)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <View style={styles.detailsTitle}>
                  <Text style={styles.detailsTitleText}>Detalles del Análisis</Text>
                </View>

                <TouchableOpacity style={styles.detailsShareButton} activeOpacity={0.8}>
                  <Ionicons name="share-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Pestañas de navegación */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[styles.tab, selectedTab === "general" && styles.activeTab]}
                  onPress={() => setSelectedTab("general")}
                >
                  <Text style={[styles.tabText, selectedTab === "general" && styles.activeTabText]}>General</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, selectedTab === "technical" && styles.activeTab]}
                  onPress={() => setSelectedTab("technical")}
                >
                  <Text style={[styles.tabText, selectedTab === "technical" && styles.activeTabText]}>Técnico</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, selectedTab === "all" && styles.activeTab]}
                  onPress={() => setSelectedTab("all")}
                >
                  <Text style={[styles.tabText, selectedTab === "all" && styles.activeTabText]}>
                    Todos los Resultados
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.detailsScrollView}>
                {/* Imagen analizada */}
                <View style={styles.detailsImageContainer}>
                  <Image source={{ uri: selectedAnalysis.image }} style={styles.detailsImage} resizeMode="cover" />
                </View>

                {/* Contenido según la pestaña seleccionada */}
                {selectedTab === "general" && (
                  <View style={styles.detailsInfoContainer}>
                    <Animated.View style={[styles.detailsCard, { opacity: fadeAnim }]}>
                      <Text style={styles.detailsCardTitle}>
                        {selectedAnalysis.result.result.classification_results[0].name || "Plaga desconocida"}
                      </Text>

                      <View style={styles.confidenceContainer}>
                        <Text style={styles.confidenceLabel}>Nivel de confianza:</Text>
                        <View style={styles.confidenceBarContainer}>
                          <View
                            style={[
                              styles.confidenceBar,
                              {
                                width: `${Math.round(selectedAnalysis.result.result.classification_results[0].probability * 100)}%`,
                                backgroundColor: getConfidenceColor(
                                  selectedAnalysis.result.result.classification_results[0].probability,
                                ),
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.confidenceValue}>
                          {Math.round(selectedAnalysis.result.result.classification_results[0].probability * 100)}%
                        </Text>
                      </View>

                      {/* Nombres comunes */}
                      {selectedAnalysis.result.result.classification_results[0].common_names && (
                        <View style={styles.detailsSection}>
                          <Text style={styles.detailsSectionTitle}>Nombres comunes:</Text>
                          <View style={styles.commonNamesContainer}>
                            {selectedAnalysis.result.result.classification_results[0].common_names.map(
                              (name, index) => (
                                <View key={index} style={styles.commonNameTag}>
                                  <Text style={styles.commonNameText}>{name}</Text>
                                </View>
                              ),
                            )}
                          </View>
                        </View>
                      )}

                      {/* Descripción */}
                      {selectedAnalysis.result.result.classification_results[0].description && (
                        <View style={styles.detailsSection}>
                          <Text style={styles.detailsSectionTitle}>Descripción:</Text>
                          <Text style={styles.detailsText}>
                            {selectedAnalysis.result.result.classification_results[0].description.value ||
                              "No hay descripción disponible"}
                          </Text>
                        </View>
                      )}

                      {/* Tratamiento */}
                      {selectedAnalysis.result.result.classification_results[0].treatment && (
                        <View style={styles.detailsSection}>
                          <Text style={styles.detailsSectionTitle}>Tratamiento recomendado:</Text>
                          <Text style={styles.detailsText}>
                            {selectedAnalysis.result.result.classification_results[0].treatment.summary ||
                              "No hay tratamiento disponible"}
                          </Text>
                        </View>
                      )}

                      {/* Fecha del análisis */}
                      <View style={styles.detailsSection}>
                        <Text style={styles.detailsSectionTitle}>Fecha del análisis:</Text>
                        <Text style={styles.detailsText}>{new Date(selectedAnalysis.timestamp).toLocaleString()}</Text>
                      </View>
                    </Animated.View>
                  </View>
                )}

                {selectedTab === "technical" && (
                  <View style={styles.detailsInfoContainer}>
                    <Animated.View style={[styles.detailsCard, { opacity: fadeAnim }]}>
                      <Text style={styles.detailsCardTitle}>Información Técnica</Text>

                      {/* Mostrar toda la información técnica disponible */}
                      <View style={styles.detailsSection}>
                        <Text style={styles.detailsSectionTitle}>Access Token:</Text>
                        <Text style={styles.detailsText}>
                          {selectedAnalysis.rawResponse?.access_token || "No disponible"}
                        </Text>
                      </View>

                      <View style={styles.detailsSection}>
                        <Text style={styles.detailsSectionTitle}>Status:</Text>
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusText}>
                            {selectedAnalysis.rawResponse?.status || "No disponible"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.detailsSection}>
                        <Text style={styles.detailsSectionTitle}>Creado:</Text>
                        <Text style={styles.detailsText}>
                          {selectedAnalysis.rawResponse?.created
                            ? new Date(selectedAnalysis.rawResponse.created * 1000).toLocaleString()
                            : "No disponible"}
                        </Text>
                      </View>

                      <View style={styles.detailsSection}>
                        <Text style={styles.detailsSectionTitle}>Tiempo de procesamiento:</Text>
                        <Text style={styles.detailsText}>
                          {selectedAnalysis.rawResponse?.completed && selectedAnalysis.rawResponse?.created
                            ? `${(selectedAnalysis.rawResponse.completed - selectedAnalysis.rawResponse.created).toFixed(2)} segundos`
                            : "No disponible"}
                        </Text>
                      </View>

                      {/* Input Parameters */}
                      <View style={styles.detailsSection}>
                        <Text style={styles.detailsSectionTitle}>Parámetros de entrada:</Text>
                        {selectedAnalysis.rawResponse?.input ? (
                          <>
                            <View style={styles.parameterContainer}>
                              <Text style={styles.parameterLabel}>latitude:</Text>
                              <Text style={styles.parameterValue}>
                                {selectedAnalysis.rawResponse.input.latitude || "None"}
                              </Text>
                            </View>
                            <View style={styles.parameterContainer}>
                              <Text style={styles.parameterLabel}>longitude:</Text>
                              <Text style={styles.parameterValue}>
                                {selectedAnalysis.rawResponse.input.longitude || "None"}
                              </Text>
                            </View>
                            <View style={styles.parameterContainer}>
                              <Text style={styles.parameterLabel}>similar_images:</Text>
                              <Text style={styles.parameterValue}>
                                {selectedAnalysis.rawResponse.input.similar_images
                                  ? selectedAnalysis.rawResponse.input.similar_images.toString()
                                  : "True"}
                              </Text>
                            </View>
                            <View style={styles.parameterContainer}>
                              <Text style={styles.parameterLabel}>datetime:</Text>
                              <Text style={styles.parameterValue}>
                                {selectedAnalysis.rawResponse.input.datetime || "No disponible"}
                              </Text>
                            </View>
                          </>
                        ) : (
                          <Text style={styles.detailsText}>No hay información de entrada disponible</Text>
                        )}
                      </View>

                      {/* Is Plant Information */}
                      <View style={styles.detailsSection}>
                        <Text style={styles.detailsSectionTitle}>Información de planta:</Text>
                        {selectedAnalysis.rawResponse?.result?.is_plant ? (
                          <>
                            <View style={styles.parameterContainer}>
                              <Text style={styles.parameterLabel}>binary:</Text>
                              <Text style={styles.parameterValue}>
                                {selectedAnalysis.rawResponse.result.is_plant.binary.toString()}
                              </Text>
                            </View>
                            <View style={styles.parameterContainer}>
                              <Text style={styles.parameterLabel}>threshold:</Text>
                              <Text style={styles.parameterValue}>
                                {selectedAnalysis.rawResponse.result.is_plant.threshold}
                              </Text>
                            </View>
                            <View style={styles.parameterContainer}>
                              <Text style={styles.parameterLabel}>probability:</Text>
                              <Text style={styles.parameterValue}>
                                {(selectedAnalysis.rawResponse.result.is_plant.probability * 100).toFixed(2)}%
                              </Text>
                            </View>
                          </>
                        ) : (
                          <Text style={styles.detailsText}>No hay información de planta disponible</Text>
                        )}
                      </View>

                      {/* Crop Information */}
                      <View style={styles.detailsSection}>
                        <Text style={styles.detailsSectionTitle}>Información de cultivo:</Text>
                        {selectedAnalysis.rawResponse?.result?.crop?.suggestions ? (
                          selectedAnalysis.rawResponse.result.crop.suggestions.map((crop, index) => (
                            <View key={index} style={styles.cropItem}>
                              <Text style={styles.cropPercentage}>{(crop.probability * 100).toFixed(2)}% - </Text>
                              <Text style={styles.cropName}>
                                {crop.name} ({crop.scientific_name})
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text style={styles.detailsText}>No hay información de cultivo disponible</Text>
                        )}
                      </View>

                      {/* Mostrar la respuesta completa en formato JSON para depuración */}
                      <View style={styles.detailsSection}>
                        <Text style={styles.detailsSectionTitle}>Respuesta completa de la API:</Text>
                        <View style={styles.jsonContainer}>
                          <Text style={styles.jsonText}>{JSON.stringify(selectedAnalysis.rawResponse, null, 2)}</Text>
                        </View>
                      </View>
                    </Animated.View>
                  </View>
                )}

                {selectedTab === "all" && (
                  <View style={styles.detailsInfoContainer}>
                    <Animated.View style={[styles.detailsCard, { opacity: fadeAnim }]}>
                      <Text style={styles.detailsCardTitle}>Todos los Resultados</Text>

                      {selectedAnalysis.rawResponse?.result?.disease?.suggestions ? (
                        <View style={styles.allResultsContainer}>
                          {selectedAnalysis.rawResponse.result.disease.suggestions.map((result, index) => (
                            <View key={index} style={styles.resultItem}>
                              <View style={styles.resultHeader}>
                                <Text style={styles.resultName}>{result.name}</Text>
                                <Text style={styles.resultPercentage}>{(result.probability * 100).toFixed(2)}%</Text>
                              </View>

                              <View style={styles.confidenceBarContainer}>
                                <View
                                  style={[
                                    styles.confidenceBar,
                                    {
                                      width: `${Math.round(result.probability * 100)}%`,
                                      backgroundColor: getConfidenceColor(result.probability),
                                    },
                                  ]}
                                />
                              </View>

                              {/* Scientific Name */}
                              <View style={styles.scientificNameContainer}>
                                <Text style={styles.scientificNameLabel}>Nombre científico:</Text>
                                <Text style={styles.scientificNameValue}>{result.scientific_name}</Text>
                              </View>

                              {/* Similar Images */}
                              {result.similar_images && result.similar_images.length > 0 && (
                                <View style={styles.similarImagesContainer}>
                                  <Text style={styles.similarImagesTitle}>Imágenes similares:</Text>
                                  <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.similarImagesScroll}
                                  >
                                    {result.similar_images.map((img, imgIndex) => (
                                      <View key={imgIndex} style={styles.similarImageWrapper}>
                                        <Image
                                          source={{ uri: img.url_small || img.url }}
                                          style={styles.similarImage}
                                          resizeMode="cover"
                                        />
                                      </View>
                                    ))}
                                  </ScrollView>
                                </View>
                              )}

                              <View style={styles.resultDivider} />
                            </View>
                          ))}
                        </View>
                      ) : (
                        <Text style={styles.detailsText}>No hay resultados de clasificación disponibles</Text>
                      )}
                    </Animated.View>
                  </View>
                )}
              </ScrollView>

              {/* Botones de acción */}
              <View style={styles.detailsActions}>
                <TouchableOpacity style={styles.detailsActionButton} activeOpacity={0.8}>
                  <Ionicons name="bookmark-outline" size={24} color="white" />
                  <Text style={styles.detailsActionText}>Guardar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.detailsActionButton, styles.detailsActionButtonPrimary]}
                  activeOpacity={0.8}
                >
                  <Ionicons name="document-text-outline" size={24} color="white" />
                  <Text style={styles.detailsActionText}>Ver tratamiento completo</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        )}
      </Modal>
    </View>
  )
}

// Función para determinar el color según el nivel de confianza
const getConfidenceColor = (confidence) => {
  const percent = confidence * 100
  if (percent >= 80) return "#4CAF50" // Verde
  if (percent >= 60) return "#8BC34A" // Verde claro
  if (percent >= 40) return "#FFEB3B" // Amarillo
  if (percent >= 20) return "#FF9800" // Naranja
  return "#F44336" // Rojo
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  cabecera: {
    backgroundColor: "#3a5a40",
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tituloCabecera: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtituloCabecera: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  iconosCabecera: {
    flexDirection: "row",
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
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  imagenCamara: {
    width: "100%",
    height: "100%",
  },
  sobreCamara: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textoCamara: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  contenedorEnVivo: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicadorEnVivo: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    marginRight: 5,
  },
  textoEnVivo: {
    color: "white",
    fontWeight: "bold",
  },
  botonesCaptura: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  botonCaptura: {
    backgroundColor: "#3a5a40",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  textoBotonCaptura: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  seccionActividad: {
    padding: 15,
  },
  tituloActividad: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3a5a40",
    marginBottom: 15,
  },
  tarjetaActividad: {
    backgroundColor: "#88a47c",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  activityImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  activityImage: {
    width: "100%",
    height: "100%",
  },
  contenedorIconoActividad: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoActividad: {
    flex: 1,
  },
  tituloTarjetaActividad: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  confianzaText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    marginTop: 2,
  },
  tiempoActividad: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 4,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "rgba(58, 90, 64, 0.1)",
    borderRadius: 12,
  },
  emptyStateIcon: {
    marginBottom: 15,
    opacity: 0.7,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3a5a40",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  botonFlotante: {
    position: "absolute",
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3a5a40",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  barraInferior: {
    height: 60,
    backgroundColor: "#3a5a40",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  itemNavegacion: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: 60,
  },
  indicadorActivo: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "white",
    marginTop: 4,
  },
  botonCentral: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#0e813c",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 34,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  contenedorBotonCentral: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Estilos para la previsualización de imagen
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewContent: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cameraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 10,
    paddingHorizontal: 20,
    backgroundColor: "rgba(58, 90, 64, 0.7)",
    paddingBottom: 15,
  },
  cameraBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(14, 129, 60, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraTitle: {
    alignItems: "center",
  },
  cameraTitleText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cameraOptionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(14, 129, 60, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraInfoContainer: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(58, 90, 64, 0.5)",
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  cameraInfoText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  previewImageContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#111",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    backgroundColor: "rgba(58, 90, 64, 0.7)",
    paddingTop: 20,
  },
  previewActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(14, 129, 60, 0.8)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 140,
  },
  previewActionButtonPrimary: {
    backgroundColor: "#0e813c",
  },
  previewActionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  // Estilos para la animación de carga
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  spinner: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 40,
    marginBottom: 20,
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  loadingSubText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  // Estilos para la pantalla de detalles
  detailsContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  detailsContent: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 10,
    paddingHorizontal: 20,
    backgroundColor: "#3a5a40",
    paddingBottom: 15,
  },
  detailsBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsTitle: {
    alignItems: "center",
  },
  detailsTitleText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  detailsShareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Estilos para las pestañas
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#3a5a40",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#fff",
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },

  detailsScrollView: {
    flex: 1,
  },
  detailsImageContainer: {
    height: 200,
    width: "100%",
    backgroundColor: "#000",
  },
  detailsImage: {
    width: "100%",
    height: "100%",
  },
  detailsInfoContainer: {
    padding: 15,
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  detailsCardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3a5a40",
    marginBottom: 15,
  },
  confidenceContainer: {
    marginBottom: 20,
  },
  confidenceLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  confidenceBarContainer: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginBottom: 5,
    overflow: "hidden",
  },
  confidenceBar: {
    height: "100%",
    borderRadius: 5,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3a5a40",
    textAlign: "right",
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailsSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3a5a40",
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  commonNamesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  commonNameTag: {
    backgroundColor: "rgba(58, 90, 64, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  commonNameText: {
    color: "#3a5a40",
    fontSize: 14,
  },

  // Estilos para la información técnica
  statusBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  parameterContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  parameterLabel: {
    fontSize: 14,
    color: "#666",
    width: 120,
  },
  parameterValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  cropItem: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
  },
  cropPercentage: {
    fontSize: 14,
    color: "#3a5a40",
    fontWeight: "bold",
  },
  cropName: {
    fontSize: 14,
    color: "#333",
  },

  // Estilos para todos los resultados
  allResultsContainer: {
    marginTop: 10,
  },
  resultItem: {
    marginBottom: 15,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3a5a40",
    flex: 1,
  },
  resultPercentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3a5a40",
  },
  resultDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 15,
  },
  similarImagesContainer: {
    marginTop: 10,
  },
  similarImagesTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  similarImagesScroll: {
    flexDirection: "row",
  },
  similarImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  similarImage: {
    width: "100%",
    height: "100%",
  },

  // Estilos para el JSON
  jsonContainer: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  jsonText: {
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: "#333",
  },

  detailsActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    backgroundColor: "white",
    paddingTop: 15,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  detailsActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#88a47c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
  },
  detailsActionButtonPrimary: {
    backgroundColor: "#3a5a40",
    flex: 1.5,
  },
  detailsActionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  scientificNameContainer: {
    marginTop: 8,
    marginBottom: 10,
  },
  scientificNameLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  scientificNameValue: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#333",
  },
})
