
import Navigation from "@/components/Navigation";
import TaskGenerator from "@/components/specter-net/TaskGenerator";
import { Zap } from "lucide-react";

export default function TargetAnalysisPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Navigation activePanel="target-analysis" />
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Target Analysis & Execution</h1>
                <p className="text-muted-foreground">AI-generated tasks based on competitor intelligence and market gaps</p>
              </div>
            </div>
          </div>

          {/* Task Generator Component */}
          <TaskGenerator />
        </div>
      </div>
    </div>
  );
}
