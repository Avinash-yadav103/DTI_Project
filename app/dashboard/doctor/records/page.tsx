'use client'

// pages/medical-records.tsx
import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Plus, Calendar, ArrowUpDown, Download, Eye, CheckCircle, X, Clock, Edit, Trash2 } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  allergies: string[];
  contactNumber: string;
  email: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  title: string;
  recordType: string;
  category: string;
  status: string;
  summary: string;
  content: string;
  attachments: string[];
  lastUpdated: string;
}

const MedicalRecordsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([
    { id: 'PAT001', name: 'John Doe', age: 32, gender: 'Male', bloodType: 'O+', allergies: ['Penicillin'], contactNumber: '+1-555-123-4567', email: 'john.doe@example.com' },
    { id: 'PAT002', name: 'Jane Smith', age: 45, gender: 'Female', bloodType: 'A-', allergies: ['Sulfa', 'Latex'], contactNumber: '+1-555-234-5678', email: 'jane.smith@example.com' },
    { id: 'PAT003', name: 'Robert Johnson', age: 28, gender: 'Male', bloodType: 'B+', allergies: [], contactNumber: '+1-555-345-6789', email: 'robert.johnson@example.com' },
    { id: 'PAT004', name: 'Emily Davis', age: 52, gender: 'Female', bloodType: 'AB+', allergies: ['Aspirin'], contactNumber: '+1-555-456-7890', email: 'emily.davis@example.com' },
    { id: 'PAT005', name: 'Rahul Sharma', age: 45, gender: 'Male', bloodType: 'O-', allergies: ['Shellfish'], contactNumber: '+1-555-567-8901', email: 'rahul.sharma@example.com' },
    { id: 'PAT006', name: 'Priya Patel', age: 35, gender: 'Female', bloodType: 'A+', allergies: [], contactNumber: '+1-555-678-9012', email: 'priya.patel@example.com' },
    { id: 'PAT007', name: 'Amit Kumar', age: 28, gender: 'Male', bloodType: 'B-', allergies: ['Peanuts'], contactNumber: '+1-555-789-0123', email: 'amit.kumar@example.com' },
    { id: 'PAT008', name: 'Sunita Singh', age: 52, gender: 'Female', bloodType: 'AB-', allergies: ['Ibuprofen'], contactNumber: '+1-555-890-1234', email: 'sunita.singh@example.com' },
    { id: 'PAT009', name: 'Michael Brown', age: 40, gender: 'Male', bloodType: 'O+', allergies: [], contactNumber: '+1-555-901-2345', email: 'michael.brown@example.com' },
    { id: 'PAT010', name: 'Sophia Wilson', age: 30, gender: 'Female', bloodType: 'A+', allergies: ['Dairy'], contactNumber: '+1-555-012-3456', email: 'sophia.wilson@example.com' },
  ]);

  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: 'DOC001', name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
    { id: 'DOC002', name: 'Dr. Michael Chen', specialty: 'Pediatrics' },
    { id: 'DOC003', name: 'Dr. David Rodriguez', specialty: 'Neurology' },
    { id: 'DOC004', name: 'Dr. Emily Wilson', specialty: 'Dermatology' },
    { id: 'DOC005', name: 'Dr. Rajesh Patel', specialty: 'Orthopedics' },
  ]);

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([
    { 
      id: 'REC001', 
      patientId: 'PAT001', 
      doctorId: 'DOC001', 
      date: '2025-03-15', 
      title: 'Annual Checkup',
      recordType: 'Clinical Notes',
      category: 'Preventive Care',
      status: 'Completed',
      summary: 'Regular physical examination with cardiac assessment',
      content: 'Patient reports no significant changes in health status. BP: 125/80, Pulse: 72, regular. Weight: 75kg. Heart sounds normal. EKG shows normal sinus rhythm. Recommended continued exercise regimen and follow-up in 6 months.',
      attachments: ['EKG_PAT001_20250315.pdf', 'Lab_Results_PAT001_20250315.pdf'],
      lastUpdated: '2025-03-15T14:30:00'
    },
    { 
      id: 'REC002', 
      patientId: 'PAT002', 
      doctorId: 'DOC001', 
      date: '2025-03-18', 
      title: 'Diabetes Management Review',
      recordType: 'Clinical Notes',
      category: 'Chronic Disease Management',
      status: 'Completed',
      summary: 'Quarterly diabetes check with medication adjustment',
      content: 'HbA1c: 7.2% (improved from 7.8%). BP: 130/85. Patient reports good compliance with diet and exercise. Experiencing occasional mild hypoglycemia in mornings. Metformin dosage adjusted to 500mg BID. Encouraged continued lifestyle modifications.',
      attachments: ['Lab_Results_PAT002_20250318.pdf', 'Diabetes_Management_Plan_PAT002.pdf'],
      lastUpdated: '2025-03-18T10:15:00'
    },
    { 
      id: 'REC003', 
      patientId: 'PAT003', 
      doctorId: 'DOC002', 
      date: '2025-03-20', 
      title: 'Asthma Follow-up',
      recordType: 'Clinical Notes',
      category: 'Respiratory',
      status: 'Completed',
      summary: 'Scheduled follow-up for asthma management',
      content: 'Patient reports decreased frequency of asthma attacks since starting new inhaler. Lung function tests show improvement. PFT: FEV1 85% of predicted (up from 75%). Continued current medication regimen. Advised on seasonal allergen avoidance strategies.',
      attachments: ['PFT_Results_PAT003_20250320.pdf'],
      lastUpdated: '2025-03-20T11:45:00'
    },
    { 
      id: 'REC004', 
      patientId: 'PAT004', 
      doctorId: 'DOC003', 
      date: '2025-03-22', 
      title: 'Neurological Assessment',
      recordType: 'Specialist Consultation',
      category: 'Neurology',
      status: 'Pending Review',
      summary: 'Evaluation for recurring headaches',
      content: 'Patient presents with 3-month history of recurring headaches, 2-3 times weekly. Pain described as throbbing, primarily right-sided. No aura or visual disturbances. Neurological exam normal. MRI scheduled. Provisional diagnosis: Migraine without aura. Started on Sumatriptan as needed.',
      attachments: ['Neurology_Assessment_PAT004_20250322.pdf'],
      lastUpdated: '2025-03-22T16:20:00'
    },
    { 
      id: 'REC005', 
      patientId: 'PAT005', 
      doctorId: 'DOC001', 
      date: '2025-03-25', 
      title: 'Hypertension Follow-up',
      recordType: 'Clinical Notes',
      category: 'Cardiovascular',
      status: 'Completed',
      summary: 'Regular blood pressure monitoring and medication review',
      content: 'BP readings from home monitoring: averaging 135/85. Current regimen: Lisinopril 10mg daily. Patient reports occasional dizziness upon standing. Recommended sodium restriction, continued exercise. Adjusted medication to Lisinopril 5mg daily. Follow-up in 1 month.',
      attachments: ['BP_Chart_PAT005_20250325.pdf'],
      lastUpdated: '2025-03-25T09:30:00'
    },
    { 
      id: 'REC006', 
      patientId: 'PAT006', 
      doctorId: 'DOC004', 
      date: '2025-03-27', 
      title: 'Dermatology Consultation',
      recordType: 'Specialist Consultation',
      category: 'Dermatology',
      status: 'Completed',
      summary: 'Assessment of recurring rash',
      content: 'Patient presents with recurring urticarial rash on forearms and neck. Associated with outdoor activity. Skin prick test positive for multiple pollen allergens. Diagnosis: Contact dermatitis with allergic component. Prescribed topical hydrocortisone 1% and oral antihistamine. Referred to allergist for comprehensive testing.',
      attachments: ['Dermatology_Photos_PAT006_20250327.pdf', 'Allergy_Referral_PAT006.pdf'],
      lastUpdated: '2025-03-27T13:15:00'
    },
    { 
      id: 'REC007', 
      patientId: 'PAT007', 
      doctorId: 'DOC002', 
      date: '2025-03-29', 
      title: 'Allergy Assessment',
      recordType: 'Clinical Notes',
      category: 'Immunology',
      status: 'Completed',
      summary: 'Comprehensive allergy testing and management plan',
      content: 'Patient underwent comprehensive allergy panel. Positive reactions to: dust mites, cat dander, birch pollen. Negative for food allergens. Prescribed Fluticasone nasal spray and Cetirizine daily during peak seasons. Provided environmental modification recommendations and allergen avoidance strategies.',
      attachments: ['Allergy_Test_Results_PAT007_20250329.pdf', 'Allergen_Management_Plan_PAT007.pdf'],
      lastUpdated: '2025-03-29T10:45:00'
    },
    { 
      id: 'REC008', 
      patientId: 'PAT008', 
      doctorId: 'DOC005', 
      date: '2025-04-01', 
      title: 'Orthopedic Assessment',
      recordType: 'Specialist Consultation',
      category: 'Musculoskeletal',
      status: 'Pending Review',
      summary: 'Evaluation of chronic knee pain',
      content: 'Patient presents with 6-month history of right knee pain, worse with stair climbing and after prolonged sitting. Physical exam shows mild swelling, crepitus with movement. X-ray reveals moderate osteoarthritis of right knee. DEXA scan shows osteopenia. Started on analgesics and referred to physical therapy. Considering hyaluronic acid injections if conservative management fails.',
      attachments: ['Knee_XRay_PAT008_20250401.pdf', 'PT_Referral_PAT008.pdf'],
      lastUpdated: '2025-04-01T15:30:00'
    },
    { 
      id: 'REC009', 
      patientId: 'PAT009', 
      doctorId: 'DOC005', 
      date: '2025-04-03', 
      title: 'Back Pain Treatment',
      recordType: 'Treatment Plan',
      category: 'Pain Management',
      status: 'In Progress',
      summary: 'Ongoing treatment for chronic back pain',
      content: 'Patient reports moderate improvement with current physical therapy regimen. Pain level decreased from 7/10 to 4/10. MRI shows L4-L5 disc bulge without nerve impingement. Continued current PT plan with focus on core strengthening. Maintained current pain management: Naproxen 500mg BID PRN. Discussed ergonomic modifications for workplace.',
      attachments: ['Spine_MRI_PAT009_20250403.pdf', 'PT_Progress_Report_PAT009.pdf'],
      lastUpdated: '2025-04-03T11:20:00'
    },
    { 
      id: 'REC010', 
      patientId: 'PAT010', 
      doctorId: 'DOC003', 
      date: '2025-04-05', 
      title: 'Anxiety Management Session',
      recordType: 'Mental Health',
      category: 'Psychiatry',
      status: 'Completed',
      summary: 'Follow-up for anxiety disorder treatment',
      content: 'Patient reports improved anxiety symptoms with current SSRI regimen. Sleep quality improved, reduced frequency of panic attacks (1-2/month vs. 2-3/week previously). Continued Sertraline 50mg daily. Encouraged to maintain CBT sessions. Discussed stress management techniques. Follow-up in 3 months or sooner if symptoms worsen.',
      attachments: ['PHQ-9_Assessment_PAT010_20250405.pdf', 'GAD-7_Assessment_PAT010_20250405.pdf'],
      lastUpdated: '2025-04-05T09:15:00'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showRecordModal, setShowRecordModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showConfirmationToast, setShowConfirmationToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: '2025-01-01',
    end: new Date().toISOString().split('T')[0]
  });

  // Extract unique categories from records
  const categories = Array.from(new Set(medicalRecords.map(record => record.category)));
  
  // Extract unique record types from records
  const recordTypes = Array.from(new Set(medicalRecords.map(record => record.recordType)));
  
  // Extract unique statuses from records
  const statuses = Array.from(new Set(medicalRecords.map(record => record.status)));

  // Reset selected record when modal closes
  useEffect(() => {
    if (!showRecordModal) {
      setSelectedRecord(null);
    }
  }, [showRecordModal]);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showConfirmationToast) {
      const timer = setTimeout(() => {
        setShowConfirmationToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmationToast]);

  const filterRecords = () => {
    let filtered = medicalRecords;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(record => {
        const patient = getPatientById(record.patientId);
        const doctor = getDoctorById(record.doctorId);
        
        return (
          record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filter by patient
    if (selectedPatient !== 'all') {
      filtered = filtered.filter(record => record.patientId === selectedPatient);
    }

    // Filter by doctor
    if (selectedDoctor !== 'all') {
      filtered = filtered.filter(record => record.doctorId === selectedDoctor);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(record => record.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }

    // Filter by date range
    filtered = filtered.filter(record => {
      return record.date >= dateRange.start && record.date <= dateRange.end;
    });

    // Sort records
    filtered = filtered.sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortField === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortField === 'patient') {
        const patientA = getPatientById(a.patientId)?.name || '';
        const patientB = getPatientById(b.patientId)?.name || '';
        return sortDirection === 'asc'
          ? patientA.localeCompare(patientB)
          : patientB.localeCompare(patientA);
      } else if (sortField === 'status') {
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

    return filtered;
  };

  const getPatientById = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  const getDoctorById = (id: string) => {
    return doctors.find(doctor => doctor.id === id);
  };

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setShowRecordModal(true);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch(category) {
      case 'Cardiovascular':
        return 'bg-red-100 text-red-800';
      case 'Respiratory':
        return 'bg-blue-100 text-blue-800';
      case 'Neurology':
        return 'bg-purple-100 text-purple-800';
      case 'Dermatology':
        return 'bg-pink-100 text-pink-800';
      case 'Preventive Care':
        return 'bg-green-100 text-green-800';
      case 'Musculoskeletal':
        return 'bg-orange-100 text-orange-800';
      case 'Chronic Disease Management':
        return 'bg-indigo-100 text-indigo-800';
      case 'Immunology':
        return 'bg-yellow-100 text-yellow-800';
      case 'Psychiatry':
        return 'bg-violet-100 text-violet-800';
      case 'Pain Management':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRecords = filterRecords();

  return (
    <div className="min-h-screen p-6 font-sans bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Add custom font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {/* Success Toast */}
      {showConfirmationToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-xl z-50 flex items-center backdrop-filter backdrop-blur-sm bg-opacity-90">
          <CheckCircle className="w-5 h-5 mr-2" />
          {toastMessage}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-800">Medical Records</h1>
          <p className="text-indigo-600 font-medium">Access and manage patient medical information</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
            <input
              type="text"
              placeholder="Search records..."
              className="pl-10 pr-4 py-2 border border-indigo-200 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white/70 backdrop-filter backdrop-blur-lg shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md font-bold"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            New Record
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Filters */}
        <div className="space-y-6">
          {/* Filter Panel */}
          <div className="bg-white/80 backdrop-filter backdrop-blur-lg rounded-xl shadow-md border border-white/50 p-4">
            <h2 className="text-lg font-bold text-indigo-800 mb-4 flex items-center">
              <Filter className="mr-2" size={18} />
              Filters
            </h2>
            
            <div className="space-y-4">
              {/* Patient Filter */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Patient</label>
                <select
                  className="w-full p-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white shadow-sm"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="all">All Patients</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Doctor Filter */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Doctor</label>
                <select
                  className="w-full p-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white shadow-sm"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="all">All Doctors</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Category</label>
                <select
                  className="w-full p-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white shadow-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Status</label>
                <select
                  className="w-full p-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white shadow-sm"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Date Range</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    className="flex-1 p-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white shadow-sm"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  />
                  <span className="text-indigo-600">to</span>
                  <input
                    type="date"
                    className="flex-1 p-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white shadow-sm"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  />
                </div>
              </div>
              
              {/* Clear Filters Button */}
              <button
                className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium mt-2"
                onClick={() => {
                  setSelectedPatient('all');
                  setSelectedDoctor('all');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                  setSearchTerm('');
                  setDateRange({
                    start: '2025-01-01',
                    end: new Date().toISOString().split('T')[0]
                  });
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-white/80 backdrop-filter backdrop-blur-lg rounded-xl shadow-md border border-white/50 p-4">
            <h2 className="text-lg font-bold text-indigo-800 mb-3">Records Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded-lg bg-indigo-50">
                <span className="text-indigo-700">Total Records</span>
                <span className="font-bold text-indigo-900">{medicalRecords.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-green-50">
                <span className="text-green-700">Completed</span>
                <span className="font-bold text-green-900">{medicalRecords.filter(r => r.status === 'Completed').length}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-yellow-50">
                <span className="text-yellow-700">Pending Review</span>
                <span className="font-bold text-yellow-900">{medicalRecords.filter(r => r.status === 'Pending Review').length}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50">
                <span className="text-blue-700">In Progress</span>
                <span className="font-bold text-blue-900">{medicalRecords.filter(r => r.status === 'In Progress').length}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Records Table */}
        <div className="lg:col-span-3">
          <div className="bg-white/80 backdrop-filter backdrop-blur-lg rounded-xl shadow-md border border-white/50 overflow-hidden">
            <div className="p-4 bg-indigo-50/80 border-b border-indigo-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-indigo-800">Medical Records</h2>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                  onClick={() => handleSort('date')}
                >
                  Date
                  <ArrowUpDown size={16} />
                </button>
                <button
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  Title
                  <ArrowUpDown size={16} />
                </button>
                <button
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                  onClick={() => handleSort('patient')}
                >
                  Patient
                  <ArrowUpDown size={16} />
                </button>
                <button
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <ArrowUpDown size={16} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-indigo-50/80 border-b border-indigo-100">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Patient</th>
                    <th className="px-4 py-2">Doctor</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => {
                      const patient = getPatientById(record.patientId);
                      const doctor = getDoctorById(record.doctorId);
                      return (
                        <tr key={record.id} className="border-b hover:bg-indigo-50/50 transition-colors">
                          <td className="px-4 py-2">{record.date}</td>
                          <td className="px-4 py-2">{record.title}</td>
                          <td className="px-4 py-2">{patient?.name || 'Unknown'}</td>
                          <td className="px-4 py-2">{doctor?.name || 'Unknown'}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getCategoryBadgeClass(record.category)}`}>
                              {record.category}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(record.status)}`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <button
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                onClick={() => handleViewRecord(record)}
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="text-green-600 hover:text-green-800 transition-colors"
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setShowAddModal(true);
                                }}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 transition-colors"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this record?')) {
                                    setMedicalRecords(medicalRecords.filter((r) => r.id !== record.id));
                                    setToastMessage('Record deleted successfully');
                                    setShowConfirmationToast(true);
                                  }
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-2 text-center text-gray-500">
                        No records found. Try adjusting your filters or search term.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Record Modal */}
      {showRecordModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-indigo-800 mb-4">{selectedRecord.title}</h2>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Date:</strong> {selectedRecord.date}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Patient:</strong> {getPatientById(selectedRecord.patientId)?.name || 'Unknown'}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Doctor:</strong> {getDoctorById(selectedRecord.doctorId)?.name || 'Unknown'}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Category:</strong> {selectedRecord.category}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Status:</strong> {selectedRecord.status}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Summary:</strong> {selectedRecord.summary}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Content:</strong> {selectedRecord.content}
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setShowRecordModal(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={() => {
                  setShowRecordModal(false);
                  setSelectedRecord(null);
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsPage;
