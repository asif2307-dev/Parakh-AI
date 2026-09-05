from app.database import engine
from sqlalchemy import text

tables = [
    'users',
    'audit_logs',
    'tenders',
    'requirements',
    'bids',
    'documents',
    'profiles',
    'face_verifications',
    'organization_verifications',
    'smartbid_evaluations',
    'notifications'
]

def main():
    print("Connecting to Supabase PostgreSQL...")
    with engine.begin() as conn:
        for t in tables:
            print(f"Enabling Row Level Security (RLS) on {t}...")
            conn.execute(text(f"ALTER TABLE public.{t} ENABLE ROW LEVEL SECURITY;"))
            
            # Clean up previous policies if present
            conn.execute(text(f"DROP POLICY IF EXISTS p_select_all ON public.{t};"))
            conn.execute(text(f"DROP POLICY IF EXISTS p_modify_all ON public.{t};"))
            
            # Create policies:
            # 1. Allow SELECT to anon, authenticated, service_role
            conn.execute(text(f"CREATE POLICY p_select_all ON public.{t} FOR SELECT USING (true);"))
            
            # 2. Allow ALL (INSERT, UPDATE, DELETE) to authenticated, anon, service_role
            conn.execute(text(f"CREATE POLICY p_modify_all ON public.{t} FOR ALL USING (true) WITH CHECK (true);"))

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
