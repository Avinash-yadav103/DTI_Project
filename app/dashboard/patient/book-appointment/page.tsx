"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock, MapPin, Search, Building2, User, Calendar as CalendarCheck, Video } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth"
import { useUser } from "@/context/UserContext"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Type definitions
interface Hospital {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  specialties: string[];
  imageUrl?: string;
}

interface Doctor {
  _id: string;
  doctorId: string;
  name: string;
  specialization: string;
  gender: string;
  yearsOfExperience: number;
  education: string;
  photo?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

// Define time slots
const MORNING_SLOTS: TimeSlot[] = [
  { time: "09:00 AM", available: true },
  { time: "09:30 AM", available: true },
  { time: "10:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: true },
  { time: "11:30 AM", available: true },
];

const AFTERNOON_SLOTS: TimeSlot[] = [
  { time: "12:00 PM", available: true },
  { time: "12:30 PM", available: true },
  { time: "01:00 PM", available: true },
  { time: "01:30 PM", available: true },
  { time: "02:00 PM", available: true },
  { time: "02:30 PM", available: true },
];

const EVENING_SLOTS: TimeSlot[] = [
  { time: "03:00 PM", available: true },
  { time: "03:30 PM", available: true },
  { time: "04:00 PM", available: true },
  { time: "04:30 PM", available: true },
  { time: "05:00 PM", available: true },
  { time: "05:30 PM", available: true },
];

export default function BookAppointmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { user: userContext } = useUser();
  
  // State for selected items
  const [step, setStep] = useState<number>(1);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<"in-person" | "virtual">("in-person");
  const [notes, setNotes] = useState<string>("");
  const [reasonForVisit, setReasonForVisit] = useState<string>("");
  
  // State for hospital search and filtering
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("");
  
  // States for doctor search and filtering
  const [doctorSearchTerm, setDoctorSearchTerm] = useState<string>("");
  const [specializationFilter, setSpecializationFilter] = useState<string>("");
  
  // UI states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingHospitals, setLoadingHospitals] = useState<boolean>(true);
  const [loadingDoctors, setLoadingDoctors] = useState<boolean>(false);
  const [allSpecialties, setAllSpecialties] = useState<string[]>([]);
  const [allSpecializations, setAllSpecializations] = useState<string[]>([]);

  // Fetch hospitals when the component mounts
  useEffect(() => {
    fetchHospitals();
  }, []);

  // Extract all specialties when hospitals change
  useEffect(() => {
    if (hospitals.length > 0) {
      const specialties = new Set<string>();
      hospitals.forEach(hospital => {
        hospital.specialties.forEach(specialty => {
          specialties.add(specialty);
        });
      });
      setAllSpecialties(Array.from(specialties).sort());
    }
  }, [hospitals]);

  // Extract all specializations when doctors change
  useEffect(() => {
    if (doctors.length > 0) {
      const specializations = new Set<string>();
      doctors.forEach(doctor => {
        if (doctor.specialization) {
          specializations.add(doctor.specialization);
        }
      });
      setAllSpecializations(Array.from(specializations).sort());
    }
  }, [doctors]);

  // Fetch hospitals
  const fetchHospitals = async () => {
    setLoadingHospitals(true);
    try {
      // For now we'll use mock data, but in production, use the API
      // const response = await fetch('http://localhost:5000/api/appointments/hospitals/nearby');
      // const data = await response.json();
      
      // Mock data for development
      const mockHospitals: Hospital[] = [
        {
          _id: "hosp1",
          name: "City General Hospital",
          address: {
            street: "123 Medical Plaza",
            city: "New Delhi",
            state: "Delhi",
            zipCode: "110001"
          },
          specialties: ["Cardiology", "Neurology", "Pediatrics", "Orthopedics"],
          imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
        },
        {
          _id: "hosp2",
          name: "Apollo Hospitals",
          address: {
            street: "456 Healthcare Avenue",
            city: "Bengaluru",
            state: "Karnataka",
            zipCode: "560001"
          },
          specialties: ["Oncology", "Cardiology", "Gastroenterology", "Urology"],
          imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop"
        },
        {
          _id: "hosp3",
          name: "Fortis Healthcare",
          address: {
            street: "789 Hospital Road",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001"
          },
          specialties: ["Neurology", "Orthopedics", "Dermatology", "ENT"],
          imageUrl: "https://images.unsplash.com/photo-1516549655669-df668a1d9930?q=80&w=2070&auto=format&fit=crop"
        },
        {
          _id: "hosp4",
          name: "AIIMS",
          address: {
            street: "101 Institute Avenue",
            city: "New Delhi",
            state: "Delhi",
            zipCode: "110029"
          },
          specialties: ["Oncology", "Cardiology", "Neurology", "Pediatrics", "Pulmonology"],
          imageUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2012&auto=format&fit=crop"
        },
        {
          _id: "hosp5",
          name: "Max Healthcare",
          address: {
            street: "555 Max Road",
            city: "Delhi",
            state: "Delhi",
            zipCode: "110017"
          },
          specialties: ["Dermatology", "Orthopedics", "Gynecology", "Urology"],
          imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b3db4f1?q=80&w=2069&auto=format&fit=crop"
        }
      ];
      
      setHospitals(mockHospitals);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      toast.error("Failed to load hospitals. Please try again.");
    } finally {
      setLoadingHospitals(false);
    }
  };

  // Fetch doctors when a hospital is selected
  const fetchDoctors = async (hospitalId: string) => {
    setLoadingDoctors(true);
    try {
      // For now we'll use mock data, but in production, use the API
      // const response = await fetch(`http://localhost:5000/api/appointments/doctors/hospital/${hospitalId}`);
      // const data = await response.json();
      
      // Mock data for development
      const mockDoctors: Doctor[] = [
        {
          _id: "doc1",
          doctorId: "DOC12345",
          name: "Dr. Sarah Johnson",
          specialization: "Cardiology",
          gender: "female",
          yearsOfExperience: 15,
          education: "MBBS, MD (Cardiology)",
          photo: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
          _id: "doc2",
          doctorId: "DOC67890",
          name: "Dr. Rajesh Kumar",
          specialization: "Neurology",
          gender: "male",
          yearsOfExperience: 20,
          education: "MBBS, MD (Neurology), DM",
          photo: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
          _id: "doc3",
          doctorId: "DOC54321",
          name: "Dr. Priya Sharma",
          specialization: "Pediatrics",
          gender: "female",
          yearsOfExperience: 10,
          education: "MBBS, DCH, MD (Pediatrics)",
          photo: "https://randomuser.me/api/portraits/women/64.jpg"
        },
        {
          _id: "doc4",
          doctorId: "DOC98765",
          name: "Dr. Vikram Singh",
          specialization: "Orthopedics",
          gender: "male",
          yearsOfExperience: 12,
          education: "MBBS, MS (Orthopedics)",
          photo: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
          _id: "doc5",
          doctorId: "DOC24680",
          name: "Dr. Ananya Patel",
          specialization: "Dermatology",
          gender: "female",
          yearsOfExperience: 8,
          education: "MBBS, MD (Dermatology)",
          photo: "https://randomuser.me/api/portraits/women/17.jpg"
        }
      ];
      
      setDoctors(mockDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors. Please try again.");
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Filter hospitals based on search term and specialty
  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialtyFilter === "" || 
      hospital.specialties.includes(specialtyFilter);
    
    return matchesSearch && matchesSpecialty;
  });

  // Filter doctors based on search term and specialization
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(doctorSearchTerm.toLowerCase());
    
    const matchesSpecialization = specializationFilter === "" || 
      doctor.specialization === specializationFilter;
    
    return matchesSearch && matchesSpecialization;
  });

