from app.database import engine
from sqlalchemy import text

ddl_statements = [
    """
    CREATE TABLE IF NOT EXISTS risk_assessments (
        id VARCHAR PRIMARY KEY,
        bidder_id VARCHAR,
        bid_id VARCHAR,
        vendor_name VARCHAR,
        integrity_score FLOAT DEFAULT 100.0,
        risk_level VARCHAR DEFAULT 'LOW',
        debarment_status VARCHAR DEFAULT 'NO_RECORD_FOUND',
        violations_count INTEGER DEFAULT 0,
        litigation_status VARCHAR DEFAULT 'NONE',
        performance_rating FLOAT DEFAULT 90.0,
        early_warnings_count INTEGER DEFAULT 0,
        scoring_breakdown_json JSON,
        audit_signature VARCHAR,
        evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS risk_signals (
        id VARCHAR PRIMARY KEY,
        bidder_id VARCHAR,
        bid_id VARCHAR,
        category VARCHAR,
        severity VARCHAR DEFAULT 'LOW',
        title VARCHAR,
        description TEXT,
        status VARCHAR DEFAULT 'UNKNOWN',
        source VARCHAR,
        source_type VARCHAR DEFAULT 'VERIFIED',
        source_reference VARCHAR,
        evidence TEXT,
        record_date VARCHAR,
        retrieved_at VARCHAR,
        confidence VARCHAR DEFAULT 'HIGH',
        is_authoritative BOOLEAN DEFAULT TRUE,
        review_status VARCHAR DEFAULT 'PENDING_REVIEW',
        review_notes TEXT,
        reviewed_by VARCHAR,
        reviewed_at VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS early_warnings (
        id VARCHAR PRIMARY KEY,
        bidder_id VARCHAR,
        bid_id VARCHAR,
        risk_signal_id VARCHAR,
        severity VARCHAR DEFAULT 'HIGH',
        title VARCHAR,
        risk_summary TEXT,
        source_authority VARCHAR,
        evidence_reference VARCHAR,
        recommended_action TEXT,
        is_acknowledged BOOLEAN DEFAULT FALSE,
        acknowledged_by VARCHAR,
        acknowledged_at VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    "CREATE INDEX IF NOT EXISTS ix_risk_assessments_bidder_id ON risk_assessments (bidder_id);",
    "CREATE INDEX IF NOT EXISTS ix_risk_signals_bidder_id ON risk_signals (bidder_id);",
    "CREATE INDEX IF NOT EXISTS ix_early_warnings_bidder_id ON early_warnings (bidder_id);",
    "ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;",
    "ALTER TABLE public.risk_signals ENABLE ROW LEVEL SECURITY;",
    "ALTER TABLE public.early_warnings ENABLE ROW LEVEL SECURITY;",
    "DROP POLICY IF EXISTS p_select_all ON public.risk_assessments;",
    "CREATE POLICY p_select_all ON public.risk_assessments FOR SELECT USING (true);",
    "DROP POLICY IF EXISTS p_modify_all ON public.risk_assessments;",
    "CREATE POLICY p_modify_all ON public.risk_assessments FOR ALL USING (true) WITH CHECK (true);",
    "DROP POLICY IF EXISTS p_select_all ON public.risk_signals;",
    "CREATE POLICY p_select_all ON public.risk_signals FOR SELECT USING (true);",
    "DROP POLICY IF EXISTS p_modify_all ON public.risk_signals;",
    "CREATE POLICY p_modify_all ON public.risk_signals FOR ALL USING (true) WITH CHECK (true);",
    "DROP POLICY IF EXISTS p_select_all ON public.early_warnings;",
    "CREATE POLICY p_select_all ON public.early_warnings FOR SELECT USING (true);",
    "DROP POLICY IF EXISTS p_modify_all ON public.early_warnings;",
    "CREATE POLICY p_modify_all ON public.early_warnings FOR ALL USING (true) WITH CHECK (true);"
]

def main():
    print("Applying DDL & RLS to risk tables...")
    for stmt in ddl_statements:
        try:
            with engine.connect() as conn:
                conn.execute(text(stmt))
                conn.commit()
        except Exception as e:
            print(f"Notice during statement: {e}")

    print("\nVerifying updated RLS status:")
    with engine.connect() as conn:
        res = conn.execute(text("""
            SELECT tablename, rowsecurity 
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename;
        """)).fetchall()
        for r in res:
            print(f"  {r[0]}: RLS Enabled = {r[1]}")

if __name__ == "__main__":
    main()
