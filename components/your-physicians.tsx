import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone } from "lucide-react"

export function YourPhysicians() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Your Physicians</CardTitle>
        <Button variant="link" asChild>
          <Link href="#">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-4 flex items-start gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback className="bg-blue-100 text-blue-600">SJ</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium">Dr. Sarah Johnson</h3>
            <p className="text-sm text-muted-foreground">Cardiologist</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>sarah.johnson@example.com</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

