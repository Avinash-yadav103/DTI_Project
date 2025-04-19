import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/component/ui/card"
import { AgeDistribution } from "./components/age-distribution"
import { GenderDistribution } from "./components/gender-distribution"
import { StatePatientDistribution } from "./components/state-patient-distribution"
import { SpecialtyDistribution } from "./components/specialty-distribution"

export default function DemographicsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient Age Distribution</CardTitle>
            <CardDescription>Age demographics of registered patients</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <AgeDistribution />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Gender demographics of registered patients</CardDescription>
          </CardHeader>
          <CardContent>
            <GenderDistribution />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>State-wise Patient Distribution</CardTitle>
            <CardDescription>Patient distribution across states</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <StatePatientDistribution />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Doctor Specialty Distribution</CardTitle>
            <CardDescription>Distribution of doctors by specialty</CardDescription>
          </CardHeader>
          <CardContent>
            <SpecialtyDistribution />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

