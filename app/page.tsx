"use client"

import { useState, useEffect } from "react"
import { Bell, Heart, HelpCircle, PieChart, User, ShoppingCart, Pill, ArrowLeft, ToggleLeft, ToggleRight, AlertTriangle, Shield, Check, X, Target } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { LoginScreen } from "@/components/login-screen"
import { LogoutButton } from "@/components/logout-button"
import { LoadingButton } from "@/components/loading-button"
import { ScreenTransition } from "@/components/screen-transition"
import { BalanceSkeleton, TransactionSkeleton, ExpenseCategorySkeleton, ContactSkeleton } from "@/components/skeleton-loader"
import { VoiceAssistant } from "@/components/voice-assistant"
import { SecurityPause } from "@/components/security-pause"
import { DigitalVault } from "@/components/digital-vault"
import { FamilyGoals } from "@/components/family-goals"
import { TrustedMarketplace } from "@/components/trusted-marketplace"

type Screen = "dashboard" | "expenses" | "alerts" | "trust" | "help" | "fraud-alert" | "voice-assistant" | "security-pause" | "digital-vault" | "family-goals" | "marketplace"

export default function GuardianFinanciero() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard")
  const [screenLoading, setScreenLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const [expensesLoading, setExpensesLoading] = useState(true)
  const [contactsLoading, setContactsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  const [contacts, setContacts] = useState([
    { id: 1, name: "Javier Astudillo", relationship: "Hijo", enabled: true },
    { id: 2, name: "María González", relationship: "Hija", enabled: true },
    { id: 3, name: "Carlos Mendoza", relationship: "Hermano", enabled: false },
  ])

  const [securityPauseData, setSecurityPauseData] = useState({
    transaction: {
      type: "Transferencia Internacional",
      amount: "$154.300",
      recipient: "Amazon.com",
      riskLevel: 'high' as const
    },
    trustedContact: {
      name: "Javier Astudillo",
      relationship: "Hijo",
      phone: "+56 9 8765 4321"
    }
  })

  // Simulate data loading when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setDataLoading(true)
      setBalanceLoading(true)
      setTransactionsLoading(true)
      
      // Simulate balance loading
      setTimeout(() => setBalanceLoading(false), 1500)
      
      // Simulate transactions loading
      setTimeout(() => setTransactionsLoading(false), 2000)
      
      // Overall data loading
      setTimeout(() => setDataLoading(false), 2500)
    }
  }, [isAuthenticated])

  // Simulate screen transitions
  const handleScreenChange = (screen: Screen, loadingText?: string) => {
    setScreenLoading(true)
    
    // Simulate different loading times for different screens
    const loadingTime = screen === 'expenses' ? 2000 : screen === 'trust' ? 1500 : 1000
    
    setTimeout(() => {
      setCurrentScreen(screen)
      setScreenLoading(false)
      
      // Load screen-specific data
      if (screen === 'expenses') {
        setExpensesLoading(true)
        setTimeout(() => setExpensesLoading(false), 1000)
      } else if (screen === 'trust') {
        setContactsLoading(true)
        setTimeout(() => setContactsLoading(false), 800)
      }
    }, loadingTime)
  }

  const handleLogout = () => {
    setActionLoading('logout')
    setTimeout(() => {
      setIsAuthenticated(false)
      setCurrentScreen("dashboard")
      setActionLoading(null)
      setDataLoading(true)
    }, 1000)
  }

  const handleFraudAction = (action: 'confirm' | 'block') => {
    setActionLoading(action)
    setTimeout(() => {
      setCurrentScreen("dashboard")
      setActionLoading(null)
    }, 2000)
  }

  const toggleContact = (id: number) => {
    setActionLoading(`toggle-${id}`)
    setTimeout(() => {
      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, enabled: !contact.enabled } : contact
      ))
      setActionLoading(null)
    }, 800)
  }

  const renderHeader = (title: string, showBack: boolean = false) => (
    <div className="bg-white shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <LoadingButton
            variant="ghost"
            size="icon"
            onClick={() => handleScreenChange("dashboard")}
            className="h-10 w-10"
            loading={screenLoading}
          >
            <ArrowLeft className="h-6 w-6" />
          </LoadingButton>
        )}
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {!showBack && (
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg?height=48&width=48&text=R" />
            <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-800">R</AvatarFallback>
          </Avatar>
        )}
        <LoadingButton
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          loading={actionLoading === 'logout'}
          loadingText=""
          className="h-10 w-10 text-gray-600 hover:text-red-600"
        >
          <User className="h-5 w-5" />
        </LoadingButton>
      </div>
    </div>
  )

  const handleVoiceCommand = (command: string) => {
    if (command.includes("dinero") || command.includes("saldo")) {
      // Voice command handled in component
    } else if (command.includes("gastos")) {
      handleScreenChange("expenses")
    } else if (command.includes("confianza")) {
      handleScreenChange("trust")
    }
  }

  const renderDashboard = () => (
    <ScreenTransition isLoading={dataLoading} loadingText="Cargando tu información...">
      <div className="min-h-screen bg-gray-50">
        {renderHeader("Hola, Roberto")}
        
        <div className="p-4 space-y-6">
          {/* Balance Card */}
          {balanceLoading ? (
            <BalanceSkeleton />
          ) : (
            <Card className="bg-green-50 border-green-200 animate-in slide-in-from-top duration-500">
              <CardContent className="p-6 text-center">
                <p className="text-lg text-gray-600 mb-2">Saldo Actual</p>
                <p className="text-4xl font-bold text-green-700">$482.550</p>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom duration-500 delay-200">
            <LoadingButton
              variant="outline"
              className="h-24 flex flex-col gap-2 text-lg font-medium border-2 hover:bg-blue-50"
              onClick={() => handleScreenChange("expenses", "Cargando gastos...")}
              loading={screenLoading && currentScreen === "expenses"}
              loadingText="Cargando..."
            >
              <PieChart className="h-8 w-8 text-blue-600" />
              Mis Gastos
            </LoadingButton>
            
            <LoadingButton
              variant="outline"
              className="h-24 flex flex-col gap-2 text-lg font-medium border-2 hover:bg-amber-50"
              onClick={() => handleScreenChange("alerts", "Verificando alertas...")}
              loading={screenLoading && currentScreen === "alerts"}
              loadingText="Cargando..."
            >
              <Bell className="h-8 w-8 text-amber-600" />
              Alertas
            </LoadingButton>
            
            <LoadingButton
              variant="outline"
              className="h-24 flex flex-col gap-2 text-lg font-medium border-2 hover:bg-pink-50"
              onClick={() => handleScreenChange("trust", "Cargando contactos...")}
              loading={screenLoading && currentScreen === "trust"}
              loadingText="Cargando..."
            >
              <Heart className="h-8 w-8 text-pink-600" />
              Confianza
            </LoadingButton>
            
            <LoadingButton
              variant="outline"
              className="h-24 flex flex-col gap-2 text-lg font-medium border-2 hover:bg-purple-50"
              onClick={() => handleScreenChange("help", "Preparando ayuda...")}
              loading={screenLoading && currentScreen === "help"}
              loadingText="Cargando..."
            >
              <HelpCircle className="h-8 w-8 text-purple-600" />
              Ayuda
            </LoadingButton>
          </div>

          {/* New Features Row */}
          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom duration-500 delay-300">
            <LoadingButton
              variant="outline"
              className="h-24 flex flex-col gap-2 text-lg font-medium border-2 hover:bg-green-50"
              onClick={() => handleScreenChange("digital-vault", "Abriendo bóveda...")}
              loading={screenLoading && currentScreen === "digital-vault"}
              loadingText="Cargando..."
            >
              <Shield className="h-8 w-8 text-green-600" />
              Bóveda Digital
            </LoadingButton>
            
            <LoadingButton
              variant="outline"
              className="h-24 flex flex-col gap-2 text-lg font-medium border-2 hover:bg-indigo-50"
              onClick={() => handleScreenChange("family-goals", "Cargando metas...")}
              loading={screenLoading && currentScreen === "family-goals"}
              loadingText="Cargando..."
            >
              <Target className="h-8 w-8 text-indigo-600" />
              Metas Familiares
            </LoadingButton>
          </div>

          {/* Voice Assistant */}
          <div className="animate-in slide-in-from-bottom duration-500 delay-400">
            <VoiceAssistant onCommand={handleVoiceCommand} />
          </div>

          {/* Marketplace Button */}
          <LoadingButton
            className="w-full h-16 text-xl font-semibold bg-purple-600 hover:bg-purple-700 animate-in slide-in-from-bottom duration-500 delay-500"
            onClick={() => handleScreenChange("marketplace", "Cargando servicios...")}
            loading={screenLoading && currentScreen === "marketplace"}
            loadingText="Cargando servicios..."
          >
            <Shield className="h-6 w-6 mr-2" />
            Servicios Verificados
          </LoadingButton>

          {/* Recent Transactions */}
          <Card className="animate-in slide-in-from-bottom duration-500 delay-300">
            <CardHeader>
              <CardTitle className="text-xl">Últimos Movimientos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactionsLoading ? (
                <>
                  <TransactionSkeleton />
                  <TransactionSkeleton />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="font-medium">Unimarc</p>
                        <p className="text-sm text-gray-500">Ayer, 14:30</p>
                      </div>
                    </div>
                    <p className="font-semibold text-red-600">-$28.450</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Pill className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium">Farmacia Cruz Verde</p>
                        <p className="text-sm text-gray-500">Lunes, 10:15</p>
                      </div>
                    </div>
                    <p className="font-semibold text-red-600">-$15.200</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ScreenTransition>
  )

  const renderFraudAlert = () => (
    <div className="min-h-screen bg-red-50">
      <div className="p-6 text-center space-y-6">
        <div className="flex justify-center animate-in zoom-in duration-500">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="h-16 w-16 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-red-800 animate-in slide-in-from-top duration-500 delay-200">
          ¡Alerta de Seguridad!
        </h1>
        
        <p className="text-xl text-gray-700 leading-relaxed animate-in slide-in-from-bottom duration-500 delay-300">
          Hemos detectado un movimiento sospechoso que no parece tuyo. Por favor, revisa esta transacción de inmediato.
        </p>
        
        <Card className="border-red-300 border-2 bg-white animate-in slide-in-from-bottom duration-500 delay-400">
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Comercio:</span>
              <span className="font-semibold">Compra Internacional - Amazon.com</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Monto:</span>
              <span className="font-semibold text-red-600 text-xl">$154.300</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Fecha y Hora:</span>
              <span className="font-semibold">Hoy, 03:15 AM</span>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4 pt-4 animate-in slide-in-from-bottom duration-500 delay-500">
          <LoadingButton
            className="w-full h-16 text-xl font-semibold bg-green-600 hover:bg-green-700"
            onClick={() => handleFraudAction('confirm')}
            loading={actionLoading === 'confirm'}
            loadingText="Confirmando..."
          >
            <Check className="h-6 w-6 mr-2" />
            Sí, fui yo. Es seguro.
          </LoadingButton>
          
          <LoadingButton
            variant="destructive"
            className="w-full h-16 text-xl font-semibold bg-red-600 hover:bg-red-700"
            onClick={() => handleFraudAction('block')}
            loading={actionLoading === 'block'}
            loadingText="Bloqueando..."
          >
            <X className="h-6 w-6 mr-2" />
            No, yo no fui. ¡Bloquear!
          </LoadingButton>
        </div>
      </div>
    </div>
  )

  const renderExpenses = () => (
    <ScreenTransition isLoading={screenLoading} loadingText="Analizando tus gastos...">
      <div className="min-h-screen bg-gray-50">
        {renderHeader("Resumen de Mis Gastos", true)}
        
        <div className="p-4 space-y-6">
          {/* Chart */}
          <Card className="animate-in slide-in-from-top duration-500">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-16 w-16 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Gráfico de Gastos</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Supermercado 40%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Cuentas 25%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Salud 20%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span>Otros 15%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Categories */}
          <div className="space-y-4">
            {expensesLoading ? (
              <>
                <Card><ExpenseCategorySkeleton /></Card>
                <Card><ExpenseCategorySkeleton /></Card>
              </>
            ) : (
              <>
                <Card className="animate-in slide-in-from-left duration-500 delay-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <ShoppingCart className="h-8 w-8 text-blue-600" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">Supermercado</h3>
                        <p className="text-2xl font-bold text-blue-600">$195.200</p>
                      </div>
                    </div>
                    <Progress value={75} className="h-3" />
                    <p className="text-sm text-gray-500 mt-1">75% del presupuesto usado</p>
                  </CardContent>
                </Card>

                <Card className="animate-in slide-in-from-right duration-500 delay-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <Pill className="h-8 w-8 text-green-600" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">Salud</h3>
                        <p className="text-2xl font-bold text-green-600">$98.400</p>
                      </div>
                    </div>
                    <Progress value={45} className="h-3" />
                    <p className="text-sm text-gray-500 mt-1">45% del presupuesto usado</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </ScreenTransition>
  )

  const renderTrust = () => (
    <ScreenTransition isLoading={screenLoading} loadingText="Cargando tu círculo de confianza...">
      <div className="min-h-screen bg-gray-50">
        {renderHeader("Mi Círculo de Confianza", true)}
        
        <div className="p-4 space-y-6">
          <Card className="bg-blue-50 border-blue-200 animate-in slide-in-from-top duration-500">
            <CardContent className="p-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                Estas son las personas que recibirán una alerta si detectamos un problema de seguridad en tu cuenta.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {contactsLoading ? (
              <>
                <Card><ContactSkeleton /></Card>
                <Card><ContactSkeleton /></Card>
                <Card><ContactSkeleton /></Card>
              </>
            ) : (
              contacts.map((contact, index) => (
                <Card key={contact.id} className={`animate-in slide-in-from-bottom duration-500 delay-${(index + 1) * 100}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={`/placeholder-icon.png?height=64&width=64&text=${contact.name.charAt(0)}`} />
                        <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-800">
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{contact.name}</h3>
                        <p className="text-lg text-gray-600">{contact.relationship}</p>
                      </div>
                      
                      <LoadingButton
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleContact(contact.id)}
                        loading={actionLoading === `toggle-${contact.id}`}
                        className="h-12 w-12"
                      >
                        {contact.enabled ? (
                          <ToggleRight className="h-8 w-8 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-8 w-8 text-gray-400" />
                        )}
                      </LoadingButton>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </ScreenTransition>
  )

  const renderAlerts = () => (
    <ScreenTransition isLoading={screenLoading} loadingText="Verificando alertas de seguridad...">
      <div className="min-h-screen bg-gray-50">
        {renderHeader("Alertas de Seguridad", true)}
        
        <div className="p-4 space-y-4">
          <Card className="border-amber-200 bg-amber-50 animate-in slide-in-from-top duration-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-amber-600" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-800">Sistema Activo</h3>
                  <p className="text-amber-700">Tu cuenta está siendo monitoreada las 24 horas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <LoadingButton
            className="w-full h-16 text-xl font-semibold bg-red-600 hover:bg-red-700 animate-in slide-in-from-bottom duration-500 delay-200"
            onClick={() => handleScreenChange("fraud-alert", "Cargando alerta...")}
            loading={screenLoading && currentScreen === "fraud-alert"}
            loadingText="Cargando alerta..."
          >
            <AlertTriangle className="h-6 w-6 mr-2" />
            Ver Alerta de Fraude (Demo)
          </LoadingButton>

          <LoadingButton
            className="w-full h-16 text-xl font-semibold bg-orange-600 hover:bg-orange-700 animate-in slide-in-from-bottom duration-500 delay-300"
            onClick={() => handleScreenChange("security-pause", "Activando pausa de seguridad...")}
            loading={screenLoading && currentScreen === "security-pause"}
            loadingText="Activando..."
          >
            <Shield className="h-6 w-6 mr-2" />
            Ver Pausa de Seguridad (Demo)
          </LoadingButton>
        </div>
      </div>
    </ScreenTransition>
  )

  const renderHelp = () => (
    <ScreenTransition isLoading={screenLoading} loadingText="Preparando centro de ayuda...">
      <div className="min-h-screen bg-gray-50">
        {renderHeader("Centro de Ayuda", true)}
        
        <div className="p-4 space-y-4">
          <Card className="animate-in slide-in-from-top duration-500">
            <CardContent className="p-6 text-center">
              <HelpCircle className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">¿Necesitas ayuda?</h2>
              <p className="text-lg text-gray-600 mb-6">
                Estamos aquí para apoyarte. Contacta a nuestro equipo de soporte.
              </p>
              <LoadingButton 
                className="w-full h-14 text-xl font-semibold bg-purple-600 hover:bg-purple-700"
                loading={actionLoading === 'call-support'}
                loadingText="Conectando..."
                onClick={() => {
                  setActionLoading('call-support')
                  setTimeout(() => setActionLoading(null), 2000)
                }}
              >
                Llamar Soporte: 600-123-4567
              </LoadingButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScreenTransition>
  )

  // Early return for login screen
  if (!isAuthenticated) {
    return <LoginScreen onAuthenticated={() => setIsAuthenticated(true)} />
  }

  // Render the appropriate screen
  switch (currentScreen) {
    case "dashboard":
      return renderDashboard()
    case "fraud-alert":
      return renderFraudAlert()
    case "security-pause":
      return (
        <SecurityPause
          transaction={securityPauseData.transaction}
          trustedContact={securityPauseData.trustedContact}
          onConfirm={() => setCurrentScreen("dashboard")}
          onCancel={() => setCurrentScreen("dashboard")}
          onCallTrusted={() => {
            // Simulate calling trusted contact
            setTimeout(() => setCurrentScreen("dashboard"), 3000)
          }}
        />
      )
    case "digital-vault":
      return <DigitalVault onBack={() => setCurrentScreen("dashboard")} />
    case "family-goals":
      return <FamilyGoals onBack={() => setCurrentScreen("dashboard")} />
    case "marketplace":
      return <TrustedMarketplace onBack={() => setCurrentScreen("dashboard")} />
    case "expenses":
      return renderExpenses()
    case "trust":
      return renderTrust()
    case "alerts":
      return renderAlerts()
    case "help":
      return renderHelp()
    default:
      return renderDashboard()
  }
}
