import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CashFlowChart, ExpensePieChart } from "@/components/dashboard/Charts";
import { FileUploader } from "@/components/upload/FileUploader";
import { useUploadFinancials, useFinancialReports, useFinancialReport, useAnalyzeFinancials } from "@/hooks/use-financials";
import { useAuth } from "@/hooks/use-auth";
import { Wallet, Activity, AlertTriangle, PiggyBank, Download, RefreshCw, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, Route, Switch, useLocation } from "wouter";

export default function DashboardLayout() {
  const { user, isLoading: authLoading } = useAuth();
  const [isHindi, setIsHindi] = useState(false);

  // Auth Guard
  if (authLoading) return <div className="flex h-screen items-center justify-center bg-background"><RefreshCw className="w-6 h-6 animate-spin text-primary" /></div>;
  if (!user) {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">
              {isHindi ? "वित्तीय अवलोकन" : "Financial Overview"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isHindi ? "आपका वित्तीय स्वास्थ्य और अंतर्दृष्टि" : "Your financial health and insights at a glance"}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsHindi(!isHindi)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-sm font-medium transition-colors"
            >
              <Languages className="w-4 h-4" />
              {isHindi ? "English" : "हिंदी"}
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-violet-400 flex items-center justify-center text-white font-bold text-lg">
              {user.firstName?.[0] || "U"}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-enter">
          <Switch>
            <Route path="/dashboard" component={Overview} />
            <Route path="/dashboard/reports" component={Reports} />
            <Route path="/dashboard/*" component={() => <div className="p-8 text-center text-muted-foreground">Coming Soon</div>} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function Overview() {
  const { data: reports, isLoading } = useFinancialReports();
  // Get latest report or null
  const latestReport = reports && reports.length > 0 ? reports[0] : null;
  
  // Safe access to nested JSON data
  const metrics = latestReport?.metrics as any || {};
  const cashFlowData = latestReport?.cashFlowData as any[];
  const costData = latestReport?.costData as any[];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Health Score"
          value={latestReport?.healthScore ? `${latestReport.healthScore}/100` : "--"}
          icon={Activity}
          trend={5}
          loading={isLoading}
          className="bg-gradient-to-br from-card to-primary/5"
        />
        <MetricCard
          title="Current Assets"
          value={`$${(metrics.currentAssets || 0).toLocaleString()}`}
          icon={Wallet}
          trend={12}
          loading={isLoading}
        />
        <MetricCard
          title="Risk Level"
          value={latestReport?.riskLevel || "Low"}
          icon={AlertTriangle}
          loading={isLoading}
          className={cn(
            latestReport?.riskLevel === "High" ? "border-destructive/50" : "border-border"
          )}
        />
        <MetricCard
          title="Est. Savings"
          value="$12,450"
          icon={PiggyBank}
          trend={8}
          loading={isLoading}
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg">Cash Flow Analysis</h3>
            <select className="bg-transparent text-sm font-medium text-muted-foreground border-none focus:ring-0 cursor-pointer">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <CashFlowChart data={cashFlowData} />
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg mb-6">Cost Breakdown</h3>
          <ExpensePieChart data={costData} />
        </div>
      </div>

      {/* Upload Section (Mini) */}
      <div className="glass-card rounded-2xl p-8 border-dashed border-2 border-primary/20">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-lg mb-2">Update Financial Data</h3>
              <p className="text-muted-foreground">Upload your latest balance sheet or P&L statement to refresh insights.</p>
            </div>
            <Link href="/dashboard/reports">
              <button className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors">
                Go to Upload Center
              </button>
            </Link>
         </div>
      </div>
    </div>
  );
}

function Reports() {
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFinancials();
  const { mutateAsync: analyzeFile, isPending: isAnalyzing } = useAnalyzeFinancials();
  const { data: reports, isLoading } = useFinancialReports();
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [industry, setIndustry] = useState("Retail");

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    // Ideally user ID comes from auth context, but here handled by backend session
    const record = await uploadFile(formData);
    setSelectedRecordId(record.id);
  };

  const handleAnalyze = async () => {
    if (selectedRecordId) {
      await analyzeFile({ recordId: selectedRecordId, industry });
      setSelectedRecordId(null); // Reset after triggering analysis
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="font-display font-bold text-lg mb-4">New Analysis</h3>
            <FileUploader onUpload={handleFileUpload} isUploading={isUploading} />
            
            {selectedRecordId && (
               <div className="mt-6 space-y-4 animate-enter">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-2">Select Industry</label>
                    <select 
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-primary/20 outline-none transition-all"
                    >
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Technology">Technology</option>
                      <option value="Services">Services</option>
                    </select>
                  </div>
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-50"
                  >
                    {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
                  </button>
               </div>
            )}
          </div>
        </div>

        {/* Reports List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl min-h-[500px]">
            <h3 className="font-display font-bold text-lg mb-6">Recent Reports</h3>
            
            {isLoading ? (
               <div className="space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-20 bg-muted/50 rounded-xl animate-pulse" />)}
               </div>
            ) : reports?.length === 0 ? (
               <div className="text-center py-20 text-muted-foreground">
                 <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                 <p>No reports found. Upload a file to get started.</p>
               </div>
            ) : (
               <div className="space-y-4">
                 {reports?.map((report) => (
                   <div key={report.id} className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer group">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className={cn(
                           "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                           (report.healthScore || 0) > 70 ? "bg-green-100 text-green-600" : 
                           (report.healthScore || 0) > 40 ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
                         )}>
                           {report.healthScore}
                         </div>
                         <div>
                           <h4 className="font-bold text-foreground">Financial Health Report</h4>
                           <p className="text-sm text-muted-foreground">Generated on {new Date(report.createdAt!).toLocaleDateString()}</p>
                         </div>
                       </div>
                       <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                         <Download className="w-5 h-5" />
                       </button>
                     </div>
                     
                     <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Risk Level</p>
                          <p className="font-medium">{report.riskLevel}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Industry</p>
                          <p className="font-medium">{report.industry}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Credit Score</p>
                          <p className="font-medium">{report.creditScore || "--"}</p>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
