"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ArrowRight, AlertTriangle, Pill, Syringe, Stethoscope, Heart } from "lucide-react"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function MedicalInfoPage() {
  const router = useRouter()
  const [allergies, setAllergies] = useState([{ type: "", severity: "mild", reaction: "" }])
  const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "" }])
  const [conditions, setConditions] = useState([{ name: "", diagnosedYear: "", status: "active" }])
  const [bloodType, setBloodType] = useState("")
  const [emergencyContact, setEmergencyContact] = useState({ name: "", relation: "", phone: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [registrationData, setRegistrationData] = useState(null)

  useEffect(() => {
    // Retrieve registration data from localStorage
    const storedData = localStorage.getItem("registrationData")
    if (storedData) {
      setRegistrationData(JSON.parse(storedData))
    }
  }, [])

  const handleAddAllergy = () => {
    setAllergies([...allergies, { type: "", severity: "mild", reaction: "" }])
  }

  const handleRemoveAllergy = (index) => {
    const newAllergies = [...allergies]
    newAllergies.splice(index, 1)
    setAllergies(newAllergies)
  }

  const handleAllergyChange = (index, field, value) => {
    const newAllergies = [...allergies]
    newAllergies[index][field] = value
    setAllergies(newAllergies)
  }

  const handleAddMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "" }])
  }

  const handleRemoveMedication = (index) => {
    const newMedications = [...medications]
    newMedications.splice(index, 1)
    setMedications(newMedications)
  }

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...medications]
    newMedications[index][field] = value
    setMedications(newMedications)
  }

  const handleAddCondition = () => {
    setConditions([...conditions, { name: "", diagnosedYear: "", status: "active" }])
  }

  const handleRemoveCondition = (index) => {
    const newConditions = [...conditions]
    newConditions.splice(index, 1)
    setConditions(newConditions)
  }

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...conditions]
    newConditions[index][field] = value
    setConditions(newConditions)
  }

  const handleEmergencyContactChange = (field, value) => {
    setEmergencyContact({ ...emergencyContact, [field]: value })
  }

  // Update the handleSubmit function to send all data to the API
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Collect all medical data
    const medicalData = {
      allergies,
      // medications,
      // conditions,
      bloodType,
    }

    try {
      const response = await fetch("http://10.12.16.45:4505/register_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medicalData),
      });

      if (!response.ok) {
      throw new Error("Failed to register medical data");
      }

      const result = await response.json();
      console.log("Registration successful:", result);
      toast.success("Medical data registered successfully!");
    } catch (error) {
      console.error("Error registering medical data:", error);
      toast.error("Failed to register medical data. Please try again.");
      setIsLoading(false);
      return;
    }

    // Get registration data from localStorage
    const storedData = localStorage.getItem("registrationData")
    const registrationData = storedData ? JSON.parse(storedData) : null

    if (!registrationData) {
      toast.error("Registration data not found. Please start the registration process again.")
      setIsLoading(false)
      router.push("/register")
      return
    }

    // Prepare complete data for API
    const completeData = {
      aadharNumber: registrationData.aadharNumber,
      password: registrationData.password,
      userData: registrationData.userData,
      medicalData,
    }

    try {
      // In a real app, you would send this data to your API
      // Replace the URL below with your actual API endpoint
      console.log("Sending data to API:", completeData)

      // Uncomment and modify this code when you have your API endpoint
      /*
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit registration data');
      }
      */

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Clear registration data from localStorage
      localStorage.removeItem("registrationData")

      toast.success("Registration complete! Please log in.")

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Error submitting data:", error)
      toast.error("There was an error submitting your information. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg mb-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Medical Information</h1>
            <p className="text-gray-600 mt-2">
              Please provide your medical information to help healthcare providers give you better care
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-8 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-amber-700 font-medium">Important</h3>
              <p className="text-amber-600 text-sm">
                This information will be securely stored on the blockchain and will only be accessible to healthcare
                providers with your explicit consent.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Allergies Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Syringe className="h-5 w-5 text-sky-600" />
                <h2 className="text-xl font-semibold text-gray-900">Allergies</h2>
              </div>

              {allergies.map((allergy, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-700 font-medium">Allergy #{index + 1}</h3>
                    {allergies.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveAllergy(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`allergy-type-${index}`} className="text-gray-700">
                        Allergy Type
                      </Label>
                      <Input
                        id={`allergy-type-${index}`}
                        placeholder="e.g., Peanuts, Penicillin"
                        value={allergy.type}
                        onChange={(e) => handleAllergyChange(index, "type", e.target.value)}
                        className="border-gray-300 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`allergy-severity-${index}`} className="text-gray-700">
                        Severity
                      </Label>
                      <Select
                        value={allergy.severity}
                        onValueChange={(value) => handleAllergyChange(index, "severity", value)}
                      >
                        <SelectTrigger className="border-gray-300 text-gray-900">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-900">
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                          <SelectItem value="life-threatening">Life-threatening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`allergy-reaction-${index}`} className="text-gray-700">
                      Reaction
                    </Label>
                    <Textarea
                      id={`allergy-reaction-${index}`}
                      placeholder="Describe your reaction"
                      value={allergy.reaction}
                      onChange={(e) => handleAllergyChange(index, "reaction", e.target.value)}
                      className="border-gray-300 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleAddAllergy}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Allergy
              </Button>
            </div>

            {/* Medications Section
            // <div className="space-y-4">
            //   <div className="flex items-center gap-2">
            //     <Pill className="h-5 w-5 text-sky-600" />
            //     <h2 className="text-xl font-semibold text-gray-900">Current Medications</h2>
            //   </div>

            //   {medications.map((medication, index) => (
            //     <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
            //       <div className="flex justify-between items-center">
            //         <h3 className="text-gray-700 font-medium">Medication #{index + 1}</h3>
            //         {medications.length > 1 && (
            //           <Button
            //             type="button"
            //             variant="ghost"
            //             size="sm"
            //             className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
            //             onClick={() => handleRemoveMedication(index)}
            //           >
            //             <Trash2 className="h-4 w-4" />
            //           </Button>
            //         )}
            //       </div>

            //       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            //         <div className="space-y-2">
            //           <Label htmlFor={`medication-name-${index}`} className="text-gray-700">
            //             Medication Name
            //           </Label>
            //           <Input
            //             id={`medication-name-${index}`}
            //             placeholder="e.g., Lisinopril"
            //             value={medication.name}
            //             onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
            //             className="border-gray-300 text-gray-900 placeholder:text-gray-500"
            //           />
            //         </div>

            //         <div className="space-y-2">
            //           <Label htmlFor={`medication-dosage-${index}`} className="text-gray-700">
            //             Dosage
            //           </Label>
            //           <Input
            //             id={`medication-dosage-${index}`}
            //             placeholder="e.g., 10mg"
            //             value={medication.dosage}
            //             onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
            //             className="border-gray-300 text-gray-900 placeholder:text-gray-500"
            //           />
            //         </div>

            //         <div className="space-y-2">
            //           <Label htmlFor={`medication-frequency-${index}`} className="text-gray-700">
            //             Frequency
            //           </Label>
            //           <Input
            //             id={`medication-frequency-${index}`}
            //             placeholder="e.g., Once daily"
            //             value={medication.frequency}
            //             onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
            //             className="border-gray-300 text-gray-900 placeholder:text-gray-500"
            //           />
            //         </div>
            //       </div>
            //     </div>
            //   ))}

            //   <Button
            //     type="button"
            //     variant="outline"
            //     className="w-full border-dashed border-gray-300 text-gray-700 hover:bg-gray-50"
            //     onClick={handleAddMedication}
            //   >
            //     <Plus className="mr-2 h-4 w-4" />
            //     Add Another Medication
            //   </Button>
            // </div> */}

            {/* Medical Conditions Section */}
            {/* <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-sky-600" />
                <h2 className="text-xl font-semibold text-gray-900">Medical Conditions</h2>
              </div>

              {conditions.map((condition, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-700 font-medium">Condition #{index + 1}</h3>
                    {conditions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveCondition(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`condition-name-${index}`} className="text-gray-700">
                        Condition Name
                      </Label>
                      <Input
                        id={`condition-name-${index}`}
                        placeholder="e.g., Diabetes"
                        value={condition.name}
                        onChange={(e) => handleConditionChange(index, "name", e.target.value)}
                        className="border-gray-300 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`condition-year-${index}`} className="text-gray-700">
                        Year Diagnosed
                      </Label>
                      <Input
                        id={`condition-year-${index}`}
                        placeholder="e.g., 2018"
                        value={condition.diagnosedYear}
                        onChange={(e) => handleConditionChange(index, "diagnosedYear", e.target.value)}
                        className="border-gray-300 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`condition-status-${index}`} className="text-gray-700">
                        Status
                      </Label>
                      <Select
                        value={condition.status}
                        onValueChange={(value) => handleConditionChange(index, "status", value)}
                      >
                        <SelectTrigger className="border-gray-300 text-gray-900">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-900">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="managed">Managed</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleAddCondition}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Condition
              </Button>
            </div> */}

            {/* Blood Type Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-sky-600" />
                <h2 className="text-xl font-semibold text-gray-900">Blood Type</h2>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-4 gap-3">
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`blood-type-${type}`}
                        checked={bloodType === type}
                        onCheckedChange={() => setBloodType(type)}
                        className="border-gray-300 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                      />
                      <Label htmlFor={`blood-type-${type}`} className="text-gray-700">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2 mt-3">
                  <Checkbox
                    id="blood-type-unknown"
                    checked={bloodType === "unknown"}
                    onCheckedChange={() => setBloodType("unknown")}
                    className="border-gray-300 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                  />
                  <Label htmlFor="blood-type-unknown" className="text-gray-700">
                    Unknown
                  </Label>
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-sky-600" />
                <h2 className="text-xl font-semibold text-gray-900">Emergency Contact</h2>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="emergency-name" className="text-gray-700">
                      Name
                    </Label>
                    <Input
                      id="emergency-name"
                      placeholder="Full name"
                      value={emergencyContact.name}
                      onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                      className="border-gray-300 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency-relation" className="text-gray-700">
                      Relationship
                    </Label>
                    <Input
                      id="emergency-relation"
                      placeholder="e.g., Spouse, Parent"
                      value={emergencyContact.relation}
                      onChange={(e) => handleEmergencyContactChange("relation", e.target.value)}
                      className="border-gray-300 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency-phone" className="text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="emergency-phone"
                      placeholder="Contact number"
                      value={emergencyContact.phone}
                      onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                      className="border-gray-300 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Complete Registration"}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

