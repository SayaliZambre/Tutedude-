// Backend API for AI detection services
// This would typically connect to computer vision APIs

export interface DetectionResult {
  faceDetected: boolean
  eyeGaze: "focused" | "looking_away" | "unknown"
  objectsDetected: string[]
  multipleFaces: boolean
  confidence: number
}

export interface ViolationLog {
  id: string
  timestamp: string
  type: "face_not_detected" | "looking_away" | "multiple_faces" | "unauthorized_object"
  description: string
  severity: "low" | "medium" | "high"
  confidence: number
  sessionTime: number
}

export class DetectionService {
  private violations: ViolationLog[] = []
  private sessionStartTime: number = Date.now()

  // Simulate AI detection - in real implementation, this would call actual AI services
  async analyzeFrame(imageData: ImageData): Promise<DetectionResult> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Mock detection results - replace with actual AI service calls
    const mockResult: DetectionResult = {
      faceDetected: Math.random() > 0.05, // 95% chance face detected
      eyeGaze: Math.random() > 0.1 ? "focused" : "looking_away", // 90% focused
      objectsDetected: Math.random() > 0.98 ? ["phone"] : [], // 2% chance object detected
      multipleFaces: Math.random() > 0.99, // 1% chance multiple faces
      confidence: 0.85 + Math.random() * 0.15, // 85-100% confidence
    }

    // Log violations
    this.processDetectionResult(mockResult)

    return mockResult
  }

  private processDetectionResult(result: DetectionResult) {
    const currentTime = Date.now()
    const sessionTime = Math.floor((currentTime - this.sessionStartTime) / 1000)

    if (!result.faceDetected) {
      this.addViolation({
        type: "face_not_detected",
        description: "No face detected in frame",
        severity: "high",
        confidence: result.confidence,
        sessionTime,
      })
    }

    if (result.eyeGaze === "looking_away") {
      this.addViolation({
        type: "looking_away",
        description: "Candidate looking away from screen",
        severity: "medium",
        confidence: result.confidence,
        sessionTime,
      })
    }

    if (result.multipleFaces) {
      this.addViolation({
        type: "multiple_faces",
        description: "Multiple faces detected",
        severity: "high",
        confidence: result.confidence,
        sessionTime,
      })
    }

    if (result.objectsDetected.length > 0) {
      result.objectsDetected.forEach((object) => {
        this.addViolation({
          type: "unauthorized_object",
          description: `Unauthorized object detected: ${object}`,
          severity: "high",
          confidence: result.confidence,
          sessionTime,
        })
      })
    }
  }

  private addViolation(violation: Omit<ViolationLog, "id" | "timestamp">) {
    const newViolation: ViolationLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      ...violation,
    }
    this.violations.push(newViolation)
  }

  getViolations(): ViolationLog[] {
    return [...this.violations]
  }

  calculateIntegrityScore(): number {
    let score = 100

    this.violations.forEach((violation) => {
      switch (violation.severity) {
        case "high":
          score -= 10
          break
        case "medium":
          score -= 5
          break
        case "low":
          score -= 2
          break
      }
    })

    return Math.max(0, score)
  }

  reset() {
    this.violations = []
    this.sessionStartTime = Date.now()
  }
}

// Export singleton instance
export const detectionService = new DetectionService()
