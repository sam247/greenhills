"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LogOut, FolderOpen, FileText, MessageSquare, Upload, Send } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  address: string | null;
  quote_amount: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string | null;
  description: string | null;
}

interface Message {
  id: string;
  project_id: string;
  content: string;
  sender_id: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  quote_sent: { label: "Quote Sent", color: "bg-blue-100 text-blue-800" },
  booked: { label: "Booked", color: "bg-purple-100 text-purple-800" },
  in_progress: { label: "In Progress", color: "bg-amber-100 text-amber-800" },
  on_hold: { label: "On Hold", color: "bg-gray-100 text-gray-800" },
  complete: { label: "Complete", color: "bg-green-100 text-green-800" },
  awaiting_payment: { label: "Awaiting Payment", color: "bg-red-100 text-red-800" },
};

const CustomerDashboard = () => {
  const supabase = getSupabaseBrowserClient();
  const { user, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "invoices" | "messages">("projects");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [projRes, invRes] = await Promise.all([
        supabase.from("projects").select("*").eq("customer_id", user.id).order("created_at", { ascending: false }),
        supabase.from("invoices").select("*").eq("customer_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (projRes.data) setProjects(projRes.data as Project[]);
      if (invRes.data) setInvoices(invRes.data as Invoice[]);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!selectedProject) return;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("project_id", selectedProject.id)
        .order("created_at", { ascending: true });
      if (data) setMessages(data as Message[]);
    };
    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel(`messages-${selectedProject.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `project_id=eq.${selectedProject.id}` },
        (payload) => { setMessages(prev => [...prev, payload.new as Message]); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedProject]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProject || !user) return;
    const { error } = await supabase.from("messages").insert({
      project_id: selectedProject.id,
      sender_id: user.id,
      content: newMessage.trim(),
    });
    if (error) toast.error(error.message);
    else setNewMessage("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProject || !user) return;
    const filePath = `${selectedProject.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from("project-files").upload(filePath, file);
    if (uploadError) { toast.error(uploadError.message); return; }
    const { error: dbError } = await supabase.from("documents").insert({
      project_id: selectedProject.id,
      uploaded_by: user.id,
      file_name: file.name,
      file_path: filePath,
      file_type: file.type,
      file_size: file.size,
    });
    if (dbError) toast.error(dbError.message);
    else toast.success("File uploaded!");
    e.target.value = "";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <Image src="/placeholder.svg" alt="Greenhills" width={120} height={32} className="h-8 w-auto" style={{ filter: "brightness(0)" }} />
            <span className="text-xs font-semibold tracking-[0.15em] text-muted-foreground">PORTAL</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setActiveTab("projects"); setSelectedProject(null); }} className={activeTab === "projects" ? "bg-muted" : ""}>
              <FolderOpen className="h-4 w-4 mr-1" /> Projects
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("invoices")} className={activeTab === "invoices" ? "bg-muted" : ""}>
              <FileText className="h-4 w-4 mr-1" /> Invoices
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        {activeTab === "projects" && !selectedProject && (
          <>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Your Projects</h1>
            {projects.length === 0 ? (
              <p className="text-muted-foreground">No projects yet. We'll create one when you get started!</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map(p => (
                  <Card key={p.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelectedProject(p); setActiveTab("projects"); }}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-heading">{p.title}</CardTitle>
                        <Badge className={STATUS_LABELS[p.status]?.color || ""}>
                          {STATUS_LABELS[p.status]?.label || p.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {p.description && <p className="text-sm text-muted-foreground mb-2">{p.description}</p>}
                      {p.address && <p className="text-xs text-muted-foreground">{p.address}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "projects" && selectedProject && (
          <>
            <Button variant="ghost" onClick={() => setSelectedProject(null)} className="mb-4">← Back to projects</Button>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-heading text-xl">{selectedProject.title}</CardTitle>
                      <Badge className={STATUS_LABELS[selectedProject.status]?.color || ""}>
                        {STATUS_LABELS[selectedProject.status]?.label || selectedProject.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedProject.description && <p className="text-muted-foreground">{selectedProject.description}</p>}
                    {selectedProject.address && <p className="text-sm"><strong>Address:</strong> {selectedProject.address}</p>}
                    {selectedProject.quote_amount && <p className="text-sm"><strong>Quote:</strong> £{selectedProject.quote_amount.toLocaleString()}</p>}
                  </CardContent>
                </Card>

                {/* Messages */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" /> Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                      {messages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
                      {messages.map(m => (
                        <div key={m.id} className={`p-3 rounded-lg text-sm ${m.sender_id === user?.id ? "bg-primary text-primary-foreground ml-8" : "bg-muted mr-8"}`}>
                          <p>{m.content}</p>
                          <span className="text-xs opacity-70">{new Date(m.created_at).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." onKeyDown={e => e.key === "Enter" && sendMessage()} />
                      <Button size="icon" onClick={sendMessage}><Send className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - File upload */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg flex items-center gap-2">
                      <Upload className="h-5 w-5" /> Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <label className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors">
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Upload a file</p>
                      </div>
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {activeTab === "invoices" && (
          <>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Your Invoices</h1>
            {invoices.length === 0 ? (
              <p className="text-muted-foreground">No invoices yet.</p>
            ) : (
              <div className="space-y-3">
                {invoices.map(inv => (
                  <Card key={inv.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-heading font-semibold">{inv.invoice_number}</p>
                        {inv.description && <p className="text-sm text-muted-foreground">{inv.description}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-heading font-bold">£{inv.amount.toLocaleString()}</p>
                        <Badge variant="outline">{inv.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
