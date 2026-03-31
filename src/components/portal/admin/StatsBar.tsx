import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, TrendingUp, FileText, MessageSquare } from "lucide-react";

interface StatsBarProps {
  projects: { status: string; quote_amount: number | null }[];
  invoices: { status: string; amount: number }[];
  unreadMessages: number;
}

const StatsBar = ({ projects, invoices, unreadMessages }: StatsBarProps) => {
  const activeProjects = projects.filter(p => ["in_progress", "booked"].includes(p.status)).length;
  const pipelineValue = projects.reduce((sum, p) => sum + (p.quote_amount || 0), 0);
  const outstandingInvoices = invoices.filter(i => ["sent", "overdue"].includes(i.status));
  const outstandingTotal = outstandingInvoices.reduce((sum, i) => sum + i.amount, 0);

  const stats = [
    {
      label: "Active Projects",
      value: activeProjects.toString(),
      subtitle: `${projects.length} total`,
      icon: FolderOpen,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Pipeline Value",
      value: `£${pipelineValue.toLocaleString("en-GB", { minimumFractionDigits: 0 })}`,
      subtitle: `across ${projects.length} projects`,
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      label: "Outstanding Invoices",
      value: outstandingInvoices.length.toString(),
      subtitle: `£${outstandingTotal.toLocaleString("en-GB", { minimumFractionDigits: 2 })} unpaid`,
      icon: FileText,
      color: "text-amber-600 bg-amber-100",
    },
    {
      label: "Unread Messages",
      value: unreadMessages.toString(),
      subtitle: "awaiting reply",
      icon: MessageSquare,
      color: "text-purple-600 bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsBar;
