"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, CheckCircle, XCircle, Clock, FileText, Info, Shield, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format, formatDistanceToNow } from "date-fns"

export function NotificationsPopup({ 
  notificationCount = 0, 
  accessRequests = [], 
  recordUpdates = [],
  systemNotifications = [],
  onApproveAccess,
  onRejectAccess,
  onViewRecord,
  onMarkAllRead,
  onViewAll
}) {
  const [isOpen, setIsOpen] = useState(false)
  const popupRef = useRef(null)

  // Handle click outside to close the popup
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [popupRef])

  // All notification types combined and sorted by date
  const allNotifications = [
    ...accessRequests.filter(req => req.status === "pending").map(req => ({
      ...req,
      type: 'access',
      time: new Date(req.requestedOn),
      isUnread: true
    })),
    ...recordUpdates.map(update => ({
      ...update,
      type: 'record',
      time: new Date(update.date),
      isUnread: !update.viewed
    })),
    ...systemNotifications.map(notification => ({
      ...notification,
      type: 'system',
      time: new Date(notification.date),
      isUnread: !notification.read
    }))
  ].sort((a, b) => b.time - a.time).slice(0, 5); // Show most recent 5

  const unreadCount = allNotifications.filter(n => n.isUnread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 transition-colors hover:text-gray-900 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <Card
          ref={popupRef}
          className="absolute right-0 top-full mt-1 w-80 sm:w-96 overflow-hidden z-50 shadow-lg"
        >
          <div className="flex items-center justify-between border-b p-3">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => {
                  onMarkAllRead();
                }}
              >
                Mark all as read
              </Button>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto">
            {allNotifications.length > 0 ? (
              <div>
                {allNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`border-b p-3 hover:bg-gray-50 ${notification.isUnread ? "bg-sky-50" : ""}`}
                  >
                    <div className="flex gap-3">
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full
                        ${notification.type === 'access' 
                          ? "bg-amber-100 text-amber-600" 
                          : notification.type === 'record'
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }
                      `}>
                        {notification.type === 'access' && <Shield className="h-4 w-4" />}
                        {notification.type === 'record' && <FileText className="h-4 w-4" />}
                        {notification.type === 'system' && <Info className="h-4 w-4" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium line-clamp-1">
                              {notification.type === 'access' && `Access request from ${notification.name}`}
                              {notification.type === 'record' && notification.title}
                              {notification.type === 'system' && notification.title}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-600 line-clamp-1">
                              {notification.type === 'access' && notification.hospital}
                              {notification.type === 'record' && `${notification.doctor} • ${notification.hospital}`}
                              {notification.type === 'system' && notification.message}
                            </p>
                          </div>
                          {notification.isUnread && (
                            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-sky-500"></span>
                          )}
                        </div>
                        
                        <div className="mt-1 text-xs text-gray-500">
                          {formatDistanceToNow(notification.time, { addSuffix: true })}
                        </div>
                        
                        {notification.type === 'access' && notification.status === 'pending' && (
                          <div className="mt-2 flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                              onClick={() => {
                                onRejectAccess(notification.id);
                                setIsOpen(false);
                              }}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-7 text-xs bg-sky-600 hover:bg-sky-700 text-white"
                              onClick={() => {
                                onApproveAccess(notification.id);
                                setIsOpen(false);
                              }}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                          </div>
                        )}
                        
                        {notification.type === 'record' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs mt-1 p-0 text-sky-600 hover:text-sky-700 hover:bg-transparent"
                            onClick={() => {
                              onViewRecord(notification.id);
                              setIsOpen(false);
                            }}
                          >
                            View Details
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-gray-500">
                No notifications at this time
              </div>
            )}
          </div>
          
          {allNotifications.length > 0 && (
            <div className="border-t p-2 text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs text-sky-600 hover:text-sky-700"
                onClick={() => {
                  onViewAll();
                  setIsOpen(false);
                }}
              >
                View all notifications
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}