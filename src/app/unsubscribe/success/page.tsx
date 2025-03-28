import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function UnsubscribeSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md p-8 text-center">
        <div className="mb-6 flex justify-center">
          <Image
            src="https://res.cloudinary.com/dvpzbs3mm/image/upload/v1742590484/logo-blanco-1024x364_h1bw5u.png"
            alt="IPA Las Encinas Logo"
            className="h-16 w-auto"
            width={512}
            height={182}
            
          />
        </div>

        <h1 className="mb-4 text-2xl font-bold text-gray-900">Suscripción Desactivada</h1>

        <p className="mb-6 text-gray-600">
          Has sido removido exitosamente de nuestra lista de correo. Ya no recibirás más comunicaciones de IPA Las
          Encinas.
        </p>

        <p className="mb-8 text-sm text-gray-500">
          Si esto fue un error, puedes volver a suscribirte en cualquier momento desde nuestra página web.
        </p>

        <Link href="/">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Volver a la página principal</Button>
        </Link>
      </Card>
    </div>
  )
}

