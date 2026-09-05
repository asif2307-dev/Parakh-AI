/**
 * ==============================================================================
 * PARAKH AI — Ministry of Petroleum & Natural Gas, Government of India
 * Hydrocarbon Telemetry & Statutory Compliance Scrutiny System
 * Frontend Architecture (Vanilla JavaScript, 2012–2018 Enterprise Portal Standard)
 * ==============================================================================
 */

(function () {
  'use strict';

  // --- 1. Realistic Seed Database: Ministry of Petroleum & Natural Gas Datasets ---
  const MOPNG_SEED_RECORDS = [
    {
      id: "REC-2026-8841",
      category: "Natural Gas Grid",
      psu: "GAIL",
      facility: "HVJ Trunk Pipeline Sector 4B (Hazira-Vijaipur)",
      dataSource: "SCADA Mass-Flow & Pressure Sensor Matrix",
      status: "Under Scrutiny",
      riskLevel: "Medium",
      aiResult: "Flow Mismatch (4.8% divergence vs 1.2% limit)",
      date: "2026-09-03 21:40 IST",
      telemetry: {
        inflow: "14.22 MMSCMD",
        outflow: "13.54 MMSCMD",
        pressureDrop: "4.2 bar (Expected: 2.1 bar)",
        sulphurContent: "0.8 ppm (Safe)",
        valveStation: "VS-14 to VS-16",
        anomaliesDetected: 2,
        sensorIntegrity: "Verified (SCADA-RTU-09)"
      },
      parameter: "Mass Flow Balance",
      observedValue: "13.54 MMSCMD",
      expectedRange: "14.05 – 14.30 MMSCMD",
      deviation: "-4.8% divergence",
      indicators: [
        "Inlet telemetry at Hazira compressor station deviates from downstream Jagdishpur terminal meter by 4.8% (statutory PNGRB limit <= 1.2%).",
        "SCADA pressure curve exhibits localized depression between Valve Station VS-14 and VS-16 without off-take logged in daily manifest.",
        "Gas chromatograph density sample indicates minor thermal variance compared to Hazira refinery quality certificate."
      ],
      recommendation: "Immediate physical ultrasonic valve inspection at Valve Station VS-14 recommended before subsequent transmission batch."
    },
    {
      id: "REC-2026-9022",
      category: "Crude Refining",
      psu: "IOCL",
      facility: "Paradip Refinery Terminal B (BS-VI Diesel Despatch)",
      dataSource: "Refinery Lab Cert & Custody Transfer Manifest",
      status: "Flagged",
      riskLevel: "High",
      aiResult: "Sulphur Spec Margin Exceeded (11.4 ppm vs 10.0 ppm max)",
      date: "2026-09-03 19:15 IST",
      telemetry: {
        batchNo: "PDR-BSVI-2026-B88",
        volume: "42,000 Kilolitres",
        sulphurMeasured: "11.4 ppm",
        statutoryLimit: "10.0 ppm (BIS IS 1460)",
        flashPoint: "38.5 deg C",
        cetaneNumber: "51.8",
        anomaliesDetected: 1,
        sensorIntegrity: "ASTM D2622 XRF Verified"
      },
      parameter: "Sulphur Content",
      observedValue: "11.4 ppm",
      expectedRange: "<= 10.0 ppm (BIS IS 1460)",
      deviation: "+14.0% above limit",
      indicators: [
        "Despatch batch sulphur content recorded at 11.4 ppm, exceeding mandatory BS-VI ceiling of 10.0 ppm under Environment Protection Rules.",
        "Refinery primary hydrocracker sensor log showed brief catalyst bed temperature dip 4 hours prior to blending batch sign-off.",
        "Terminal custody transfer valve released 6,200 KL into coastal pipeline before automated containment cutoff triggered."
      ],
      recommendation: "Quarantine Batch PDR-BSVI-2026-B88 at downstream Cuttack depot for mandatory re-hydrotreating and lab re-certification."
    },
    {
      id: "REC-2026-9140",
      category: "LPG Allocation",
      psu: "IOCL",
      facility: "Subsidized LPG Bottling Plant - Kanpur Rural",
      dataSource: "DBTL Pahal Allocation Ledger & Weighbridge Telemetry",
      status: "Flagged",
      riskLevel: "High",
      aiResult: "Subsidy Diversion Pattern Flagged (1,420 cylinders unaccounted)",
      date: "2026-09-03 17:30 IST",
      telemetry: {
        bottledCount: "28,400 cylinders",
        dispatchedCount: "26,980 cylinders",
        divergenceCount: "1,420 cylinders",
        subsidyValueExposed: "INR 5,68,000",
        distributorCount: "14 Agencies",
        anomaliesDetected: 3,
        sensorIntegrity: "Weighbridge Tare Automated Log"
      },
      parameter: "Subsidized Domestic Allocation",
      observedValue: "26,980 Verified Dispenses",
      expectedRange: "28,400 Reconciled Dispenses",
      deviation: "-1,420 Cylinders (5.0%)",
      indicators: [
        "1,420 subsidized domestic LPG cylinders dispatched without corresponding Aadhaar authentication tokens in PMUY database.",
        "Geographic clustering of repeat bookings within 48 hours detected across three commercial highway distributors.",
        "Weighbridge automated RFID log records truck exit timestamps inconsistent with security bay manifest."
      ],
      recommendation: "Issue immediate statutory show-cause notice to Agency UP-KNP-104 and dispatch Ministry Vigilance inspection team."
    },
    {
      id: "REC-2026-9255",
      category: "Offshore Extraction",
      psu: "ONGC",
      facility: "Mumbai High Offshore Platform B-17",
      dataSource: "Subsea Wellhead Multi-Phase Flow Telemetry",
      status: "Compliant",
      riskLevel: "Low",
      aiResult: "Telemetry Reconciled (99.4% cross-source match)",
      date: "2026-09-03 15:10 IST",
      telemetry: {
        crudeProduction: "38,200 BBL/day",
        associatedGas: "2.14 MMSCMD",
        wellheadPressure: "184 bar",
        separatorTemp: "62 deg C",
        waterCut: "14.2%",
        anomaliesDetected: 0,
        sensorIntegrity: "Dual Rosemount Coriolis calibrated 28-Aug"
      },
      parameter: "Wellhead Flow & Pressure",
      observedValue: "184 bar / 38,200 BBL",
      expectedRange: "180 – 190 bar / 37,500 – 39,000 BBL",
      deviation: "+0.6% (Nominal)",
      indicators: [
        "Wellhead multi-phase flow rates align within 0.6% tolerance against Uran coastal terminal receipt meters.",
        "Subsea choke valve pressure differential exhibits stable laminar profile over continuous 72-hour operational cycle.",
        "Zero environmental methane venting detected by coastal satellite aperture radar."
      ],
      recommendation: "Routine scheduled telemetry monitoring; next statutory underwater sensor calibration scheduled 15-Oct-2026."
    },
    {
      id: "REC-2026-9310",
      category: "Crude Refining",
      psu: "BPCL",
      facility: "Kochi Refinery Aviation Turbine Fuel (ATF) Terminal",
      dataSource: "DGCA Statutory Quality Test Certificate",
      status: "Compliant",
      riskLevel: "Low",
      aiResult: "Aviation Fuel Spec Verified (DefStan 91-091 & IS 1571)",
      date: "2026-09-03 13:45 IST",
      telemetry: {
        batchNo: "KCH-ATF-26-90",
        volume: "18,500 KL",
        flashPoint: "41.2 deg C (Min 38.0)",
        freezePoint: "-49.0 deg C (Max -47.0)",
        smokePoint: "24.5 mm (Min 18.0)",
        anomaliesDetected: 0,
        sensorIntegrity: "NABL Accredited Lab Automated Telemetry"
      },
      parameter: "Flash Point & Smoke Point",
      observedValue: "41.2 deg C / 24.5 mm",
      expectedRange: ">= 38.0 deg C / >= 18.0 mm",
      deviation: "+3.2 deg C Margin",
      indicators: [
        "All critical aviation parameters comply strictly with DGCA and MoPNG mandatory safety regulations.",
        "Pipeline custody transfer filtration delta-P within normal limits (0.42 bar).",
        "Digital signature validated against BPCL Quality Assurance Directorate."
      ],
      recommendation: "Approved for unrestricted commercial airport pipeline distribution (Cochin & Trivandrum airports)."
    },
    {
      id: "REC-2026-9420",
      category: "City Gas Distribution",
      psu: "GAIL",
      facility: "Ahmedabad City Gas Distribution (CGD) Steel Network",
      dataSource: "Pressure Regulating Skid (PRS) SCADA Stream",
      status: "Under Scrutiny",
      riskLevel: "Medium",
      aiResult: "Off-Peak Transient Pressure Surge (19.4 bar vs 16.0 bar max)",
      date: "2026-09-03 11:20 IST",
      telemetry: {
        networkZone: "Zone 3 - Vatva Industrial Area",
        inletPressure: "26.0 bar",
        regulatedOutlet: "19.4 bar (Ceiling: 16.0 bar)",
        peakFlow: "18,400 SCMH",
        reliefValveAction: "1 actuation recorded (03:14 IST)",
        anomaliesDetected: 1,
        sensorIntegrity: "PRS Telemetry Stream Online"
      },
      parameter: "Regulated Network Pressure",
      observedValue: "19.4 bar",
      expectedRange: "14.0 – 16.0 bar",
      deviation: "+21.2% Surge",
      indicators: [
        "Secondary pressure reduction slam-shut valve operated 2 times during midnight low-consumption window.",
        "Pilot diaphragm response latency delayed by 4.2 seconds beyond manufacturer safety limits.",
        "Industrial off-take customer meter logged pressure pulse spike."
      ],
      recommendation: "Dispatch emergency CGD field engineer to replace pilot regulator diaphragm at PRS-Vatva-02."
    },
    {
      id: "REC-2026-9505",
      category: "Crude Refining",
      psu: "HPCL",
      facility: "Visakhapatnam Refinery Naphtha Cracker Storage",
      dataSource: "Terminal Automated Tank Gauging (ATG) Radar",
      status: "Verified",
      riskLevel: "Low",
      aiResult: "Mass Balance Reconciled (0.3% margin)",
      date: "2026-09-03 09:50 IST",
      telemetry: {
        tankNo: "TK-402A & TK-402B",
        inventory: "45,800 MT",
        temperature: "29.4 deg C",
        vaporPressure: "0.62 bar",
        anomaliesDetected: 0,
        sensorIntegrity: "Enraf Radar Gauge Calibrated"
      },
      parameter: "ATG Radar Level & Temperature",
      observedValue: "45,800 MT / 29.4 deg C",
      expectedRange: "45,650 – 45,950 MT",
      deviation: "+0.3% (Compliant)",
      indicators: [
        "Tank inventory mass balance reconciled with marine tanker offloading manifest.",
        "No vapor recovery system alarm or volatile organic emission detected."
      ],
      recommendation: "Record verified and archived in MoPNG Monthly Hydrocarbon Ledger."
    },
    {
      id: "REC-2026-9630",
      category: "Strategic Reserves",
      psu: "ISPRL",
      facility: "Padur Underground Crude Cavern Storage",
      dataSource: "Subsurface Hydrostatic & Inflow Sensor Network",
      status: "Verified",
      riskLevel: "Low",
      aiResult: "Cavern Containment & Hydrostatic Integrity Normal",
      date: "2026-09-02 22:15 IST",
      telemetry: {
        storedCrude: "2.50 Million Metric Tonnes",
        cavernWaterCurtainPressure: "9.2 bar",
        seepageRate: "0.4 L/min (Permissible: <= 2.5 L/min)",
        dissolvedGasLevel: "Stable",
        anomaliesDetected: 0,
        sensorIntegrity: "Triple Redundant Piezometer Sensors"
      },
      parameter: "Water Curtain Pressure & Seepage",
      observedValue: "9.2 bar / 0.4 L/min",
      expectedRange: ">= 8.5 bar / <= 2.5 L/min",
      deviation: "Nominal Containment",
      indicators: [
        "Underground rock cavern water curtain containment curtain holding at designated hydrostatic gradient.",
        "Piezometric water table levels surrounding Padur facility verified within statutory parameters."
      ],
      recommendation: "Approved. Routine quarterly status report transmitted to National Security Council Secretariat."
    },
    {
      id: "REC-2026-9715",
      category: "Natural Gas Grid",
      psu: "GAIL",
      facility: "Jagdishpur-Haldia-Bokaro-Dhamra Pipeline (JHBDPL)",
      dataSource: "SCADA Pipeline Telemetry & Valve Supervisory Log",
      status: "Compliant",
      riskLevel: "Low",
      aiResult: "Throughput Reconciled (99.1% match)",
      date: "2026-09-02 18:30 IST",
      telemetry: {
        throughput: "11.2 MMSCMD",
        operatingPressure: "74 bar",
        dewPoint: "-14 deg C",
        anomaliesDetected: 0,
        sensorIntegrity: "SCADA Node JH-08 Online"
      },
      parameter: "Throughput & Operating Pressure",
      observedValue: "11.2 MMSCMD / 74 bar",
      expectedRange: "10.8 – 11.5 MMSCMD / 70 – 78 bar",
      deviation: "+0.9% (Nominal)",
      indicators: [
        "Mass balance verified across fertilizer plant off-take terminals at Gorakhpur and Sindri.",
        "All telemetry verified against dispatch schedule."
      ],
      recommendation: "Normal operations. Statutory transmission clearance granted."
    },
    {
      id: "REC-2026-9840",
      category: "Crude Refining",
      psu: "IOCL",
      facility: "Mathura Refinery Main Pipeline Offtake",
      dataSource: "Pipeline Ultrasonic In-Line Inspection (ILI) Pigging Log",
      status: "Under Scrutiny",
      riskLevel: "Medium",
      aiResult: "Pipe Wall Thinning Anomaly Detected (KM 42.8)",
      date: "2026-09-02 14:00 IST",
      telemetry: {
        inspectionTool: "Magnetic Flux Leakage (MFL) In-Line Pig",
        milepost: "KM 42.8 near Bharatpur section",
        anomalyDepth: "22% wall thickness loss (O&M Alert threshold 20%)",
        internalPressure: "58 bar",
        anomaliesDetected: 1,
        sensorIntegrity: "Rosen MFL Calibrated Run"
      },
      parameter: "ILI Metal Loss Depth",
      observedValue: "22% Wall Loss",
      expectedRange: "<= 20% (ASME B31.8S O&M Threshold)",
      deviation: "+2% Above Alert Threshold",
      indicators: [
        "In-line pigging telemetry recorded 22% localized wall loss at KM 42.8.",
        "Operating pressure lowered temporarily by 10 bar pending technical verification."
      ],
      recommendation: "Perform visual and ultrasonic direct examination within 14 business days pursuant to ASME B31.8S standard."
    }
  ];

  // --- 2. Initial Reports Repository ---
  const MOPNG_SEED_REPORTS = [
    {
      title: "Quarterly Hydrocarbon Pipeline Mass Balance Scrutiny Brief (Q2-2026)",
      code: "MOPNG/REP/2026/Q2-PIPE",
      category: "Pipeline Integrity",
      date: "2026-08-31",
      status: "Officially Signed",
      createdBy: "Shri Rajesh K. Sharma, Director",
      classification: "OFFICIAL SECRET / RESTRICTED",
      period: "Q2 FY2025-26"
    },
    {
      title: "National City Gas Distribution (CGD) Allocation Discrepancy Scrutiny",
      code: "MOPNG/REP/2026/CGD-ALLOC",
      category: "Subsidy Scrutiny",
      date: "2026-08-25",
      status: "Published to Ministry",
      createdBy: "Technical Audit Cell",
      classification: "CONFIDENTIAL",
      period: "Monthly - Aug 2026"
    },
    {
      title: "Strategic Petroleum Reserves (ISPRL) Padur Cavern Hydrostatic Audit",
      code: "MOPNG/REP/2026/ISPRL-AUD",
      category: "Storage Audits",
      date: "2026-08-18",
      status: "Officially Signed",
      createdBy: "Joint Director (Safety & Security)",
      classification: "SECRET",
      period: "Annual Verification"
    },
    {
      title: "IOCL Mathura & Paradip Refinery Sulphur Spec Compliance Verification",
      code: "MOPNG/REP/2026/SULPHUR-BSVI",
      category: "Environmental Specs",
      date: "2026-08-10",
      status: "Action Pending",
      createdBy: "Environmental Monitoring Directorate",
      classification: "OFFICIAL / INTERNAL",
      period: "Bi-Weekly Batch Audit"
    },
    {
      title: "GAIL HVJ Trunk Pipeline Pressure Variance Technical Evaluation",
      code: "MOPNG/REP/2026/HVJ-TECH-04",
      category: "Pipeline Integrity",
      date: "2026-08-04",
      status: "Officially Signed",
      createdBy: "Shri Rajesh K. Sharma, Director",
      classification: "RESTRICTED",
      period: "Incident Review"
    }
  ];

  // --- 3. Initial Operational Alerts ---
  const MOPNG_SEED_ALERTS = [
    {
      id: "ALT-2026-01",
      severity: "CRITICAL",
      facility: "IOCL Paradip Refinery",
      title: "BS-VI Diesel Sulphur Specification Violation (11.4 ppm)",
      description: "Batch PDR-BSVI-2026-B88 exceeds BIS IS 1460 ceiling of 10.0 ppm. Risk of environmental non-compliance and vehicular emissions.",
      timestamp: "03-Sep-2026 19:15 IST",
      acknowledged: false,
      refId: "REC-2026-9022",
      assignedOfficer: "Shri R. K. Sharma (Director)",
      source: "Refinery Lab NABL Feed"
    },
    {
      id: "ALT-2026-02",
      severity: "CRITICAL",
      facility: "IOCL LPG Bottling Kanpur",
      title: "Subsidized Domestic LPG Allocation Divergence (1,420 Cylinders)",
      description: "Unauthenticated batch dispatch logged without biometric Pahal tokens. Potential diversion to commercial un-metered consumers.",
      timestamp: "03-Sep-2026 17:30 IST",
      acknowledged: false,
      refId: "REC-2026-9140",
      assignedOfficer: "Shri R. K. Sharma (Director)",
      source: "DBTL Weighbridge API"
    },
    {
      id: "ALT-2026-03",
      severity: "CRITICAL",
      facility: "GAIL HVJ Trunk Sector 4B",
      title: "Mass Balance Inflow-Outflow Discrepancy > 4.5%",
      description: "Hazira vs Jagdishpur telemetry divergence exceeds PNGRB statutory tolerance of 1.2%. Pressure drop localized to VS-14.",
      timestamp: "03-Sep-2026 21:40 IST",
      acknowledged: false,
      refId: "REC-2026-8841",
      assignedOfficer: "Shri S. P. Nambiar (Chief Examiner)",
      source: "SCADA RTU Grid"
    },
    {
      id: "ALT-2026-04",
      severity: "HIGH",
      facility: "GAIL Ahmedabad CGD",
      title: "Vatva Industrial PRS Slam-Shut Valve Operating Anomaly",
      description: "Pressure reached 19.4 bar during midnight off-peak hours. Regulating pilot diaphragm response latency noted.",
      timestamp: "03-Sep-2026 11:20 IST",
      acknowledged: false,
      refId: "REC-2026-9420",
      assignedOfficer: "Shri S. P. Nambiar (Chief Examiner)",
      source: "PRS SCADA Stream"
    },
    {
      id: "ALT-2026-05",
      severity: "HIGH",
      facility: "IOCL Mathura Pipeline",
      title: "Pipe Wall Loss Anomaly at KM 42.8 (22% Depth)",
      description: "ILI Magnetic Flux Leakage pig recorded localized corrosion exceeding standard O&M 20% threshold.",
      timestamp: "02-Sep-2026 14:00 IST",
      acknowledged: false,
      refId: "REC-2026-9840",
      assignedOfficer: "Shri R. K. Sharma (Director)",
      source: "In-Line Inspection Run"
    },
    {
      id: "ALT-2026-06",
      severity: "HIGH",
      facility: "BPCL Bina Refinery",
      title: "Delayed Reconciliation for Crude Feed Despatch Manifest",
      description: "Statutory monthly feed reconciliation ledger overdue by 48 hours pursuant to Petroleum Rules.",
      timestamp: "02-Sep-2026 10:15 IST",
      acknowledged: true,
      refId: "REC-2026-9100",
      assignedOfficer: "Shri R. K. Sharma (Director)",
      source: "Ministry Portal Ingestion"
    },
    {
      id: "ALT-2026-07",
      severity: "MEDIUM",
      facility: "ONGC Uran Terminal",
      title: "Secondary Flow Meter Density Calibration Variance",
      description: "Ultrasonic density reading delta of 0.8% against fiscal custody transfer Coriolis meter.",
      timestamp: "01-Sep-2026 16:40 IST",
      acknowledged: true,
      refId: "REC-2026-9210",
      assignedOfficer: "Technical Audit Cell",
      source: "Coriolis Flow Meter"
    },
    {
      id: "ALT-2026-08",
      severity: "MEDIUM",
      facility: "HPCL Mumbai Terminal",
      title: "Vapor Recovery System (VRU) Scheduled Maintenance Due",
      description: "Compressor run-hours exceeded 4,000 hours. Scheduled preventative overhaul flagged.",
      timestamp: "01-Sep-2026 12:05 IST",
      acknowledged: true,
      refId: "REC-2026-9050",
      assignedOfficer: "Technical Audit Cell",
      source: "Automated Tank Gauging"
    },
    {
      id: "ALT-2026-09",
      severity: "LOW",
      facility: "ISPRL Mangalore Cavern",
      title: "Periodic Cavern Water Curtain Pressure Sensor Re-Zeroing",
      description: "Automated hydrostatic pressure diagnostic executed normally. All piezometer readings nominal.",
      timestamp: "01-Sep-2026 08:00 IST",
      acknowledged: true,
      refId: "REC-2026-9630",
      assignedOfficer: "Safety & Security Cell",
      source: "Piezometer Sensor Grid"
    }
  ];

  // --- 4. Initial Immutable NIC Audit Trail ---
  const MOPNG_SEED_AUDIT = [
    {
      timestamp: "03-Sep-2026 21:42:15 IST",
      user: "PARAKH AI Rule Engine v3.2",
      action: "ANOMALY_FLAGGED",
      module: "AI Compliance Scrutiny",
      recordId: "REC-2026-8841",
      prevStatus: "Under Scrutiny",
      newStatus: "Flagged",
      ipAddress: "10.24.112.44 (NIC Internal Node)",
      status: "ALERT"
    },
    {
      timestamp: "03-Sep-2026 19:20:04 IST",
      user: "NABL Lab Ingestion Service",
      action: "SPEC_VIOLATION",
      module: "Production & Despatch",
      recordId: "REC-2026-9022",
      prevStatus: "Pending Audit",
      newStatus: "Flagged",
      ipAddress: "10.24.112.18 (Paradip Ref Node)",
      status: "CRITICAL"
    },
    {
      timestamp: "03-Sep-2026 17:35:12 IST",
      user: "DBTL Pahal Cross-Verify Connector",
      action: "SUBSIDY_AUDIT",
      module: "LPG Allocation",
      recordId: "REC-2026-9140",
      prevStatus: "Under Ingestion",
      newStatus: "Flagged",
      ipAddress: "10.24.110.82 (NIC Cloud Kanpur)",
      status: "CRITICAL"
    },
    {
      timestamp: "03-Sep-2026 15:15:00 IST",
      user: "Shri Rajesh K. Sharma (Director)",
      action: "OFFICER_SIGNOFF",
      module: "Decision Support",
      recordId: "REC-2026-9255",
      prevStatus: "Under Review",
      newStatus: "Verified",
      ipAddress: "10.24.100.05 (MoPNG Shastri Bhawan)",
      status: "SUCCESS"
    },
    {
      timestamp: "03-Sep-2026 11:30:22 IST",
      user: "SCADA Telemetry Daemon",
      action: "TELEMETRY_INGEST",
      module: "Telemetry Upload",
      recordId: "REC-2026-9420",
      prevStatus: "New Batch",
      newStatus: "Under Scrutiny",
      ipAddress: "10.24.115.60 (GAIL SCADA Node)",
      status: "SUCCESS"
    }
  ];

  // --- 5. Main Application Controller ---
  class ParakhApplication {
    constructor() {
      this.currentView = 'home';
      this.records = [...MOPNG_SEED_RECORDS];
      this.filteredRecords = [...MOPNG_SEED_RECORDS];
      this.reports = [...MOPNG_SEED_REPORTS];
      this.alerts = [...MOPNG_SEED_ALERTS];
      this.auditTrail = [...MOPNG_SEED_AUDIT];
      
      this.recordsCurrentPage = 1;
      this.recordsPerPage = 10;
      this.sortField = 'id';
      this.sortOrder = 'asc';

      this.isLoggedIn = true;
      this.currentUser = {
        name: "Shri Rajesh K. Sharma",
        role: "Senior Audit Officer",
        designation: "Director (Pipeline Audit & Allocation)",
        badgeId: "MoPNG-AUD-8842",
        token: "NIC-SHA256-TOKEN-2026"
      };

      this.currentSelectedRecord = null;
      this.currentAnalysisCase = 'CASE-8841';
      this.isPipelineRunning = false;
      this.activeAlertFilter = 'ALL';
      this.currentLang = 'en';
      this.activeAdminTab = 'users';
      this.viewHistory = [];

      this.init();
    }

    init() {
      this.startLiveClock();
      this.renderDashboard();
      this.renderRecordsTable();
      this.renderReportsTable();
      this.renderAlerts();
      this.renderAuditHistory();
      this.renderComplianceChart();
      this.renderStructuredAiInsights();
      this.loadAnalysisCase('CASE-8841');
      this.refreshCaptcha();
      this.setupDropzone();

      // Listen for browser hash navigation (e.g. #dashboard, #home, #records)
      window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        if (hash && hash !== this.currentView) {
          this.switchView(hash, null, false);
        }
      });

      // Initial route from hash if specified, otherwise default to home
      const initialHash = window.location.hash.replace('#', '');
      const validViews = ['dashboard', 'bids', 'documents', 'compliance', 'crosscheck', 'risk', 'smartbid', 'reports', 'notifications', 'audit', 'settings', 'profile', 'help', 'records', 'upload', 'history'];
      if (initialHash && validViews.includes(initialHash)) {
        this.switchView(initialHash, null, false);
      } else {
        this.switchView('dashboard', null, false);
      }
    }

    // --- Clock and Accessibility ---
    startLiveClock() {
      const update = () => {
        const now = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = String(now.getDate()).padStart(2, '0');
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const str = `${day}-${month}-${year} ${hours}:${minutes}:${seconds} IST`;
        
        const clockEl = document.getElementById('liveClockDisplay');
        if (clockEl) clockEl.textContent = str;
      };
      update();
      setInterval(update, 1000);
    }

    adjustFontSize(size) {
      document.body.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg');
      if (size === 'sm') document.body.classList.add('font-size-sm');
      else if (size === 'lg') document.body.classList.add('font-size-lg');
      else document.body.classList.add('font-size-md');
    }

    toggleLanguage() {
      this.currentLang = this.currentLang === 'en' ? 'hi' : 'en';
      const ticker = document.getElementById('tickerContent');
      if (this.currentLang === 'hi') {
        if (ticker) ticker.textContent = "पीएनजीआरबी तकनीकी मानकों एवं विनियमों 2026 के अंतर्गत हाइड्रोकार्बन पाइपलाइन एवं आवंटन संवीक्षा सक्रिय। आगामी सांविधिक समाधान समयसीमा: 15-सितम्बर-2026।";
      } else {
        if (ticker) ticker.textContent = "Mandatory Hydrocarbon Pipeline & Allocation Scrutiny Active under PNGRB Technical Standards & Regulations 2026. Next statutory reconciliation deadline: 15-Sep-2026.";
      }
    }

    // --- Navigation & View Switching (Public Pillar Pages vs Operational Portal) ---
    switchView(viewName, filterPsu = null, updateHash = true, isBack = false) {
      if (!this.isLoggedIn && viewName !== 'login') {
        this.showLoginScreen();
        return;
      }

      if (!isBack && this.currentView && this.currentView !== viewName && this.currentView !== 'login') {
        if (!this.viewHistory) this.viewHistory = [];
        this.viewHistory.push(this.currentView);
        if (this.viewHistory.length > 25) this.viewHistory.shift();
      }

      this.currentView = viewName;
      if (updateHash && viewName !== 'login') {
        window.location.hash = viewName;
      }

      // Hide all view sections
      const sections = document.querySelectorAll('.view-section');
      sections.forEach(sec => sec.style.display = 'none');

      // Show selected section
      const targetSec = document.getElementById(`view-${viewName}`);
      if (targetSec) {
        targetSec.style.display = 'block';
      }

      // Control layout shell (Public Pillar Pages vs Operational Portal vs Login)
      const publicViews = ['home', 'tech', 'grid', 'compliance', 'about', 'helpdesk'];
      const loginSection = document.getElementById('institutionalLoginSection');
      const portalContainer = document.getElementById('portalContainer');
      const noticeTicker = document.getElementById('noticeTicker');
      const sidebar = document.getElementById('portalSidebar');
      const breadcrumbBar = document.getElementById('breadcrumbBar');

      if (viewName === 'login') {
        if (loginSection) loginSection.style.display = 'block';
        if (portalContainer) portalContainer.style.display = 'none';
        if (noticeTicker) noticeTicker.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
        if (breadcrumbBar) breadcrumbBar.style.display = 'none';
      } else if (publicViews.includes(viewName)) {
        if (loginSection) loginSection.style.display = 'none';
        if (portalContainer) {
          portalContainer.style.display = 'block';
          portalContainer.classList.add('home-mode');
        }
        if (noticeTicker) noticeTicker.style.display = 'block';
        if (sidebar) sidebar.style.display = 'none';
        if (breadcrumbBar) breadcrumbBar.style.display = 'none';
      } else {
        // Operational Portal Views
        if (loginSection) loginSection.style.display = 'none';
        if (portalContainer) {
          portalContainer.style.display = 'flex';
          portalContainer.classList.remove('home-mode');
        }
        if (noticeTicker) noticeTicker.style.display = 'block';
        if (sidebar) sidebar.style.display = 'flex';
        if (breadcrumbBar) breadcrumbBar.style.display = 'flex';
      }

      // Update active nav items in horizontal bar
      const navItems = document.querySelectorAll('.nav-item');
      navItems.forEach(item => {
        if (item.getAttribute('data-view') === viewName) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Update sidebar active buttons
      const sidebarBtns = document.querySelectorAll('.sidebar-link-btn');
      sidebarBtns.forEach(btn => {
        const btnView = btn.getAttribute('data-view');
        const btnPsu = btn.getAttribute('data-psu');
        if (filterPsu && btnPsu === filterPsu) {
          btn.classList.add('active');
        } else if (!filterPsu && btnView === viewName && !btnPsu) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update Breadcrumbs
      this.updateBreadcrumbs(viewName, filterPsu);

      // Handle specific view hooks
      if (viewName === 'dashboard') {
        this.renderComplianceChart();
      } else if (viewName === 'records') {
        if (filterPsu) {
          const psuSelect = document.getElementById('filterPsuSelect');
          if (psuSelect) psuSelect.value = filterPsu;
          this.applyFilters();
        } else {
          this.renderRecordsTable();
        }
      } else if (viewName === 'alerts' || viewName === 'notifications') {
        this.renderAlerts();
      } else if (viewName === 'history') {
        this.renderAuditHistory();
      } else if (viewName === 'expiry') {
        this.renderExpiryView();
      } else if (viewName === 'smartbid') {
        this.renderSmartBidView();
      } else if (viewName === 'risk') {
        this.renderIntegrityRiskView();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    goBack() {
      if (this.viewHistory && this.viewHistory.length > 0) {
        const prevView = this.viewHistory.pop();
        this.switchView(prevView, null, true, true);
      } else {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          this.switchView('dashboard', null, true, true);
        }
      }
    }

    updateBreadcrumbs(viewName, filterPsu) {
      const parentEl = document.getElementById('breadcrumbParent');
      const currentEl = document.getElementById('breadcrumbCurrent');
      const timeEl = document.getElementById('breadcrumbTime');

      const viewLabels = {
        'home': { parent: 'PARAKH AI', current: 'Home Overview' },
        'tech': { parent: 'Technology', current: 'AI Engine Architecture' },
        'grid': { parent: 'Infrastructure', current: 'National Grid & PSUs' },
        'about': { parent: 'Institution', current: 'About Ministry & Governance' },
        'helpdesk': { parent: 'Support', current: 'Helpdesk & Grievances' },
        'upload': { parent: 'Procurement Data', current: 'Bid Documents' },
        'compliance': { parent: 'Intelligence', current: 'Compliance Scrutiny' },
        'expiry': { parent: 'Intelligence', current: 'Expiry & Validity Monitor' },
        'crosscheck': { parent: 'Intelligence', current: 'Registry CrossCheck' },
        'risk': { parent: 'Intelligence', current: 'Risk Analysis' },
        'smartbid': { parent: 'Intelligence', current: 'SmartBid Compare' },
        'reports': { parent: 'Intelligence', current: 'Reports & Export' },
        'notifications': { parent: 'System', current: 'Notifications' },
        'history': { parent: 'System', current: 'Audit Trail' },
        'settings': { parent: 'System', current: 'System Settings' },
        'dashboard': { parent: 'Operational Portal', current: 'Main Dashboard (Phase 2)' },
        'login': { parent: 'Access Control', current: 'Officer Sign-In' }
      };

      const info = viewLabels[viewName] || { parent: 'Portal', current: viewName };
      if (parentEl) parentEl.innerHTML = `<a href="javascript:void(0)" onclick="parakhApp.switchView('${viewName}')">${info.parent}</a>`;
      if (currentEl) currentEl.textContent = info.current;
      if (timeEl) timeEl.textContent = 'Refreshed: ' + new Date().toLocaleTimeString('en-GB') + ' IST';
    }

    // --- Interactive Pillar Page Helpers ---
    filterPillarGrid(psu, btn) {
      const pills = document.querySelectorAll('.psu-filter-pill');
      pills.forEach(p => p.classList.remove('active'));
      if (btn) btn.classList.add('active');

      const cards = document.querySelectorAll('#pillarGridCardsContainer .home-module-card');
      cards.forEach(card => {
        const cardPsu = card.getAttribute('data-psu');
        if (psu === 'ALL' || cardPsu === psu) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    toggleFaq(btn) {
      const body = btn.nextElementSibling;
      if (!body) return;
      const isHidden = body.style.display === 'none' || !body.style.display;
      body.style.display = isHidden ? 'block' : 'none';
      const arrow = btn.querySelector('span:last-child');
      if (arrow) arrow.textContent = isHidden ? '▴' : '▾';
    }

    handleGrievanceSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('grievanceName').value;
      const psu = document.getElementById('grievancePsu').value;
      const cat = document.getElementById('grievanceCategory').value;
      const refId = "GRV-2026-" + Math.floor(1000 + Math.random() * 9000);

      this.addAuditEntry(
        'GRIEVANCE_LODGED',
        'Nodal Helpdesk',
        refId,
        'New Submission',
        'Logged for Inquiry',
        'ALERT'
      );

      alert(`Statutory Anomaly / Grievance Logged Successfully!\n\nReference ID: ${refId}\nReporting Officer: ${name}\nTarget Entity: ${psu}\nCategory: ${cat}\n\nThis incident has been anchored into the Ministry NIC Event Ledger and routed to the Directorate of Pipeline Audit & Allocation.`);
      e.target.reset();
    }

    // --- Authentication & Portal Lock ---
    showLoginScreen() {
      this.switchView('login');
      const authBtnText = document.getElementById('authToggleText');
      if (authBtnText) authBtnText.textContent = 'Sign In';
    }

    handleLogoutToggle() {
      if (this.isLoggedIn) {
        if (confirm("Are you sure you wish to lock this terminal and log out of the MoPNG Operational Portal?")) {
          this.isLoggedIn = false;
          this.showLoginScreen();
        }
      } else {
        this.showLoginScreen();
      }
    }

    handleLogin(e) {
      if (e) e.preventDefault();
      const user = document.getElementById('loginUsername').value;
      const roleSelect = document.getElementById('loginRole');
      const roleText = roleSelect.options[roleSelect.selectedIndex].text;

      this.isLoggedIn = true;
      this.currentUser.name = user === 'admin' ? 'Shri K. V. Ramanathan' : 'Shri Rajesh K. Sharma';
      this.currentUser.designation = roleText;

      const nameEl = document.getElementById('userDisplayName');
      const roleEl = document.getElementById('userDisplayRole');
      const authBtnText = document.getElementById('authToggleText');

      if (nameEl) nameEl.textContent = this.currentUser.name;
      if (roleEl) roleEl.textContent = this.currentUser.designation;
      if (authBtnText) authBtnText.textContent = 'Log Out';

      this.addAuditEntry('OFFICER_LOGIN', 'Access Control', `Successful authentication via NIC National Node by ${this.currentUser.name}`, 'SUCCESS');
      this.switchView('dashboard');
    }

    fillDemoCredentials() {
      document.getElementById('loginUsername').value = 'officer';
      document.getElementById('loginPassword').value = 'demo123';
      document.getElementById('loginCaptcha').value = document.getElementById('captchaValue').textContent.replace(/\s+/g, '');
    }

    refreshCaptcha() {
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let res = '';
      for (let i = 0; i < 5; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length)) + ' ';
      }
      const el = document.getElementById('captchaValue');
      if (el) el.textContent = res.trim();
    }

    // --- Dashboard Rendering ---
    renderDashboard() {
      // Render recent activity table
      const tbody = document.getElementById('dashboardRecentTbody');
      if (!tbody) return;

      tbody.innerHTML = '';
      const recentSlice = this.records.slice(0, 5);

      recentSlice.forEach(rec => {
        const tr = document.createElement('tr');

        let badgeCls = 'badge-info';
        if (rec.status === 'Compliant' || rec.status === 'Verified') badgeCls = 'badge-success';
        else if (rec.status === 'Flagged') badgeCls = 'badge-critical';
        else if (rec.status === 'Under Scrutiny') badgeCls = 'badge-high';

        let riskCls = 'badge-info';
        if (rec.riskLevel === 'High') riskCls = 'badge-critical';
        else if (rec.riskLevel === 'Medium') riskCls = 'badge-high';
        else if (rec.riskLevel === 'Low') riskCls = 'badge-success';

        tr.innerHTML = `
          <td><strong>${rec.id}</strong></td>
          <td>${rec.category}</td>
          <td><strong>${rec.psu}</strong> — ${rec.facility}</td>
          <td style="font-size:11.5px; color:#475569;">${rec.dataSource}</td>
          <td><span class="badge ${badgeCls}">${rec.status}</span></td>
          <td><span class="badge ${riskCls}">${rec.riskLevel}</span></td>
          <td style="font-size:11.5px; color:#0A243F;"><strong>${rec.aiResult}</strong></td>
          <td style="font-size:11.5px; white-space:nowrap;">${rec.date}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="parakhApp.openRecordModal('${rec.id}')">View Details</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Render dashboard alerts list
      const alertsContainer = document.getElementById('dashboardAlertsList');
      if (alertsContainer) {
        alertsContainer.innerHTML = '';
        const unacked = this.alerts.filter(a => !a.acknowledged).slice(0, 4);

        unacked.forEach(alt => {
          const item = document.createElement('div');
          item.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; border:1px solid #CBD5E1; padding:7px 12px; border-radius:3px; gap:8px;";

          let sevBadge = alt.severity === 'CRITICAL' ? 'badge-critical' : alt.severity === 'HIGH' ? 'badge-high' : 'badge-medium';

          item.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px; flex:1;">
              <span class="badge ${sevBadge}">${alt.severity}</span>
              <div style="font-size:12.5px;">
                <strong>${alt.facility}:</strong> ${alt.title}
                <span style="font-size:11px; color:#64748B; margin-left:6px;">[${alt.timestamp}]</span>
              </div>
            </div>
            <div style="display:flex; gap:5px;">
              <button class="btn btn-accent btn-sm" onclick="parakhApp.openRecordModal('${alt.refId}')">Scrutinize</button>
              <button class="btn btn-secondary btn-sm" onclick="parakhApp.acknowledgeAlert('${alt.id}')">Acknowledge</button>
            </div>
          `;
          alertsContainer.appendChild(item);
        });
      }
    }

    // --- Traditional Canvas Chart (Restrained 2012-2018 Style) ---
    renderComplianceChart() {
      const canvas = document.getElementById('complianceChartCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // Clear canvas with crisp off-white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      // Data setup: 6 months of FY 2025-26
      const months = ['Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025 (Live)'];
      const psuSelect = document.getElementById('chartPsuFilter');
      const filter = psuSelect ? psuSelect.value : 'ALL';

      let volumeData = [124, 138, 142, 135, 148, 154];
      let complianceRate = [82, 85, 87, 84, 89, 91];

      if (filter === 'GAIL') {
        volumeData = [98, 102, 105, 101, 110, 114];
        complianceRate = [88, 89, 90, 87, 92, 93];
      } else if (filter === 'IOCL') {
        volumeData = [140, 145, 150, 142, 155, 160];
        complianceRate = [79, 81, 84, 80, 86, 88];
      }

      // Chart margins
      const padLeft = 45;
      const padRight = 45;
      const padTop = 25;
      const padBottom = 35;
      const chartW = w - padLeft - padRight;
      const chartH = h - padTop - padBottom;

      // Draw Grid Lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#E2E8F0';

      const gridSteps = 4;
      for (let i = 0; i <= gridSteps; i++) {
        const y = padTop + (chartH / gridSteps) * i;
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(w - padRight, y);
        ctx.stroke();

        // Left axis labels (Volume)
        ctx.fillStyle = '#123B63';
        ctx.font = '10.5px Arial';
        ctx.textAlign = 'right';
        const val = Math.round(200 - (200 / gridSteps) * i);
        ctx.fillText(val.toString(), padLeft - 6, y + 3);

        // Right axis labels (Compliance %)
        ctx.fillStyle = '#C25E00';
        ctx.textAlign = 'left';
        const pct = Math.round(100 - (50 / gridSteps) * i);
        ctx.fillText(pct + '%', w - padRight + 6, y + 3);
      }

      // Draw Bars (Deep Navy #123B63)
      const numPoints = months.length;
      const slotW = chartW / numPoints;
      const barW = slotW * 0.45;

      months.forEach((m, idx) => {
        const x = padLeft + slotW * idx + (slotW - barW) / 2;
        const barH = (volumeData[idx] / 200) * chartH;
        const y = padTop + chartH - barH;

        ctx.fillStyle = '#123B63';
        ctx.fillRect(x, y, barW, barH);

        ctx.strokeStyle = '#0A243F';
        ctx.strokeRect(x, y, barW, barH);

        // X-axis label
        ctx.fillStyle = '#475569';
        ctx.font = '10.5px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(m, x + barW / 2, h - padBottom + 16);
      });

      // Draw Compliance Line (Saffron / Amber #C25E00)
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#C25E00';

      const linePoints = [];
      months.forEach((m, idx) => {
        const x = padLeft + slotW * idx + slotW / 2;
        const pct = complianceRate[idx];
        const normalized = (pct - 50) / 50;
        const y = padTop + chartH - normalized * chartH;
        linePoints.push({ x, y, val: pct });

        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw line points (Squares)
      linePoints.forEach(pt => {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#C25E00';
        ctx.lineWidth = 2;
        ctx.fillRect(pt.x - 3, pt.y - 3, 6, 6);
        ctx.strokeRect(pt.x - 3, pt.y - 3, 6, 6);

        ctx.fillStyle = '#9A4A00';
        ctx.font = 'bold 9.5px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(pt.val + '%', pt.x, pt.y - 6);
      });
    }

    // --- Records Table Rendering, Filtering & Pagination ---
    renderRecordsTable() {
      const tbody = document.getElementById('recordsTbody');
      if (!tbody) return;

      tbody.innerHTML = '';

      const total = this.filteredRecords.length;
      document.getElementById('pageTotalRecords').textContent = total;

      if (total === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="9">
              <div class="empty-state-box">
                <h4>No statutory hydrocarbon records match the specified filters.</h4>
                <p>Try adjusting the sector classification, entity dropdown, or date range.</p>
                <button type="button" class="btn btn-primary btn-sm" onclick="parakhApp.resetFilters()">Clear Filters</button>
              </div>
            </td>
          </tr>
        `;
        document.getElementById('pageStartRecord').textContent = '0';
        document.getElementById('pageEndRecord').textContent = '0';
        this.renderPaginationControls(0);
        return;
      }

      const startIdx = (this.recordsCurrentPage - 1) * this.recordsPerPage;
      const endIdx = Math.min(startIdx + this.recordsPerPage, total);

      document.getElementById('pageStartRecord').textContent = (startIdx + 1).toString();
      document.getElementById('pageEndRecord').textContent = endIdx.toString();

      const pageItems = this.filteredRecords.slice(startIdx, endIdx);

      pageItems.forEach(rec => {
        const tr = document.createElement('tr');

        let badgeCls = 'badge-info';
        if (rec.status === 'Compliant' || rec.status === 'Verified') badgeCls = 'badge-success';
        else if (rec.status === 'Flagged') badgeCls = 'badge-critical';
        else if (rec.status === 'Under Scrutiny') badgeCls = 'badge-high';

        let riskCls = 'badge-info';
        if (rec.riskLevel === 'High') riskCls = 'badge-critical';
        else if (rec.riskLevel === 'Medium') riskCls = 'badge-high';
        else if (rec.riskLevel === 'Low') riskCls = 'badge-success';

        tr.innerHTML = `
          <td><strong>${rec.id}</strong></td>
          <td>${rec.category}</td>
          <td><strong>${rec.psu}</strong> — ${rec.facility}</td>
          <td style="font-size:11.5px; color:#475569;">${rec.dataSource}</td>
          <td><span class="badge ${badgeCls}">${rec.status}</span></td>
          <td><span class="badge ${riskCls}">${rec.riskLevel}</span></td>
          <td style="font-size:11.5px; color:#0A243F;"><strong>${rec.aiResult}</strong></td>
          <td style="font-size:11.5px; white-space:nowrap;">${rec.date}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="parakhApp.openRecordModal('${rec.id}')">View Details</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      this.renderPaginationControls(total);
    }

    renderPaginationControls(total) {
      const container = document.getElementById('paginationControls');
      if (!container) return;

      container.innerHTML = '';
      const totalPages = Math.ceil(total / this.recordsPerPage) || 1;

      // Prev Button
      const prevBtn = document.createElement('button');
      prevBtn.className = 'page-btn';
      prevBtn.textContent = '« Prev';
      prevBtn.disabled = this.recordsCurrentPage === 1;
      prevBtn.onclick = () => {
        if (this.recordsCurrentPage > 1) {
          this.recordsCurrentPage--;
          this.renderRecordsTable();
        }
      };
      container.appendChild(prevBtn);

      for (let p = 1; p <= totalPages; p++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${p === this.recordsCurrentPage ? 'active' : ''}`;
        btn.textContent = p.toString();
        btn.onclick = () => {
          this.recordsCurrentPage = p;
          this.renderRecordsTable();
        };
        container.appendChild(btn);
      }

      // Next Button
      const nextBtn = document.createElement('button');
      nextBtn.className = 'page-btn';
      nextBtn.textContent = 'Next »';
      nextBtn.disabled = this.recordsCurrentPage === totalPages;
      nextBtn.onclick = () => {
        if (this.recordsCurrentPage < totalPages) {
          this.recordsCurrentPage++;
          this.renderRecordsTable();
        }
      };
      container.appendChild(nextBtn);
    }

    applyFilters() {
      const search = (document.getElementById('filterSearchInput').value || '').toLowerCase().trim();
      const cat = document.getElementById('filterCategorySelect').value;
      const psu = document.getElementById('filterPsuSelect').value;
      const status = document.getElementById('filterStatusSelect').value;

      this.filteredRecords = this.records.filter(rec => {
        if (search) {
          const match = rec.id.toLowerCase().includes(search) ||
                        rec.facility.toLowerCase().includes(search) ||
                        rec.psu.toLowerCase().includes(search) ||
                        rec.aiResult.toLowerCase().includes(search);
          if (!match) return false;
        }

        if (cat !== 'ALL' && rec.category !== cat) return false;
        if (psu !== 'ALL' && rec.psu !== psu) return false;
        if (status !== 'ALL' && rec.status !== status) return false;

        return true;
      });

      this.recordsCurrentPage = 1;
      this.renderRecordsTable();
    }

    resetFilters() {
      document.getElementById('filterSearchInput').value = '';
      document.getElementById('filterCategorySelect').value = 'ALL';
      document.getElementById('filterPsuSelect').value = 'ALL';
      document.getElementById('filterStatusSelect').value = 'ALL';
      this.filteredRecords = [...this.records];
      this.recordsCurrentPage = 1;
      this.renderRecordsTable();
    }

    filterRecordsByPsu(psuName) {
      this.switchView('records', psuName);
      const sel = document.getElementById('filterPsuSelect');
      if (sel) sel.value = psuName;
      this.applyFilters();
    }

    sortRecords(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortOrder = 'asc';
      }

      this.filteredRecords.sort((a, b) => {
        let vA = a[field] || '';
        let vB = b[field] || '';
        if (typeof vA === 'string') vA = vA.toLowerCase();
        if (typeof vB === 'string') vB = vB.toLowerCase();

        if (vA < vB) return this.sortOrder === 'asc' ? -1 : 1;
        if (vA > vB) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      this.renderRecordsTable();
    }

    exportRecordsCSV() {
      let csv = "Record ID,Category,PSU,Facility,Data Source,Status,Risk Level,AI Result,Date\n";
      this.filteredRecords.forEach(r => {
        csv += `"${r.id}","${r.category}","${r.psu}","${r.facility}","${r.dataSource}","${r.status}","${r.riskLevel}","${r.aiResult}","${r.date}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MoPNG_Hydrocarbon_Records_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // --- Record Details Modal ---
    openRecordModal(recordId) {
      const rec = this.records.find(r => r.id === recordId);
      if (!rec) return;

      this.currentSelectedRecord = rec;

      const titleEl = document.getElementById('recordModalTitle');
      const bodyEl = document.getElementById('recordModalBody');

      if (titleEl) titleEl.textContent = `Record Scrutiny Dossier: ${rec.id} — ${rec.facility}`;

      let telemetryRows = '';
      if (rec.telemetry) {
        for (const [k, v] of Object.entries(rec.telemetry)) {
          telemetryRows += `<tr><td style="font-weight:bold; width:40%; background:#F8FAFC;">${k}:</td><td>${v}</td></tr>`;
        }
      }

      let indicatorsHtml = '';
      if (rec.indicators && rec.indicators.length) {
        indicatorsHtml = `<ul style="list-style:disc; margin-left:18px; display:flex; flex-direction:column; gap:5px; font-size:12.5px; color:#0F172A;">` +
          rec.indicators.map(i => `<li>${i}</li>`).join('') + `</ul>`;
      }

      if (bodyEl) {
        bodyEl.innerHTML = `
          <div style="background:#F8FAFC; border:1px solid #CBD5E1; padding:11px; border-radius:3px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:14px; font-weight:bold; color:#123B63;">${rec.psu} — ${rec.facility}</span>
              <span class="badge ${rec.riskLevel === 'High' ? 'badge-critical' : rec.riskLevel === 'Medium' ? 'badge-high' : 'badge-success'}">${rec.riskLevel} RISK</span>
            </div>
            <div style="font-size:12px; color:#475569;">
              Category: <strong>${rec.category}</strong> | Data Stream: <strong>${rec.dataSource}</strong> | Ingestion: ${rec.date}
            </div>
          </div>

          <div style="border:1px solid #C25E00; background:#FFFBEB; padding:11px; border-radius:3px;">
            <div style="font-size:11px; font-weight:bold; color:#92400E; text-transform:uppercase;">Deterministic AI Assessment Result</div>
            <div style="font-size:13.5px; font-weight:bold; color:#123B63; margin:4px 0;">${rec.aiResult}</div>
            <div style="font-size:12.5px; color:#92400E; margin-top:4px;">
              <strong>Recommendation:</strong> ${rec.recommendation || 'Continuous telemetry monitoring.'}
            </div>
          </div>

          <div>
            <div style="font-size:12px; font-weight:bold; color:#123B63; margin-bottom:5px; text-transform:uppercase;">Technical Telemetry & Observed Readings</div>
            <div class="table-responsive">
              <table class="table-gov">
                <tbody>${telemetryRows}</tbody>
              </table>
            </div>
          </div>

          <div>
            <div style="font-size:12px; font-weight:bold; color:#123B63; margin-bottom:5px; text-transform:uppercase;">Key Discrepancy Indicators & Statutory Notes</div>
            ${indicatorsHtml}
          </div>
        `;
      }

      const modal = document.getElementById('recordDetailsModal');
      if (modal) modal.classList.add('active');
    }

    closeRecordModal() {
      const modal = document.getElementById('recordDetailsModal');
      if (modal) modal.classList.remove('active');
    }

    openOfficerSignOffFromModal() {
      if (!this.currentSelectedRecord) return;
      this.closeRecordModal();

      document.getElementById('signOffTargetTitle').textContent = `${this.currentSelectedRecord.psu} — ${this.currentSelectedRecord.facility}`;
      document.getElementById('signOffTargetId').textContent = this.currentSelectedRecord.id;
      document.getElementById('decisionRemarkInput').value = `Verified under PNGRB Rule Section 4. ${this.currentSelectedRecord.recommendation}`;

      const modal = document.getElementById('officerSignOffModal');
      if (modal) modal.classList.add('active');
    }

    closeOfficerSignOffModal() {
      const modal = document.getElementById('officerSignOffModal');
      if (modal) modal.classList.remove('active');
    }

    handleOfficerDecisionSubmit(e) {
      if (e) e.preventDefault();
      const decision = document.getElementById('decisionSelect').value;
      const remark = document.getElementById('decisionRemarkInput').value;

      if (!remark || remark.trim().length < 5) {
        alert("Please enter a valid statutory officer remark before signing off.");
        return;
      }

      if (this.currentSelectedRecord) {
        const prevStatus = this.currentSelectedRecord.status;
        const newStatus = decision === 'APPROVE' ? 'Verified' : decision === 'REJECT' ? 'Compliant' : 'Under Scrutiny';
        this.currentSelectedRecord.status = newStatus;
        
        this.addAuditEntry(
          'OFFICER_DECISION',
          'Decision Support',
          this.currentSelectedRecord.id,
          prevStatus,
          newStatus,
          decision === 'APPROVE' ? 'SUCCESS' : 'ALERT'
        );
      }

      this.closeOfficerSignOffModal();
      this.renderDashboard();
      this.renderRecordsTable();
      alert(`Officer Decision successfully registered with Ministry Digital Signature.`);
    }

    // --- Drag & Drop Data Upload Setup ---
    setupDropzone() {
      const dropzone = document.getElementById('uploadDropzone');
      const fileInput = document.getElementById('uploadFileInput');
      if (!dropzone || !fileInput) return;

      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
          fileInput.files = e.dataTransfer.files;
          this.updateDropzoneLabel(fileInput.files[0].name);
        }
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
          this.updateDropzoneLabel(fileInput.files[0].name);
        }
      });
    }

    updateDropzoneLabel(fileName) {
      const label = document.getElementById('uploadDropzoneFilename');
      if (label) {
        label.innerHTML = `<strong>Selected file:</strong> <span style="color:#123B63;">${fileName}</span>`;
      }
    }

    handleDataUpload(e) {
      if (e) e.preventDefault();
      const psu = document.getElementById('uploadPsuSelect').value;
      const category = document.getElementById('uploadCategorySelect').value;
      const facility = document.getElementById('uploadFacilityInput').value;
      const dataStream = document.getElementById('uploadDataStream').value;
      const fileInput = document.getElementById('uploadFileInput');

      if (!fileInput.files.length) {
        alert("Please select or drop a valid telemetry/manifest data file.");
        return;
      }

      const file = fileInput.files[0];
      const progressContainer = document.getElementById('uploadProgressContainer');
      const progressBar = document.getElementById('uploadProgressBar');
      const progressLabel = document.getElementById('uploadProgressLabel');
      const progressPercent = document.getElementById('uploadProgressPercent');
      const submitBtn = document.getElementById('uploadSubmitBtn');
      const successState = document.getElementById('uploadSuccessState');

      if (progressContainer) progressContainer.style.display = 'block';
      if (successState) successState.style.display = 'none';
      if (submitBtn) submitBtn.disabled = true;

      let pct = 10;
      const interval = setInterval(() => {
        pct += 25;
        if (pct >= 100) {
          pct = 100;
          clearInterval(interval);

          if (progressBar) progressBar.style.width = '100%';
          if (progressPercent) progressPercent.textContent = '100%';
          if (progressLabel) progressLabel.textContent = 'Ingestion complete: SHA-256 Checksum Verified (Integrity: PASSED)';

          setTimeout(() => {
            const newBatchId = `BATCH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
            const newRecordId = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

            const newRecord = {
              id: newRecordId,
              category: category,
              psu: psu,
              facility: facility,
              dataSource: dataStream,
              status: "Under Scrutiny",
              riskLevel: "Medium",
              aiResult: "Ingestion Batch Validated; Telemetry awaiting baseline comparison",
              date: new Date().toISOString().slice(0,10) + " " + new Date().toLocaleTimeString('en-GB').slice(0,5) + " IST",
              telemetry: {
                fileName: file.name,
                batchId: newBatchId,
                fileSize: (file.size / 1024).toFixed(1) + " KB",
                recordsIngested: 1240,
                checksum: "SHA256:88a1c9e0" + Math.floor(1000 + Math.random() * 9000),
                ingestionNode: "MoPNG-NIC-DEL04"
              },
              parameter: "SCADA Telemetry Batch",
              observedValue: "1,240 Samples",
              expectedRange: "Full Time-Series",
              deviation: "Awaiting Scrutiny",
              indicators: [
                `File ${file.name} ingested successfully under regulatory classification ${category}.`,
                "SHA-256 cryptographic checksum matches transmission manifest.",
                "Automated rule engine triggered for boundary condition analysis."
              ],
              recommendation: "Awaiting preliminary deterministic anomaly check."
            };

            this.records.unshift(newRecord);
            this.filteredRecords = [...this.records];
            
            this.addAuditEntry(
              'DATA_INGESTION',
              'Telemetry Upload',
              newRecordId,
              'New Batch',
              'Under Scrutiny',
              'SUCCESS'
            );

            if (submitBtn) submitBtn.disabled = false;
            if (progressContainer) progressContainer.style.display = 'none';

            // Show Successful Upload State Card
            if (successState) {
              document.getElementById('successBatchId').textContent = newBatchId;
              document.getElementById('successRecordId').textContent = newRecordId;
              document.getElementById('successUploadedBy').textContent = this.currentUser.name;
              document.getElementById('successTimestamp').textContent = newRecord.date;
              document.getElementById('successSource').textContent = `${psu} (${dataStream})`;
              document.getElementById('successFileName').textContent = file.name;
              successState.style.display = 'block';
            }
          }, 500);
        } else {
          if (progressBar) progressBar.style.width = pct + '%';
          if (progressPercent) progressPercent.textContent = pct + '%';
        }
      }, 250);
    }

    resetUploadForm() {
      document.getElementById('uploadDataForm').reset();
      const progressContainer = document.getElementById('uploadProgressContainer');
      const successState = document.getElementById('uploadSuccessState');
      const filenameLabel = document.getElementById('uploadDropzoneFilename');
      if (progressContainer) progressContainer.style.display = 'none';
      if (successState) successState.style.display = 'none';
      if (filenameLabel) filenameLabel.innerHTML = 'Drag & drop telemetry files here, or <span style="text-decoration:underline;">browse computer</span>';
    }

    // --- Multi-Stage AI Compliance Scrutiny ---
    onAnalysisCaseSelect() {
      const sel = document.getElementById('analysisCaseSelect');
      if (sel) {
        this.loadAnalysisCase(sel.value);
      }
    }

    loadAnalysisCase(caseId) {
      this.currentAnalysisCase = caseId;
      const sel = document.getElementById('analysisCaseSelect');
      if (sel) sel.value = caseId;

      const caseDetailsMap = {
        'CASE-8841': {
          target: "GAIL HVJ Trunk Sector 4B (Hazira-Vijaipur)",
          assessment: "Potential flow discrepancy and pressure divergence detected",
          confidence: 87,
          severity: "Medium",
          severityBadge: "badge-high",
          parameter: "Mass Flow Balance & In-Line Pressure",
          observed: "13.54 MMSCMD / 4.2 bar drop",
          expected: "14.05 – 14.30 MMSCMD / 2.1 bar drop",
          deviation: "-4.8% Flow Mismatch",
          clause: "PNGRB Technical Standards Regulation 4(2)(b)",
          indicators: [
            "Input telemetry at Hazira compressor shows 4.8% divergence against downstream Jagdishpur terminal meter (statutory PNGRB limit <= 1.2%).",
            "Transient localized pressure drop recorded between Valve Station VS-14 and VS-16 without off-take logged in daily manifest.",
            "Density sensor batch test indicates subtle thermal variance compared to refinery test certification."
          ],
          recommendation: "Further verification recommended. Dispatch physical ultrasonic calibration team to Valve Station VS-14 before the next transmission cycle."
        },
        'CASE-9022': {
          target: "IOCL Paradip Refinery Terminal B (BS-VI Diesel)",
          assessment: "Sulphur specification margin exceeded (11.4 ppm vs 10.0 ppm BIS ceiling)",
          confidence: 96,
          severity: "High",
          severityBadge: "badge-critical",
          parameter: "Diesel Sulphur Content (XRF)",
          observed: "11.4 ppm",
          expected: "<= 10.0 ppm (Ceiling)",
          deviation: "+14.0% Over Mandatory Limit",
          clause: "Bureau of Indian Standards (BIS) IS 1460:2020",
          indicators: [
            "Despatch batch sulphur content recorded at 11.4 ppm, exceeding mandatory BS-VI ceiling under Environment Protection Rules.",
            "Refinery primary hydrocracker sensor log showed brief catalyst bed temperature dip 4 hours prior to blending batch sign-off.",
            "Automated containment valve triggered cutoff after 6,200 KL pipeline release."
          ],
          recommendation: "Quarantine Batch PDR-BSVI-2026-B88 at downstream Cuttack depot for mandatory re-hydrotreating and lab re-certification."
        },
        'CASE-9140': {
          target: "Subsidized LPG Bottling Plant - Kanpur Rural",
          assessment: "Subsidy diversion pattern flagged across commercial retail distributors",
          confidence: 91,
          severity: "High",
          severityBadge: "badge-critical",
          parameter: "Biometric DBTL Verification",
          observed: "26,980 Verified Dispenses",
          expected: "28,400 Total Dispatched",
          deviation: "1,420 Unauthenticated Cylinders (5.0%)",
          clause: "Direct Benefit Transfer for LPG (DBTL Pahal) Guidelines",
          indicators: [
            "1,420 subsidized domestic LPG cylinders dispatched without corresponding Aadhaar authentication tokens in PMUY database.",
            "Geographic clustering of repeat bookings within 48 hours detected across three commercial highway distributors.",
            "Weighbridge automated RFID log records exit timestamps inconsistent with security bay manifest."
          ],
          recommendation: "Issue immediate statutory show-cause notice to Agency UP-KNP-104 and dispatch Ministry Vigilance inspection team."
        },
        'CASE-9255': {
          target: "ONGC Mumbai High Offshore Platform B-17",
          assessment: "Telemetry fully reconciled; routine flow meter calibration drift noted",
          confidence: 94,
          severity: "Low",
          severityBadge: "badge-success",
          parameter: "Subsea Multi-Phase Production Rate",
          observed: "38,200 BBL/day / 184 bar",
          expected: "37,500 – 39,000 BBL/day / 180 – 190 bar",
          deviation: "+0.6% Nominal Variance",
          clause: "Oilfield Hydrocarbon Accounting Protocol Section 12",
          indicators: [
            "Wellhead multi-phase flow rates align within 0.6% tolerance against Uran coastal terminal receipt meters.",
            "Subsea choke valve pressure differential exhibits stable laminar profile over continuous 72-hour operational cycle.",
            "Secondary density sensor indicates minor 0.3% calibration offset."
          ],
          recommendation: "Routine scheduled telemetry monitoring; next statutory underwater sensor calibration scheduled 15-Oct-2026."
        }
      };

      const cData = caseDetailsMap[caseId] || caseDetailsMap['CASE-8841'];
      const container = document.getElementById('analysisDetailsContainer');
      if (!container) return;

      container.innerHTML = `
        <div class="panel ai-insight-panel">
          <div class="panel-header">
            <span>AI COMPLIANCE FINDINGS & STATUTORY DOSSIER — ${caseId}</span>
            <span class="ai-tag">${cData.target}</span>
          </div>
          <div class="panel-body">
            <div class="ai-result-block">
              <div class="ai-assessment-box">
                <div style="font-size:11px; font-weight:bold; color:#123B63; text-transform:uppercase;">Statutory Compliance Assessment</div>
                <div style="font-size:14px; font-weight:bold; color:#123B63; margin-top:3px;">
                  ${cData.assessment}
                </div>
              </div>

              <!-- Parameter Comparison Table -->
              <div class="table-responsive" style="margin-top:2px;">
                <table class="table-gov">
                  <thead>
                    <tr>
                      <th>Evaluated Parameter</th>
                      <th>Observed Telemetry</th>
                      <th>Permissible Range</th>
                      <th>Measured Deviation</th>
                      <th>Governing Clause</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>${cData.parameter}</strong></td>
                      <td style="color:#C25E00; font-weight:bold;">${cData.observed}</td>
                      <td>${cData.expected}</td>
                      <td><span class="badge ${cData.severityBadge}">${cData.deviation}</span></td>
                      <td style="font-size:11.5px; color:#475569;">${cData.clause}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="ai-metric-row" style="margin-top:4px;">
                <div class="ai-metric-col">
                  <span class="ai-metric-label">Confidence Score</span>
                  <div class="ai-metric-value">${cData.confidence}%</div>
                  <div class="confidence-bar-wrap">
                    <div class="confidence-bar-fill" style="width: ${cData.confidence}%;"></div>
                  </div>
                </div>
                <div class="ai-metric-col">
                  <span class="ai-metric-label">Risk Classification</span>
                  <div class="ai-metric-value"><span class="badge ${cData.severityBadge}">${cData.severity} RISK</span></div>
                </div>
                <div class="ai-metric-col">
                  <span class="ai-metric-label">Scrutiny Engine</span>
                  <div style="font-size:12.5px; font-weight:bold; color:#123B63;">Deterministic Rule Matrix v3.2</div>
                </div>
              </div>

              <div>
                <div style="font-size:12px; font-weight:bold; color:#123B63; margin-bottom:5px; text-transform:uppercase;">Synthesized Discrepancy Evidence:</div>
                <ul class="ai-indicator-list">
                  ${cData.indicators.map(i => `<li class="ai-indicator-item">${i}</li>`).join('')}
                </ul>
              </div>

              <div class="ai-recommendation-box">
                <strong>Recommended Statutory Action:</strong>
                ${cData.recommendation}
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; flex-wrap:wrap; gap:8px;">
                <div style="display:flex; gap:6px;">
                  <button class="btn btn-accent btn-sm" onclick="parakhApp.endorseAiFinding('${caseId}')">
                    [ Endorse Finding & Issue Direction ]
                  </button>
                  <button class="btn btn-secondary btn-sm" onclick="parakhApp.requestReaudit('${caseId}')">
                    [ Request Calibration Re-Audit ]
                  </button>
                  <button class="btn btn-primary btn-sm" onclick="parakhApp.openOfficerSignOffModal()">
                    [ Record Final Sign-Off ]
                  </button>
                </div>
                <span style="font-size:11px; color:#64748B;">Multi-Source Verification: PNGRB Grid, SCADA & NABL Hub</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    runAiAnalysisPipeline() {
      if (this.isPipelineRunning) return;
      this.isPipelineRunning = true;

      const btn = document.getElementById('triggerAiAnalysisBtn');
      const badge = document.getElementById('analysisPipelineStatusBadge');
      if (btn) btn.disabled = true;
      if (badge) {
        badge.className = 'badge badge-high';
        badge.textContent = 'EXECUTING DETERMINISTIC RULES...';
      }

      const stages = [
        { id: 'pipeStage1', statusId: 'pipeStage1Status', label: 'Processing Telemetry (320ms)' },
        { id: 'pipeStage2', statusId: 'pipeStage2Status', label: 'Boundary Condition Check (480ms)' },
        { id: 'pipeStage3', statusId: 'pipeStage3Status', label: 'Cross-Source Matching (590ms)' },
        { id: 'pipeStage4', statusId: 'pipeStage4Status', label: 'Deterministic Rule Engine (140ms)' },
        { id: 'pipeStage5', statusId: 'pipeStage5Status', label: 'Dossier Assembled (210ms)' }
      ];

      stages.forEach(s => {
        const el = document.getElementById(s.statusId);
        if (el) {
          el.textContent = 'Queued...';
          el.style.color = '#64748B';
        }
      });

      let currentStageIdx = 0;

      const stepInterval = setInterval(() => {
        if (currentStageIdx < stages.length) {
          const s = stages[currentStageIdx];
          const el = document.getElementById(s.statusId);
          if (el) {
            el.innerHTML = '<span class="spin-loader" style="border-color:#123B63; border-top-color:transparent; margin-right:4px;"></span> ' + s.label;
            el.style.color = '#123B63';
          }

          if (currentStageIdx > 0) {
            const prev = stages[currentStageIdx - 1];
            const prevEl = document.getElementById(prev.statusId);
            if (prevEl) {
              prevEl.textContent = '✓ COMPLETED';
              prevEl.style.color = '#166534';
              prevEl.style.fontWeight = 'bold';
            }
          }
          currentStageIdx++;
        } else {
          clearInterval(stepInterval);
          const last = stages[stages.length - 1];
          const lastEl = document.getElementById(last.statusId);
          if (lastEl) {
            lastEl.textContent = '✓ COMPLETED';
            lastEl.style.color = '#166534';
            lastEl.style.fontWeight = 'bold';
          }

          if (badge) {
            badge.className = 'badge badge-success';
            badge.textContent = 'PIPELINE VERIFIED / READY';
          }
          if (btn) btn.disabled = false;
          this.isPipelineRunning = false;

          this.addAuditEntry(
            'AI_SCRUTINY_RUN',
            'AI Compliance Scrutiny',
            this.currentAnalysisCase,
            'Under Scrutiny',
            'Dossier Generated',
            'SUCCESS'
          );

          this.loadAnalysisCase(this.currentAnalysisCase);
        }
      }, 350);
    }

    endorseAiFinding(caseId) {
      this.addAuditEntry(
        'OFFICER_ENDORSEMENT',
        'Decision Support',
        caseId,
        'Under Scrutiny',
        'Endorsed',
        'SUCCESS'
      );
      alert(`AI Finding for ${caseId} officially endorsed by ${this.currentUser.name}.\nStatutory inspection directive dispatched.`);
    }

    requestReaudit(caseId) {
      this.addAuditEntry(
        'RE_AUDIT_REQUEST',
        'Decision Support',
        caseId,
        'Under Scrutiny',
        'Re-Audit Requested',
        'ALERT'
      );
      alert(`Re-audit directive issued for ${caseId}.\nOperating PSU has 48 hours to submit re-calibrated sensor certificates.`);
    }

    // --- Structured AI Insights View (Cards & Comparison Table) ---
    renderStructuredAiInsights() {
      const container = document.getElementById('insightsCardContainer');
      const tableBody = document.getElementById('insightsTableBody');

      const insightsList = [
        {
          anomaly: "Mass Flow Inflow-Outflow Mismatch (> 4.8%)",
          severity: "Medium",
          severityBadge: "badge-high",
          facility: "GAIL HVJ Trunk Sector 4B",
          parameter: "Mass Flow Balance",
          observed: "13.54 MMSCMD",
          expected: "14.05 – 14.30 MMSCMD",
          deviation: "-4.8% divergence",
          aiFinding: "Localized pressure depression between VS-14 and VS-16 without off-take recorded in manifest.",
          recommendation: "Immediate physical ultrasonic valve inspection at Valve Station VS-14 recommended."
        },
        {
          anomaly: "Sulphur Content Spec Ceiling Exceeded",
          severity: "High",
          severityBadge: "badge-critical",
          facility: "IOCL Paradip Refinery Terminal B",
          parameter: "Sulphur Content (XRF)",
          observed: "11.4 ppm",
          expected: "<= 10.0 ppm (BIS IS 1460)",
          deviation: "+14.0% above limit",
          aiFinding: "Hydrocracker temperature excursion resulted in off-spec sulphur release before containment cutoff.",
          recommendation: "Quarantine Batch PDR-BSVI-2026-B88 at downstream depot for re-hydrotreating."
        },
        {
          anomaly: "Subsidized Domestic LPG Allocation Divergence",
          severity: "High",
          severityBadge: "badge-critical",
          facility: "IOCL Bottling Plant Kanpur",
          parameter: "DBTL Pahal Authenticated Dispenses",
          observed: "26,980 Dispenses",
          expected: "28,400 Dispenses",
          deviation: "-1,420 Cylinders (5.0%)",
          aiFinding: "1,420 subsidized cylinders dispatched without Aadhaar authentication tokens; commercial diversion suspected.",
          recommendation: "Issue show-cause notice to Agency UP-KNP-104 and dispatch Ministry Vigilance team."
        },
        {
          anomaly: "Secondary Pressure Regulation Surge",
          severity: "Medium",
          severityBadge: "badge-high",
          facility: "GAIL Ahmedabad CGD Network",
          parameter: "PRS Regulated Outlet Pressure",
          observed: "19.4 bar",
          expected: "14.0 – 16.0 bar",
          deviation: "+21.2% Surge",
          aiFinding: "Diaphragm response latency caused midnight transient over-pressure in industrial off-take sector.",
          recommendation: "Dispatch emergency CGD field engineer to overhaul pilot regulator at PRS-Vatva-02."
        },
        {
          anomaly: "Pipe Wall Loss Exceeding O&M Threshold",
          severity: "Medium",
          severityBadge: "badge-high",
          facility: "IOCL Mathura Pipeline Section",
          parameter: "ILI Metal Loss Depth",
          observed: "22% Wall Loss",
          expected: "<= 20% (ASME B31.8S)",
          deviation: "+2.0% over threshold",
          aiFinding: "Magnetic Flux Leakage pig recorded localized metal loss at KM 42.8.",
          recommendation: "Execute visual direct examination and reduce operating pressure by 10 bar."
        },
        {
          anomaly: "Subsea Choke & Flow Balance Verified",
          severity: "Low",
          severityBadge: "badge-success",
          facility: "ONGC Mumbai High Platform B-17",
          parameter: "Multi-Phase Flow Balance",
          observed: "38,200 BBL / 184 bar",
          expected: "37,500 – 39,000 BBL",
          deviation: "+0.6% (Nominal)",
          aiFinding: "All subsea choke differential pressures laminar and reconciled with Uran terminal.",
          recommendation: "Routine scheduled telemetry monitoring; next calibration scheduled 15-Oct-2026."
        }
      ];

      // Render structured table
      if (tableBody) {
        tableBody.innerHTML = insightsList.map(ins => `
          <tr>
            <td><strong>${ins.anomaly}</strong></td>
            <td><span class="badge ${ins.severityBadge}">${ins.severity}</span></td>
            <td>${ins.facility}</td>
            <td><code>${ins.parameter}</code></td>
            <td style="color:#C25E00; font-weight:bold;">${ins.observed}</td>
            <td>${ins.expected}</td>
            <td><strong>${ins.deviation}</strong></td>
            <td style="font-size:12px; color:#475569;">${ins.aiFinding}</td>
            <td style="font-size:12px; color:#123B63;"><strong>${ins.recommendation}</strong></td>
          </tr>
        `).join('');
      }

      // Render structured insight cards
      if (container) {
        container.innerHTML = insightsList.slice(0, 3).map((ins, idx) => `
          <div class="panel ai-insight-panel">
            <div class="panel-header">
              <span>STRUCTURED ANOMALY DOSSIER — INSIGHT #${idx + 1}</span>
              <span class="ai-tag">${ins.facility}</span>
            </div>
            <div class="panel-body">
              <div class="ai-result-block">
                <div class="ai-assessment-box">
                  <div style="font-size:11px; font-weight:bold; color:#123B63; text-transform:uppercase;">Detected Anomaly</div>
                  <div style="font-size:13.5px; font-weight:bold; color:#123B63; margin-top:2px;">
                    ${ins.anomaly}
                  </div>
                </div>

                <div class="ai-metric-row">
                  <div class="ai-metric-col">
                    <span class="ai-metric-label">Observed Value</span>
                    <div class="ai-metric-value" style="color:#C25E00;">${ins.observed}</div>
                  </div>
                  <div class="ai-metric-col">
                    <span class="ai-metric-label">Expected Statutory Range</span>
                    <div class="ai-metric-value">${ins.expected}</div>
                  </div>
                  <div class="ai-metric-col">
                    <span class="ai-metric-label">Measured Deviation</span>
                    <div class="ai-metric-value"><span class="badge ${ins.severityBadge}">${ins.deviation}</span></div>
                  </div>
                  <div class="ai-metric-col">
                    <span class="ai-metric-label">Severity</span>
                    <div class="ai-metric-value"><span class="badge ${ins.severityBadge}">${ins.severity} RISK</span></div>
                  </div>
                </div>

                <div style="font-size:12.5px; color:#334155;">
                  <strong>AI Finding:</strong> ${ins.aiFinding}
                </div>

                <div class="ai-recommendation-box">
                  <strong>Recommended Action:</strong> ${ins.recommendation}
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                  <button class="btn btn-accent btn-sm" onclick="parakhApp.switchView('compliance')">
                    [ Open in Scrutiny Suite ]
                  </button>
                  <span style="font-size:11px; color:#64748B;">Algorithm: PNGRB Multi-Source Scrutiny v3.2</span>
                </div>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    // --- Reports Management ---
    renderReportsTable() {
      const tbody = document.getElementById('reportsTbody');
      if (!tbody) return;

      tbody.innerHTML = this.reports.map(rep => `
        <tr>
          <td><strong>${rep.title}</strong></td>
          <td style="font-family:monospace; font-size:11.5px;">${rep.code}</td>
          <td>${rep.category}</td>
          <td style="font-size:11.5px;">${rep.period || 'Q2 FY25-26'}</td>
          <td style="font-size:11.5px;">${rep.date}</td>
          <td><span class="badge badge-success">${rep.status}</span></td>
          <td style="font-size:11.5px;">${rep.createdBy}</td>
          <td><span class="badge badge-info">${rep.classification}</span></td>
          <td>
            <div style="display:flex; gap:4px;">
              <button class="btn btn-secondary btn-sm" onclick="parakhApp.downloadReportPDF('${rep.code}')">Download PDF</button>
              <button class="btn btn-secondary btn-sm" onclick="parakhApp.viewReportData('${rep.code}')">View Sheet</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    filterReports() {
      const search = (document.getElementById('reportSearchInput').value || '').toLowerCase();
      const cat = document.getElementById('reportCategoryFilter').value;

      const filtered = this.reports.filter(r => {
        if (search && !r.title.toLowerCase().includes(search) && !r.code.toLowerCase().includes(search)) {
          return false;
        }
        if (cat !== 'ALL' && r.category !== cat) return false;
        return true;
      });

      const tbody = document.getElementById('reportsTbody');
      if (!tbody) return;

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px; color:#64748B;">No statutory reports found matching criteria.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(rep => `
        <tr>
          <td><strong>${rep.title}</strong></td>
          <td style="font-family:monospace; font-size:11.5px;">${rep.code}</td>
          <td>${rep.category}</td>
          <td style="font-size:11.5px;">${rep.period || 'Q2 FY25-26'}</td>
          <td style="font-size:11.5px;">${rep.date}</td>
          <td><span class="badge badge-success">${rep.status}</span></td>
          <td style="font-size:11.5px;">${rep.createdBy}</td>
          <td><span class="badge badge-info">${rep.classification}</span></td>
          <td>
            <div style="display:flex; gap:4px;">
              <button class="btn btn-secondary btn-sm" onclick="parakhApp.downloadReportPDF('${rep.code}')">Download PDF</button>
              <button class="btn btn-secondary btn-sm" onclick="parakhApp.viewReportData('${rep.code}')">View Sheet</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    openGenerateReportModal() {
      const modal = document.getElementById('generateReportModal');
      if (modal) modal.classList.add('active');
    }

    closeGenerateReportModal() {
      const modal = document.getElementById('generateReportModal');
      if (modal) modal.classList.remove('active');
    }

    handleGenerateReportSubmit(e) {
      if (e) e.preventDefault();
      const title = document.getElementById('reportParamTitle').value;
      const sector = document.getElementById('reportParamSector').value;
      const fmt = document.getElementById('reportParamFormat').value;

      const newCode = `MOPNG/REP/2026/${Math.floor(1000 + Math.random() * 9000)}`;
      const newRep = {
        title: title,
        code: newCode,
        category: sector === 'All Sectors' ? 'Pipeline Integrity' : sector,
        date: new Date().toISOString().slice(0,10),
        status: "Officially Signed",
        createdBy: `${this.currentUser.name}`,
        classification: "RESTRICTED",
        period: "On-Demand Compilation"
      };

      this.reports.unshift(newRep);
      this.addAuditEntry(
        'REPORT_GENERATED',
        'Statutory Reports',
        newCode,
        'Draft',
        'Officially Signed',
        'SUCCESS'
      );
      this.closeGenerateReportModal();
      this.renderReportsTable();
      alert(`Report ${newCode} successfully compiled and digitally attested.\nArchived in Ministry Central Repository.`);
    }

    downloadReportPDF(code) {
      alert(`Generating official Ministry PDF document for [${code}] with Government of India digital stamp...\nDownload initiated.`);
    }

    viewReportData(code) {
      alert(`Opening raw telemetry and audit dataset for report [${code}] in spreadsheet viewer.`);
    }

    // --- Alerts Management (3-Tone Restrained) ---
    renderAlerts() {
      const container = document.getElementById('alertsFullContainer');
      if (!container) return;

      const filtered = this.alerts.filter(a => {
        if (this.activeAlertFilter === 'ALL') return true;
        return a.severity === this.activeAlertFilter;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="empty-state-box">
            <h4>No alerts in category: ${this.activeAlertFilter}</h4>
            <p>All pipeline sensors and statutory manifests operating within designated tolerances.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(alt => {
        let badgeCls = 'badge-info';
        let borderCol = '#123B63';
        if (alt.severity === 'CRITICAL') {
          badgeCls = 'badge-critical';
          borderCol = '#991B1B';
        } else if (alt.severity === 'HIGH') {
          badgeCls = 'badge-high';
          borderCol = '#C25E00';
        } else if (alt.severity === 'MEDIUM') {
          badgeCls = 'badge-medium';
          borderCol = '#D97706';
        }

        return `
          <div class="panel" style="background:#FFFFFF; border-left:4px solid ${borderCol};">
            <div class="panel-header" style="background:#F8FAFC;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="badge ${badgeCls}">${alt.severity}</span>
                <span style="font-weight:bold; color:#123B63;">${alt.facility}</span>
                <span style="font-size:11.5px; color:#475569;">| Ref: ${alt.id}</span>
                <span style="font-size:11.5px; color:#64748B;">[Source: ${alt.source || 'SCADA'}]</span>
              </div>
              <span style="font-size:11.5px; color:#64748B;">${alt.timestamp}</span>
            </div>
            <div class="panel-body">
              <div style="font-size:13.5px; font-weight:bold; color:#123B63; margin-bottom:4px;">${alt.title}</div>
              <p style="font-size:12.5px; color:#334155; margin-bottom:10px; line-height:1.4;">${alt.description}</p>
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                <div style="font-size:11.5px; color:#64748B;">
                  Assigned Officer: <strong>${alt.assignedOfficer || 'Shri R. K. Sharma'}</strong> |
                  Status: <strong>${alt.acknowledged ? '✓ Acknowledged by Audit Officer' : 'Pending Formal Officer Review'}</strong>
                </div>
                <div style="display:flex; gap:6px;">
                  <button class="btn btn-secondary btn-sm" onclick="parakhApp.openRecordModal('${alt.refId}')">View Telemetry</button>
                  ${!alt.acknowledged ? `<button class="btn btn-accent btn-sm" onclick="parakhApp.acknowledgeAlert('${alt.id}')">Acknowledge</button>` : ''}
                  <button class="btn btn-secondary btn-sm" onclick="parakhApp.resolveAlert('${alt.id}')">Mark Resolved</button>
                  <button class="btn btn-primary btn-sm" onclick="parakhApp.escalateAlert('${alt.id}')">Escalate to Directorate</button>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    filterAlerts(filterType) {
      this.activeAlertFilter = filterType;
      this.renderAlerts();
    }

    acknowledgeAlert(alertId) {
      const alt = this.alerts.find(a => a.id === alertId);
      if (alt) {
        alt.acknowledged = true;
        this.addAuditEntry(
          'ALERT_ACKNOWLEDGED',
          'Operational Alerts',
          alt.id,
          'Active',
          'Acknowledged',
          'SUCCESS'
        );
        this.renderAlerts();
        this.renderDashboard();

        const unackedCount = this.alerts.filter(a => !a.acknowledged).length;
        const countEl = document.getElementById('headerAlertCount');
        const sideEl = document.getElementById('sidebarAlertBadge');
        if (countEl) countEl.textContent = unackedCount.toString();
        if (sideEl) sideEl.textContent = unackedCount.toString();
      }
    }

    resolveAlert(alertId) {
      const alt = this.alerts.find(a => a.id === alertId);
      if (alt) {
        alt.acknowledged = true;
        alt.resolved = true;
        this.addAuditEntry(
          'ALERT_RESOLVED',
          'Operational Alerts',
          alt.id,
          'Acknowledged',
          'Resolved',
          'SUCCESS'
        );
        alert(`Alert ${alertId} marked as resolved and archived into historical audit log.`);
        this.renderAlerts();
        this.renderDashboard();
      }
    }

    escalateAlert(alertId) {
      const alt = this.alerts.find(a => a.id === alertId);
      if (alt) {
        this.addAuditEntry(
          'ALERT_ESCALATED',
          'Operational Alerts',
          alt.id,
          'Active',
          'Escalated to MoPNG Directorate',
          'ALERT'
        );
        alert(`Alert ${alertId} escalated to the Ministry Directorate.\nStatutory summons drafted.`);
      }
    }

    // --- Audit Trail (NIC Regulatory Standard) ---
    renderAuditHistory() {
      const tbody = document.getElementById('auditHistoryTbody');
      if (!tbody) return;

      tbody.innerHTML = this.auditTrail.map(entry => {
        let tagCls = 'badge-info';
        if (entry.status === 'SUCCESS') tagCls = 'badge-success';
        else if (entry.status === 'CRITICAL') tagCls = 'badge-critical';
        else if (entry.status === 'ALERT') tagCls = 'badge-high';

        return `
          <tr>
            <td style="white-space:nowrap; font-size:11.5px;">${entry.timestamp}</td>
            <td><strong>${entry.user}</strong></td>
            <td style="font-size:11.5px;"><code>${entry.action}</code></td>
            <td>${entry.module}</td>
            <td style="font-family:monospace; font-size:11.5px;">${entry.recordId || 'N/A'}</td>
            <td><span class="badge badge-info">${entry.prevStatus}</span></td>
            <td><span class="badge ${tagCls}">${entry.newStatus}</span></td>
            <td style="font-family:monospace; font-size:10.5px; color:#475569;">${entry.ipAddress}</td>
            <td><span class="badge ${tagCls}">${entry.status}</span></td>
          </tr>
        `;
      }).join('');
    }

    addAuditEntry(action, module, recordId, prevStatus, newStatus, status) {
      const now = new Date();
      const timestamp = now.toLocaleDateString('en-GB') + " " + now.toLocaleTimeString('en-GB') + " IST";

      this.auditTrail.unshift({
        timestamp,
        user: `${this.currentUser.name} (${this.currentUser.badgeId})`,
        action,
        module,
        recordId,
        prevStatus,
        newStatus,
        ipAddress: "10.24.100.05 (MoPNG Shastri Bhawan)",
        status
      });

      this.renderAuditHistory();
    }

    filterAuditTrail() {
      const search = (document.getElementById('auditSearchInput').value || '').toLowerCase();
      const moduleFilter = document.getElementById('auditModuleFilter').value;

      const filtered = this.auditTrail.filter(entry => {
        if (search && !entry.user.toLowerCase().includes(search) &&
            !entry.recordId.toLowerCase().includes(search) &&
            !entry.action.toLowerCase().includes(search)) {
          return false;
        }
        if (moduleFilter !== 'ALL' && entry.module !== moduleFilter) return false;
        return true;
      });

      const tbody = document.getElementById('auditHistoryTbody');
      if (!tbody) return;

      tbody.innerHTML = filtered.map(entry => {
        let tagCls = 'badge-info';
        if (entry.status === 'SUCCESS') tagCls = 'badge-success';
        else if (entry.status === 'CRITICAL') tagCls = 'badge-critical';
        else if (entry.status === 'ALERT') tagCls = 'badge-high';

        return `
          <tr>
            <td style="white-space:nowrap; font-size:11.5px;">${entry.timestamp}</td>
            <td><strong>${entry.user}</strong></td>
            <td style="font-size:11.5px;"><code>${entry.action}</code></td>
            <td>${entry.module}</td>
            <td style="font-family:monospace; font-size:11.5px;">${entry.recordId || 'N/A'}</td>
            <td><span class="badge badge-info">${entry.prevStatus}</span></td>
            <td><span class="badge ${tagCls}">${entry.newStatus}</span></td>
            <td style="font-family:monospace; font-size:10.5px; color:#475569;">${entry.ipAddress}</td>
            <td><span class="badge ${tagCls}">${entry.status}</span></td>
          </tr>
        `;
      }).join('');
    }

    // --- Expiry & Validity Surveillance Engine ---
    renderExpiryView() {
      this.currentExpiryFilter = this.currentExpiryFilter || 'ALL';
      this.filterExpiryDocs(this.currentExpiryFilter);
    }

    filterExpiryDocs(status) {
      this.currentExpiryFilter = status;
      const allDocs = [
        { bidder: 'Tech Solutions Pvt Ltd (Bidder A)', doc: 'ISO 9001:2015 Quality Management', issue: '2023-08-15', expiry: '2026-08-14', days: -22, status: 'EXPIRED' },
        { bidder: 'Tech Solutions Pvt Ltd (Bidder A)', doc: 'Factory License (Form 4)', issue: '2024-10-01', expiry: '2026-09-20', days: 15, status: 'CRITICAL' },
        { bidder: 'InfraTech Corp Ltd (Bidder B)', doc: 'PESO Explosives Storage License', issue: '2024-11-10', expiry: '2026-10-25', days: 50, status: 'EXPIRING_SOON' },
        { bidder: 'InfraTech Corp Ltd (Bidder B)', doc: 'ISO 27001:2022 InfoSec Cert', issue: '2025-01-01', expiry: '2028-01-01', days: 483, status: 'VALID' },
        { bidder: 'Global Power Systems (Bidder C)', doc: 'Class-1 Electrical Contractor License', issue: '2024-05-15', expiry: '2027-05-14', days: 251, status: 'VALID' },
        { bidder: 'Global Power Systems (Bidder C)', doc: 'Pollution Control Board Consent (CTO)', issue: '2024-04-10', expiry: '2026-10-10', days: 35, status: 'EXPIRING_SOON' },
        { bidder: 'Shree Balaji Transporters (Bidder D)', doc: 'National Highway Fleet Permit', issue: '2025-02-01', expiry: '2027-02-01', days: 514, status: 'VALID' },
        { bidder: 'Shree Balaji Transporters (Bidder D)', doc: 'Hazardous Chemical Carriage Cert', issue: '2025-03-10', expiry: '2027-03-10', days: 551, status: 'VALID' }
      ];

      const filtered = status === 'ALL' ? allDocs : allDocs.filter(d => d.status === status);
      const tbody = document.getElementById('expiryTableBody');
      if (!tbody) return;

      tbody.innerHTML = filtered.map(item => {
        let badgeCls = 'badge-success';
        if (item.status === 'EXPIRED' || item.status === 'CRITICAL') badgeCls = 'badge-error';
        else if (item.status === 'EXPIRING_SOON') badgeCls = 'badge-warning';

        return `
          <tr>
            <td><strong>${item.bidder}</strong></td>
            <td>${item.doc}</td>
            <td>${item.issue}</td>
            <td>${item.expiry}</td>
            <td><span class="badge ${badgeCls}">${item.days > 0 ? item.days + ' days' : item.days + ' days (Overdue)'}</span></td>
            <td><span class="badge ${badgeCls}">${item.status}</span></td>
            <td>
              ${item.status === 'EXPIRED' 
                ? `<button class="btn btn-secondary btn-sm" onclick="alert('Statutory Expiry Disqualification Notice logged in audit trail.')">Issue Notice</button>`
                : item.status === 'CRITICAL'
                ? `<button class="btn btn-secondary btn-sm" onclick="alert('Statutory Cure Citation dispatched to bidder.')">Demand Renewal</button>`
                : `<span style="font-size:12px; color:#166534;">Verified Active</span>`
              }
            </td>
          </tr>
        `;
      }).join('');
    }

    // --- SmartBid Perspective & Explainable AI Suite ---
    renderSmartBidView() {
      this.currentSmartBidPerspective = this.currentSmartBidPerspective || 'overall';
      this.setSmartBidPerspective(this.currentSmartBidPerspective);
    }

    onSmartBidTenderChange(tenderId) {
      this.currentTenderId = tenderId;
      this.setSmartBidPerspective(this.currentSmartBidPerspective || 'overall');
    }

    setSmartBidPerspective(perspective) {
      this.currentSmartBidPerspective = perspective;

      // Update active button state
      document.querySelectorAll('.smartbid-persp-btn').forEach(btn => btn.classList.remove('active'));
      const activeBtn = document.getElementById(`btn-persp-${perspective}`);
      if (activeBtn) activeBtn.classList.add('active');

      // Perspective weights configurations
      const perspectives = {
        overall: {
          weights: { price: '20%', compliance: '25%', experience: '15%', performance: '15%', financial: '10%', risk: '15%' },
          scores: { a: '58.4 / 100', b: '92.4 / 100', c: '84.1 / 100' },
          title: 'Bidder B (InfraTech Corp Ltd) — Superior Overall Value (Score: 92.4/100)',
          reason: '<strong>Strategic Trade-off Analysis:</strong> While <strong>Bidder A (Tech Solutions)</strong> offered the lowest price (₹8.50 Cr vs ₹9.20 Cr), they exhibit critical non-compliances (insufficient audited turnover of ₹9.8 Cr vs ₹10 Cr req, expired ISO cert, and active CBI inquiry citation). In contrast, <strong>Bidder B</strong> offers 98% compliance, verified 12-project past performance, zero debarment history, and 5-year defect-free SLA record. <em>Lowest price does NOT constitute best value.</em>',
          recBidder: 'b'
        },
        vfm: {
          weights: { price: '25%', compliance: '20%', experience: '15%', performance: '15%', financial: '10%', risk: '15%' },
          scores: { a: '61.2 / 100', b: '91.8 / 100', c: '82.0 / 100' },
          title: 'Bidder B (InfraTech Corp Ltd) — Prime Value-for-Money Recommendation',
          reason: '<strong>Value-For-Money Analysis:</strong> Bidder B provides the optimal balance of competitive pricing (only 8.2% above L1) with 98% compliance and proven execution capability. Bidder A has high lifecycle risk that exceeds the 8.2% cost differential.',
          recBidder: 'b'
        },
        experience: {
          weights: { price: '10%', compliance: '20%', experience: '35%', performance: '15%', financial: '10%', risk: '10%' },
          scores: { a: '48.1 / 100', b: '95.6 / 100', c: '88.2 / 100' },
          title: 'Bidder B (InfraTech Corp Ltd) — Dominant Technical Experience Leader (Score: 95.6/100)',
          reason: '<strong>Experience Priority:</strong> Bidder B has delivered 12 high-pressure pipeline contracts (₹84 Cr aggregate value) with identical technical specifications. Bidder A only has 3 minor projects.',
          recBidder: 'b'
        },
        performance: {
          weights: { price: '10%', compliance: '20%', experience: '15%', performance: '35%', financial: '10%', risk: '10%' },
          scores: { a: '49.8 / 100', b: '96.2 / 100', c: '89.4 / 100' },
          title: 'Bidder B (InfraTech Corp Ltd) — Highest On-Field Reliability (Score: 96.2/100)',
          reason: '<strong>Performance Priority:</strong> Zero defect citations and 100% on-time milestone delivery across last 5 years verified via GeM buyer feedback registry.',
          recBidder: 'b'
        },
        compliance: {
          weights: { price: '10%', compliance: '40%', experience: '10%', performance: '15%', financial: '10%', risk: '15%' },
          scores: { a: '41.2 / 100', b: '96.8 / 100', c: '92.1 / 100' },
          title: 'Bidder B (InfraTech Corp Ltd) — Full Statutory Compliance (Score: 96.8/100)',
          reason: '<strong>Compliance Priority:</strong> 14 of 14 statutory requirements satisfied with cryptographically verified registry proofs. Bidder A disqualified due to statutory turnover shortfall.',
          recBidder: 'b'
        },
        risk: {
          weights: { price: '5%', compliance: '25%', experience: '5%', performance: '10%', financial: '15%', risk: '40%' },
          scores: { a: '32.5 / 100', b: '94.0 / 100', c: '91.5 / 100' },
          title: 'Bidder B (InfraTech Corp Ltd) — Cleanest Risk & Governance Profile (Score: 94.0/100)',
          reason: '<strong>Risk & Governance Priority:</strong> Bidder A penalized heavily for active legal prosecution citation and expired statutory certifications. Bidder B verified clean across MCA21, CVC, and GeM registries.',
          recBidder: 'b'
        },
        integrity: {
          weights: { price: '10%', compliance: '20%', experience: '15%', performance: '15%', financial: '10%', risk: '30%' },
          scores: { a: '38.4 / 100', b: '95.2 / 100', c: '92.6 / 100' },
          title: 'Bidder B (InfraTech Corp Ltd) — Pristine Integrity & Clean Debarment Standing (Score: 95.2/100)',
          reason: '<strong>Integrity Priority Analysis:</strong> Scrutinizes debarment registries, contract termination records, and regulatory clearances. <strong>Bidder B</strong> is verified 100% clean across CVC, MCA21, and GeM registries with zero defaults. In contrast, <strong>Bidder A</strong> suffers severe deductions due to active legal inquiries and adverse vigilance citations. <em>Integrity and probity in public procurement are non-negotiable.</em>',
          recBidder: 'b'
        },
        risk_adjusted_vfm: {
          weights: { price: '20%', compliance: '20%', experience: '15%', performance: '15%', financial: '10%', risk: '20%' },
          scores: { a: '52.1 / 100', b: '93.8 / 100', c: '87.4 / 100' },
          title: 'Bidder B (InfraTech Corp Ltd) — Optimal Risk-Adjusted Value for Money (Score: 93.8/100)',
          reason: '<strong>Risk-Adjusted Value-for-Money:</strong> Reconciles commercial quotes against operational and legal risk exposure. Although <strong>Bidder A</strong> is priced at ₹8.50 Cr vs Bidder B\'s ₹9.20 Cr (+8.2%), Bidder A\'s contract dispute exposure and historical SLA delay penalties create an estimated ₹1.85 Cr lifecycle contingency risk, making Bidder B the genuinely superior economic value.',
          recBidder: 'b'
        }
      };

      const p = perspectives[perspective] || perspectives.overall;

      // Update table weights
      if (document.getElementById('wt-price')) document.getElementById('wt-price').textContent = p.weights.price;
      if (document.getElementById('wt-compliance')) document.getElementById('wt-compliance').textContent = p.weights.compliance;
      if (document.getElementById('wt-experience')) document.getElementById('wt-experience').textContent = p.weights.experience;
      if (document.getElementById('wt-performance')) document.getElementById('wt-performance').textContent = p.weights.performance;
      if (document.getElementById('wt-financial')) document.getElementById('wt-financial').textContent = p.weights.financial;
      if (document.getElementById('wt-risk')) document.getElementById('wt-risk').textContent = p.weights.risk;

      // Update final scores
      if (document.getElementById('score-bidder-a')) document.getElementById('score-bidder-a').textContent = p.scores.a;
      if (document.getElementById('score-bidder-b')) document.getElementById('score-bidder-b').textContent = p.scores.b;
      if (document.getElementById('score-bidder-c')) document.getElementById('score-bidder-c').textContent = p.scores.c;

      // Update banner
      if (document.getElementById('smartbidRecommendedBidderTitle')) document.getElementById('smartbidRecommendedBidderTitle').textContent = p.title;
      if (document.getElementById('smartbidRecommendationReason')) document.getElementById('smartbidRecommendationReason').innerHTML = p.reason;
    }

    showExplainableAiModal(bidderKey) {
      const modal = document.getElementById('explainableAiModal');
      const title = document.getElementById('explainModalTitle');
      const content = document.getElementById('explainModalContent');
      if (!modal || !content) return;

      const explanations = {
        bidder_a: {
          name: 'Bidder A (Tech Solutions Pvt Ltd)',
          score: '58.4 / 100',
          verdict: 'DISQUALIFIED / NOT RECOMMENDED',
          verdictClass: 'badge-error',
          factors: [
            { dimension: 'Financial Price', raw: '100/100 (₹8.50 Cr)', weight: '20%', contrib: '+20.0', reason: 'Lowest submitted commercial quote (L1)', citation: 'Financial Bid Form B - Page 2' },
            { dimension: 'Statutory Compliance', raw: '62/100', weight: '25%', contrib: '+15.5', reason: 'Audited turnover ₹9.8 Cr is below mandatory ₹10.0 Cr threshold', citation: 'CA Turnover Certificate 2025' },
            { dimension: 'Technical Experience', raw: '50/100', weight: '15%', contrib: '+7.5', reason: 'Only 3 completed projects; none in cryogenic SCADA', citation: 'Technical Annexure 3 - Experience Schedule' },
            { dimension: 'Past Performance', raw: '40/100', weight: '15%', contrib: '+6.0', reason: 'Two logged delivery SLA delay citations on GeM in 2025', citation: 'GeM Central Rating Registry' },
            { dimension: 'Financial Stability', raw: '64/100', weight: '10%', contrib: '+6.4', reason: 'Working capital ratio is tight (1.1 vs 1.5 norm)', citation: 'MCA21 Balance Sheet 2024-25' },
            { dimension: 'Risk & Debarment', raw: '20/100', weight: '15%', contrib: '+3.0', reason: 'Active CBI prosecution inquiry citation flagged in e-Courts', citation: 'CVC / CBI Vigilance Bulletins 2025' }
          ]
        },
        bidder_b: {
          name: 'Bidder B (InfraTech Corp Ltd)',
          score: '92.4 / 100',
          verdict: '★ RECOMMENDED FOR PROCUREMENT AWARD (VALUE FOR MONEY)',
          verdictClass: 'badge-success',
          factors: [
            { dimension: 'Financial Price', raw: '92/100 (₹9.20 Cr)', weight: '20%', contrib: '+18.4', reason: 'Competitive commercial quote (+8.2% over L1)', citation: 'Financial Bid Form B - Page 2' },
            { dimension: 'Statutory Compliance', raw: '98/100', weight: '25%', contrib: '+24.5', reason: '14 of 14 mandatory statutory requirements satisfied with valid docs', citation: 'Compliance Matrix - Tender #4929' },
            { dimension: 'Technical Experience', raw: '96/100', weight: '15%', contrib: '+14.4', reason: '12 high-pressure pipeline contracts (₹84 Cr aggregate value)', citation: 'Client Completion Certificates (IOCL/GAIL)' },
            { dimension: 'Past Performance', raw: '98/100', weight: '15%', contrib: '+14.7', reason: 'Zero defect citations and 100% on-time delivery across 5 years', citation: 'GeM Central Vendor Scorecard' },
            { dimension: 'Financial Stability', raw: '94/100', weight: '10%', contrib: '+9.4', reason: '₹45.2 Cr turnover, audited net worth ₹18.5 Cr', citation: 'Audited Financials FY 2024-25' },
            { dimension: 'Risk & Debarment', raw: '100/100', weight: '15%', contrib: '+15.0', reason: 'Zero debarment or blacklisting records across all checked registries', citation: 'MCA21 / CVC / GeM Blacklist Registry' }
          ]
        },
        bidder_c: {
          name: 'Bidder C (Global Systems Ltd)',
          score: '84.1 / 100',
          verdict: 'QUALIFIED / HIGH PRICE PREMIUM',
          verdictClass: 'badge-info',
          factors: [
            { dimension: 'Financial Price', raw: '72/100 (₹11.80 Cr)', weight: '20%', contrib: '+14.4', reason: 'Commercial quote is 38.8% above L1, exceeds allocated budget estimate', citation: 'Financial Bid Form B - Page 2' },
            { dimension: 'Statutory Compliance', raw: '94/100', weight: '25%', contrib: '+23.5', reason: 'All critical requirements passed; minor non-material documentation delay', citation: 'Compliance Scrutiny Sheet' },
            { dimension: 'Technical Experience', raw: '90/100', weight: '15%', contrib: '+13.5', reason: '8 high-value projects completed in international jurisdictions', citation: 'Project Track Record Annexure' },
            { dimension: 'Past Performance', raw: '92/100', weight: '15%', contrib: '+13.8', reason: 'Strong 98.2% SLA adherence track record', citation: 'GeM Vendor Performance Matrix' },
            { dimension: 'Financial Stability', raw: '98/100', weight: '10%', contrib: '+9.8', reason: '₹120 Cr turnover, multinational balance sheet stability', citation: 'MCA21 Registry Records FY 2024-25' },
            { dimension: 'Risk & Debarment', raw: '100/100', weight: '15%', contrib: '+15.0', reason: 'Zero adverse regulatory records found in authoritative sources', citation: 'CVC / MoPNG Governance Archive' }
          ]
        }
      };

      const exp = explanations[bidderKey] || explanations.bidder_b;
      if (title) title.textContent = `Explainable AI Traceability — ${exp.name}`;

      content.innerHTML = `
        <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:14px; border-radius:4px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span style="font-size:11px; color:#64748B; font-weight:bold; text-transform:uppercase;">Composite AI Score</span>
            <div style="font-size:22px; font-weight:800; color:var(--parakh-navy);">${exp.score}</div>
          </div>
          <div>
            <span class="badge ${exp.verdictClass}" style="font-size:12px; padding:6px 12px;">${exp.verdict}</span>
          </div>
        </div>

        <h4 style="color:var(--parakh-navy); margin-bottom:8px; font-size:14px;">Factor Breakdown & Evidence Grounding ("WHY?" Analysis)</h4>
        <p style="font-size:12px; color:#475569; margin-bottom:12px;">
          Every score component is derived from deterministic rules and verified documentation citations. No black-box or hallucinated metrics.
        </p>

        <table class="data-table" style="font-size:12px;">
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Raw Metric</th>
              <th>Weight</th>
              <th>Contribution</th>
              <th>Algorithmic Rationale</th>
              <th>Document Citation / Source</th>
            </tr>
          </thead>
          <tbody>
            ${exp.factors.map(f => `
              <tr>
                <td><strong>${f.dimension}</strong></td>
                <td>${f.raw}</td>
                <td><code>${f.weight}</code></td>
                <td><strong style="color:var(--parakh-teal);">${f.contrib}</strong></td>
                <td>${f.reason}</td>
                <td style="font-family:monospace; font-size:11px; color:#0369A1;">${f.citation}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top:16px; padding:12px; background:#EFF6FF; border-radius:4px; border:1px solid #BFDBFE; font-size:12px; color:#1E40AF;">
          <strong>Official Governance Note:</strong> This Explainable AI breakdown adheres to Government of India procurement transparency guidelines. Final award decision rests with the authorized Tender Committee.
        </div>
      `;

      modal.style.display = 'flex';
    }

    closeExplainableAiModal() {
      const modal = document.getElementById('explainableAiModal');
      if (modal) modal.style.display = 'none';
    }

    // --- Administration Tabs ---
    switchAdminTab(tabName) {
      this.activeAdminTab = tabName;
      const tabBtns = document.querySelectorAll('.admin-tab-btn');
      tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      const contents = document.querySelectorAll('.admin-tab-content');
      contents.forEach(c => c.style.display = 'none');

      const target = document.getElementById(`admin-tab-${tabName}`);
      if (target) target.style.display = 'block';
    }

    // --- Integrity & Risk Intelligence USP ---
    renderIntegrityRiskView(bidId) {
      this.currentIntegrityBidderId = bidId || this.currentIntegrityBidderId || 'BID-2026-002';
      const selectEl = document.getElementById('integrityBidderSelect');
      if (selectEl) selectEl.value = this.currentIntegrityBidderId;

      // Realistic Ground-Truth Profiles for Bidders
      const profiles = {
        'BID-2026-002': {
          id: 'BID-2026-002',
          bidder_name: 'XYZ Infra Solutions Pvt Ltd',
          integrity_score: 94.0,
          risk_level: 'LOW RISK',
          level_color: '#166534',
          level_desc: 'Safe statutory & delivery standing',
          debarment_status: 'NO RECORD FOUND',
          warnings_count: 0,
          warnings_desc: 'Zero critical signals',
          has_alert: false,
          dimensions: {
            debarment: { score: '25.0 / 25', status: 'No record found in CVC / GeM', color: '#166534' },
            compliance: { score: '20.0 / 20', status: '0 violations on record', color: '#166534' },
            performance: { score: '19.2 / 20', status: '96.0% verified SLA rate', color: '#166534' },
            defaults: { score: '15.0 / 15', status: '0 defaults recorded', color: '#166534' },
            regulatory: { score: '10.0 / 10', status: 'All clearances active', color: '#166534' },
            legal: { score: '10.0 / 10', status: 'No adverse litigation recorded', color: '#166534' }
          },
          signals: [
            {
              id: 'SIG-XYZ-01',
              category: 'DEBARMENT',
              severity: 'INFO',
              title: 'CVC Central Gazette Scrutiny',
              description: 'No active or historical debarment or blacklisting orders found in Central Vigilance Commission register.',
              status: 'VERIFIED_CLEAR',
              source: 'Central Vigilance Commission (CVC)',
              source_type: 'AUTHORITATIVE',
              evidence: 'CVC Gazette Archive 2026-Q3',
              date: '04-Sep-2026',
              review_status: 'VERIFIED',
              recommended_action: 'Routine procurement clearance'
            },
            {
              id: 'SIG-XYZ-02',
              category: 'CONTRACT_VIOLATION',
              severity: 'INFO',
              title: 'GeM Past Contract Audit',
              description: 'All 8 past public procurement contracts executed without default or penalty deduction.',
              status: 'VERIFIED_CLEAR',
              source: 'GeM Central Contractor Ledger',
              source_type: 'AUTHORITATIVE',
              evidence: 'Contract Completion Certificates #CC-4901..#CC-4908',
              date: '01-Sep-2026',
              review_status: 'VERIFIED',
              recommended_action: 'Proceed with technical evaluation'
            }
          ]
        },
        'BID-2026-004': {
          id: 'BID-2026-004',
          bidder_name: 'Kirloskar Dynamics Ltd.',
          integrity_score: 92.4,
          risk_level: 'LOW RISK',
          level_color: '#166534',
          level_desc: 'High integrity, robust past execution',
          debarment_status: 'NO RECORD FOUND',
          warnings_count: 0,
          warnings_desc: 'Zero critical signals',
          has_alert: false,
          dimensions: {
            debarment: { score: '25.0 / 25', status: 'No record found in CVC', color: '#166534' },
            compliance: { score: '20.0 / 20', status: '0 violations on record', color: '#166534' },
            performance: { score: '19.6 / 20', status: '98.2% verified SLA rate', color: '#166534' },
            defaults: { score: '15.0 / 15', status: '0 defaults recorded', color: '#166534' },
            regulatory: { score: '10.0 / 10', status: 'All clearances active', color: '#166534' },
            legal: { score: '8.5 / 10', status: 'Commercial arbitration (Allegation != Guilt)', color: '#0369A1' }
          },
          signals: [
            {
              id: 'SIG-KIR-01',
              category: 'LITIGATION',
              severity: 'LOW',
              title: 'Commercial Price Indexation Arbitration',
              description: 'Commercial arbitration matter pending before High Court of Delhi regarding steel price escalation formula on project HVJ-2022. Non-criminal, purely commercial dispute.',
              status: 'PENDING',
              source: 'High Court of Delhi e-Courts Registry',
              source_type: 'AUTHORITATIVE',
              evidence: 'OMP (COMM) 142/2024',
              date: '18-Aug-2026',
              review_status: 'PENDING_REVIEW',
              recommended_action: 'Allegation != Guilt: Does not impede technical eligibility'
            },
            {
              id: 'SIG-KIR-02',
              category: 'PERFORMANCE',
              severity: 'INFO',
              title: 'Exemplary On-Field Milestone Delivery',
              description: 'Completed 12 high-pressure pipeline contracts (aggregate ₹84 Cr) with zero defect liability notices.',
              status: 'VERIFIED_CLEAR',
              source: 'IOCL & GAIL Joint Performance Ledger',
              source_type: 'AUTHORITATIVE',
              evidence: 'GeM Buyer Rating: 4.95 / 5.00',
              date: '28-Aug-2026',
              review_status: 'VERIFIED',
              recommended_action: 'Eligible for preferential technical scoring'
            }
          ]
        },
        'BID-2026-003': {
          id: 'BID-2026-003',
          bidder_name: 'Bharat Industrial Systems',
          integrity_score: 68.0,
          risk_level: 'MEDIUM RISK',
          level_color: '#C25E00',
          level_desc: 'Review required — historical delay records',
          debarment_status: 'NO RECORD FOUND',
          warnings_count: 1,
          warnings_desc: '1 non-critical delay citation',
          has_alert: true,
          alert_title: 'Historical Contract SLA Delay Flagged',
          alert_summary: 'GeM Contractor Performance Ledger logged a 42-day milestone delay on Contract GEM-2025-C-4412. Liquidated damages (LD) of ₹4.8 Lakh were recovered. Contract subsequently closed successfully.',
          alert_action: 'Verify whether current tender capacity allows parallel execution without milestone slippage.',
          dimensions: {
            debarment: { score: '25.0 / 25', status: 'No record found in CVC', color: '#166534' },
            compliance: { score: '15.0 / 20', status: '1 documentation delay recorded', color: '#C25E00' },
            performance: { score: '12.0 / 20', status: '88.0% verified SLA delivery', color: '#C25E00' },
            defaults: { score: '11.0 / 15', status: '1 cure notice issued in 2025', color: '#C25E00' },
            regulatory: { score: '9.0 / 10', status: 'Factory license renewed', color: '#166534' },
            legal: { score: '7.0 / 10', status: '1 pending commercial suit', color: '#C25E00' }
          },
          signals: [
            {
              id: 'SIG-BHA-01',
              category: 'PERFORMANCE',
              severity: 'MEDIUM',
              title: 'Delivery Schedule Delay Citation',
              description: 'Delayed delivery of cryogenic ball valves by 42 days on IOCL Paradip Refinery contract. Liquidated damages recovered.',
              status: 'RESOLVED',
              source: 'IOCL Project Directorate',
              source_type: 'AUTHORITATIVE',
              evidence: 'LD Recovery Memo #IOCL-PDR-2025-99',
              date: '14-Nov-2025',
              review_status: 'REVIEWED',
              recommended_action: 'Review current project schedule commitments'
            },
            {
              id: 'SIG-BHA-02',
              category: 'LITIGATION',
              severity: 'MEDIUM',
              title: 'Subcontractor Civil Claim Pending',
              description: 'Commercial suit filed by subcontractor claiming unpaid fabrication invoices of ₹22 Lakh. Case sub-judice.',
              status: 'UNDER_INVESTIGATION',
              source: 'City Civil Court Bengaluru',
              source_type: 'VERIFIED',
              evidence: 'Civil Suit #OS-4881/2025',
              date: '05-Jul-2026',
              review_status: 'PENDING_REVIEW',
              recommended_action: 'Review financial liquidity buffers'
            }
          ]
        },
        'BID-2026-005': {
          id: 'BID-2026-005',
          bidder_name: 'CyberTech Solutions LLP',
          integrity_score: 41.2,
          risk_level: 'HIGH RISK',
          level_color: '#DC2626',
          level_desc: 'Serious verified risk indicators identified',
          debarment_status: 'ACTIVE DEBARMENT IDENTIFIED',
          warnings_count: 2,
          warnings_desc: 'Critical early warning triggered',
          has_alert: true,
          alert_title: 'HIGH-RISK EARLY WARNING: Active Debarment & Contract Termination',
          alert_summary: 'Official Ministry of Finance Gazette debarment order #F-11/2024 active until 11-Nov-2026. Additionally, Contract GEM-2024-C-9901 was terminated for cause due to abandonment of works.',
          alert_action: 'Statutory Tender Committee Scrutiny Mandatory: Verify whether debarment scope applies to current procurement category before tender opening.',
          dimensions: {
            debarment: { score: '0.0 / 25', status: 'Active debarment record identified', color: '#DC2626' },
            compliance: { score: '8.0 / 20', status: 'Multiple non-compliance orders', color: '#DC2626' },
            performance: { score: '6.0 / 20', status: 'Contract terminated for cause', color: '#DC2626' },
            defaults: { score: '5.0 / 15', status: 'Repeated bid abandonment', color: '#DC2626' },
            regulatory: { score: '6.0 / 10', status: 'Show cause notice pending', color: '#DC2626' },
            legal: { score: '4.0 / 10', status: 'Serious prosecution cited', color: '#DC2626' }
          },
          signals: [
            {
              id: 'SIG-CYB-01',
              category: 'DEBARMENT',
              severity: 'CRITICAL',
              title: 'Active Central Debarment Order',
              description: 'Debarred from participating in central government tenders for 2 years w.e.f. 12-Nov-2024 due to supply of non-conforming sub-assemblies.',
              status: 'PROVEN_VIOLATION',
              source: 'Ministry of Finance Gazette Bulletin',
              source_type: 'AUTHORITATIVE',
              evidence: 'Order #F-11/2024 / CVC Circular 18/2024',
              date: '12-Nov-2024',
              review_status: 'PENDING_REVIEW',
              recommended_action: 'Statutory tender committee determination required'
            },
            {
              id: 'SIG-CYB-02',
              category: 'CONTRACT_VIOLATION',
              severity: 'CRITICAL',
              title: 'Contract Termination for Cause',
              description: 'Contract GEM-2024-C-9901 for Supervisory Control integration terminated for cause following complete site abandonment.',
              status: 'PROVEN_VIOLATION',
              source: 'GeM Default Contractor Register',
              source_type: 'AUTHORITATIVE',
              evidence: 'Termination Notice #GEM-TERM-9901',
              date: '15-Jan-2025',
              review_status: 'PENDING_REVIEW',
              recommended_action: 'Examine applicability of General Financial Rules (GFR 151)'
            },
            {
              id: 'SIG-CYB-03',
              category: 'TENDER_DEFAULT',
              severity: 'HIGH',
              title: 'Repeated Tender Default / Post-Award Withdrawal',
              description: 'Withdrew bid after commercial opening in IOCL Tender 4402 without statutory cause; EMD of ₹5 Lakh forfeited.',
              status: 'ADJUDICATED',
              source: 'Central Public Procurement Portal',
              source_type: 'AUTHORITATIVE',
              evidence: 'CPPP Forfeiture Order #CPPP-2025-4402',
              date: '20-May-2025',
              review_status: 'PENDING_REVIEW',
              recommended_action: 'Evaluate financial reliability and bidder credibility'
            }
          ]
        }
      };

      const prof = profiles[this.currentIntegrityBidderId] || profiles['BID-2026-002'];
      this.activeIntegrityProfile = prof;
      this.activeIntegritySignals = [...prof.signals];

      // Update KPI scorecards
      const scoreEl = document.getElementById('riskIntegrityScore');
      if (scoreEl) scoreEl.textContent = `${prof.integrity_score.toFixed(1)} / 100`;

      const subTitleEl = document.getElementById('riskIntegritySubtitle');
      if (subTitleEl) subTitleEl.textContent = prof.level_desc;

      const levelBadge = document.getElementById('riskLevelBadge');
      if (levelBadge) {
        levelBadge.textContent = prof.risk_level;
        levelBadge.style.color = prof.level_color;
      }
      const levelCard = document.getElementById('riskLevelCard');
      if (levelCard) levelCard.style.borderTop = `3px solid ${prof.level_color}`;

      const debarmentEl = document.getElementById('riskDebarmentStatus');
      if (debarmentEl) {
        debarmentEl.textContent = prof.debarment_status;
        debarmentEl.style.color = prof.debarment_status.includes('ACTIVE') ? '#DC2626' : '#166534';
      }

      const warningsEl = document.getElementById('riskEarlyWarningsCount');
      if (warningsEl) {
        warningsEl.textContent = prof.warnings_count;
        warningsEl.style.color = prof.warnings_count > 0 ? (prof.warnings_count >= 2 ? '#DC2626' : '#C25E00') : '#166534';
      }
      const warningsDesc = document.getElementById('riskEarlyWarningsDesc');
      if (warningsDesc) warningsDesc.textContent = prof.warnings_desc;

      // Early Warning Alert Box
      const alertBox = document.getElementById('riskEarlyWarningAlertBox');
      if (alertBox) {
        if (prof.has_alert) {
          alertBox.style.display = 'block';
          const title = document.getElementById('earlyWarningTitle');
          if (title) title.textContent = prof.alert_title;
          const summary = document.getElementById('earlyWarningSummary');
          if (summary) summary.innerHTML = `${prof.alert_summary}<br><span style="display:inline-block; margin-top:6px; color:#7F1D1D;"><strong>Recommended Action:</strong> ${prof.alert_action}</span>`;
        } else {
          alertBox.style.display = 'none';
        }
      }

      // 6 Dimensions Grid
      if (prof.dimensions) {
        const d = prof.dimensions;
        const setDim = (scoreId, statusId, data) => {
          const s = document.getElementById(scoreId);
          const st = document.getElementById(statusId);
          if (s) { s.textContent = data.score; s.style.color = data.color; }
          if (st) st.textContent = data.status;
        };
        setDim('dimScoreDebarment', 'dimStatusDebarment', d.debarment);
        setDim('dimScoreCompliance', 'dimStatusCompliance', d.compliance);
        setDim('dimScorePerformance', 'dimStatusPerformance', d.performance);
        setDim('dimScoreDefault', 'dimStatusDefault', d.defaults);
        setDim('dimScoreRegulatory', 'dimStatusRegulatory', d.regulatory);
        setDim('dimScoreLegal', 'dimStatusLegal', d.legal);
      }

      this.renderSignalsTable(this.activeIntegritySignals);
    }

    onIntegrityBidderChange(bidId) {
      this.renderIntegrityRiskView(bidId);
    }

    reanalyzeIntegrity() {
      const bidderId = this.currentIntegrityBidderId || 'BID-2026-002';
      alert(`[PARAKH AI - Integrity & Risk Engine]\nQuerying official registries:\n- Central Vigilance Commission (CVC Gazette)\n- GeM Default Contractor Register\n- MCA21 & GSTN Central Portals\n- e-Courts Commercial Dispute Index\n\nRegistry data re-synchronized. Risk profile recomputed.`);
      this.renderIntegrityRiskView(bidderId);
    }

    filterSignals(filter) {
      if (!this.activeIntegrityProfile) return;
      let list = this.activeIntegrityProfile.signals || [];
      if (filter !== 'ALL') {
        list = list.filter(s => s.severity === filter);
      }
      this.renderSignalsTable(list);
    }

    renderSignalsTable(signals) {
      const tbody = document.getElementById('riskSignalsTableBody');
      if (!tbody) return;

      if (!signals || signals.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align:center; padding:24px; color:#64748B;">
              <strong>NO RISK SIGNALS FOUND</strong><br>
              <span style="font-size:11px;">No adverse findings matching the selected filter were identified in authoritative sources.</span>
            </td>
          </tr>
        `;
        return;
      }

      const getSeverityBadge = (sev) => {
        if (sev === 'CRITICAL') return '<span class="badge badge-error" style="font-weight:800;">CRITICAL</span>';
        if (sev === 'HIGH') return '<span class="badge badge-error">HIGH</span>';
        if (sev === 'MEDIUM') return '<span class="badge badge-warning">MEDIUM</span>';
        return '<span class="badge badge-success">INFO / CLEAR</span>';
      };

      const getLegalStatusBadge = (status) => {
        if (status === 'PROVEN_VIOLATION') return '<span style="color:#DC2626; font-weight:700; font-size:11px;">PROVEN VIOLATION</span>';
        if (status === 'ADJUDICATED') return '<span style="color:#991B1B; font-weight:700; font-size:11px;">ADJUDICATED</span>';
        if (status === 'UNDER_INVESTIGATION') return '<span style="color:#C25E00; font-weight:700; font-size:11px;">INVESTIGATION</span>';
        if (status === 'PENDING') return '<span style="color:#0369A1; font-weight:700; font-size:11px;">PENDING (ALLEGATION)</span>';
        if (status === 'RESOLVED') return '<span style="color:#475569; font-weight:700; font-size:11px;">RESOLVED</span>';
        return '<span style="color:#166534; font-weight:700; font-size:11px;">VERIFIED CLEAR</span>';
      };

      tbody.innerHTML = signals.map(sig => `
        <tr>
          <td><strong style="color:var(--parakh-navy); font-size:11px;">${sig.category}</strong></td>
          <td>${getSeverityBadge(sig.severity)}</td>
          <td>
            <div style="font-weight:700; color:var(--parakh-navy); margin-bottom:2px;">${sig.title}</div>
            <div style="font-size:11.5px; color:#334155; line-height:1.4;">${sig.description}</div>
            <div style="font-size:10.5px; color:#64748B; margin-top:4px;">
              <strong>Recommended Action:</strong> ${sig.recommended_action}
            </div>
          </td>
          <td>${getLegalStatusBadge(sig.status)}</td>
          <td>
            <div style="font-weight:600; font-size:11.5px; color:#0F172A;">${sig.source}</div>
            <div style="font-size:10.5px; font-family:monospace; color:#0369A1;">${sig.evidence}</div>
            <div style="font-size:10px; color:#64748B;">Date: ${sig.date} (${sig.source_type})</div>
          </td>
          <td>
            <span class="badge ${sig.review_status === 'VERIFIED' ? 'badge-success' : (sig.review_status === 'OVERRIDDEN' ? 'badge-info' : 'badge-warning')}" style="font-size:10px;">
              ${sig.review_status}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="parakhApp.openRiskReviewModal('${sig.id}')" style="padding:4px 8px; font-size:11px;">
              Review Finding
            </button>
          </td>
        </tr>
      `).join('');
    }

    openRiskReviewModal(signalId) {
      if (!this.activeIntegritySignals) return;
      const sig = this.activeIntegritySignals.find(s => s.id === signalId);
      if (!sig) return;

      document.getElementById('modalSignalId').value = sig.id;
      document.getElementById('modalSignalTitle').textContent = `[${sig.category}] ${sig.title}`;
      document.getElementById('modalSignalDesc').textContent = sig.description;
      document.getElementById('modalSignalSource').textContent = `${sig.source} (${sig.source_type} - Date: ${sig.date})`;
      document.getElementById('modalSignalEvidence').textContent = sig.evidence;
      document.getElementById('modalReviewAction').value = 'REVIEWED';
      document.getElementById('modalReviewNotes').value = '';

      const modal = document.getElementById('riskReviewModal');
      if (modal) modal.style.display = 'flex';
    }

    closeRiskReviewModal() {
      const modal = document.getElementById('riskReviewModal');
      if (modal) modal.style.display = 'none';
    }

    submitRiskReviewAction() {
      const signalId = document.getElementById('modalSignalId').value;
      const action = document.getElementById('modalReviewAction').value;
      const notes = document.getElementById('modalReviewNotes').value.trim();

      if (!notes) {
        alert("Statutory Compliance Warning: Mandatory Officer Rationale and Notes must be provided for every audit determination.");
        return;
      }

      if (this.activeIntegritySignals) {
        const sig = this.activeIntegritySignals.find(s => s.id === signalId);
        if (sig) {
          sig.review_status = action;
          sig.officer_notes = notes;
        }
      }

      // Add to immutable audit trail
      if (this.auditHistory) {
        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2, '0')}-Sep-2026 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} IST`;
        this.auditHistory.unshift({
          date: dateStr,
          text: `Officer Determination: Signal ${signalId} set to [${action}]. Justification: "${notes}". SHA-256 Sig: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.`,
          badgeColor: action === 'OVERRIDDEN' ? '#0369A1' : '#166534'
        });
        this.renderAuditHistory();
      }

      this.closeRiskReviewModal();
      this.renderSignalsTable(this.activeIntegritySignals);
      alert(`Official Determination Recorded:\nAction: ${action}\nAudit Signature: NIC-SHA256 Token Logged.\nDecision recorded in the Ministry event ledger.`);
    }

    acknowledgeCurrentWarning() {
      const prof = this.activeIntegrityProfile;
      if (!prof) return;

      prof.warnings_count = Math.max(0, prof.warnings_count - 1);
      const warningsEl = document.getElementById('riskEarlyWarningsCount');
      if (warningsEl) warningsEl.textContent = prof.warnings_count;

      const alertBox = document.getElementById('riskEarlyWarningAlertBox');
      if (alertBox) {
        alertBox.style.background = '#F0FDF4';
        alertBox.style.borderLeftColor = '#166534';
        alertBox.innerHTML = `
          <div style="color:#166534; font-size:13px; font-weight:700;">
            ✓ Early Warning Acknowledged by Tender Scrutiny Officer
          </div>
          <div style="font-size:12px; color:#14532D; margin-top:4px;">
            Officer acknowledgment timestamp and digital attestation recorded in immutable audit log. Manual review note appended to tender evaluation file.
          </div>
        `;
      }

      // Add to audit trail
      if (this.auditHistory) {
        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2, '0')}-Sep-2026 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} IST`;
        this.auditHistory.unshift({
          date: dateStr,
          text: `Statutory Warning Acknowledged: High-Risk Alert for Bidder ${prof.bidder_name} acknowledged by Officer. Action: Noted for Tender Committee scrutiny.`,
          badgeColor: '#166534'
        });
        this.renderAuditHistory();
      }
    }
  }

  // Global mount
  window.parakhApp = new ParakhApplication();

})();

