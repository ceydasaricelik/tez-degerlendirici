export interface EvaluationResult {
  meta: {
    candidateName: string;
    fileName: string;
    evaluatedAt: string;
    version: string;
  };
  decision: {
    overall: string; // İDARİ_RED | GEÇTİ | DÜZELTME_GEREKİR | RED
    risk: "DÜŞÜK" | "ORTA" | "YÜKSEK";
    summaryText: string;
  };
  counts: {
    totalRules: number;
    applicable: number;
    countsByStatus: {
      UYGUN: number;
      UYARI: number;
      HATA: number;
      N_A: number;
      BILGI: number;
    };
    score: {
      points: number;
      maxPoints: number;
      successRate: number;
      errorRate: number;
    };
    note: string;
  };
  tiers: {
    tier: string;
    status: string;
    summary: string;
    findings: Finding[];
  }[];
  findingsTable: Finding[];
  reportTxt: string;
}

export interface Finding {
  tier: string;
  ruleId: string;
  ruleName: string;
  status: "UYGUN" | "UYARI" | "HATA" | "N/A" | "BİLGİ";
  note: string;
  evidence: string;
}

export type AppStep = 'input' | 'analyzing' | 'result' | 'error';
