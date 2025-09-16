"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Video, FileText, CheckCircle } from "lucide-react"

interface CandidateFormProps {
  onSubmit: (data: { name: string; position: string; email: string }) => void
}

export function CandidateForm({ onSubmit }: CandidateFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.position || !formData.email) return

    setIsSubmitting(true)
    // Simulate form processing
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSubmit(formData)
  }

  const positions = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "DevOps Engineer",
    "QA Engineer",
    "Business Analyst",
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">SecureProctor</h1>
          </div>
          <p className="text-xl text-muted-foreground">AI-Powered Video Proctoring System</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Registration Form */}
          <Card className="border-border/50 shadow-2xl animate-slide-up">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">Candidate Registration</CardTitle>
              <CardDescription className="text-muted-foreground">
                Please provide your details to begin the proctored assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position" className="text-foreground">
                    Position Applied For
                  </Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => setFormData({ ...formData, position: value })}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select the position you're applying for" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {positions.map((position) => (
                        <SelectItem key={position} value={position} className="text-popover-foreground">
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isSubmitting || !formData.name || !formData.position || !formData.email}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Start Proctored Assessment"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Information Panel */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center">
                  <Video className="h-5 w-5 text-primary mr-2" />
                  Assessment Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Real-time Monitoring</h4>
                    <p className="text-sm text-muted-foreground">AI-powered face detection and focus tracking</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Object Detection</h4>
                    <p className="text-sm text-muted-foreground">Automatic detection of unauthorized materials</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Integrity Scoring</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive assessment integrity analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center">
                  <FileText className="h-5 w-5 text-primary mr-2" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Stable internet connection</p>
                <p>• Working webcam and microphone</p>
                <p>• Well-lit, quiet environment</p>
                <p>• Chrome or Firefox browser</p>
                <p>• No unauthorized materials nearby</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
