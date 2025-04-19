"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, X, MessageCircle, Loader, AlertCircle } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  isError?: boolean
}

export default function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hello! I'm your healthcare assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!input.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    
    try {
      // Use environment variable or full URL with protocol
      // If running in development, both front and back ends are likely running on different ports
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
      
      const response = await fetch(`${backendUrl}/api/healthcareChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add CORS headers if needed
          "Accept": "application/json",
        },
        body: JSON.stringify({ userInput: input }),
        // Add credentials if needed
        // credentials: "include",
      })
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }
      
      const data = await response.json()
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: data.advice || "Sorry, I couldn't process that request.",
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, botMessage])
      
      // If there are follow-up questions, add them
      if (data.followUpQuestions && data.followUpQuestions.length > 0) {
        const followUpMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: "bot",
          content: `Additional questions you might consider: \n${data.followUpQuestions.map((q: string) => `• ${q}`).join("\n")}`,
          timestamp: new Date(),
        }
        
        setMessages(prev => [...prev, followUpMessage])
      }
      
      // If there's additional info, add it
      if (data.additionalInfo) {
        const additionalInfoMessage: Message = {
          id: (Date.now() + 3).toString(),
          type: "bot",
          content: `Additional information: ${data.additionalInfo}`,
          timestamp: new Date(),
        }
        
        setMessages(prev => [...prev, additionalInfoMessage])
      }
      
    } catch (error) {
      console.error("Error sending message:", error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "Sorry, I encountered an error connecting to the healthcare service. Please check if the backend server is running and try again later.",
        timestamp: new Date(),
        isError: true
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg ${
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-sky-600 hover:bg-sky-700"
        } text-white transition-colors`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-600 to-sky-800 p-4 text-white">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h3 className="font-bold">Healthcare Assistant</h3>
                  <p className="text-xs text-sky-100">Charaka Health</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      message.type === "user"
                        ? "bg-sky-600 text-white rounded-tr-none"
                        : message.isError
                        ? "bg-rose-50 border border-rose-200 rounded-tl-none"
                        : "bg-white border border-gray-200 rounded-tl-none"
                    }`}
                  >
                    {message.isError && (
                      <div className="flex items-center gap-2 text-rose-500 mb-1">
                        <AlertCircle size={14} />
                        <span className="text-xs font-medium">Connection Error</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Loader size={16} className="animate-spin" />
                      <p className="text-sm text-gray-500">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-sky-600 text-white rounded-full p-2 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!input.trim() || isLoading}
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}