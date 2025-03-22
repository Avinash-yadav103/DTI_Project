import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Info, 
  Plus, 
  Download, 
  Share2, 
  Filter, 
  ChevronDown,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

interface Vaccination {
  id: string;
  name: string;
  date: Date;
  provider: string;
  location: string;
  lotNumber: string;
  nextDueDate?: Date;
  status: 'Completed' | 'Scheduled' | 'Overdue' | 'Recommended';
  doseNumber?: number;
  totalDoses?: number;
}

interface VaccinationCategory {
  name: string;
  vaccinations: Vaccination[];
  isExpanded: boolean;
}

const VaccinationPage: React.FC = () => {
  // Sample vaccination data grouped by category
  const [categories, setCategories] = useState<VaccinationCategory[]>([
    {
      name: "COVID-19",
      isExpanded: true,
      vaccinations: [
        {
          id: "vac-001",
          name: "Pfizer-BioNTech COVID-19",
          date: new Date("2021-03-15"),
          provider: "Dr. Emily Chen",
          location: "City Medical Center",
          lotNumber: "EL0283",
          status: "Completed",
          doseNumber: 1,
          totalDoses: 2
        },
        {
          id: "vac-002",
          name: "Pfizer-BioNTech COVID-19",
          date: new Date("2021-04-05"),
          provider: "Dr. Emily Chen",
          location: "City Medical Center",
          lotNumber: "EL1427",
          status: "Completed",
          doseNumber: 2,
          totalDoses: 2
        },
        {
          id: "vac-003",
          name: "Pfizer-BioNTech COVID-19 Booster",
          date: new Date("2021-11-10"),
          provider: "Dr. Emily Chen",
          location: "City Medical Center",
          lotNumber: "EL8765",
          status: "Completed",
          doseNumber: 1,
          totalDoses: 1
        }
      ]
    },
    {
      name: "Influenza",
      isExpanded: false,
      vaccinations: [
        {
          id: "vac-004",
          name: "Seasonal Influenza Vaccine",
          date: new Date("2020-10-12"),
          provider: "Dr. James Wilson",
          location: "Health Plus Clinic",
          lotNumber: "IN2010A",
          status: "Completed",
          doseNumber: 1,
          totalDoses: 1
        },
        {
          id: "vac-005",
          name: "Seasonal Influenza Vaccine",
          date: new Date("2021-10-08"),
          provider: "Dr. Emily Chen",
          location: "City Medical Center",
          lotNumber: "IN2021B",
          status: "Completed",
          doseNumber: 1,
          totalDoses: 1
        },
        {
          id: "vac-006",
          name: "Seasonal Influenza Vaccine",
          date: new Date("2022-10-05"),
          provider: "Dr. Sarah Johnson",
          location: "Neurology Center",
          lotNumber: "IN2022C",
          status: "Completed",
          doseNumber: 1,
          totalDoses: 1
        },
        {
          id: "vac-007",
          name: "Seasonal Influenza Vaccine",
          date: new Date("2023-09-28"),
          provider: "Dr. Emily Chen",
          location: "City Medical Center",
          lotNumber: "IN2023A",
          status: "Completed",
          doseNumber: 1,
          totalDoses: 1
        },
        {
          id: "vac-008",
          name: "Seasonal Influenza Vaccine",
          date: new Date("2024-10-15"),
          provider: "Dr. Emily Chen",
          location: "City Medical Center",
          lotNumber: "",
          nextDueDate: new Date("2024-10-15"),
          status: "Scheduled",
          doseNumber: 1,
          totalDoses: 1
        }
      ]
    },
    {
      name: "Travel & Other Vaccines",
      isExpanded: false,
      vaccinations: [
        {
          id: "vac-009",
          name: "Hepatitis A",
          date: new Date("2019-06-10"),
          provider: "Dr. Linda Martinez",
          location: "Travel Clinic",
          lotNumber: "HAV291",
          status: "Completed",
          doseNumber: 1,
          totalDoses: 2
        },
        {
          id: "vac-010",
          name: "Hepatitis A",
          date: new Date("2019-12-12"),
          provider: "Dr. Linda Martinez",
          location: "Travel Clinic",
          lotNumber: "HAV305",
          status: "Completed",
          doseNumber: 2,
          totalDoses: 2
        },
        {
          id: "vac-011",
          name: "Typhoid",
          date: new Date("2019-06-10"),
          provider: "Dr. Linda Martinez",
          location: "Travel Clinic",
          lotNumber: "TYP118",
          status: "Completed",
          doseNumber: 1,
          totalDoses: 1
        },
        {
          id: "vac-012",
          name: "Yellow Fever",
          date: new Date("2019-06-10"),
          provider: "Dr. Linda Martinez",
          location: "Travel Clinic",
          lotNumber: "YF2019",
          status: "Completed",
          doseNumber: 1,
          totalDoses: 1
        }
      ]
    },
    {
      name: "Childhood Immunizations",
      isExpanded: false,
      vaccinations: [
        {
          id: "vac-013",
          name: "MMR (Measles, Mumps, Rubella)",
          date: new Date("1986-04-15"),
          provider: "Dr. Robert Johnson",
          location: "Children's Hospital",
          lotNumber: "MMR8604",
          status: "Completed",
          doseNumber: 1,
          totalDoses: 2
        },
        {
          id: "vac-014",
          name: "MMR (Measles, Mumps, Rubella)",
          date: new Date("1990-05-20"),
          provider: "Dr. Robert Johnson",
          location: "Children's Hospital",
          lotNumber: "MMR9005",
          status: "Completed",
          doseNumber: 2,
          totalDoses: 2
        },
        {
          id: "vac-015",
          name: "Polio (IPV)",
          date: new Date("1986-02-10"),
          provider: "Dr. Robert Johnson",
          location: "Children's Hospital",
          lotNumber: "IPV8602",
          status: "Completed",
          doseNumber: 1,
          totalDoses: 4
        },
        {
          id: "vac-016",
          name: "Tetanus, Diphtheria, Pertussis (Tdap)",
          date: new Date("2015-08-12"),
          provider: "Dr. James Wilson",
          location: "Health Plus Clinic",
          lotNumber: "TDAP1508",
          status: "Completed",
          doseNumber: 1,
          totalDoses: 1
        }
      ]
    },
    {
      name: "Recommended Vaccines",
      isExpanded: false,
      vaccinations: [
        {
          id: "vac-017",
          name: "Shingrix (Shingles)",
          date: new Date("2025-06-01"),
          provider: "",
          location: "",
          lotNumber: "",
          nextDueDate: new Date("2025-06-01"),
          status: "Recommended",
          doseNumber: 1,
          totalDoses: 2
        },
        {
          id: "vac-018",
          name: "Pneumococcal (PPSV23)",
          date: new Date("2030-01-01"),
          provider: "",
          location: "",
          lotNumber: "",
          nextDueDate: new Date("2030-01-01"),
          status: "Recommended",
          doseNumber: 1,
          totalDoses: 1
        }
      ]
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("All");
  
  const toggleCategory = (index: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].isExpanded = !updatedCategories[index].isExpanded;
    setCategories(updatedCategories);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Recommended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    vaccinations: category.vaccinations.filter(vac => 
      filterStatus === "All" || vac.status === filterStatus
    )
  })).filter(category => category.vaccinations.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">PM Patient Portfolio</h1>
          <div className="ml-6 relative w-64">
            <input 
              type="text" 
              placeholder="Search medical records, appointments..." 
              className="w-full py-2 px-4 rounded-full bg-gray-100 border-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2">
            <Calendar size={20} />
          </button>
          <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
            AM
          </div>
          <div>
            <div className="font-medium">Alex Morgan</div>
            <div className="text-sm text-gray-500">Patient</div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white h-screen border-r">
          <nav className="py-4">
            <a href="#" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
              <span className="mr-3"><Calendar size={18} /></span>
              Dashboard
            </a>
            <a href="#" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
              <span className="mr-3"><Calendar size={18} /></span>
              Appointments
            </a>
            <a href="#" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
              <span className="mr-3"><Info size={18} /></span>
              Health Metrics
            </a>
            <a href="#" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
              <span className="mr-3"><Download size={18} /></span>
              Reports
            </a>
            <a href="#" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
              <span className="mr-3"><Calendar size={18} /></span>
              Profile
            </a>
            <a href="#" className="flex items-center px-6 py-3 bg-gray-100 text-blue-600 font-medium">
              <span className="mr-3"><Calendar size={18} /></span>
              Vaccination
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Vaccination Records</h1>
              <p className="text-gray-600 mt-1">
                Track and manage all your vaccinations throughout your lifetime
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white border rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50">
                <Download size={16} />
                Export
              </button>
              <button className="flex items-center gap-2 bg-white border rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50">
                <Share2 size={16} />
                Share
              </button>
              <button className="flex items-center gap-2 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700">
                <Plus size={16} />
                Add Vaccination
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="text-xs font-medium text-gray-500 uppercase">Total Vaccines</div>
              <div className="mt-1 flex items-end justify-between">
                <div className="text-2xl font-bold">
                  {categories.reduce((sum, cat) => sum + cat.vaccinations.filter(v => v.status === 'Completed').length, 0)}
                </div>
                <div className="text-green-600 flex items-center text-sm">
                  <CheckCircle size={16} className="mr-1" />
                  Completed
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="text-xs font-medium text-gray-500 uppercase">Upcoming</div>
              <div className="mt-1 flex items-end justify-between">
                <div className="text-2xl font-bold">
                  {categories.reduce((sum, cat) => sum + cat.vaccinations.filter(v => v.status === 'Scheduled').length, 0)}
                </div>
                <div className="text-blue-600 flex items-center text-sm">
                  <Calendar size={16} className="mr-1" />
                  Scheduled
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="text-xs font-medium text-gray-500 uppercase">Recommended</div>
              <div className="mt-1 flex items-end justify-between">
                <div className="text-2xl font-bold">
                  {categories.reduce((sum, cat) => sum + cat.vaccinations.filter(v => v.status === 'Recommended').length, 0)}
                </div>
                <div className="text-yellow-600 flex items-center text-sm">
                  <Calendar size={16} className="mr-1" />
                  Due Soon
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="text-xs font-medium text-gray-500 uppercase">Overdue</div>
              <div className="mt-1 flex items-end justify-between">
                <div className="text-2xl font-bold">
                  {categories.reduce((sum, cat) => sum + cat.vaccinations.filter(v => v.status === 'Overdue').length, 0)}
                </div>
                <div className="text-red-600 flex items-center text-sm">
                  <Calendar size={16} className="mr-1" />
                  Action Required
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <div className="font-medium flex items-center">
                <Filter size={16} className="mr-2" />
                Filter by:
              </div>
              <div className="flex gap-2">
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                  onClick={() => setFilterStatus('All')}
                >
                  All
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'Completed' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
                  onClick={() => setFilterStatus('Completed')}
                >
                  Completed
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'Scheduled' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                  onClick={() => setFilterStatus('Scheduled')}
                >
                  Scheduled
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'Recommended' ? 'bg-yellow-600 text-white' : 'bg-gray-100'}`}
                  onClick={() => setFilterStatus('Recommended')}
                >
                  Recommended
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'Overdue' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
                  onClick={() => setFilterStatus('Overdue')}
                >
                  Overdue
                </button>
              </div>
            </div>
          </div>

          {/* Vaccination Categories */}
          <div className="space-y-4">
            {filteredCategories.map((category, catIndex) => (
              <div key={category.name} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 border-b"
                  onClick={() => toggleCategory(catIndex)}
                >
                  <h3 className="font-semibold text-lg flex items-center">
                    {category.isExpanded ? <ChevronDown size={20} className="mr-2" /> : <ChevronRight size={20} className="mr-2" />}
                    {category.name}
                    <span className="ml-2 text-sm bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">
                      {category.vaccinations.length}
                    </span>
                  </h3>
                  <div className="text-sm text-gray-500">
                    {category.vaccinations.filter(v => v.status === 'Completed').length} completed
                    {category.vaccinations.filter(v => v.status === 'Scheduled' || v.status === 'Recommended').length > 0 && 
                      `, ${category.vaccinations.filter(v => v.status === 'Scheduled' || v.status === 'Recommended').length} upcoming`
                    }
                  </div>
                </div>
                
                {category.isExpanded && (
                  <div className="p-1">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vaccination
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Provider
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lot #
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {category.vaccinations.map((vaccination) => (
                          <tr key={vaccination.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{vaccination.name}</div>
                              {vaccination.doseNumber && vaccination.totalDoses && (
                                <div className="text-xs text-gray-500">
                                  Dose {vaccination.doseNumber} of {vaccination.totalDoses}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {vaccination.status === 'Recommended' || vaccination.status === 'Scheduled' 
                                ? (vaccination.nextDueDate ? format(vaccination.nextDueDate, 'MMM d, yyyy') : 'Not scheduled') 
                                : format(vaccination.date, 'MMM d, yyyy')}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {vaccination.provider || '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {vaccination.location || '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {vaccination.lotNumber || '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vaccination.status)}`}>
                                {vaccination.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                {vaccination.status === 'Completed' && (
                                  <>
                                    <button className="text-blue-600 hover:text-blue-800">View</button>
                                    <button className="text-blue-600 hover:text-blue-800">Print</button>
                                  </>
                                )}
                                {(vaccination.status === 'Scheduled' || vaccination.status === 'Recommended') && (
                                  <>
                                    <button className="text-blue-600 hover:text-blue-800">Schedule</button>
                                    <button className="text-gray-600 hover:text-gray-800">Remind</button>
                                  </>
                                )}
                                {vaccination.status === 'Overdue' && (
                                  <button className="text-red-600 hover:text-red-800 font-medium">Schedule Now</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VaccinationPage;