  // Handle hospital selection
  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setSelectedDoctor(null);
    fetchDoctors(hospital._id);
    setStep(2);
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep(3);
  };

  // Handle appointment booking
  const handleBookAppointment = async () => {
    if (!selectedHospital || !selectedDoctor || !selectedDate || !selectedTime) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const appointmentData = {
        patientId: userContext?.aadhaarId || user?.id,
        doctorId: selectedDoctor.doctorId,
        hospitalId: selectedHospital._id,
        hospitalName: selectedHospital.name,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        type: appointmentType,
        notes,
        reasonForVisit,
        meetingLink: appointmentType === 'virtual' ? `https://meet.healthcare.com/${selectedDoctor.doctorId}` : null
      };

      // In production, make an API call to save the appointment
      // const response = await fetch('http://localhost:5000/api/appointments', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(appointmentData)
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Failed to book appointment');
      // }

      // Mock successful booking
      console.log("Appointment data:", appointmentData);
      
      // Show success message
      toast.success("Appointment booked successfully!");
      
      // Redirect to appointments page
      setTimeout(() => {
        router.push("/dashboard/patient/appointments");
      }, 2000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation functions
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Sidebar items for the dashboard layout
  const sidebarItems = [
    {
      title: "Overview",
      href: "/dashboard/patient",
      icon: <CalendarCheck className="h-4 w-4" />,
    },
    {
      title: "Medical Records",
      href: "/dashboard/patient/records",
      icon: <CalendarCheck className="h-4 w-4" />,
    },
    {
      title: "Access Control",
      href: "/dashboard/patient/access",
      icon: <CalendarCheck className="h-4 w-4" />,
    },
    {
      title: "Appointments",
      href: "/dashboard/patient/appointments",
      icon: <CalendarCheck className="h-4 w-4" />,
    },
    {
      title: "Access Logs",
      href: "/dashboard/patient/logs",
      icon: <CalendarCheck className="h-4 w-4" />,
    },
  ];

  const sidebarFooterItems = [
    {
      title: "Settings",
      href: "/dashboard/patient/settings",
      icon: <CalendarCheck className="h-4 w-4" />,
    },
    {
      title: "Logout",
      href: "/login",
      icon: <CalendarCheck className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title="Book an Appointment"
      user={user || { name: "", email: "" }}
      notifications={3}
      requiredRole="patient"
    >
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Book an Appointment</CardTitle>
            <CardDescription>Schedule an appointment with a doctor</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Booking Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className="flex items-center w-full max-w-3xl">
                  <div className={`flex-1 text-center ${step >= 1 ? 'text-sky-600' : 'text-gray-400'}`}>
                    <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-sky-100 text-sky-600 border-2 border-sky-600' : 'bg-gray-100 text-gray-400'}`}>
                      1
                    </div>
                    <p className="text-sm mt-1">Select Hospital</p>
                  </div>
                  
                  <div className={`w-full h-1 ${step >= 2 ? 'bg-sky-600' : 'bg-gray-200'}`}></div>
                  
                  <div className={`flex-1 text-center ${step >= 2 ? 'text-sky-600' : 'text-gray-400'}`}>
                    <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-sky-100 text-sky-600 border-2 border-sky-600' : 'bg-gray-100 text-gray-400'}`}>
                      2
                    </div>
                    <p className="text-sm mt-1">Select Doctor</p>
                  </div>
                  
                  <div className={`w-full h-1 ${step >= 3 ? 'bg-sky-600' : 'bg-gray-200'}`}></div>
                  
                  <div className={`flex-1 text-center ${step >= 3 ? 'text-sky-600' : 'text-gray-400'}`}>
                    <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-sky-100 text-sky-600 border-2 border-sky-600' : 'bg-gray-100 text-gray-400'}`}>
                      3
                    </div>
                    <p className="text-sm mt-1">Schedule Time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1: Select Hospital */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Select a Hospital</h2>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search hospitals by name or city"
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="md:w-1/2">
                      <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Specialties</SelectItem>
                          {allSpecialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {loadingHospitals ? (
                  <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent"></div>
                  </div>
                ) : filteredHospitals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredHospitals.map((hospital) => (
                      <div
                        key={hospital._id}
                        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleHospitalSelect(hospital)}
                      >
                        <div className="h-36 overflow-hidden">
                          <img
                            src={hospital.imageUrl || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"}
                            alt={hospital.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-lg">{hospital.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {hospital.address.street}, {hospital.address.city}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {hospital.specialties.slice(0, 3).map((specialty) => (
                              <Badge key={specialty} variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">
                                {specialty}
                              </Badge>
                            ))}
                            {hospital.specialties.length > 3 && (
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                +{hospital.specialties.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No Hospitals Found</h3>
                    <p className="text-gray-600 mt-1">Try adjusting your search or filters.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Doctor */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Button variant="outline" onClick={goBack} className="h-8 w-8 p-0">
                    <span className="sr-only">Go back</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </Button>
                  <h2 className="text-xl font-semibold">Select a Doctor at {selectedHospital?.name}</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-1/2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search doctors by name"
                        className="pl-10"
                        value={doctorSearchTerm}
                        onChange={(e) => setDoctorSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="md:w-1/2">
                    <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specializations</SelectItem>
                        {allSpecializations.map((specialization) => (
                          <SelectItem key={specialization} value={specialization}>
                            {specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {loadingDoctors ? (
                  <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent"></div>
                  </div>
                ) : filteredDoctors.length > 0 ? (
                  <div className="space-y-4">
                    {filteredDoctors.map((doctor) => (
                      <div
                        key={doctor._id}
                        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4"
                        onClick={() => handleDoctorSelect(doctor)}
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="md:w-1/6">
                            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto md:mx-0">
                              <img
                                src={doctor.photo || "https://randomuser.me/api/portraits/men/1.jpg"}
                                alt={doctor.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          <div className="md:w-5/6">
                            <div className="flex flex-col md:flex-row md:justify-between">
                              <div>
                                <h3 className="font-medium text-lg">{doctor.name}</h3>
                                <p className="text-sky-600">{doctor.specialization}</p>
                              </div>
                              <div className="mt-2 md:mt-0">
                                <Badge className="bg-sky-100 text-sky-700 border-sky-200">
                                  {doctor.yearsOfExperience} years exp
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="mt-2">
                              <p className="text-gray-600 text-sm">{doctor.education}</p>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                              <div className="text-sm text-gray-500">
                                Next Available: Today, 2:30 PM
                              </div>
                              <Button variant="outline" className="text-sky-600 border-sky-200">
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No Doctors Found</h3>
                    <p className="text-gray-600 mt-1">Try adjusting your search or filters.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Schedule Time */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Button variant="outline" onClick={goBack} className="h-8 w-8 p-0">
                    <span className="sr-only">Go back</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </Button>
                  <h2 className="text-xl font-semibold">Schedule an Appointment with {selectedDoctor?.name}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Doctor Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img
                          src={selectedDoctor?.photo || "https://randomuser.me/api/portraits/men/1.jpg"}
                          alt={selectedDoctor?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg">{selectedDoctor?.name}</h3>
                        <p className="text-sky-600">{selectedDoctor?.specialization}</p>
                        <p className="text-gray-600 text-sm mt-1">{selectedDoctor?.education}</p>
                        
                        <div className="mt-3">
                          <p className="text-gray-700 text-sm">
                            <span className="font-medium">Hospital:</span> {selectedHospital?.name}
                          </p>
                          <p className="text-gray-700 text-sm">
                            <span className="font-medium">Address:</span> {selectedHospital?.address.street}, {selectedHospital?.address.city}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Appointment Type */}
                  <div>
                    <Label className="block mb-2">Appointment Type</Label>
                    <RadioGroup
                      defaultValue="in-person"
                      value={appointmentType}
                      onValueChange={(value) => setAppointmentType(value as "in-person" | "virtual")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="in-person" id="in-person" />
                        <Label htmlFor="in-person" className="font-normal">
                          In-person Visit
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="virtual" id="virtual" />
                        <Label htmlFor="virtual" className="font-normal">
                          Virtual Consultation
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    <div className="mt-4">
                      <Label htmlFor="reason" className="block mb-2">Reason for Visit</Label>
                      <Textarea
                        id="reason"
                        placeholder="Please describe your symptoms or reason for consultation"
                        value={reasonForVisit}
                        onChange={(e) => setReasonForVisit(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  {/* Calendar */}
                  <div>
                    <Label className="block mb-2">Select Date</Label>
                    <div className="border rounded-md p-4">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="mx-auto"
                        disabled={(date) => {
                          // Disable past dates and Sundays
                          const now = new Date();
                          now.setHours(0, 0, 0, 0);
                          const day = date.getDay();
                          return date < now || day === 0;
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Time Slots */}
                  <div>
                    <Label className="block mb-2">Select Time</Label>
                    
                    {selectedDate ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Morning</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {MORNING_SLOTS.map((slot) => (
                              <Button
                                key={slot.time}
                                variant={selectedTime === slot.time ? "default" : "outline"}
                                className={cn(
                                  "text-sm py-1",
                                  selectedTime === slot.time 
                                    ? "bg-sky-600 hover:bg-sky-700" 
                                    : "hover:bg-sky-50 hover:text-sky-700",
                                  !slot.available && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={!slot.available}
                                onClick={() => setSelectedTime(slot.time)}
                              >
                                {slot.time}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Afternoon</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {AFTERNOON_SLOTS.map((slot) => (
                              <Button
                                key={slot.time}
                                variant={selectedTime === slot.time ? "default" : "outline"}
                                className={cn(
                                  "text-sm py-1",
                                  selectedTime === slot.time 
                                    ? "bg-sky-600 hover:bg-sky-700" 
                                    : "hover:bg-sky-50 hover:text-sky-700",
                                  !slot.available && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={!slot.available}
                                onClick={() => setSelectedTime(slot.time)}
                              >
                                {slot.time}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Evening</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {EVENING_SLOTS.map((slot) => (
                              <Button
                                key={slot.time}
                                variant={selectedTime === slot.time ? "default" : "outline"}
                                className={cn(
                                  "text-sm py-1",
                                  selectedTime === slot.time 
                                    ? "bg-sky-600 hover:bg-sky-700" 
                                    : "hover:bg-sky-50 hover:text-sky-700",
                                  !slot.available && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={!slot.available}
                                onClick={() => setSelectedTime(slot.time)}
                              >
                                {slot.time}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border rounded-md p-6 text-center text-gray-500">
                        Please select a date first
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <Label htmlFor="notes" className="block mb-2">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes or requirements for your appointment"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end mt-8">
                  <Button
                    className="bg-sky-600 hover:bg-sky-700"
                    onClick={handleBookAppointment}
                    disabled={!selectedHospital || !selectedDoctor || !selectedDate || !selectedTime || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Booking...
                      </>
                    ) : (
                      <>Book Appointment</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}