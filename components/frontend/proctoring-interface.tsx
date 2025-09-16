"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Video, VideoOff, EyeOff, AlertTriangle, CheckCircle, Clock, User, Briefcase } from "lucide-react"

interface ProctoringInterfaceProps {
  candidateData: {
    name: string
    position: string
    email: string
  }
  onComplete: (sessionData: any) => void
}

export function ProctoringInterface({ candidateData, onComplete }: ProctoringInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [violations, setViolations] = useState<any[]>([])
  const [currentStatus, setCurrentStatus] = useState<"good" | "warning" | "violation">("good")
  const [detectionLogs, setDetectionLogs] = useState<any[]>([])
  const [integrityScore, setIntegrityScore] = useState(100)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Simulated detection states
  const [faceDetected, setFaceDetected] = useState(true)
  const [lookingAway, setLookingAway] = useState(false)
  const [objectsDetected, setObjectsDetected] = useState<string[]>([])

  useEffect(() => {
    startCamera()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1)
        simulateDetection()
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const simulateDetection = () => {
    // Simulate random detection events for demo
    const random = Math.random()

    if (random < 0.05) {
      // 5% chance of face not detected
      setFaceDetected(false)
      addViolation("No face detected", "high")
      setTimeout(() => setFaceDetected(true), 3000)
    }

    if (random > 0.95) {
      // 5% chance of looking away
      setLookingAway(true)
      addViolation("Looking away from screen", "medium")
      setTimeout(() => setLookingAway(false), 2000)
    }

    if (random > 0.98) {
      // 2% chance of object detection
      const objects = ["phone", "book", "notes"]
      const detectedObject = objects[Math.floor(Math.random() * objects.length)]
      setObjectsDetected([detectedObject])
      addViolation(`Unauthorized object detected: ${detectedObject}`, "high")
      setTimeout(() => setObjectsDetected([]), 5000)
    }
  }

  const addViolation = (description: string, severity: "low" | "medium" | "high") => {
    const violation = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      description,
      severity,
      sessionTime,
    }

    setViolations((prev) => [...prev, violation])
    setDetectionLogs((prev) => [...prev, violation])

    // Update integrity score
    const scoreDeduction = severity === "high" ? 10 : severity === "medium" ? 5 : 2
    setIntegrityScore((prev) => Math.max(0, prev - scoreDeduction))

    // Update current status
    setCurrentStatus(severity === "high" ? "violation" : "warning")
    setTimeout(() => setCurrentStatus("good"), 3000)
  }

  const startRecording = () => {
    setIsRecording(true)
    addDetectionLog("Session started", "info")
  }

  const stopRecording = () => {
    setIsRecording(false)
    const sessionData = {
      duration: sessionTime,
      violations,
      detectionLogs,
      integrityScore,
      timestamp: new Date().toISOString(),
    }
    onComplete(sessionData)
  }

  const addDetectionLog = (message: string, type: "info" | "warning" | "error") => {
    const log = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message,
      type,
      sessionTime,
    }
    setDetectionLogs((prev) => [...prev, log])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = () => {
    switch (currentStatus) {
      case "good":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "violation":
        return "text-red-400"
      default:
        return "text-green-400"
    }
  }

  const getStatusIcon = () => {
    switch (currentStatus) {
      case "good":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case "violation":
        return <AlertTriangle className="h-5 w-5 text-red-400" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-400" />
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">{candidateData.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">{candidateData.position}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-mono text-foreground">{formatTime(sessionTime)}</span>
            </div>
            <Badge variant={integrityScore > 80 ? "default" : integrityScore > 60 ? "secondary" : "destructive"}>
              Integrity: {integrityScore}%
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Video className="h-5 w-5 text-primary mr-2" />
                    Live Video Feed
                  </span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon()}
                    <span className={`text-sm font-medium ${getStatusColor()}`}>
                      {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <video ref={videoRef} autoPlay muted className="w-full h-96 bg-muted rounded-lg object-cover" />
                  {isRecording && (
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>RECORDING</span>
                      </div>
                    </div>
                  )}

                  {/* Detection Overlays */}
                  {!faceDetected && (
                    <div className="absolute inset-0 bg-red-500/20 border-2 border-red-500 rounded-lg flex items-center justify-center">
                      <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
                        <EyeOff className="h-5 w-5 inline mr-2" />
                        No Face Detected
                      </div>
                    </div>
                  )}

                  {lookingAway && (
                    <div className="absolute top-4 right-4 bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm">
                      Looking Away
                    </div>
                  )}

                  {objectsDetected.length > 0 && (
                    <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
                      Object Detected: {objectsDetected.join(", ")}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center space-x-4 mt-4">
                  {!isRecording ? (
                    <Button onClick={startRecording} className="bg-primary hover:bg-primary/90">
                      <Video className="h-4 w-4 mr-2" />
                      Start Assessment
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} variant="destructive">
                      <VideoOff className="h-4 w-4 mr-2" />
                      End Assessment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monitoring Panel */}
          <div className="space-y-6">
            {/* Detection Status */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Detection Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Face Detection</span>
                  <Badge variant={faceDetected ? "default" : "destructive"}>
                    {faceDetected ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Eye Tracking</span>
                  <Badge variant={!lookingAway ? "default" : "secondary"}>
                    {!lookingAway ? "Focused" : "Distracted"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Object Detection</span>
                  <Badge variant={objectsDetected.length === 0 ? "default" : "destructive"}>
                    {objectsDetected.length === 0 ? "Clear" : "Objects Found"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Integrity Score */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Integrity Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Score</span>
                    <span className="font-medium text-foreground">{integrityScore}%</span>
                  </div>
                  <Progress value={integrityScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Violations */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {violations
                    .slice(-5)
                    .reverse()
                    .map((violation) => (
                      <Alert key={violation.id} className="py-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          <div className="flex justify-between items-start">
                            <span>{violation.description}</span>
                            <Badge
                              variant={violation.severity === "high" ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {violation.severity}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground mt-1">{formatTime(violation.sessionTime)}</div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  {violations.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No violations detected</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
