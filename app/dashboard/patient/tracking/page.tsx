"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import {
  Calendar,
  Clock,
  Check,
  Plus,
  Trash2,
  Bell,
  FileText,
  Settings,
  LogOut,
  Heart,
  Activity,
  X,
  Pill,
  Home,
  User,
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  MoreHorizontal
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { format, addDays, eachDayOfInterval, isSameDay, isWeekend, parseISO, isValid } from "date-fns"

export default function TrackingPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  // State for medications
  const [medications, setMedications] = useState([])
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState(null)
  const [selectedDates, setSelectedDates] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // State for health tracker
  const [dailySuggestion, setDailySuggestion] = useState(null)
  const [completedActivities, setCompletedActivities] = useState([])
  const [activityPoints, setActivityPoints] = useState(0)
  const [streakDays, setStreakDays] = useState(0)
  const [healthGoals, setHealthGoals] = useState([
    { id: 1, title: "Daily meditation", completed: false },
    { id: 2, title: "8,000 steps", completed: false },
    { id: 3, title: "Drink 8 glasses of water", completed: false }
  ])

  // Form state for adding medication
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "daily",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    timeOfDay: "morning",
    instructions: "",
    daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  })

  // Health activities
  const healthActivities = [
    { 
      category: "meditation", 
      items: [
        "5-minute breathing exercise", 
        "10-minute guided meditation", 
        "Body scan relaxation (15 min)"
      ] 
    },
    { 
      category: "yoga", 
      items: [
        "Morning sun salutations (10 min)", 
        "Office chair yoga stretches", 
        "Bedtime relaxation yoga"
      ] 
    },
    { 
      category: "exercise", 
      items: [
        "10-minute brisk walking", 
        "Quick home workout (no equipment)", 
        "Desk stretches for better posture"
      ] 
    },
    { 
      category: "nutrition", 
      items: [
        "Drink an extra glass of water", 
        "Add one extra vegetable to your meal", 
        "Replace a processed snack with fruit"
      ] 
    },
    { 
      category: "mindfulness", 
      items: [
        "Practice gratitude - list 3 things", 
        "Technology break - 30 minutes screen-free", 
        "Mindful eating practice"
      ] 
    }
  ]

  // Get random health suggestion
  useEffect(() => {
    generateDailySuggestion()
    
    // Load saved data from localStorage
    const savedMedications = localStorage.getItem('medications')
    if (savedMedications) {
      setMedications(JSON.parse(savedMedications))
    }
    
    const savedDates = localStorage.getItem('medicationDates')
    if (savedDates) {
      setSelectedDates(JSON.parse(savedDates))
    }
    
    const savedActivities = localStorage.getItem('completedActivities')
    if (savedActivities) {
      setCompletedActivities(JSON.parse(savedActivities))
    }
    
    const savedPoints = localStorage.getItem('activityPoints')
    if (savedPoints) {
      setActivityPoints(Number(savedPoints))
    }
    
    const savedStreak = localStorage.getItem('streakDays')
    if (savedStreak) {
      setStreakDays(Number(savedStreak))
    }
    
    const savedGoals = localStorage.getItem('healthGoals')
    if (savedGoals) {
      setHealthGoals(JSON.parse(savedGoals))
    }
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications))
  }, [medications])
  
  useEffect(() => {
    localStorage.setItem('medicationDates', JSON.stringify(selectedDates))
  }, [selectedDates])
  
  useEffect(() => {
    localStorage.setItem('completedActivities', JSON.stringify(completedActivities))
  }, [completedActivities])
  
  useEffect(() => {
    localStorage.setItem('activityPoints', String(activityPoints))
  }, [activityPoints])
  
  useEffect(() => {
    localStorage.setItem('streakDays', String(streakDays))
  }, [streakDays])
  
  useEffect(() => {
    localStorage.setItem('healthGoals', JSON.stringify(healthGoals))
  }, [healthGoals])

  const generateDailySuggestion = () => {
    const categories = healthActivities.map(a => a.category)
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const categoryActivities = healthActivities.find(a => a.category === randomCategory)
    const randomActivity = categoryActivities.items[Math.floor(Math.random() * categoryActivities.items.length)]
    
    setDailySuggestion({
      category: randomCategory,
      activity: randomActivity
    })
  }

  const handleAddMedication = () => {
    // Validate inputs
    if (!newMedication.name || !newMedication.dosage || !newMedication.startDate) {
      toast.error("Please fill all required fields")
      return
    }

    // Validate dates
    const startDate = parseISO(newMedication.startDate)
    const endDate = parseISO(newMedication.endDate)
    
    if (!isValid(startDate) || !isValid(endDate) || endDate < startDate) {
      toast.error("Please enter valid date range")
      return
    }

    // Create medication with ID
    const medicationToAdd = {
      id: Date.now().toString(),
      ...newMedication,
      createdAt: new Date().toISOString(),
      status: "active"
    }

    // Add to medications list
    setMedications([...medications, medicationToAdd])
    
    // Reset form and close dialog
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "daily",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
      timeOfDay: "morning",
      instructions: "",
      daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    })
    setIsAddMedicationOpen(false)
    
    toast.success("Medication added successfully")
  }

  const handleDeleteMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id))
    
    // Clean up selected dates related to this medication
    setSelectedDates(selectedDates.filter(date => date.medicationId !== id))
    
    toast.success("Medication removed")
  }

  const handleToggleDate = (date, medicationId) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const existingDate = selectedDates.find(d => 
      d.date === dateStr && d.medicationId === medicationId
    )
    
    if (existingDate) {
      // Remove date if already selected
      setSelectedDates(selectedDates.filter(d => 
        !(d.date === dateStr && d.medicationId === medicationId)
      ))
    } else {
      // Add date if not selected
      setSelectedDates([
        ...selectedDates, 
        { date: dateStr, medicationId, timestamp: new Date().toISOString() }
      ])
      
      toast.success("Medication marked as taken")
    }
  }

  const isDoseMarked = (date, medicationId) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return selectedDates.some(d => 
      d.date === dateStr && d.medicationId === medicationId
    )
  }

  const daysInRange = (medication) => {
    if (!medication) return []
    
    const startDate = parseISO(medication.startDate)
    const endDate = parseISO(medication.endDate)
    
    if (!isValid(startDate) || !isValid(endDate)) return []
    
    return eachDayOfInterval({ start: startDate, end: endDate })
  }

  const handleMarkActivity = (activity) => {
    // Add to completed activities
    const now = new Date()
    setCompletedActivities([
      ...completedActivities,
      {
        activity,
        category: dailySuggestion.category,
        timestamp: now.toISOString(),
        date: format(now, "yyyy-MM-dd")
      }
    ])
    
    // Add points and update streak
    setActivityPoints(prev => prev + 10)
    
    // Check if already completed activity today
    const today = format(now, "yyyy-MM-dd")
    const completedToday = completedActivities.some(a => a.date === today)
    
    if (!completedToday) {
      const yesterday = format(addDays(now, -1), "yyyy-MM-dd")
      const completedYesterday = completedActivities.some(a => a.date === yesterday)
      
      if (completedYesterday) {
        setStreakDays(prev => prev + 1)
      } else {
        setStreakDays(1)
      }
    }
    
    // Generate a new suggestion
    generateDailySuggestion()
    
    toast.success("Activity completed! +10 points")
  }

  const handleToggleGoal = (id) => {
    setHealthGoals(healthGoals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ))
  }

  // Dashboard navigation
  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard/patient",
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: "Medical Records",
      href: "/dashboard/patient/records",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Appointments",
      href: "/dashboard/patient/appointments",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Vaccinations",
      href: "/dashboard/patient/vaccinations",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Health Tracking",
      href: "/dashboard/patient/tracking",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      title: "Profile",
      href: "/dashboard/patient/profile",
      icon: <User className="h-4 w-4" />,
    },
  ]

  const sidebarFooterItems = [
    {
      title: "Settings",
      href: "/dashboard/patient/settings",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      title: "Logout",
      href: "#",
      icon: <LogOut className="h-4 w-4" />,
      onClick: () => {
        logout()
        router.push("/login")
      },
    },
  ]

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title="Health Tracking"
      user={user || { name: "", email: "" }}
      notifications={3}
      requiredRole="patient"
    >
      <div className="mb-6">
        <Tabs defaultValue="medications" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="medications">
              <Pill className="h-4 w-4 mr-2" />
              Medication Reminders
            </TabsTrigger>
            <TabsTrigger value="wellness">
              <Heart className="h-4 w-4 mr-2" />
              Health Tracker
            </TabsTrigger>
          </TabsList>
          
          {/* Medications Tab */}
          <TabsContent value="medications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-2xl">My Medications</CardTitle>
                  <CardDescription>Track and manage your medication schedule</CardDescription>
                </div>
                <Button onClick={() => setIsAddMedicationOpen(true)} className="bg-sky-600 hover:bg-sky-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Medication
                </Button>
              </CardHeader>
              
              <CardContent>
                {medications.length > 0 ? (
                  <div className="space-y-6">
                    {/* Warning for demonstration only */}
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-8 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-amber-700 font-medium">For demonstration purposes only</h3>
                        <p className="text-amber-600 text-sm">
                          Always follow your healthcare provider's instructions for medications.
                          This tracker is for personal use only and should not replace professional medical advice.
                        </p>
                      </div>
                    </div>
                    
                    {/* Medication cards */}
                    {medications.map((medication) => (
                      <Card key={medication.id} className="border border-gray-200">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Pill className="h-5 w-5 text-sky-600" />
                              <CardTitle>{medication.name} {medication.dosage}</CardTitle>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteMedication(medication.id)}
                              className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="text-gray-600">
                              <Clock className="h-3 w-3 mr-1" />
                              {medication.timeOfDay}
                            </Badge>
                            <Badge variant="outline" className="text-gray-600">
                              <CalendarDays className="h-3 w-3 mr-1" />
                              {medication.frequency}
                            </Badge>
                            <Badge className="bg-sky-100 text-sky-800">
                              {format(parseISO(medication.startDate), "MMM d")} - {format(parseISO(medication.endDate), "MMM d, yyyy")}
                            </Badge>
                          </div>
                          {medication.instructions && (
                            <p className="text-sm text-gray-600 mt-2">{medication.instructions}</p>
                          )}
                        </CardHeader>
                        
                        <CardContent>
                          <h3 className="font-medium text-sm mb-2">Tracking Calendar</h3>
                          <div className="flex flex-wrap gap-2">
                            {daysInRange(medication).map((date, i) => (
                              <button
                                key={i}
                                className={`
                                  w-10 h-10 rounded-full flex items-center justify-center text-sm 
                                  ${isDoseMarked(date, medication.id) 
                                    ? 'bg-green-100 text-green-800 ring-2 ring-green-600 ring-offset-1' 
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                                  ${isWeekend(date) ? 'font-medium' : ''}
                                `}
                                onClick={() => handleToggleDate(date, medication.id)}
                              >
                                {format(date, "d")}
                              </button>
                            ))}
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <Button 
                              variant="outline" 
                              className="text-sm"
                              onClick={() => handleToggleDate(new Date(), medication.id)}
                            >
                              {isDoseMarked(new Date(), medication.id) 
                                ? <><Check className="h-4 w-4 mr-1 text-green-600" /> Taken Today</>
                                : <>Mark as Taken Today</>
                              }
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Pill className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-1">No medications added yet</h3>
                    <p className="text-gray-500 mb-4">Add your first medication to start tracking</p>
                    <Button 
                      onClick={() => setIsAddMedicationOpen(true)}
                      className="bg-sky-600 hover:bg-sky-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Medication
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Health Tracker Tab */}
          <TabsContent value="wellness">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Activity Suggestion */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Today's Wellness Suggestion</CardTitle>
                  <CardDescription>Taking small steps each day leads to big improvements in your health</CardDescription>
                </CardHeader>
                <CardContent>
                  {dailySuggestion && (
                    <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-6 rounded-lg border border-sky-100">
                      <Badge className="bg-sky-100 text-sky-800 mb-3 capitalize">
                        {dailySuggestion.category}
                      </Badge>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">{dailySuggestion.activity}</h3>
                      <p className="text-gray-600 mb-4">
                        Taking a small break for your health can significantly improve your well-being and productivity.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          className="bg-sky-600 hover:bg-sky-700"
                          onClick={() => handleMarkActivity(dailySuggestion.activity)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          I Did This
                        </Button>
                        <Button variant="outline" onClick={generateDailySuggestion}>
                          Try Different Activity
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Activity Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Stats</CardTitle>
                  <CardDescription>Your progress and wellness journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <p className="text-sm font-medium text-green-800">Current Streak</p>
                      <p className="text-3xl font-bold text-green-700">{streakDays} days</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <p className="text-sm font-medium text-indigo-800">Wellness Points</p>
                      <p className="text-3xl font-bold text-indigo-700">{activityPoints}</p>
                    </div>
                    <div className="col-span-2 bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <p className="text-sm font-medium text-amber-800">Activities Completed</p>
                      <p className="text-3xl font-bold text-amber-700">{completedActivities.length}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Latest Activities</h3>
                    {completedActivities.length > 0 ? (
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {completedActivities.slice().reverse().slice(0, 5).map((entry, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                            <Check className="h-4 w-4 text-green-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{entry.activity}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(entry.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <Badge className="capitalize bg-gray-100 text-gray-800">
                              {entry.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No activities completed yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Daily Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Health Goals</CardTitle>
                  <CardDescription>Track your daily wellness targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {healthGoals.map(goal => (
                      <div 
                        key={goal.id} 
                        className={`p-4 rounded-lg border flex items-center gap-3 ${
                          goal.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <Checkbox 
                          id={`goal-${goal.id}`}
                          checked={goal.completed}
                          onCheckedChange={() => handleToggleGoal(goal.id)}
                        />
                        <Label 
                          htmlFor={`goal-${goal.id}`}
                          className={`flex-1 ${goal.completed ? 'line-through text-green-800' : ''}`}
                        >
                          {goal.title}
                        </Label>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Goal
                    </Button>
                  </div>
                  
                  <div className="mt-6 bg-sky-50 p-4 rounded-lg border border-sky-100">
                    <h3 className="font-medium text-sky-900 mb-1">Tips for Creating Healthy Habits</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-sky-800">
                      <li>Start with small, achievable goals</li>
                      <li>Be consistent - same time each day</li>
                      <li>Track your progress</li>
                      <li>Celebrate small wins</li>
                      <li>Don't break the chain - maintain your streak</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Medication Dialog */}
      <Dialog open={isAddMedicationOpen} onOpenChange={setIsAddMedicationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Medication</DialogTitle>
            <DialogDescription>
              Enter your medication details to set up reminders
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Medication Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Lisinopril"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  placeholder="e.g. 10mg"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newMedication.startDate}
                  onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newMedication.endDate}
                  onChange={(e) => setNewMedication({ ...newMedication, endDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={newMedication.frequency}
                  onValueChange={(value) => setNewMedication({ ...newMedication, frequency: value })}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="twice-daily">Twice Daily</SelectItem>
                    <SelectItem value="every-other-day">Every Other Day</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="as-needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timeOfDay">Time of Day</Label>
                <Select 
                  value={newMedication.timeOfDay}
                  onValueChange={(value) => setNewMedication({ ...newMedication, timeOfDay: value })}
                >
                  <SelectTrigger id="timeOfDay">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="bedtime">Bedtime</SelectItem>
                    <SelectItem value="with-food">With Food</SelectItem>
                    <SelectItem value="before-food">Before Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Any special instructions or notes"
                value={newMedication.instructions}
                onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMedicationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMedication} className="bg-sky-600 hover:bg-sky-700">
              Save Medication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}