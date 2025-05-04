"use client"

import { useState, useEffect } from "react"
import { Shield, CheckCircle, XCircle, UserPlus, Clock, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"
import axios from "axios"
import { GrantAccessModal } from "@/components/modals/grant-access-modal"

export default function AccessControlPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("pending")
  const [loadingApproveId, setLoadingApproveId] = useState<number | null>(null)
  const [loadingRejectId, setLoadingRejectId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [accessGrants, setAccessGrants] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const API_BASE_URL = 'http://localhost:5000/api/access-control';
  const LOGS_API_URL = 'http://localhost:5000/api/transaction-logs';

  // Fetch existing access grants
  const fetchAccessGrants = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await axios.get(API_BASE_URL, { params: { patientId: user.id } });
      setAccessGrants(response.data);
    } catch (error) {
      console.error('Error fetching access grants:', error);
      toast.error('Failed to load access grants');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle newly granted access
  const handleAccessGranted = (accessData) => {
    fetchAccessGrants(); // Refresh the list
  };

  // Handle access revocation
  const handleRevokeAccess = async (accessId, doctorName) => {
    if (!user?.id) return;

    try {
      await axios.post(`${API_BASE_URL}/revoke/${accessId}`);
      
      // Log this action
      await axios.post(LOGS_API_URL, {
        patientId: user.id,
        action: "revoke",
        actor: {
          name: user.name || "Patient",
          role: "Patient",
          id: user.id
        },
        details: `Revoked access for Dr. ${doctorName}`,
        hash: '0x' + Math.random().toString(16).substring(2, 34),
        blockNumber: Math.floor(Math.random() * 1000000) + 14000000,
        consensusTimestamp: new Date(),
        additionalInfo: {
          ipAddress: "127.0.0.1",
          device: navigator.userAgent,
          location: "Local"
        }
      });

      toast.success(`Access for Dr. ${doctorName} has been revoked`);
      fetchAccessGrants(); // Refresh the list
    } catch (error) {
      console.error('Error revoking access:', error);
      toast.error('Failed to revoke access');
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAccessGrants();
    } else {
      // Simulate loading
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [user?.id]);

  const handleApproveAccess = async (id: number) => {
    setLoadingApproveId(id)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success("Access request approved")
    } catch (error) {
      console.error("Error approving access:", error)
      toast.error("Failed to approve access")
    } finally {
      setLoadingApproveId(null)
    }
  }

  const handleRejectAccess = async (id: number) => {
    setLoadingRejectId(id)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success("Access request rejected")
    } catch (error) {
      console.error("Error rejecting access:", error)
      toast.error("Failed to reject access")
    } finally {
      setLoadingRejectId(null)
    }
  }

  const sidebarItems = [
    {
      title: "Overview",
      href: "/dashboard/patient",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Medical Records",
      href: "/dashboard/patient/records",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Access Control",
      href: "/dashboard/patient/access",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      title: "Appointments",
      href: "/dashboard/patient/appointments",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      title: "Access Logs",
      href: "/dashboard/patient/logs",
      icon: <FileText className="h-4 w-4" />,
    },
  ]

  const sidebarFooterItems = [
    {
      title: "Settings",
      href: "/dashboard/patient/settings",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Logout",
      href: "/login",
      icon: <FileText className="h-4 w-4" />,
    },
  ]

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title="Access Control"
      user={user || { name: "", email: "" }}
      notifications={3}
      requiredRole="patient"
    >
      <div className="mb-6">
        <Card className="bg-white dark:bg-gray-900 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Access Management</CardTitle>
                <CardDescription>
                  Control who has access to your medical records
                </CardDescription>
              </div>
              <Button 
                className="bg-sky-600 hover:bg-sky-700 text-white"
                onClick={() => setIsModalOpen(true)}
              >
                Grant Access
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Render your access grants list here */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
              </div>
            ) : accessGrants.length > 0 ? (
              <div className="space-y-4">
                {accessGrants.map(grant => (
                  <div 
                    key={grant._id} 
                    className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <h3 className="font-medium">Dr. {grant.doctor.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {grant.doctor.hospital} • ID: {grant.doctor.id}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {grant.recordTypes.map(type => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Granted: {new Date(grant.grantedAt).toLocaleDateString()} • 
                        Expires: {grant.accessDuration === 'permanent' 
                          ? 'Never' 
                          : new Date(grant.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 self-end md:self-auto">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRevokeAccess(grant._id, grant.doctor.name)}
                      >
                        Revoke Access
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-medium">No Active Access Grants</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  You haven't granted access to any healthcare providers yet.
                </p>
                <Button 
                  className="mt-4 bg-sky-600 hover:bg-sky-700 text-white"
                  onClick={() => setIsModalOpen(true)}
                >
                  Grant New Access
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grant Access Modal */}
      <GrantAccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientId={user?.id}
        onAccessGranted={handleAccessGranted}
      />
    </DashboardLayout>
  )
}

