"use client"

import { useState, useEffect } from "react"
import { Fingerprint, Lock, Eye, EyeOff, Shield, Smartphone } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingButton } from "./loading-button"
import { LoadingSpinner } from "./loading-spinner"

interface LoginScreenProps {
  onAuthenticated: () => void
}

export function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const [loginMethod, setLoginMethod] = useState<'choose' | 'biometric' | 'pin' | 'setup-pin' | 'setup-biometric'>('choose')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasExistingPin, setHasExistingPin] = useState(false)
  const [hasBiometric, setHasBiometric] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Check if we're on the client side and load localStorage data
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      setHasExistingPin(localStorage.getItem('guardian-pin') !== null)
      setHasBiometric(localStorage.getItem('guardian-biometric') === 'enabled')
    }
  }, [])

  // Don't render until we're on the client side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <LoadingSpinner size="xl" text="Cargando..." />
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleBiometricAuth = async () => {
    setLoading(true)
    setError('')
    
    try {
      if (!window.PublicKeyCredential) {
        setError('La autenticación biométrica no está disponible en este dispositivo')
        setLoading(false)
        return
      }

      await new Promise(resolve => setTimeout(resolve, 3000))
      
      if (Math.random() > 0.1) {
        onAuthenticated()
      } else {
        setError('No se pudo verificar tu identidad. Intenta de nuevo o usa tu PIN.')
      }
    } catch (err) {
      setError('Error en la autenticación biométrica. Intenta con tu PIN.')
    }
    
    setLoading(false)
  }

  const handlePinAuth = () => {
    setLoading(true)
    setError('')
    
    setTimeout(() => {
      const storedPin = typeof window !== 'undefined' ? localStorage.getItem('guardian-pin') : null
      if (pin === storedPin) {
        onAuthenticated()
      } else {
        setError('PIN incorrecto. Intenta de nuevo.')
        setPin('')
      }
      setLoading(false)
    }, 1500)
  }

  const handleSetupPin = () => {
    if (pin.length < 4) {
      setError('El PIN debe tener al menos 4 números')
      return
    }
    
    if (pin !== confirmPin) {
      setError('Los PINs no coinciden')
      return
    }
    
    setLoading(true)
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('guardian-pin', pin)
      }
      setError('')
      setLoginMethod('setup-biometric')
      setLoading(false)
    }, 1000)
  }

  const handleSkipBiometric = () => {
    setLoading(true)
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('guardian-biometric', 'disabled')
      }
      onAuthenticated()
    }, 800)
  }

  const handleEnableBiometric = async () => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500))
      if (typeof window !== 'undefined') {
        localStorage.setItem('guardian-biometric', 'enabled')
      }
      onAuthenticated()
    } catch (err) {
      setError('No se pudo configurar la autenticación biométrica')
      setLoading(false)
    }
  }

  const renderChooseMethod = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in slide-in-from-bottom duration-500">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center">
            <Shield className="h-10 w-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Guardián Financiero</CardTitle>
          <p className="text-lg text-gray-600 mt-2">Ingresa de forma segura</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {hasBiometric && (
            <LoadingButton
              className="w-full h-16 text-xl font-semibold bg-blue-600 hover:bg-blue-700"
              onClick={() => setLoginMethod('biometric')}
            >
              <Fingerprint className="h-8 w-8 mr-3" />
              Usar Huella Digital
            </LoadingButton>
          )}
          
          {hasExistingPin && (
            <LoadingButton
              variant="outline"
              className="w-full h-16 text-xl font-semibold border-2"
              onClick={() => setLoginMethod('pin')}
            >
              <Lock className="h-8 w-8 mr-3" />
              Ingresar PIN
            </LoadingButton>
          )}
          
          {!hasExistingPin && (
            <LoadingButton
              className="w-full h-16 text-xl font-semibold bg-green-600 hover:bg-green-700"
              onClick={() => setLoginMethod('setup-pin')}
            >
              <Smartphone className="h-8 w-8 mr-3" />
              Configurar Acceso
            </LoadingButton>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderBiometricAuth = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in slide-in-from-top duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-6 bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center">
            {loading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <Fingerprint className="h-12 w-12 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">Verificación Biométrica</CardTitle>
          <p className="text-lg text-gray-600 mt-2">
            {loading ? 'Verificando tu identidad...' : 'Coloca tu dedo en el sensor o mira a la cámara'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800 text-lg">
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <LoadingButton
            className="w-full h-16 text-xl font-semibold bg-blue-600 hover:bg-blue-700"
            onClick={handleBiometricAuth}
            loading={loading}
            loadingText="Verificando..."
          >
            Iniciar Verificación
          </LoadingButton>
          
          <LoadingButton
            variant="outline"
            className="w-full h-14 text-lg border-2"
            onClick={() => setLoginMethod('pin')}
            disabled={loading}
          >
            Usar PIN en su lugar
          </LoadingButton>
          
          <LoadingButton
            variant="ghost"
            className="w-full h-12 text-lg"
            onClick={() => setLoginMethod('choose')}
            disabled={loading}
          >
            Volver
          </LoadingButton>
        </CardContent>
      </Card>
    </div>
  )

  const renderPinAuth = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in slide-in-from-right duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
            <Lock className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Ingresa tu PIN</CardTitle>
          <p className="text-lg text-gray-600 mt-2">Escribe tu PIN de seguridad</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800 text-lg">
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="relative">
            <Input
              type={showPin ? "text" : "password"}
              placeholder="Ingresa tu PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="h-16 text-2xl text-center tracking-widest pr-12"
              maxLength={6}
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-12 w-12"
              onClick={() => setShowPin(!showPin)}
              disabled={loading}
            >
              {showPin ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
            </Button>
          </div>
          
          <LoadingButton
            className="w-full h-16 text-xl font-semibold bg-green-600 hover:bg-green-700"
            onClick={handlePinAuth}
            disabled={pin.length < 4}
            loading={loading}
            loadingText="Verificando..."
          >
            Ingresar
          </LoadingButton>
          
          <LoadingButton
            variant="ghost"
            className="w-full h-12 text-lg"
            onClick={() => setLoginMethod('choose')}
            disabled={loading}
          >
            Volver
          </LoadingButton>
        </CardContent>
      </Card>
    </div>
  )

  const renderSetupPin = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in slide-in-from-left duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center">
            <Lock className="h-10 w-10 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Crear PIN de Seguridad</CardTitle>
          <p className="text-lg text-gray-600 mt-2">Elige un PIN de 4-6 números que recuerdes fácilmente</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800 text-lg">
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <div>
            <label className="block text-lg font-medium mb-2">Nuevo PIN</label>
            <Input
              type={showPin ? "text" : "password"}
              placeholder="Ej: 1234"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="h-16 text-2xl text-center tracking-widest"
              maxLength={6}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-lg font-medium mb-2">Confirmar PIN</label>
            <Input
              type={showPin ? "text" : "password"}
              placeholder="Repite tu PIN"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="h-16 text-2xl text-center tracking-widest"
              maxLength={6}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPin(!showPin)}
              className="h-12 w-12"
              disabled={loading}
            >
              {showPin ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
            </Button>
            <span className="text-lg text-gray-600">
              {showPin ? 'Ocultar' : 'Mostrar'} números
            </span>
          </div>
          
          <LoadingButton
            className="w-full h-16 text-xl font-semibold bg-purple-600 hover:bg-purple-700"
            onClick={handleSetupPin}
            disabled={pin.length < 4 || confirmPin.length < 4}
            loading={loading}
            loadingText="Creando PIN..."
          >
            Crear PIN
          </LoadingButton>
        </CardContent>
      </Card>
    </div>
  )

  const renderSetupBiometric = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in slide-in-from-bottom duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-6 bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center">
            {loading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <Fingerprint className="h-12 w-12 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">Configurar Huella Digital</CardTitle>
          <p className="text-lg text-gray-600 mt-2">
            {loading ? 'Configurando tu huella digital...' : '¿Te gustaría usar tu huella digital para ingresar más rápido?'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800 text-lg">
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          {!loading && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Ventajas:</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Acceso más rápido y seguro</li>
                <li>• No necesitas recordar tu PIN</li>
                <li>• Mayor protección de tu cuenta</li>
              </ul>
            </div>
          )}
          
          <LoadingButton
            className="w-full h-16 text-xl font-semibold bg-blue-600 hover:bg-blue-700"
            onClick={handleEnableBiometric}
            loading={loading}
            loadingText="Configurando..."
          >
            Sí, Configurar Huella
          </LoadingButton>
          
          <LoadingButton
            variant="outline"
            className="w-full h-14 text-lg border-2"
            onClick={handleSkipBiometric}
            disabled={loading}
            loading={loading}
            loadingText="Finalizando..."
          >
            Ahora no, solo usar PIN
          </LoadingButton>
        </CardContent>
      </Card>
    </div>
  )

  switch (loginMethod) {
    case 'biometric':
      return renderBiometricAuth()
    case 'pin':
      return renderPinAuth()
    case 'setup-pin':
      return renderSetupPin()
    case 'setup-biometric':
      return renderSetupBiometric()
    default:
      return renderChooseMethod()
  }
}
