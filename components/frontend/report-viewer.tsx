"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, Clock, AlertTriangle, CheckCircle, User, BarChart3 } from "lucide-react"

interface ReportViewerProps {
  candidateData: {
    name: string
    position: string
    email: string
  }
  sessionData: {
    duration: number
    violations: any[]
    detectionLogs: any[]
    integrityScore: number
    timestamp: string
  }
  onStartNew: () => void
}

export function ReportViewer({ candidateData, sessionData, onStartNew }: ReportViewerProps) {
  const [reportFormat, setReportFormat] = useState<"text" | "pdf">("text")

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const generateTextReport = () => {
    const report = `
PROCTORING ASSESSMENT REPORT
============================

CANDIDATE INFORMATION
--------------------
Name: ${candidateData.name}
Position: ${candidateData.position}
Email: ${candidateData.email}
Assessment Date: ${formatDate(sessionData.timestamp)}

SESSION SUMMARY
--------------
Duration: ${formatTime(sessionData.duration)}
Integrity Score: ${sessionData.integrityScore}%
Total Violations: ${sessionData.violations.length}

VIOLATION DETAILS
----------------
${
  sessionData.violations.length > 0
    ? sessionData.violations
        .map((v, i) => `${i + 1}. [${formatTime(v.sessionTime)}] ${v.description} (${v.severity.toUpperCase()})`)
        .join("\n")
    : "No violations detected during the assessment."
}

DETECTION LOG
------------
${sessionData.detectionLogs.map((log, i) => `${i + 1}. [${formatTime(log.sessionTime)}] ${log.message}`).join("\n")}

ASSESSMENT CONCLUSION
-------------------
${
  sessionData.integrityScore >= 80
    ? "The candidate demonstrated high integrity throughout the assessment."
    : sessionData.integrityScore >= 60
      ? "The candidate showed moderate integrity with some concerns noted."
      : "The candidate's assessment raised significant integrity concerns."
}

Report generated on: ${new Date().toLocaleString()}
System: SecureProctor v1.0
    `.trim()

    return report
  }

  const downloadReport = () => {
    const report = generateTextReport()
    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `proctoring-report-${candidateData.name.replace(/\s+/g, "-")}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Assessment Report</h1>
            <p className="text-muted-foreground">Generated on {formatDate(sessionData.timestamp)}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={downloadReport} className="bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button onClick={onStartNew} variant="outline">
              Start New Assessment
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Report */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Information */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 text-primary mr-2" />
                  Candidate Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Full Name</label>
                    <p className="text-foreground font-medium">{candidateData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="text-foreground font-medium">{candidateData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Position</label>
                    <p className="text-foreground font-medium">{candidateData.position}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Assessment Date</label>
                    <p className="text-foreground font-medium">{formatDate(sessionData.timestamp)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Summary */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-primary mr-2" />
                  Session Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{formatTime(sessionData.duration)}</p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <AlertTriangle className="h-8 w-8 text-yellow-400" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{sessionData.violations.length}</p>
                    <p className="text-sm text-muted-foreground">Violations</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <p className={`text-2xl font-bold ${getScoreColor(sessionData.integrityScore)}`}>
                      {sessionData.integrityScore}%
                    </p>
                    <p className="text-sm text-muted-foreground">Integrity Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Violations Detail */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-primary mr-2" />
                  Violation Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessionData.violations.length > 0 ? (
                  <div className="space-y-4">
                    {sessionData.violations.map((violation, index) => (
                      <div key={violation.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">Violation #{index + 1}</span>
                          <Badge variant={violation.severity === "high" ? "destructive" : "secondary"}>
                            {violation.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{violation.description}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          Time: {formatTime(violation.sessionTime)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-foreground font-medium">No violations detected</p>
                    <p className="text-muted-foreground">
                      The candidate maintained integrity throughout the assessment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Text Report Preview */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 text-primary mr-2" />
                  Report Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-muted-foreground bg-muted p-4 rounded-lg overflow-auto max-h-96 whitespace-pre-wrap">
                  {generateTextReport()}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overall Assessment */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Overall Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge variant={getScoreBadgeVariant(sessionData.integrityScore)} className="text-lg px-4 py-2">
                    {sessionData.integrityScore >= 80
                      ? "PASSED"
                      : sessionData.integrityScore >= 60
                        ? "REVIEW"
                        : "FAILED"}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Integrity Score:</span>
                    <span className={`font-medium ${getScoreColor(sessionData.integrityScore)}`}>
                      {sessionData.integrityScore}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assessment Time:</span>
                    <span className="text-foreground">{formatTime(sessionData.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Violations:</span>
                    <span className="text-foreground">{sessionData.violations.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {sessionData.integrityScore >= 80 ? (
                  <>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                      <span className="text-muted-foreground">Candidate demonstrated high integrity</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                      <span className="text-muted-foreground">Suitable for next interview round</span>
                    </div>
                  </>
                ) : sessionData.integrityScore >= 60 ? (
                  <>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                      <span className="text-muted-foreground">Review violations before proceeding</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                      <span className="text-muted-foreground">Consider additional assessment</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                      <span className="text-muted-foreground">Multiple integrity violations detected</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                      <span className="text-muted-foreground">Recommend rejection or re-assessment</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={downloadReport} className="w-full bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Download as TXT
                </Button>
                <Button onClick={() => window.print()} variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
