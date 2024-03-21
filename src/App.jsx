import {useRef,useEffect} from 'react'
import './App.css'
import * as faceapi from 'face-api.js'

function App(){
  // ---- REFERENCIAS ---- //
  const videoRef = useRef()
  const canvasRef = useRef()
  // --------------------- //
  
  // ---- EFECTOS ---- //
  useEffect(()=>{
    startVideo()
    videoRef && loadModels()
  },[]);
  // ----------------- //

  // ---- FUNCIONES ---- //
  // CAPTURA LA EL VIDEO DE LA WEBCAM
  const startVideo = ()=>{
    navigator.mediaDevices.getUserMedia({video:true})
    .then((currentStream)=>{
      videoRef.current.srcObject = currentStream
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  // CARGA LOS MODELOS DE LA API DE FACE API
  const loadModels = ()=>{
    Promise.all([
      // MODELOS DE DETECTOR DE CARAS Y RECONOCIMIENTO FACIAL
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models")

      ]).then(()=>{
      faceMyDetect()
    })
  }
  // DETECTA EL ROSTRO EN PANTALLA
  const faceMyDetect = ()=>{
    setInterval(async()=>{
      const detections = await faceapi.detectAllFaces(videoRef.current,
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

      // DIBUJA EL ROSTRO EN PANTALLA
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current)
      faceapi.matchDimensions(canvasRef.current,{
        width:940,
        height:650
      })

      const resized = faceapi.resizeResults(detections,{
         width:940,
        height:650
      })

      faceapi.draw.drawDetections(canvasRef.current,resized)
      faceapi.draw.drawFaceLandmarks(canvasRef.current,resized)
      faceapi.draw.drawFaceExpressions(canvasRef.current,resized)


    },1000)
  }
  // ------------------- //

  return (
    <div className="myapp">
        {/* TITULO */}
        <h1>Reconocimiento Facial</h1>
        {/* VIDEO */}
        <div className="appvide">    
            <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
        </div>
        {/* CANVAS */}
        <canvas 
          ref={canvasRef} 
          width="940" 
          height="650"
          className="appcanvas"
        />
    </div>
  )
}

export default App;