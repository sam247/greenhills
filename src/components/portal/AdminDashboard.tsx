"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { LogOut, Plus, Users, FolderOpen, FileText, PoundSterling, Download, Camera } from "lucide-react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import StatsBar from "./admin/StatsBar";
import InvoicesTab from "./admin/InvoicesTab";
import CustomersTab from "./admin/CustomersTab";
import RecentJobsTab from "./admin/RecentJobsTab";
import ProjectDetail from "./admin/ProjectDetail";

type ProjectStatus = "quote_sent" | "booked" | "in_progress" | "on_hold" | "complete" | "awaiting_payment";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  customer_id: string | null;
  address: string | null;
  quote_amount: number | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  company_name: string | null;
  avatar_url: string | null;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  due_date: string | null;
  paid_date: string | null;
  description: string | null;
  customer_id: string | null;
  project_id: string | null;
  created_at: string;
}

const KANBAN_COLUMNS: { status: ProjectStatus; label: string; color: string }[] = [
  { status: "quote_sent", label: "Quote Sent", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { status: "booked", label: "Booked", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { status: "in_progress", label: "In Progress", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { status: "on_hold", label: "On Hold", color: "bg-gray-100 text-gray-800 border-gray-200" },
  { status: "complete", label: "Complete", color: "bg-green-100 text-green-800 border-green-200" },
  { status: "awaiting_payment", label: "Awaiting Payment", color: "bg-red-100 text-red-800 border-red-200" },
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

const AdminDashboard = () => {
  const supabase = getSupabaseBrowserClient();
  const { signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", customer_id: "", address: "", quote_amount: "" });
  const [activeTab, setActiveTab] = useState<"kanban" | "customers" | "invoices" | "jobs">("kanban");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const [projectsRes, customersRes, invoicesRes, messagesRes] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*"),
      supabase.from("invoices").select("*").order("created_at", { ascending: false }),
      supabase.from("messages").select("id", { count: "exact" }).eq("is_read", false),
    ]);
    if (projectsRes.data) setProjects(projectsRes.data as Project[]);
    if (customersRes.data) setCustomers(customersRes.data as Profile[]);
    if (invoicesRes.data) setInvoices(invoicesRes.data as Invoice[]);
    setUnreadMessages(messagesRes.count || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [supabase]);

  const handleCreateProject = async () => {
    if (!supabase) return;
    const { error } = await supabase.from("projects").insert({
      title: newProject.title,
      description: newProject.description || null,
      customer_id: newProject.customer_id || null,
      address: newProject.address || null,
      quote_amount: newProject.quote_amount ? parseFloat(newProject.quote_amount) : null,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Project created");
      setShowNewProject(false);
      setNewProject({ title: "", description: "", customer_id: "", address: "", quote_amount: "" });
      fetchData();
    }
  };

  const moveProject = async (projectId: string, newStatus: ProjectStatus) => {
    if (!supabase) return;
    const { error } = await supabase.from("projects").update({ status: newStatus }).eq("id", projectId);
    if (error) {
      toast.error(error.message);
    } else {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    }
  };

  const getCustomer = (customerId: string | null) => {
    if (!customerId) return null;
    return customers.find(c => c.id === customerId) || null;
  };

  const getCustomerName = (customerId: string | null) => {
    const customer = getCustomer(customerId);
    if (!customer) return "Unassigned";
    return customer.full_name || customer.email || "Unknown";
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    if (email) return email[0].toUpperCase();
    return "?";
  };

  const onDragEnd = (result: DropResult) => {
    const { draggableId, destination } = result;
    if (!destination) return;
    const newStatus = destination.droppableId as ProjectStatus;
    const project = projects.find(p => p.id === draggableId);
    if (!project || project.status === newStatus) return;
    setProjects(prev => prev.map(p => p.id === draggableId ? { ...p, status: newStatus } : p));
    moveProject(draggableId, newStatus);
  };

  const exportProjects = () => {
    const headers = ["Title", "Status", "Customer", "Address", "Quote (£)", "Start Date", "End Date"];
    const rows = projects.map(p => [
      p.title,
      KANBAN_COLUMNS.find(c => c.status === p.status)?.label || p.status,
      getCustomerName(p.customer_id),
      p.address || "",
      p.quote_amount?.toFixed(2) || "",
      p.start_date || "",
      p.end_date || "",
    ]);
    downloadCSV("projects.csv", headers, rows);
    toast.success("Projects exported");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted">
        <header className="bg-background border-b border-border sticky top-0 z-50">
          <div className="container flex items-center justify-between py-3">
            <Skeleton className="h-6 w-40" />
            <div className="flex gap-2"><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-24" /></div>
          </div>
        </header>
        <div className="container py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Admin header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image src="/placeholder.svg" alt="Greenhills" width={120} height={32} className="h-8 w-auto" style={{ filter: "brightness(0)" }} />
              <span className="text-xs font-semibold tracking-[0.15em] text-muted-foreground">ADMIN</span>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("kanban")} className={activeTab === "kanban" ? "bg-muted" : ""}>
              <FolderOpen className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">Projects</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("customers")} className={activeTab === "customers" ? "bg-muted" : ""}>
              <Users className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">Customers</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("invoices")} className={activeTab === "invoices" ? "bg-muted" : ""}>
              <FileText className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">Invoices</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("jobs")} className={activeTab === "jobs" ? "bg-muted" : ""}>
              <Camera className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">Recent Jobs</span>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6 flex-1">
        <StatsBar projects={projects} invoices={invoices} unreadMessages={unreadMessages} />

        {activeTab === "kanban" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-heading font-bold text-foreground">Project Board</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={exportProjects}>
                  <Download className="h-4 w-4 mr-1" /> Export CSV
                </Button>
                <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
                  <DialogTrigger asChild>
                    <Button className="font-heading font-bold"><Plus className="h-4 w-4 mr-1" /> New Project</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle className="font-heading">Create New Project</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={newProject.title} onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))} placeholder="Project title" />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} placeholder="Project details..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Customer</Label>
                        <Select value={newProject.customer_id} onValueChange={v => setNewProject(p => ({ ...p, customer_id: v }))}>
                          <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                          <SelectContent>
                            {customers.map(c => (
                              <SelectItem key={c.id} value={c.id}>{c.full_name || c.email}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input value={newProject.address} onChange={e => setNewProject(p => ({ ...p, address: e.target.value }))} placeholder="Site address" />
                      </div>
                      <div className="space-y-2">
                        <Label>Quote Amount (£)</Label>
                        <Input type="number" value={newProject.quote_amount} onChange={e => setNewProject(p => ({ ...p, quote_amount: e.target.value }))} placeholder="0.00" />
                      </div>
                      <Button onClick={handleCreateProject} className="w-full font-heading font-bold" disabled={!newProject.title}>Create Project</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {KANBAN_COLUMNS.map(col => {
                  const columnProjects = projects.filter(p => p.status === col.status);
                  return (
                    <div key={col.status} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`${col.color} font-heading text-xs`}>{col.label}</Badge>
                        <span className="text-xs text-muted-foreground font-medium">{columnProjects.length}</span>
                      </div>
                      <Droppable droppableId={col.status}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`space-y-2 min-h-[200px] rounded-lg p-1 transition-colors ${
                              snapshot.isDraggingOver ? "bg-primary/10 ring-2 ring-primary/20" : ""
                            }`}
                          >
                            {columnProjects.map((project, index) => {
                              const customer = getCustomer(project.customer_id);
                              return (
                                <Draggable key={project.id} draggableId={project.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => setSelectedProject(project)}
                                    >
                                      <Card className={`cursor-pointer transition-all ${
                                        snapshot.isDragging
                                          ? "shadow-lg rotate-2 ring-2 ring-primary/30"
                                          : "hover:shadow-md"
                                      }`}>
                                        <CardContent className="p-3">
                                          <h3 className="font-heading font-semibold text-sm mb-2">{project.title}</h3>
                                          <div className="flex items-center gap-2 mb-2">
                                            <Avatar className="h-5 w-5">
                                              {customer?.avatar_url && <AvatarImage src={customer.avatar_url} alt={customer.full_name || ""} />}
                                              <AvatarFallback className="text-[9px] bg-muted text-muted-foreground">
                                                {getInitials(customer?.full_name || null, customer?.email || null)}
                                              </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-muted-foreground truncate">
                                              {getCustomerName(project.customer_id)}
                                            </span>
                                          </div>
                                          {project.quote_amount && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                              <PoundSterling className="h-3 w-3" /> £{project.quote_amount.toLocaleString("en-GB")}
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          </>
        )}

        {activeTab === "customers" && (
          <CustomersTab customers={customers} projects={projects} invoices={invoices} />
        )}

        {activeTab === "invoices" && (
          <InvoicesTab invoices={invoices} customers={customers} projects={projects} onRefresh={fetchData} />
        )}

        {activeTab === "jobs" && (
          <RecentJobsTab />
        )}
      </div>

      {/* SaaS Footer */}
      <footer className="border-t border-border bg-background mt-auto">
        <div className="container flex items-center justify-between py-3 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Greenhills Electric · Admin v1.0</span>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="/contact" className="hover:text-foreground transition-colors">Help</a>
            <span>Powered by Greenhills</span>
          </div>
        </div>
      </footer>

      <ProjectDetail
        project={selectedProject}
        customers={customers}
        open={!!selectedProject}
        onOpenChange={(open) => { if (!open) setSelectedProject(null); }}
        onRefresh={fetchData}
      />
    </div>
  );
};

export default AdminDashboard;
