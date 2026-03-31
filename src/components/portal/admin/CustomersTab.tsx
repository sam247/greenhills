import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { format } from "date-fns";
import { Mail, Phone, MapPin, Building2, FolderOpen, FileText, Search, Download, StickyNote, Plus } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  company_name: string | null;
  avatar_url: string | null;
}

interface Project {
  id: string;
  title: string;
  customer_id: string | null;
  status: string;
  quote_amount: number | null;
  created_at: string;
}

interface Invoice {
  id: string;
  invoice_number?: string;
  customer_id: string | null;
  amount: number;
  status: string;
  created_at?: string;
}

interface CustomersTabProps {
  customers: Profile[];
  projects: Project[];
  invoices: Invoice[];
}

interface CRMNote {
  id: string;
  text: string;
  timestamp: string;
}

const STATUS_COLORS: Record<string, string> = {
  quote_sent: "bg-blue-100 text-blue-700",
  booked: "bg-purple-100 text-purple-700",
  in_progress: "bg-amber-100 text-amber-700",
  on_hold: "bg-gray-100 text-gray-700",
  complete: "bg-green-100 text-green-700",
  awaiting_payment: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-600",
  sent: "bg-blue-100 text-blue-600",
  paid: "bg-green-100 text-green-600",
  overdue: "bg-red-100 text-red-600",
};

const getInitials = (name: string | null, email: string | null) => {
  if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  if (email) return email[0].toUpperCase();
  return "?";
};

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

const CustomersTab = ({ customers, projects, invoices }: CustomersTabProps) => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, CRMNote[]>>({});
  const [newNote, setNewNote] = useState("");

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return !q
      || c.full_name?.toLowerCase().includes(q)
      || c.email?.toLowerCase().includes(q)
      || c.company_name?.toLowerCase().includes(q)
      || c.phone?.includes(q);
  });

  const selected = selectedId ? customers.find(c => c.id === selectedId) || null : null;

  const getStats = (id: string) => {
    const cp = projects.filter(p => p.customer_id === id);
    const ci = invoices.filter(i => i.customer_id === id);
    const totalSpend = ci.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
    const active = cp.filter(p => ["in_progress", "booked"].includes(p.status)).length;
    return { totalProjects: cp.length, active, totalSpend };
  };

  const customerProjects = selected ? projects.filter(p => p.customer_id === selected.id) : [];
  const customerInvoices = selected ? invoices.filter(i => i.customer_id === selected.id) : [];
  const customerNotes = selected ? notes[selected.id] || [] : [];

  const addNote = () => {
    if (!selected || !newNote.trim()) return;
    const note: CRMNote = { id: Date.now().toString(), text: newNote.trim(), timestamp: new Date().toISOString() };
    setNotes(prev => ({ ...prev, [selected.id]: [...(prev[selected.id] || []), note] }));
    setNewNote("");
    toast.success("Note added");
  };

  const exportCustomers = () => {
    const headers = ["Name", "Email", "Phone", "Company", "Address", "Projects", "Active", "Total Spend (£)"];
    const rows = customers.map(c => {
      const s = getStats(c.id);
      return [c.full_name || "", c.email || "", c.phone || "", c.company_name || "", c.address || "", s.totalProjects.toString(), s.active.toString(), s.totalSpend.toFixed(2)];
    });
    downloadCSV("customers.csv", headers, rows);
    toast.success("Customers exported");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">{customers.length} customer{customers.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCustomers}>
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Customer List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-1 max-h-[calc(100vh-340px)] overflow-y-auto">
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No customers found.</p>
            )}
            {filtered.map(c => {
              const stats = getStats(c.id);
              const isSelected = selectedId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted"
                  }`}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    {c.avatar_url && <AvatarImage src={c.avatar_url} alt={c.full_name || ""} />}
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                      {getInitials(c.full_name, c.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.full_name || "No name"}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.email || c.phone || "—"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-primary">
                      £{stats.totalSpend >= 1000 ? `${(stats.totalSpend / 1000).toFixed(1)}k` : stats.totalSpend.toFixed(0)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{stats.totalProjects} proj</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Customer Detail */}
        <div className="lg:col-span-2">
          {!selected ? (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center">
                <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Select a customer to view details</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Profile Header */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      {selected.avatar_url && <AvatarImage src={selected.avatar_url} alt={selected.full_name || ""} />}
                      <AvatarFallback className="text-lg bg-primary/10 text-primary font-bold">
                        {getInitials(selected.full_name, selected.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-heading font-bold">{selected.full_name || "No name"}</h2>
                      {selected.company_name && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" /> {selected.company_name}
                        </p>
                      )}
                      {/* Quick Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        {selected.email && (
                          <Button variant="outline" size="sm" className="text-xs" asChild>
                            <a href={`mailto:${selected.email}`}><Mail className="h-3.5 w-3.5 mr-1" /> Email</a>
                          </Button>
                        )}
                        {selected.phone && (
                          <Button variant="outline" size="sm" className="text-xs" asChild>
                            <a href={`tel:${selected.phone}`}><Phone className="h-3.5 w-3.5 mr-1" /> Call</a>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-heading font-bold text-primary">
                        £{getStats(selected.id).totalSpend.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">Lifetime spend</p>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                    {selected.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate text-muted-foreground">{selected.email}</span>
                      </div>
                    )}
                    {selected.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{selected.phone}</span>
                      </div>
                    )}
                    {selected.address && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate text-muted-foreground">{selected.address}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Projects & Invoices side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Projects */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-heading flex items-center gap-1.5">
                      <FolderOpen className="h-4 w-4 text-muted-foreground" /> Projects ({customerProjects.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {customerProjects.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No projects yet.</p>
                    ) : (
                      customerProjects.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{p.title}</p>
                            {p.quote_amount && (
                              <p className="text-xs text-muted-foreground">£{p.quote_amount.toLocaleString("en-GB")}</p>
                            )}
                          </div>
                          <Badge variant="outline" className={`text-[10px] shrink-0 ml-2 ${STATUS_COLORS[p.status] || ""}`}>
                            {p.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Invoices */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-heading flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-muted-foreground" /> Invoices ({customerInvoices.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {customerInvoices.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No invoices yet.</p>
                    ) : (
                      customerInvoices.map(inv => (
                        <div key={inv.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                          <div>
                            <p className="text-sm font-mono font-medium">{(inv as any).invoice_number || "—"}</p>
                            <p className="text-xs text-muted-foreground">
                              £{inv.amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <Badge variant="outline" className={`text-[10px] shrink-0 ${STATUS_COLORS[inv.status] || ""}`}>
                            {inv.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Notes */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-heading flex items-center gap-1.5">
                    <StickyNote className="h-4 w-4 text-muted-foreground" /> Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {customerNotes.length > 0 && (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {customerNotes.map(note => (
                        <div key={note.id} className="p-2.5 rounded-md bg-muted/50 border border-border">
                          <p className="text-sm">{note.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {format(new Date(note.timestamp), "dd MMM yyyy, HH:mm")}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a note about this customer..."
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      className="text-sm min-h-[60px]"
                    />
                    <Button size="sm" onClick={addNote} disabled={!newNote.trim()} className="self-end shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersTab;
