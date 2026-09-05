/**
 * PARAKH AI - API Client
 * Facilitates asynchronous interaction with FastAPI backend.
 */

const API_BASE = '/api';

const api = {
  // Authentication
  async login(username, password, role = 'officer') {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    if (!res.ok) throw new Error('Login failed');
    return await res.json();
  },

  // Dashboard Stats
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to load dashboard metrics');
    return await res.json();
  },

  // Bids List
  async getBids(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.risk && params.risk !== 'All') query.append('risk', params.risk);
    if (params.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/bids?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load bids list');
    return await res.json();
  },

  // Bid Detail
  async getBidDetail(bidId) {
    const res = await fetch(`${API_BASE}/bids/${bidId}`);
    if (!res.ok) throw new Error(`Failed to load bid ${bidId}`);
    return await res.json();
  },

  // Analyze Bid (AI OCR + Deterministic Evaluation)
  async analyzeBid(bidId) {
    const res = await fetch(`${API_BASE}/bids/${bidId}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`Analysis failed for bid ${bidId}`);
    return await res.json();
  },

  // Evidence Mapping
  async getEvidenceMapping(bidId) {
    const res = await fetch(`${API_BASE}/bids/${bidId}/evidence-mapping`);
    if (!res.ok) throw new Error(`Failed to load evidence mapping for ${bidId}`);
    return await res.json();
  },

  // Trigger Multi-Source Verification
  async verifyBid(bidId) {
    const res = await fetch(`${API_BASE}/bids/${bidId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`Verification failed for ${bidId}`);
    return await res.json();
  },

  // Submit Officer Decision
  async submitOfficerDecision(bidId, decisionData) {
    const res = await fetch(`${API_BASE}/bids/${bidId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(decisionData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to submit officer decision');
    }
    return await res.json();
  },

  // Audit Trail
  async getAuditTrail(bidId = null) {
    const url = bidId ? `${API_BASE}/audit-trail?bid_id=${bidId}` : `${API_BASE}/audit-trail`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load audit trail');
    return await res.json();
  },

  // Connectors
  async getConnectors() {
    const res = await fetch(`${API_BASE}/connectors`);
    if (!res.ok) throw new Error('Failed to load connectors');
    return await res.json();
  },

  // Test Connector
  async testConnector(connectorId) {
    const res = await fetch(`${API_BASE}/connectors/${connectorId}/test`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Failed to test connector ${connectorId}`);
    return await res.json();
  },

  // Reset Single Bid to pristine demo state
  async resetBid(bidId) {
    const res = await fetch(`${API_BASE}/bids/${bidId}/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset bid state');
    return await res.json();
  },

  // Reset entire Demo DB
  async resetDemo() {
    const res = await fetch(`${API_BASE}/demo/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset demo dataset');
    return await res.json();
  },

  // Supabase & Authentication
  async getSupabaseConfig() {
    const res = await fetch(`${API_BASE}/auth/supabase-config`);
    if (!res.ok) throw new Error('Failed to load auth config');
    return await res.json();
  },

  async sendOtp(destination, channel = 'email') {
    const res = await fetch(`${API_BASE}/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, channel })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to dispatch OTP');
    }
    return await res.json();
  },

  async verifyOtp(destination, otp_code, channel = 'email') {
    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, otp_code, channel })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Invalid or expired OTP code');
    }
    return await res.json();
  },

  async completeOnboarding(onboardingData) {
    const res = await fetch(`${API_BASE}/auth/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(onboardingData)
    });
    if (!res.ok) throw new Error('Failed to save profile onboarding');
    return await res.json();
  },

  // Face Verification (Replaces Aadhaar)
  async verifyFace(data) {
    const res = await fetch(`${API_BASE}/kyc/face-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Face verification failed');
    }
    return await res.json();
  },

  // Organization Verification (CIN & MCA21)
  async verifyOrganization(data) {
    const res = await fetch(`${API_BASE}/kyc/org-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Organization verification failed');
    }
    return await res.json();
  },

  // Expiry & Validity Monitor (USP 3)
  async getBidExpiry(bidId, alertDays = 60) {
    const res = await fetch(`${API_BASE}/bids/${bidId}/expiry?alert_days=${alertDays}`);
    if (!res.ok) throw new Error(`Failed to load expiry records for bid ${bidId}`);
    return await res.json();
  },

  // CrossCheck & Discrepancy Detection (USP 4)
  async getBidCrossCheck(bidId) {
    const res = await fetch(`${API_BASE}/bids/${bidId}/crosscheck`);
    if (!res.ok) throw new Error(`Failed to load crosscheck findings for bid ${bidId}`);
    return await res.json();
  },

  // SmartBid (USP 6)
  async getBidSmartBid(bidId) {
    const res = await fetch(`${API_BASE}/bids/${bidId}/smartbid`);
    if (!res.ok) throw new Error(`Failed to load SmartBid evaluation for ${bidId}`);
    return await res.json();
  },

  async compareSmartBid() {
    const res = await fetch(`${API_BASE}/bids/smartbid/compare`);
    if (!res.ok) throw new Error('Failed to load SmartBid multi-perspective comparison');
    return await res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) throw new Error('Failed to load notifications');
    return await res.json();
  }
};

window.api = api;

