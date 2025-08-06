"use client"

import { useState } from "react"
import { Shield, Star, Phone, MapPin, Clock, Heart, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "./loading-button"

interface Service {
  id: string
  name: string
  category: 'health' | 'legal' | 'home' | 'insurance'
  description: string
  rating: number
  reviewCount: number
  phone: string
  location: string
  verified: boolean
  specialties: string[]
  price: string
}

interface TrustedMarketplaceProps {
  onBack: () => void
}

export function TrustedMarketplace({ onBack }: TrustedMarketplaceProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const [services] = useState<Service[]>([
    {
      id: '1',
      name: 'Dr. Patricia Morales - Telemedicina',
      category: 'health',
      description: 'Consultas médicas por videollamada. Especialista en medicina familiar y geriatría.',
      rating: 4.9,
      reviewCount: 127,
      phone: '+56 9 8765 4321',
      location: 'Disponible 24/7',
      verified: true,
      specialties: ['Medicina General', 'Geriatría', 'Consultas Online'],
      price: 'Desde $25.000'
    },
    {
      id: '2',
      name: 'Estudio Jurídico González & Asociados',
      category: 'legal',
      description: 'Especialistas en testamentos y trámites de herencia para adultos mayores.',
      rating: 4.8,
      reviewCount: 89,
      phone: '+56 2 2345 6789',
      location: 'Providencia, Santiago',
      verified: true,
      specialties: ['Testamentos', 'Herencias', 'Poderes'],
      price: 'Consulta gratuita'
    },
    {
      id: '3',
      name: 'Reparaciones del Hogar "Don Luis"',
      category: 'home',
      description: 'Servicios de plomería, electricidad y reparaciones menores con 20 años de experiencia.',
      rating: 4.7,
      reviewCount: 156,
      phone: '+56 9 1234 5678',
      location: 'Ñuñoa y comunas cercanas',
      verified: true,
      specialties: ['Plomería', 'Electricidad', 'Cerrajería'],
      price: 'Desde $15.000'
    },
    {
      id: '4',
      name: 'Seguros Vida Dorada',
      category: 'insurance',
      description: 'Seguros de vida y salud especializados para la tercera edad.',
      rating: 4.6,
      reviewCount: 203,
      phone: '+56 2 3456 7890',
      location: 'Oficinas en todo Chile',
      verified: true,
      specialties: ['Seguro de Vida', 'Seguro Oncológico', 'Cobertura Dental'],
      price: 'Cotización gratuita'
    }
  ])

  const categories = [
    { id: 'all', name: 'Todos', icon: '🏪', color: 'bg-gray-100' },
    { id: 'health', name: 'Salud', icon: '🏥', color: 'bg-green-100' },
    { id: 'legal', name: 'Legal', icon: '⚖️', color: 'bg-blue-100' },
    { id: 'home', name: 'Hogar', icon: '🏠', color: 'bg-orange-100' },
    { id: 'insurance', name: 'Seguros', icon: '🛡️', color: 'bg-purple-100' }
  ]

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleContact = (serviceId: string) => {
    setLoading(`contact-${serviceId}`)
    setTimeout(() => {
      setLoading(null)
      // Simulate contacting service
    }, 2000)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
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
          <h1 className="text-2xl font-bold text-gray-800">Servicios Verificados</h1>
        </div>
        <Shield className="h-8 w-8 text-green-600" />
      </div>

      <div className="p-4 space-y-6">
        {/* Trust Badge */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Servicios de Confianza</h3>
                <p className="text-green-700">
                  Todos los servicios han sido verificados por Guardián Financiero por ser confiables y de precio justo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 text-lg pl-10"
          />
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Categorías</h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`h-16 flex flex-col gap-1 text-base ${
                  selectedCategory === category.id ? '' : category.color
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="text-2xl">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedCategory === 'all' ? 'Todos los Servicios' : 
             categories.find(c => c.id === selectedCategory)?.name}
          </h3>
          
          {filteredServices.map((service, index) => (
            <Card key={service.id} className={`animate-in slide-in-from-bottom duration-500 delay-${index * 100}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg text-gray-800">{service.name}</CardTitle>
                      {service.verified && (
                        <Shield className="h-5 w-5 text-green-600" title="Verificado por Guardián" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(service.rating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {service.rating} ({service.reviewCount} reseñas)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">{service.price}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-700">{service.description}</p>
                
                {/* Contact Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{service.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{service.location}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {service.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <LoadingButton
                    className="flex-1 h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleContact(service.id)}
                    loading={loading === `contact-${service.id}`}
                    loadingText="Conectando..."
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Contactar
                  </LoadingButton>
                  
                  <Button
                    variant="outline"
                    className="h-12 px-4 border-2"
                    title="Agregar a favoritos"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Card className="text-center p-8">
            <p className="text-lg text-gray-600">
              No se encontraron servicios que coincidan con tu búsqueda.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
