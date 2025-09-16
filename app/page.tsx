"use client"

import { useState } from "react"
import { CandidateForm } from "@/components/frontend/candidate-form"
import { ProctoringInterface } from "@/components/frontend/proctoring-interface"
import { ReportViewer } from "@/components/frontend/report-viewer"
import { Chatbot } from "@/components/frontend/chatbot"

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"form" | "proctoring" | "report">("form")
  const [candidateData, setCandidateData] = useState<{
    name: string
    position: string
    email: string
  } | null>(null)
  const [sessionData, setSessionData] = useState<any>(null)

  const handleFormSubmit = (data: { name: string; position: string; email: string }) => {
    setCandidateData(data)
    setCurrentStep("proctoring")
  }

  const handleSessionComplete = (data: any) => {
    setSessionData(data)
    setCurrentStep("report")
  }

  const handleStartNew = () => {
    setCandidateData(null)
    setSessionData(null)
    setCurrentStep("form")
  }

  return (
    <main className="min-h-screen bg-background relative">
      {currentStep === "form" && <CandidateForm onSubmit={handleFormSubmit} />}

      {currentStep === "proctoring" && candidateData && (
        <ProctoringInterface candidateData={candidateData} onComplete={handleSessionComplete} />
      )}

      {currentStep === "report" && sessionData && candidateData && (
        <ReportViewer candidateData={candidateData} sessionData={sessionData} onStartNew={handleStartNew} />
      )}

      <Chatbot />
    </main>
  )
}
