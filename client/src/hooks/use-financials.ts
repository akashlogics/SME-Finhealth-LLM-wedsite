import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { FinancialRecord, AnalysisReport } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { FinancialRecord, AnalysisReport } from "@shared/schema";

// Helper for type safety on file uploads since schema doesn't define FormData
interface UploadResponse extends FinancialRecord {}

interface FinancialRecord {
  id: number;
  createdAt: string;
  filename: string;
  status: "uploaded" | "analyzed";
}

interface AnalysisReport {
  summary: string;
  risks: string[];
  recommendations: string[];
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const API = {
  list: `${API_BASE}/api/financials`,
  upload: `${API_BASE}/api/financials/upload`,
  analyze: `${API_BASE}/api/financials/analyze`,
  report: (id: number) => `${API_BASE}/api/financials/${id}`,
};

export function useFinancialReports() {
  return useQuery({
    queryKey: ["financials"],
    queryFn: async (): Promise<FinancialRecord[]> => {
      const res = await fetch(API.list);
      if (!res.ok) throw new Error("Failed to fetch reports");
      return res.json();
    },
  });
}

export function useFinancialReport(id: number | null) {
  return useQuery({
    queryKey: ["financials", id],
    enabled: !!id,
    queryFn: async (): Promise<FinancialRecord | null> => {
      if (!id) return null;
      const res = await fetch(API.report(id));
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch report");
      return res.json();
    },
  });
}

export function useUploadFinancials() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(API.upload, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Upload successful",
        description: "File uploaded for analysis",
      });
    },
  });
}

export function useAnalyzeFinancials() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { recordId: number; industry: string }) => {
      const res = await fetch(API.analyze, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Analysis failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financials"] });
      toast({
        title: "Analysis complete",
        description: "AI analysis finished successfully",
      });
    },
  });
}
