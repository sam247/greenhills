import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import { Download, PoundSterling, Calendar, FileText, User, FolderOpen } from "lucide-react";
import AccountingConnection from "./AccountingConnection";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string | null;
  paid_date: string | null;
  description: string | null;
  customer_id: string | null;
  project_id: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface Project {
  id: string;
  title: string;
}

interface InvoicesTabProps {
  invoices: Invoice[];
  customers: Profile[];
  projects: Project[];
  onRefresh: () => void;
}

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  draft: "bg-gray-100 text-gray-700 border-gray-200",
  sent: "bg-blue-100 text-blue-700 border-blue-200",
  paid: "bg-green-100 text-green-700 border-green-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
};

const FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Invoices" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

const downloadCSV = (filename: string, headers: string[], rows: string[][]) => {
  const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${(c || "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const InvoicesTab = ({ invoices, customers, projects, onRefresh }: InvoicesTabProps) => {
  const supabase = getSupabaseBrowserClient();
  const [filter, setFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filtered = filter === "all" ? invoices : invoices.filter(i => i.status === filter);

  const getCustomerName = (id: string | null) => {
    if (!id) return "—";
    const c = customers.find(c => c.id === id);
    return c?.full_name || c?.email || "Unknown";
  };

  const getCustomerEmail = (id: string | null) => {
    if (!id) return null;
    return customers.find(c => c.id === id)?.email || null;
  };

  const getProjectTitle = (id: string | null) => {
    if (!id) return "—";
    return projects.find(p => p.id === id)?.title || "Unknown";
  };

  const updateStatus = async (invoiceId: string, newStatus: InvoiceStatus) => {
    if (!supabase) return;
    const updateData: Record<string, unknown> = { status: newStatus };
    if (newStatus === "paid") updateData.paid_date = new Date().toISOString().split("T")[0];
    const { error } = await supabase.from("invoices").update(updateData).eq("id", invoiceId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Invoice marked as ${newStatus}`);
      onRefresh();
      if (selectedInvoice?.id === invoiceId) {
        setSelectedInvoice(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  const exportCSV = () => {
    const headers = ["Invoice #", "Customer", "Project", "Amount (£)", "Status", "Due Date", "Created"];
    const rows = filtered.map(inv => [
      inv.invoice_number,
      getCustomerName(inv.customer_id),
      getProjectTitle(inv.project_id),
      inv.amount.toFixed(2),
      inv.status,
      inv.due_date || "",
      format(new Date(inv.created_at), "yyyy-MM-dd"),
    ]);
    downloadCSV("invoices.csv", headers, rows);
    toast.success("Invoices exported");
  };

  const totalAmount = filtered.reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} invoice{filtered.length !== 1 ? "s" : ""} · £{totalAmount.toLocaleString("en-GB", { minimumFractionDigits: 2 })} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AccountingConnection />
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(inv => (
                <TableRow
                  key={inv.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedInvoice(inv)}
                >
                  <TableCell className="font-medium font-mono text-sm">{inv.invoice_number}</TableCell>
                  <TableCell className="text-sm">{getCustomerName(inv.customer_id)}</TableCell>
                  <TableCell className="text-sm max-w-[180px] truncate">{getProjectTitle(inv.project_id)}</TableCell>
                  <TableCell className="text-right font-semibold text-sm">
                    £{inv.amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {inv.due_date ? format(new Date(inv.due_date), "dd MMM yyyy") : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${STATUS_STYLES[inv.status]}`}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <Select value={inv.status} onValueChange={(v) => updateStatus(inv.id, v as InvoiceStatus)}>
                      <SelectTrigger className="h-7 text-xs w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FILTER_OPTIONS.filter(o => o.value !== "all").map(o => (
                          <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Invoice Detail Sheet */}
      <Sheet open={!!selectedInvoice} onOpenChange={(open) => { if (!open) setSelectedInvoice(null); }}>
        <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto">
          {selectedInvoice && (
            <>
              <SheetHeader>
                <SheetTitle className="font-heading text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  Invoice {selectedInvoice.invoice_number}
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Amount & Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-heading font-bold text-foreground">
                      £{selectedInvoice.amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Total amount</p>
                  </div>
                  <Badge variant="outline" className={`text-sm px-3 py-1 ${STATUS_STYLES[selectedInvoice.status]}`}>
                    {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                  </Badge>
                </div>

                <Separator />

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{getCustomerName(selectedInvoice.customer_id)}</p>
                      {getCustomerEmail(selectedInvoice.customer_id) && (
                        <p className="text-xs text-muted-foreground">{getCustomerEmail(selectedInvoice.customer_id)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    <p className="text-sm">{getProjectTitle(selectedInvoice.project_id)}</p>
                  </div>
                  {selectedInvoice.description && (
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{selectedInvoice.description}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Dates */}
                <div className="space-y-2">
                  <h3 className="text-sm font-heading font-semibold">Dates</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-xs">Created</p>
                        <p className="font-medium">{format(new Date(selectedInvoice.created_at), "dd MMM yyyy")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-xs">Due</p>
                        <p className="font-medium">{selectedInvoice.due_date ? format(new Date(selectedInvoice.due_date), "dd MMM yyyy") : "—"}</p>
                      </div>
                    </div>
                    {selectedInvoice.paid_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <PoundSterling className="h-3.5 w-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground text-xs">Paid</p>
                          <p className="font-medium">{format(new Date(selectedInvoice.paid_date), "dd MMM yyyy")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Status Change */}
                <div className="space-y-2">
                  <h3 className="text-sm font-heading font-semibold">Update Status</h3>
                  <Select
                    value={selectedInvoice.status}
                    onValueChange={(v) => updateStatus(selectedInvoice.id, v as InvoiceStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FILTER_OPTIONS.filter(o => o.value !== "all").map(o => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default InvoicesTab;
