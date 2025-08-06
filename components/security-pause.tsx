"use client"

import { useState } from "react"
import { AlertTriangle, Phone, Shield, Clock, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingButton } from "./loading-button"

interface SecurityPauseProps {
  transaction: {
    type: string
    amount: string
    recipient: string
    riskLevel: 'high' | 'medium' | 'low'
  }
  trustedContact: {
    name: string
    relationship: string
    phone: string
  }
  onConfirm: () => void
  onCancel: () => void
  onCallTrusted: () => void
}

export function SecurityPause({ 
  transaction, 
  trustedContact, 
  onConfirm, 
  onCancel, 
  onCallTrusted 
}: SecurityPauseProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = (action: string, callback: () => void) => {
    setLoading(action)
    setTimeout(() => {
      callback()
      setLoading(null)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md border-2 border-amber-300">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-4 bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center">
            <Shield className="h-12 w-12 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-amber-800 flex items-center gap-2 justify-center">
            <Clock className="h-6 w-6" />
            Pausa de Seguridad
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              <h3 className="text-lg font-semibold text-amber-800">Movimiento Poco Común</h3>
            </div>
            <p className="text-lg text-gray-700 mb-4">
              Este es un movimiento de dinero grande y poco común para ti. ¿Estás 100% seguro/a?
            </p>
            
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Tipo:</span>
                <span>{transaction.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Monto:</span>
                <span className="font-bold text-red-600">{transaction.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Destinatario:</span>
                <span>{transaction.recipient}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">Sugerencia de Guardián</h3>
            </div>
            <p className="text-lg text-gray-700 mb-3">
              ¿Quieres que llamemos a <strong>{trustedContact.name}</strong> ({trustedContact.relationship}) 
              para conversarlo antes de confirmar?
            </p>
            <p className="text-sm text-gray-600">
              Teléfono: {trustedContact.phone}
            </p>
          </div>

          <div className="space-y-3">
            <LoadingButton
              className="w-full h-16 text-xl font-semibold bg-blue-600 hover:bg-blue-700"
              onClick={() => handleAction('call', onCallTrusted)}
              loading={loading === 'call'}
              loadingText="Llamando..."
            >
              <Phone className="h-6 w-6 mr-2" />
              Llamar a {trustedContact.name}
            </LoadingButton>

            <LoadingButton
              className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700"
              onClick={() => handleAction('confirm', onConfirm)}
              loading={loading === 'confirm'}
              loadingText="Procesando..."
            >
              Sí, estoy seguro/a. Continuar
            </LoadingButton>

            <LoadingButton
              variant="outline"
              className="w-full h-14 text-lg font-semibold border-2"
              onClick={() => handleAction('cancel', onCancel)}
              loading={loading === 'cancel'}
              loadingText="Cancelando..."
            >
              No, mejor cancelar
            </LoadingButton>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Tu seguridad es nuestra prioridad. Siempre es mejor verificar dos veces.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
