"use client"

import { useState } from "react"
import { FileText, Camera, Shield, Plus, Eye, Download, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingButton } from "./loading-button"
import { Skeleton } from "./skeleton-loader"

interface Document {
  id: string
  name: string
  type: 'id' | 'medical' | 'insurance' | 'medication' | 'emergency'
  dateAdded: string
  size: string
}

interface DigitalVaultProps {
  onBack: () => void
}

export function DigitalVault({ onBack }: DigitalVaultProps) {
  const [loading, setLoading] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Cédula de Identidad',
      type: 'id',
      dateAdded: '15 Mar 2024',
      size: '2.1 MB'
    },
    {
      id: '2',
      name: 'Seguro Médico FONASA',
      type: 'insurance',
      dateAdded: '10 Mar 2024',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Lista de Medicamentos',
      type: 'medication',
      dateAdded: '8 Mar 2024',
      size: '0.5 MB'
    },
    {
      id: '4',
      name: 'Contactos de Emergencia',
      type: 'emergency',
      dateAdded: '5 Mar 2024',
      size: '0.3 MB'
    }
  ])

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'id': return '🆔'
      case 'medical': return '🏥'
      case 'insurance': return '🛡️'
      case 'medication': return '💊'
      case 'emergency': return '🚨'
      default: return '📄'
    }
  }

  const getDocumentColor = (type: string) => {
    switch (type) {
      case 'id': return 'bg-blue-50 border-blue-200'
      case 'medical': return 'bg-green-50 border-green-200'
      case 'insurance': return 'bg-purple-50 border-purple-200'
      case 'medication': return 'bg-orange-50 border-orange-200'
      case 'emergency': return 'bg-red-50 border-red-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const handleAddDocument = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Simulate adding a new document
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-10 w-10"
          >
            ←
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Bóveda Digital Familiar</h1>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-green-600" />
          <span className="text-sm font-medium text-green-600">Protegido</span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Security Notice */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Ultra Seguro</h3>
                <p className="text-green-700">
                  Tus documentos están encriptados y solo tú y tu círculo de confianza pueden verlos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Document Button */}
        <LoadingButton
          className="w-full h-16 text-xl font-semibold bg-blue-600 hover:bg-blue-700"
          onClick={handleAddDocument}
          loading={loading}
          loadingText="Subiendo documento..."
        >
          <Plus className="h-6 w-6 mr-2" />
          Agregar Documento
        </LoadingButton>

        {/* Document Categories */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Mis Documentos</h2>
          
          {documents.map((doc, index) => (
            <Card key={doc.id} className={`${getDocumentColor(doc.type)} animate-in slide-in-from-bottom duration-500 delay-${index * 100}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {getDocumentIcon(doc.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{doc.name}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Agregado: {doc.dateAdded}</span>
                      <span>Tamaño: {doc.size}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      title="Ver documento"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      title="Descargar"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Add Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Agregar Rápido</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 text-base border-2"
            >
              <Camera className="h-6 w-6" />
              Tomar Foto
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 text-base border-2"
            >
              <FileText className="h-6 w-6" />
              Subir Archivo
            </Button>
          </div>
        </div>

        {/* Family Access Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Acceso Familiar</h3>
            <p className="text-blue-700 mb-3">
              Las siguientes personas pueden ver tus documentos en caso de emergencia:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Javier Astudillo (Hijo)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>María González (Hija)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
