"use client"

import { useState } from "react"
import { Target, Heart, Plus, DollarSign, Users, Gift } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LoadingButton } from "./loading-button"

interface FamilyGoal {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  contributors: { name: string; amount: number }[]
  category: 'health' | 'comfort' | 'travel' | 'other'
  createdDate: string
}

interface FamilyGoalsProps {
  onBack: () => void
}

export function FamilyGoals({ onBack }: FamilyGoalsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [goals, setGoals] = useState<FamilyGoal[]>([
    {
      id: '1',
      title: 'Sillón Reclinable Nuevo',
      description: 'Un sillón más cómodo para ver televisión y descansar',
      targetAmount: 250000,
      currentAmount: 180000,
      contributors: [
        { name: 'Roberto (Yo)', amount: 80000 },
        { name: 'Javier', amount: 60000 },
        { name: 'María', amount: 40000 }
      ],
      category: 'comfort',
      createdDate: '10 Mar 2024'
    },
    {
      id: '2',
      title: 'Audífono Digital',
      description: 'Audífono moderno para escuchar mejor',
      targetAmount: 180000,
      currentAmount: 45000,
      contributors: [
        { name: 'Roberto (Yo)', amount: 45000 }
      ],
      category: 'health',
      createdDate: '5 Mar 2024'
    }
  ])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return '🏥'
      case 'comfort': return '🛋️'
      case 'travel': return '✈️'
      default: return '🎯'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'bg-green-50 border-green-200'
      case 'comfort': return 'bg-blue-50 border-blue-200'
      case 'travel': return 'bg-purple-50 border-purple-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleContribute = (goalId: string) => {
    setLoading(`contribute-${goalId}`)
    setTimeout(() => {
      setLoading(null)
      // Simulate contribution
    }, 2000)
  }

  const handleCreateGoal = () => {
    setLoading('create')
    setTimeout(() => {
      setLoading(null)
      // Simulate creating new goal
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
          <h1 className="text-2xl font-bold text-gray-800">Metas Familiares</h1>
        </div>
        <Heart className="h-8 w-8 text-pink-600" />
      </div>

      <div className="p-4 space-y-6">
        {/* Welcome Message */}
        <Card className="bg-pink-50 border-pink-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-pink-600" />
              <div>
                <h3 className="text-lg font-semibold text-pink-800">Metas Compartidas</h3>
                <p className="text-pink-700">
                  Crea objetivos y permite que tu familia te ayude a alcanzarlos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create New Goal */}
        <LoadingButton
          className="w-full h-16 text-xl font-semibold bg-green-600 hover:bg-green-700"
          onClick={handleCreateGoal}
          loading={loading === 'create'}
          loadingText="Creando meta..."
        >
          <Plus className="h-6 w-6 mr-2" />
          Crear Nueva Meta
        </LoadingButton>

        {/* Active Goals */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Mis Metas Activas</h2>
          
          {goals.map((goal, index) => {
            const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100
            const remainingAmount = goal.targetAmount - goal.currentAmount
            
            return (
              <Card key={goal.id} className={`${getCategoryColor(goal.category)} animate-in slide-in-from-bottom duration-500 delay-${index * 100}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-800">{goal.title}</CardTitle>
                      <p className="text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>{formatCurrency(goal.currentAmount)}</span>
                      <span>{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-4" />
                    <p className="text-center text-gray-600">
                      {progressPercentage.toFixed(0)}% completado • Faltan {formatCurrency(remainingAmount)}
                    </p>
                  </div>

                  {/* Contributors */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-700">Contribuciones:</span>
                    </div>
                    {goal.contributors.map((contributor, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-2 rounded">
                        <span className="text-gray-700">{contributor.name}</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(contributor.amount)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <LoadingButton
                      className="flex-1 h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleContribute(goal.id)}
                      loading={loading === `contribute-${goal.id}`}
                      loadingText="Agregando..."
                    >
                      <DollarSign className="h-5 w-5 mr-2" />
                      Agregar Dinero
                    </LoadingButton>
                    
                    <Button
                      variant="outline"
                      className="h-12 px-4 border-2"
                      title="Compartir con familia"
                    >
                      <Gift className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Family Participation */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Participación Familiar</h3>
            <p className="text-blue-700 mb-3">
              Tu familia puede ver tus metas y contribuir directamente desde sus teléfonos.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Javier puede contribuir ✓</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>María puede contribuir ✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
