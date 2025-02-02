"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppContext } from "@/contexts/AppContext"

interface Subscription {
  _id: string
  email: string
  createdAt: string
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useAppContext()

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const response = await fetch("/api/subscriptions")
      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data)
      }
      setIsLoading(false)
    }
    fetchSubscriptions()
  }, [])

  const handleDownloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Email,Fecha de Suscripción\n" +
      subscriptions.map((s) => `${s.email},${new Date(s.createdAt).toLocaleString()}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "suscripciones.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return <div className="text-center p-4">Cargando suscripciones...</div>
  }

  return (
    <div className={`space-y-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
      <h1 className="text-3xl font-bold">Gestión de Suscripciones</h1>
      <Button onClick={handleDownloadCSV}>Descargar CSV</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Fecha de Suscripción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription._id}>
              <TableCell>{subscription.email}</TableCell>
              <TableCell>{new Date(subscription.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

