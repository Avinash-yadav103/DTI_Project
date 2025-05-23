"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  Search,
  Download,
  Calendar,
  Clock,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Shield,
  X,
  HelpCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from 'axios';

export default function AccessLogsPage() {
  const { user } = useAuth()
  const [timeFilter, setTimeFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")
  const [actorFilter, setActorFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("transactions")
  const [showHelp, setShowHelp] = useState(false)
  const API_BASE_URL = 'http://localhost:5000/api/transaction-logs';
  const [transactionLogs, setTransactionLogs] = useState([]);

  const fetchTransactionLogs = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const params = { patientId: user.id };
      
      if (timeFilter !== 'all') params.timeFilter = timeFilter;
      if (actionFilter !== 'all') params.actionFilter = actionFilter;
      if (actorFilter !== 'all') params.actorFilter = actorFilter;
      if (searchQuery) params.searchQuery = searchQuery;
      
      const response = await axios.get(API_BASE_URL, { params });
      
      const formattedLogs = response.data.map(log => ({
        id: log._id,
        time: new Date(log.timestamp).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }),
        timestamp: log.timestamp,
        action: log.action,
        actor: log.actor,
        details: log.details,
        hash: log.hash,
        blockNumber: log.blockNumber,
        consensusTimestamp: log.consensusTimestamp,
        additionalInfo: log.additionalInfo
      }));
      
      setTransactionLogs(formattedLogs);
    } catch (error) {
      console.error('Error fetching transaction logs:', error);
      toast.error('Failed to load transaction logs');
      
      if (process.env.NODE_ENV === 'development') {
        setTransactionLogs(mockTransactionLogs);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMedicalRecord = async (recordId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${recordId}`, {
        params: { 
          userId: user.id,
          userName: user.name,
          userRole: 'Patient' 
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching record:', error);
      toast.error('Failed to load medical record');
      return null;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTransactionLogs();
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [user?.id, timeFilter, actionFilter, actorFilter, searchQuery]);

  const handleExportLogs = async (format) => {
    if (!user?.id) return;
    
    try {
      toast.loading(`Exporting logs as ${format.toUpperCase()}...`);
      
      if (format === 'json' || format === 'csv') {
        window.open(`${API_BASE_URL}/export?patientId=${user.id}&format=${format}`, '_blank');
        toast.dismiss();
        toast.success(`Exported logs as ${format.toUpperCase()}`);
      } else if (format === 'pdf') {
        toast.dismiss();
        toast.success(`Exporting blockchain logs as PDF`);
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error exporting logs:', error);
      toast.error('Failed to export logs');
    }
  };

  const recordTransactionView = async (transactionId) => {
    if (!user?.id) return;
    
    try {
      if (typeof transactionId === 'string' && transactionId.length > 8) {
        console.log("Sending data to server:", {
          patientId: user.id,
          action: 'view',
          actor: {
            name: user.name || 'Patient',
            role: 'Patient',
            id: user.id
          },
          details: `Viewed transaction details for ${transactionId}`,
          // Other fields...
        });
        await axios.post(API_BASE_URL, {
          patientId: user.id,
          action: 'view',
          actor: {
            name: user.name || 'Patient',
            role: 'Patient',
            id: user.id
          },
          details: `Viewed transaction details for ${transactionId}`,
          hash: '0x' + Math.random().toString(16).substring(2, 34),
          blockNumber: Math.floor(Math.random().toString(16).substring(2, 34)),
          consensusTimestamp: new Date(),
          additionalInfo: {
            ipAddress: '127.0.0.1',
            device: navigator.userAgent,
            location: 'Local'
          }
        });
      }
    } catch (error) {
      console.error('Error recording transaction view:', error);
    }
  };

  const toggleTransactionDetails = (id) => {
    if (expandedTransaction === id) {
      setExpandedTransaction(null);
    } else {
      setExpandedTransaction(id);
      recordTransactionView(id);
    }
  };

  const handleVerifyTransaction = (hash) => {
    toast.success("Verifying transaction on blockchain explorer");
    window.open(`https://example-blockchain-explorer.com/tx/${hash}`, "_blank");
    
    if (user?.id) {
      axios.post(API_BASE_URL, {
        patientId: user.id,
        action: 'view',
        actor: {
          name: user.name || 'Patient',
          role: 'Patient',
          id: user.id
        },
        details: `Verified transaction hash: ${hash}`,
        hash: '0x' + Math.random().toString(16).substring(2, 34),
        blockNumber: Math.floor(Math.random() * 1000000) + 14000000,
        consensusTimestamp: new Date(),
        additionalInfo: {
          ipAddress: '127.0.0.1',
          device: navigator.userAgent,
          location: 'Local'
        }
      }).catch(error => {
        console.error('Error recording verification:', error);
      });
    }
  };

  const filteredLogs = transactionLogs.filter((log) => {
    if (timeFilter === "today") {
      const today = new Date().toISOString().split("T")[0]
      const logDate = new Date(log.timestamp).toISOString().split("T")[0]
      if (logDate !== today) return false
    } else if (timeFilter === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      if (new Date(log.timestamp) < weekAgo) return false
    } else if (timeFilter === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      if (new Date(log.timestamp) < monthAgo) return false
    }

    if (actionFilter !== "all" && log.action !== actionFilter) {
      return false
    }

    if (actorFilter !== "all" && log.actor.role.toLowerCase() !== actorFilter) {
      return false
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesId = log.id.toLowerCase().includes(query)
      const matchesActor = log.actor.name.toLowerCase().includes(query)
      const matchesDetails = log.details.toLowerCase().includes(query)

      if (!matchesId && !matchesActor && !matchesDetails) {
        return false
      }
    }

    return true
  })

  const groupedByDate = filteredLogs.reduce((groups, log) => {
    const date = new Date(log.timestamp).toISOString().split("T")[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(log)
    return groups
  }, {})

  const getActionIcon = (action) => {
    switch (action) {
      case "view":
        return <Eye className="h-4 w-4" />
      case "update":
        return <Edit className="h-4 w-4" />
      case "access":
        return <CheckCircle className="h-4 w-4" />
      case "revoke":
        return <X className="h-4 w-4" />
      case "upload":
        return <FileText className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Access Logs",
      href: "/dashboard/patient/logs",
      icon: <Clock className="h-4 w-4" />,
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
      title="Blockchain Access Logs"
      user={user || { name: "", email: "" }}
      notifications={3}
      requiredRole="patient"
    >
      <div className="mb-6">
        <Card className="bg-gray-900 text-white border-none shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  Blockchain Access Logs
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
                          onClick={() => setShowHelp(!showHelp)}
                        >
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Learn about blockchain logs</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Immutable record of all access and modifications to your medical data
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-[140px] bg-gray-800 border-gray-700 text-white">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                  </SelectContent>
                </Select>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-gray-700 text-white hover:bg-gray-800"
                        onClick={() => handleExportLogs("csv")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export logs</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>

          {showHelp && (
            <div className="mx-6 my-2 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-amber-400 font-medium">About Blockchain Access Logs</h3>
                  <p className="text-gray-300 text-sm mt-1">
                    Every access to your medical data is recorded on the blockchain, creating an immutable audit trail.
                    These logs cannot be altered or deleted, ensuring complete transparency about who accessed your
                    information and when.
                  </p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gray-700/50 p-3 rounded-md">
                      <h4 className="text-white text-sm font-medium">Verification</h4>
                      <p className="text-gray-300 text-xs mt-1">
                        Each transaction has a unique hash that can be verified on the blockchain explorer to confirm
                        its authenticity.
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-md">
                      <h4 className="text-white text-sm font-medium">Security</h4>
                      <p className="text-gray-300 text-xs mt-1">
                        The distributed nature of blockchain ensures these records cannot be tampered with by any single
                        entity.
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full flex-shrink-0"
                  onClick={() => setShowHelp(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <CardContent>
            <Tabs defaultValue="transactions" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-gray-800 border-gray-700 mb-6">
                <TabsTrigger
                  value="transactions"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
                >
                  Transaction Log
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
                >
                  Activity Timeline
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transactions">
                <div className="bg-gray-800 rounded-lg p-6 mt-2">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold">Blockchain Transaction Log</h2>

                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Search transactions..."
                          className="pl-9 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 w-full"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      <Select value={actionFilter} onValueChange={setActionFilter}>
                        <SelectTrigger className="w-[140px] bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Action type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600 text-white">
                          <SelectItem value="all">All Actions</SelectItem>
                          <SelectItem value="view">View</SelectItem>
                          <SelectItem value="update">Update</SelectItem>
                          <SelectItem value="access">Access</SelectItem>
                          <SelectItem value="revoke">Revoke</SelectItem>
                          <SelectItem value="upload">Upload</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={actorFilter} onValueChange={setActorFilter}>
                        <SelectTrigger className="w-[140px] bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Actor type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600 text-white">
                          <SelectItem value="all">All Actors</SelectItem>
                          <SelectItem value="doctor">Doctors</SelectItem>
                          <SelectItem value="specialist">Specialists</SelectItem>
                          <SelectItem value="patient">You</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
                    </div>
                  ) : (
                    <>
                      {filteredLogs.length > 0 ? (
                        <div className="space-y-4">
                          {filteredLogs.map((log) => (
                            <div key={log.id} className="bg-gray-750 border border-gray-700 rounded-lg overflow-hidden">
                              <div
                                className="p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                                onClick={() => toggleTransactionDetails(log.id)}
                              >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`
                                      h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0
                                      ${
                                        log.action === "view"
                                          ? "bg-blue-900/30 text-blue-400"
                                          : log.action === "update"
                                            ? "bg-amber-900/30 text-amber-400"
                                            : log.action === "access"
                                              ? "bg-green-900/30 text-green-400"
                                              : log.action === "revoke"
                                                ? "bg-red-900/30 text-red-400"
                                                : "bg-purple-900/30 text-purple-400"
                                      }
                                    `}
                                    >
                                      {getActionIcon(log.action)}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          className={`
                                          ${
                                            log.action === "view"
                                              ? "bg-blue-900 text-blue-300"
                                              : log.action === "update"
                                                ? "bg-amber-900 text-amber-300"
                                                : log.action === "access"
                                                  ? "bg-green-900 text-green-300"
                                                  : log.action === "revoke"
                                                    ? "bg-red-900 text-red-300"
                                                    : "bg-purple-900 text-purple-300"
                                          }
                                        `}
                                        >
                                          {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                                        </Badge>
                                        <span className="text-sm font-medium">{log.details}</span>
                                      </div>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-400">{log.time}</span>
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="text-xs text-gray-400">{log.actor.name}</span>
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="text-xs text-gray-400">{log.actor.role}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <code className="text-xs bg-gray-700 px-2 py-1 rounded">{log.id}</code>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleVerifyTransaction(log.hash)
                                      }}
                                    >
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </Button>
                                    {expandedTransaction === log.id ? (
                                      <ChevronUp className="h-5 w-5 text-gray-400" />
                                    ) : (
                                      <ChevronDown className="h-5 w-5 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                              </div>

                              {expandedTransaction === log.id && (
                                <div className="p-4 pt-0 border-t border-gray-700 bg-gray-800/50">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-300 mb-2">Transaction Details</h4>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-xs text-gray-400">Transaction Hash:</span>
                                          <code className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                                            {log.hash.substring(0, 12)}...{log.hash.substring(log.hash.length - 8)}
                                          </code>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-xs text-gray-400">Block Number:</span>
                                          <span className="text-xs text-white">{log.blockNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-xs text-gray-400">Consensus Timestamp:</span>
                                          <span className="text-xs text-white">
                                            {new Date(log.consensusTimestamp).toLocaleString()}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-xs text-gray-400">Actor ID:</span>
                                          <span className="text-xs text-white">{log.actor.id}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-gray-300 mb-2">Access Information</h4>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-xs text-gray-400">IP Address:</span>
                                          <span className="text-xs text-white">{log.additionalInfo.ipAddress}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-xs text-gray-400">Device:</span>
                                          <span className="text-xs text-white">{log.additionalInfo.device}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-xs text-gray-400">Location:</span>
                                          <span className="text-xs text-white">{log.additionalInfo.location}</span>
                                        </div>
                                        {log.additionalInfo.accessReason && (
                                          <div className="flex justify-between">
                                            <span className="text-xs text-gray-400">Access Reason:</span>
                                            <span className="text-xs text-white">
                                              {log.additionalInfo.accessReason}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {log.action === "view" && log.additionalInfo.recordsAccessed && (
                                    <div className="mt-4">
                                      <h4 className="text-sm font-medium text-gray-300 mb-2">Records Accessed</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {log.additionalInfo.recordsAccessed.map((record, idx) => (
                                          <Badge
                                            key={idx}
                                            className="bg-blue-900/30 text-blue-300 border border-blue-800"
                                          >
                                            {record}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {log.action === "update" && log.additionalInfo.changesMade && (
                                    <div className="mt-4">
                                      <h4 className="text-sm font-medium text-gray-300 mb-2">Changes Made</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {log.additionalInfo.changesMade.map((change, idx) => (
                                          <Badge
                                            key={idx}
                                            className="bg-amber-900/30 text-amber-300 border border-amber-800"
                                          >
                                            {change}
                                          </Badge>
                                        ))}
                                      </div>
                                      {log.additionalInfo.previousValue && log.additionalInfo.newValue && (
                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                          <div className="bg-gray-700/50 p-2 rounded">
                                            <span className="text-xs text-gray-400">Previous Value:</span>
                                            <p className="text-xs text-white">{log.additionalInfo.previousValue}</p>
                                          </div>
                                          <div className="bg-gray-700/50 p-2 rounded">
                                            <span className="text-xs text-gray-400">New Value:</span>
                                            <p className="text-xs text-white">{log.additionalInfo.newValue}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {log.action === "access" && log.additionalInfo.accessDuration && (
                                    <div className="mt-4">
                                      <h4 className="text-sm font-medium text-gray-300 mb-2">Access Details</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div className="bg-gray-700/50 p-2 rounded">
                                          <span className="text-xs text-gray-400">Duration:</span>
                                          <p className="text-xs text-white">{log.additionalInfo.accessDuration}</p>
                                        </div>
                                        <div className="bg-gray-700/50 p-2 rounded">
                                          <span className="text-xs text-gray-400">Access Level:</span>
                                          <p className="text-xs text-white">{log.additionalInfo.accessLevel}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {log.action === "upload" && log.additionalInfo.fileDetails && (
                                    <div className="mt-4">
                                      <h4 className="text-sm font-medium text-gray-300 mb-2">File Details</h4>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        <div className="bg-gray-700/50 p-2 rounded">
                                          <span className="text-xs text-gray-400">File Name:</span>
                                          <p className="text-xs text-white">{log.additionalInfo.fileDetails.name}</p>
                                        </div>
                                        <div className="bg-gray-700/50 p-2 rounded">
                                          <span className="text-xs text-gray-400">File Type:</span>
                                          <p className="text-xs text-white">{log.additionalInfo.fileDetails.type}</p>
                                        </div>
                                        <div className="bg-gray-700/50 p-2 rounded">
                                          <span className="text-xs text-gray-400">File Size:</span>
                                          <p className="text-xs text-white">{log.additionalInfo.fileDetails.size}</p>
                                        </div>
                                        <div className="bg-gray-700/50 p-2 rounded">
                                          <span className="text-xs text-gray-400">File Hash:</span>
                                          <p className="text-xs text-white truncate">
                                            {log.additionalInfo.fileDetails.hash}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div className="mt-4 flex justify-end">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleVerifyTransaction(log.hash)
                                      }}
                                    >
                                      <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                      Verify on Blockchain
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-750 rounded-lg border border-gray-700">
                          <Search className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-gray-300">No Transactions Found</h3>
                          <p className="text-gray-400 mt-1">No transactions match your current filters.</p>
                          <Button
                            variant="outline"
                            className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-700"
                            onClick={() => {
                              setTimeFilter("all")
                              setActionFilter("all")
                              setActorFilter("all")
                              setSearchQuery("")
                            }}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="activity">
                <div className="bg-gray-800 rounded-lg p-6 mt-2">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold">Activity Timeline</h2>

                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Search activities..."
                          className="pl-9 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 w-full"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
                    </div>
                  ) : (
                    <>
                      {Object.keys(groupedByDate).length > 0 ? (
                        <div className="space-y-8">
                          {Object.entries(groupedByDate)
                            .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                            .map(([date, logs]) => (
                              <div key={date}>
                                <h3 className="text-lg font-medium text-white mb-4">{formatDate(date)}</h3>
                                <div className="relative pl-8 border-l-2 border-gray-700 space-y-6">
                                  {logs.map((log) => (
                                    <div key={log.id} className="relative">
                                      <div className="absolute -left-[41px] top-0">
                                        <div
                                          className={`
                                          h-8 w-8 rounded-full flex items-center justify-center
                                          ${
                                            log.action === "view"
                                              ? "bg-blue-900/30 text-blue-400 border-2 border-blue-700"
                                              : log.action === "update"
                                                ? "bg-amber-900/30 text-amber-400 border-2 border-amber-700"
                                                : log.action === "access"
                                                  ? "bg-green-900/30 text-green-400 border-2 border-green-700"
                                                  : log.action === "revoke"
                                                    ? "bg-red-900/30 text-red-400 border-2 border-red-700"
                                                    : "bg-purple-900/30 text-purple-400 border-2 border-purple-700"
                                          }
                                        `}
                                        >
                                          {getActionIcon(log.action)}
                                        </div>
                                      </div>

                                      <div className="bg-gray-750 border border-gray-700 rounded-lg p-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <Badge
                                                className={`
                                                ${
                                                  log.action === "view"
                                                    ? "bg-blue-900 text-blue-300"
                                                    : log.action === "update"
                                                      ? "bg-amber-900 text-amber-300"
                                                      : log.action === "access"
                                                        ? "bg-green-900 text-green-300"
                                                        : log.action === "revoke"
                                                          ? "bg-red-900 text-red-300"
                                                          : "bg-purple-900 text-purple-300"
                                                }
                                              `}
                                              >
                                                {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                                              </Badge>
                                              <span className="text-sm font-medium">{log.details}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className="text-xs text-gray-400">{log.time.split(" ")[1]}</span>
                                              <span className="text-xs text-gray-500">•</span>
                                              <span className="text-xs text-gray-400">{log.actor.name}</span>
                                              <span className="text-xs text-gray-500">•</span>
                                              <span className="text-xs text-gray-400">{log.actor.role}</span>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <code className="text-xs bg-gray-700 px-2 py-1 rounded">{log.id}</code>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                                              onClick={() => handleVerifyTransaction(log.hash)}
                                            >
                                              <ExternalLink className="h-3.5 w-3.5" />
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-750 rounded-lg border border-gray-700">
                          <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-gray-300">No Activities Found</h3>
                          <p className="text-gray-400 mt-1">No activities match your current filters.</p>
                          <Button
                            variant="outline"
                            className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-700"
                            onClick={() => {
                              setTimeFilter("all")
                              setActionFilter("all")
                              setActorFilter("all")
                              setSearchQuery("")
                            }}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
            <div className="text-xs text-gray-500">
              Secured by MediChain Blockchain • Last synced: {new Date().toLocaleString()}
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-white hover:bg-gray-800"
                      onClick={() => handleExportLogs("pdf")}
                    >
                      PDF
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export as PDF</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-white hover:bg-gray-800"
                      onClick={() => handleExportLogs("csv")}
                    >
                      CSV
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export as CSV</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-white hover:bg-gray-800"
                      onClick={() => handleExportLogs("json")}
                    >
                      JSON
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export as JSON</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

