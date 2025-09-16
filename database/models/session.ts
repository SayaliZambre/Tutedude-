// Database models for session data (using local storage instead of actual database)

export interface SessionModel {
  id: string
  candidateId: string
  startTime: string
  endTime?: string
  duration: number
  integrityScore: number
  status: "active" | "completed" | "terminated"
  violations: ViolationModel[]
  detectionLogs: DetectionLogModel[]
}

export interface ViolationModel {
  id: string
  sessionId: string
  timestamp: string
  type: string
  description: string
  severity: "low" | "medium" | "high"
  sessionTime: number
}

export interface DetectionLogModel {
  id: string
  sessionId: string
  timestamp: string
  message: string
  type: "info" | "warning" | "error"
  sessionTime: number
}

export interface CandidateModel {
  id: string
  name: string
  email: string
  position: string
  createdAt: string
}

// Local storage-based database service
export class LocalDatabase {
  private readonly SESSIONS_KEY = "proctoring_sessions"
  private readonly CANDIDATES_KEY = "proctoring_candidates"

  // Session methods
  createSession(candidateId: string): SessionModel {
    const session: SessionModel = {
      id: this.generateId(),
      candidateId,
      startTime: new Date().toISOString(),
      duration: 0,
      integrityScore: 100,
      status: "active",
      violations: [],
      detectionLogs: [],
    }

    const sessions = this.getSessions()
    sessions.push(session)
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions))

    return session
  }

  updateSession(sessionId: string, updates: Partial<SessionModel>): SessionModel | null {
    const sessions = this.getSessions()
    const sessionIndex = sessions.findIndex((s) => s.id === sessionId)

    if (sessionIndex === -1) return null

    sessions[sessionIndex] = { ...sessions[sessionIndex], ...updates }
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions))

    return sessions[sessionIndex]
  }

  getSession(sessionId: string): SessionModel | null {
    const sessions = this.getSessions()
    return sessions.find((s) => s.id === sessionId) || null
  }

  getSessions(): SessionModel[] {
    const stored = localStorage.getItem(this.SESSIONS_KEY)
    return stored ? JSON.parse(stored) : []
  }

  // Candidate methods
  createCandidate(data: Omit<CandidateModel, "id" | "createdAt">): CandidateModel {
    const candidate: CandidateModel = {
      id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
    }

    const candidates = this.getCandidates()
    candidates.push(candidate)
    localStorage.setItem(this.CANDIDATES_KEY, JSON.stringify(candidates))

    return candidate
  }

  getCandidate(candidateId: string): CandidateModel | null {
    const candidates = this.getCandidates()
    return candidates.find((c) => c.id === candidateId) || null
  }

  getCandidates(): CandidateModel[] {
    const stored = localStorage.getItem(this.CANDIDATES_KEY)
    return stored ? JSON.parse(stored) : []
  }

  // Violation methods
  addViolation(sessionId: string, violation: Omit<ViolationModel, "id" | "sessionId">): void {
    const sessions = this.getSessions()
    const sessionIndex = sessions.findIndex((s) => s.id === sessionId)

    if (sessionIndex === -1) return

    const newViolation: ViolationModel = {
      id: this.generateId(),
      sessionId,
      ...violation,
    }

    sessions[sessionIndex].violations.push(newViolation)
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions))
  }

  // Detection log methods
  addDetectionLog(sessionId: string, log: Omit<DetectionLogModel, "id" | "sessionId">): void {
    const sessions = this.getSessions()
    const sessionIndex = sessions.findIndex((s) => s.id === sessionId)

    if (sessionIndex === -1) return

    const newLog: DetectionLogModel = {
      id: this.generateId(),
      sessionId,
      ...log,
    }

    sessions[sessionIndex].detectionLogs.push(newLog)
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions))
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
  }

  clearAllData(): void {
    localStorage.removeItem(this.SESSIONS_KEY)
    localStorage.removeItem(this.CANDIDATES_KEY)
  }

  exportData(): { sessions: SessionModel[]; candidates: CandidateModel[] } {
    return {
      sessions: this.getSessions(),
      candidates: this.getCandidates(),
    }
  }
}

// Export singleton instance
export const localDB = new LocalDatabase()
