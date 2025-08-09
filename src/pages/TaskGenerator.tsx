
import Navigation from "@/components/Navigation";
import TaskGenerator from "@/components/specter-net/TaskGenerator";
import PageHeader from "@/components/PageHeader";

export default function TaskGeneratorPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <PageHeader 
            title="AI Task Generator" 
            subtitle="Actionable intelligence tasks prioritized by impact" 
          />
          <TaskGenerator />
        </div>
      </div>
    </div>
  );
}
