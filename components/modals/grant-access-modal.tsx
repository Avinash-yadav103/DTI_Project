import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import axios from "axios";

export function GrantAccessModal({ isOpen, onClose, patientId, onAccessGranted }) {
  const [isLoading, setIsLoading] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [hospital, setHospital] = useState("");
  const [accessLevel, setAccessLevel] = useState("read");
  const [accessDuration, setAccessDuration] = useState("24h");
  const [accessReason, setAccessReason] = useState("");
  
  // Records the patient will grant access to
  const [selectedRecords, setSelectedRecords] = useState({
    diagnosis: true,
    medications: true,
    labResults: true,
    imaging: true,
    allergies: true,
    immunizations: false,
    procedures: false,
  });

  const handleSelectAll = (checked) => {
    setSelectedRecords({
      diagnosis: checked,
      medications: checked,
      labResults: checked,
      imaging: checked,
      allergies: checked,
      immunizations: checked,
      procedures: checked,
    });
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!doctorName.trim()) {
      toast.error("Doctor name is required");
      return;
    }
    
    if (!doctorId.trim()) {
      toast.error("Doctor ID is required");
      return;
    }

    if (!hospital.trim()) {
      toast.error("Hospital name is required");
      return;
    }

    if (!accessReason.trim()) {
      toast.error("Access reason is required");
      return;
    }

    // Count selected records
    const recordsSelected = Object.values(selectedRecords).filter(Boolean).length;
    if (recordsSelected === 0) {
      toast.error("Please select at least one record type to share");
      return;
    }

    setIsLoading(true);

    try {
      // Grant access on the backend
      const response = await axios.post("http://localhost:5000/api/access-control", {
        patientId,
        doctor: {
          name: doctorName,
          id: doctorId,
          hospital
        },
        accessLevel,
        accessDuration,
        accessReason,
        recordTypes: Object.entries(selectedRecords)
          .filter(([_, selected]) => selected)
          .map(([type]) => type)
      });

      // Log this action
      await axios.post("http://localhost:5000/api/transaction-logs", {
        patientId,
        action: "access",
        actor: {
          name: "You", // The patient is granting access
          role: "Patient",
          id: patientId
        },
        details: `Granted access to Dr. ${doctorName} (${doctorId})`,
        hash: '0x' + Math.random().toString(16).substring(2, 34),
        blockNumber: Math.floor(Math.random() * 1000000) + 14000000,
        consensusTimestamp: new Date(),
        additionalInfo: {
          ipAddress: "127.0.0.1",
          device: navigator.userAgent,
          location: "Local",
          accessReason,
          accessLevel,
          accessDuration,
          recordsAccessed: Object.entries(selectedRecords)
            .filter(([_, selected]) => selected)
            .map(([type]) => type)
        }
      });

      toast.success(`Access granted to Dr. ${doctorName}`);
      
      // Call the onAccessGranted callback
      if (onAccessGranted) {
        onAccessGranted({
          doctorName,
          doctorId,
          hospital,
          accessLevel,
          accessDuration,
          accessReason,
          recordTypes: Object.entries(selectedRecords)
            .filter(([_, selected]) => selected)
            .map(([type]) => type)
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Error granting access:", error);
      toast.error("Failed to grant access. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl">Grant Access to Medical Records</DialogTitle>
          <DialogDescription className="text-gray-400">
            Provide the information of the healthcare professional you'd like to grant access to your medical records.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctorName">Doctor Name</Label>
              <Input
                id="doctorName"
                placeholder="Dr. John Smith"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctorId">Doctor ID</Label>
              <Input
                id="doctorId"
                placeholder="DOC-12345"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospital">Hospital/Clinic</Label>
            <Input
              id="hospital"
              placeholder="City General Hospital"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accessLevel">Access Level</Label>
              <Select value={accessLevel} onValueChange={setAccessLevel}>
                <SelectTrigger id="accessLevel" className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="read">Read Only</SelectItem>
                  <SelectItem value="readWrite">Read & Write</SelectItem>
                  <SelectItem value="full">Full Access</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessDuration">Access Duration</Label>
              <Select value={accessDuration} onValueChange={setAccessDuration}>
                <SelectTrigger id="accessDuration" className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="48h">48 Hours</SelectItem>
                  <SelectItem value="1w">1 Week</SelectItem>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessReason">Reason for Access</Label>
            <Input
              id="accessReason"
              placeholder="e.g., Initial consultation, Second opinion"
              value={accessReason}
              onChange={(e) => setAccessReason(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Records to Share</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="selectAll" 
                  checked={Object.values(selectedRecords).every(Boolean)}
                  onCheckedChange={handleSelectAll}
                />
                <label 
                  htmlFor="selectAll" 
                  className="text-sm font-medium leading-none cursor-pointer text-gray-300"
                >
                  Select All
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(selectedRecords).map(([key, checked]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox 
                    id={key} 
                    checked={checked}
                    onCheckedChange={(checked) => 
                      setSelectedRecords(prev => ({...prev, [key]: !!checked}))
                    }
                  />
                  <label 
                    htmlFor={key} 
                    className="text-sm font-medium leading-none cursor-pointer text-gray-300"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={onClose} className="border-gray-600">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            {isLoading ? "Processing..." : "Grant Access"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}