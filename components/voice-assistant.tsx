"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "./loading-spinner"

interface VoiceAssistantProps {
  onCommand: (command: string) => void
}

export function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)

  const startListening = () => {
    setIsListening(true)
    setTranscript('')
    setResponse('')
    
    // Simulate voice recognition
    setTimeout(() => {
      const sampleCommands = [
        "¿Cuánto dinero me queda?",
        "¿Ya se pagó la cuenta de la luz?",
        "Léeme mis últimos gastos",
        "¿Hay alguna alerta de seguridad?",
        "Muéstrame mi círculo de confianza"
      ]
      const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)]
      setTranscript(randomCommand)
      setIsListening(false)
      setIsProcessing(true)
      
      setTimeout(() => {
        processVoiceCommand(randomCommand)
      }, 1500)
    }, 3000)
  }

  const processVoiceCommand = (command: string) => {
    let response = ""
    
    if (command.includes("dinero") || command.includes("saldo")) {
      response = "Tu saldo actual es de $482.550 pesos. Tienes suficiente dinero para tus gastos del mes."
    } else if (command.includes("cuenta") || command.includes("luz")) {
      response = "Sí, la cuenta de la luz se pagó el día 15 de este mes por $45.200 pesos."
    } else if (command.includes("gastos")) {
      response = "Tus últimos gastos fueron: Unimarc por $28.450 ayer, y Farmacia Cruz Verde por $15.200 el lunes."
    } else if (command.includes("alerta") || command.includes("seguridad")) {
      response = "No hay alertas de seguridad activas. Tu cuenta está protegida y monitoreada."
    } else if (command.includes("confianza") || command.includes("círculo")) {
      response = "Tu círculo de confianza tiene 3 personas: Javier tu hijo, María tu hija, y Carlos tu hermano."
    } else {
      response = "Entiendo tu pregunta. Te ayudo con eso en un momento."
    }
    
    setResponse(response)
    setIsProcessing(false)
    speakResponse(response)
    onCommand(command)
  }

  const speakResponse = (text: string) => {
    setIsSpeaking(true)
    // Simulate text-to-speech
    setTimeout(() => {
      setIsSpeaking(false)
    }, 3000)
  }

  const stopListening = () => {
    setIsListening(false)
    setIsProcessing(false)
  }

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardContent className="p-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className={`p-4 rounded-full ${isListening ? 'bg-red-100 animate-pulse' : 'bg-blue-100'}`}>
            {isListening ? (
              <Mic className="h-12 w-12 text-red-600" />
            ) : (
              <MicOff className="h-12 w-12 text-blue-600" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-blue-800">Asistente Guardián</h3>
          <p className="text-lg text-gray-700">
            {isListening ? "Te estoy escuchando..." : 
             isProcessing ? "Procesando tu pregunta..." :
             isSpeaking ? "Respondiendo..." :
             "Presiona el botón y hazme una pregunta"}
          </p>
        </div>

        {transcript && (
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-lg font-medium text-gray-800">Escuché: "{transcript}"</p>
          </div>
        )}

        {isProcessing && (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="Pensando..." />
          </div>
        )}

        {response && !isProcessing && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              {isSpeaking ? (
                <Volume2 className="h-5 w-5 text-green-600 animate-pulse" />
              ) : (
                <VolumeX className="h-5 w-5 text-green-600" />
              )}
              <span className="font-medium text-green-800">
                {isSpeaking ? "Hablando..." : "Respuesta:"}
              </span>
            </div>
            <p className="text-lg text-gray-800">{response}</p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Button
            className={`h-16 px-8 text-xl font-semibold ${
              isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
          >
            {isListening ? (
              <>
                <MicOff className="h-6 w-6 mr-2" />
                Parar
              </>
            ) : (
              <>
                <Mic className="h-6 w-6 mr-2" />
                Hablar con Guardián
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
