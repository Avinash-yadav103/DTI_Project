"use client"

import { useState } from "react"
import { Card, CardContent } from "@/component/ui/card"

export function HospitalMap() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="w-full aspect-[16/9] bg-muted rounded-md flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-medium">Interactive Hospital Map</h3>
        <p className="text-sm text-muted-foreground">Geographic distribution of hospitals across India</p>
        <div className="mt-4 grid grid-cols-4 gap-2">
          <Card className="bg-blue-100">
            <CardContent className="p-2 text-center">
              <p className="text-xs font-medium">North</p>
              <p className="text-lg font-bold">32</p>
            </CardContent>
          </Card>
          <Card className="bg-green-100">
            <CardContent className="p-2 text-center">
              <p className="text-xs font-medium">South</p>
              <p className="text-lg font-bold">45</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-100">
            <CardContent className="p-2 text-center">
              <p className="text-xs font-medium">East</p>
              <p className="text-lg font-bold">21</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-100">
            <CardContent className="p-2 text-center">
              <p className="text-xs font-medium">West</p>
              <p className="text-lg font-bold">30</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

