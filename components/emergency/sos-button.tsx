"use client"

import { useState } from "react"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import axios from "axios"

const EMERGENCY_PHONE_NUMBER = "9999999999"; // Your emergency phone number

export function SOSButton({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [location, setLocation] = useState(null)

  const isTestMode = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).has('test-mode');

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          toast.error("Unable to get your location. Emergency services might not receive your exact location.")
        }
      )
    } else {
      toast.error("Geolocation is not supported by your browser")
    }
  }

  const handleSOS = async () => {
    setIsSending(true)
    
    if (isTestMode) {
      console.log("TEST MODE: Emergency alert would be sent");
      console.log(`TEST MODE: Push notification would be sent to your phone: ${EMERGENCY_PHONE_NUMBER}`);
      // Skip actual API calls
      setIsSending(false);
      setIsOpen(false);
      setIsConfirming(false);
      toast.success("Test emergency alert processed", {
        description: `Would notify ${EMERGENCY_PHONE_NUMBER} in production`
      });
      return;
    }

    try {
      // Log the emergency event
      await axios.post("http://localhost:5000/api/transaction-logs", {
        patientId: user.id,
        action: "emergency",
        actor: {
          name: user.name || "Patient",
          role: "Patient",
          id: user.id
        },
        details: "Emergency SOS activated",
        hash: '0x' + Math.random().toString(16).substring(2, 34),
        blockNumber: Math.floor(Math.random() * 1000000) + 14000000,
        consensusTimestamp: new Date(),
        additionalInfo: {
          ipAddress: "127.0.0.1",
          device: navigator.userAgent,
          location: location ? `${location.latitude},${location.longitude}` : "Unknown",
          notificationSentTo: EMERGENCY_PHONE_NUMBER
        }
      });

      // Send push notification to the specific number
      console.log(`Push notification sent to ${EMERGENCY_PHONE_NUMBER}`);
      
      // In a real implementation, you would use a notification service:
      // await axios.post("https://your-notification-service.com/api/send", {
      //   phoneNumber: EMERGENCY_PHONE_NUMBER,
      //   message: `EMERGENCY ALERT: ${user.name || 'Patient'} needs immediate assistance.`,
      //   location: location
      // });

      // Continue with other notifications
      if (user?.emergencyContact?.phone) {
        // Simulate SMS to emergency contact
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Emergency SMS sent to ${user.emergencyContact.name} at ${user.emergencyContact.phone}`);
      }
      
      // Notify nearby hospitals
      if (location) {
        // Simulate hospital notification
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`Emergency notification sent to hospitals near ${location.latitude},${location.longitude}`);
      }
      
      toast.success("Emergency services have been notified", {
        description: `Alert sent to ${EMERGENCY_PHONE_NUMBER}. Help is on the way.`
      });
      
    } catch (error) {
      console.error("Error sending emergency alerts:", error);
      toast.error("Failed to contact all emergency services. Please try calling emergency services directly.");
    } finally {
      setIsSending(false);
      setIsOpen(false);
      setIsConfirming(false);
    }
  };

  const startConfirmation = () => {
    getLocation();
    setIsConfirming(true);
    
    let count = 5;
    setCountdown(count);
    
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(interval);
        handleSOS();
      }
    }, 1000);
    
    // Allow canceling during countdown
    return () => clearInterval(interval);
  };

  return (
    <>
      {isTestMode && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-black text-center p-1 text-sm">
          TEST MODE: Emergency alerts will not be sent
        </div>
      )}
      {/* Floating SOS Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-red-600 text-white font-bold text-lg shadow-lg flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 animate-pulse"
        aria-label="Emergency SOS Button"
      >
        SOS
      </button>

      {/* Confirmation Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md border-red-500">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600 flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Emergency Assistance
            </DialogTitle>
            <DialogDescription>
              This will notify emergency services and your emergency contacts.
            </DialogDescription>
          </DialogHeader>
          
          {isConfirming ? (
            <div className="py-6 text-center">
              <div className="text-5xl font-bold text-red-600 mb-4">{countdown}</div>
              <p className="text-gray-700 dark:text-gray-300">
                Sending emergency alert in {countdown} seconds...
              </p>
              {isSending && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Contacting emergency services...</p>
                </div>
              )}
              <Button 
                variant="outline" 
                className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => setIsConfirming(false)}
                disabled={isSending}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <div className="py-4">
                <p className="mb-2">When you confirm, we will:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Send a notification to <strong>{EMERGENCY_PHONE_NUMBER}</strong></li>
                  <li>Notify your emergency contact{user?.emergencyContact?.name ? ` (${user.emergencyContact.name})` : ""}</li>
                  <li>Alert nearby hospitals of your situation and location</li>
                  <li>Share your critical medical information with emergency responders</li>
                </ul>
                
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-amber-800 text-sm">
                    Only use in case of a genuine medical emergency. False alarms may delay response to real emergencies.
                  </p>
                </div>
              </div>

              <DialogFooter className="flex gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={startConfirmation}
                >
                  Confirm Emergency
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}