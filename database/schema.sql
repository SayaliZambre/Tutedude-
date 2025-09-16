-- SQL Schema for Video Proctoring System
-- This would be used if implementing with a real database

-- Candidates table
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    position VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER DEFAULT 0, -- in seconds
    integrity_score INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'terminated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Violations table
CREATE TABLE violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    session_time INTEGER NOT NULL, -- time in seconds from session start
    confidence DECIMAL(3,2), -- AI confidence score
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detection logs table
CREATE TABLE detection_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'warning', 'error')),
    session_time INTEGER NOT NULL, -- time in seconds from session start
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    report_data JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    report_type VARCHAR(20) DEFAULT 'standard' CHECK (report_type IN ('standard', 'detailed', 'summary'))
);

-- Indexes for better performance
CREATE INDEX idx_sessions_candidate_id ON sessions(candidate_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_violations_session_id ON violations(session_id);
CREATE INDEX idx_violations_severity ON violations(severity);
CREATE INDEX idx_detection_logs_session_id ON detection_logs(session_id);
CREATE INDEX idx_reports_session_id ON reports(session_id);
CREATE INDEX idx_reports_candidate_id ON reports(candidate_id);

-- Views for common queries
CREATE VIEW session_summary AS
SELECT 
    s.id,
    s.candidate_id,
    c.name as candidate_name,
    c.email as candidate_email,
    c.position as candidate_position,
    s.start_time,
    s.end_time,
    s.duration,
    s.integrity_score,
    s.status,
    COUNT(v.id) as violation_count,
    COUNT(CASE WHEN v.severity = 'high' THEN 1 END) as high_violations,
    COUNT(CASE WHEN v.severity = 'medium' THEN 1 END) as medium_violations,
    COUNT(CASE WHEN v.severity = 'low' THEN 1 END) as low_violations
FROM sessions s
JOIN candidates c ON s.candidate_id = c.id
LEFT JOIN violations v ON s.id = v.session_id
GROUP BY s.id, c.id;

-- Functions for integrity score calculation
CREATE OR REPLACE FUNCTION calculate_integrity_score(session_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    base_score INTEGER := 100;
    violation_record RECORD;
    final_score INTEGER;
BEGIN
    FOR violation_record IN 
        SELECT severity FROM violations WHERE session_id = session_uuid
    LOOP
        CASE violation_record.severity
            WHEN 'high' THEN base_score := base_score - 10;
            WHEN 'medium' THEN base_score := base_score - 5;
            WHEN 'low' THEN base_score := base_score - 2;
        END CASE;
    END LOOP;
    
    final_score := GREATEST(0, base_score);
    
    -- Update the session with calculated score
    UPDATE sessions SET integrity_score = final_score WHERE id = session_uuid;
    
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update integrity score
CREATE OR REPLACE FUNCTION update_integrity_score_trigger()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM calculate_integrity_score(NEW.session_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER violation_integrity_update
    AFTER INSERT ON violations
    FOR EACH ROW
    EXECUTE FUNCTION update_integrity_score_trigger();
