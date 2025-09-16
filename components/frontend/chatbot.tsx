"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. I can help you with questions about the proctoring system, technical issues, or assessment procedures. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const predefinedResponses = {
    camera:
      "If you're having camera issues, please ensure your browser has camera permissions enabled and no other applications are using your camera. Try refreshing the page if the problem persists.",
    microphone:
      "For microphone issues, check that your browser has microphone permissions and your microphone is not muted. Make sure no other applications are using your microphone.",
    technical:
      "For technical support, please ensure you're using Chrome or Firefox browser, have a stable internet connection, and have enabled camera/microphone permissions.",
    assessment:
      "During the assessment, please maintain eye contact with the camera, keep your workspace clear of unauthorized materials, and ensure good lighting. The AI will monitor for any violations.",
    violations:
      "Violations include looking away for extended periods, multiple faces detected, unauthorized objects (phones, books, notes), or no face detected. Each violation affects your integrity score.",
    score:
      "Your integrity score starts at 100% and decreases based on violations. High severity violations deduct 10 points, medium 5 points, and low 2 points.",
    report:
      "After your assessment, you'll receive a detailed report showing your integrity score, violations detected, and recommendations. You can download it as a text file.",
    help: "I can help with: camera/microphone issues, assessment procedures, violation explanations, scoring system, technical support, and report generation. What would you like to know?",
  }

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("camera") || message.includes("video")) {
      return predefinedResponses.camera
    } else if (message.includes("microphone") || message.includes("audio") || message.includes("mic")) {
      return predefinedResponses.microphone
    } else if (message.includes("technical") || message.includes("problem") || message.includes("issue")) {
      return predefinedResponses.technical
    } else if (message.includes("assessment") || message.includes("test") || message.includes("exam")) {
      return predefinedResponses.assessment
    } else if (message.includes("violation") || message.includes("cheat") || message.includes("detect")) {
      return predefinedResponses.violations
    } else if (message.includes("score") || message.includes("integrity") || message.includes("percentage")) {
      return predefinedResponses.score
    } else if (message.includes("report") || message.includes("download") || message.includes("result")) {
      return predefinedResponses.report
    } else if (message.includes("help") || message.includes("what") || message.includes("how")) {
      return predefinedResponses.help
    } else {
      return "I understand you need assistance. Could you please be more specific about your question? I can help with camera/microphone issues, assessment procedures, violations, scoring, or technical support."
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(inputValue),
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg pulse-glow"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 slide-in">
      <Card className={`w-80 border-border/50 shadow-2xl ${isMinimized ? "h-14" : "h-96"} transition-all duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <CardTitle className="text-lg flex items-center">
            <Bot className="h-5 w-5 text-primary mr-2" />
            AI Assistant
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="h-8 w-8 p-0">
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-4 pt-0 flex flex-col h-80">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === "bot" && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        {message.sender === "user" && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        <div className="text-sm">{message.text}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="flex items-center space-x-2 mt-4">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-input border-border text-foreground"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
