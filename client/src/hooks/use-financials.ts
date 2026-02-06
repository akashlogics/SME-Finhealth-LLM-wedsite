import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { FinancialRecord, AnalysisReport } from "@shared/schema";

// Helper for type safety on file uploads since schema doesn't define FormData
interface UploadResponse extends FinancialRecord {}

export function useFinancialReports() {
  return useQuery({
    queryKey: [api.financials.list.path],
    queryFn: async () => {
      const res = await fetch(api.financials.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reports");
      return api.financials.list.responses[200].parse(await res.json());
    },
  });
}

export function useFinancialReport(id: number | null) {
  return useQuery({
    queryKey: [api.financials.getReport.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.financials.getReport.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch report");
      return api.financials.getReport.responses[200].parse(await res.json());
    },
  });
}

export function useUploadFinancials() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(api.financials.upload.path, {
        method: api.financials.upload.method,
        body: formData,
        credentials: "include",
        // Note: Content-Type header is not set manually for FormData to allow browser to set boundary
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to upload file");
      }
      return api.financials.upload.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "File uploaded successfully",
        description: "Your financial document is now ready for analysis.",
      });
      // Invalidate queries if needed, though usually upload triggers a new flow
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useAnalyzeFinancials() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { recordId: number; industry: string }) => {
      // Validate input against schema manually or trust backend validation
      const res = await fetch(api.financials.analyze.path, {
        method: api.financials.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Analysis failed");
      }
      return api.financials.analyze.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.financials.list.path] });
      toast({
        title: "Analysis complete",
        description: "AI has successfully analyzed your financial data.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
