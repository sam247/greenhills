import { useState, useEffect, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { format } from "date-fns";
import { MapPin, Calendar, PoundSterling, MessageSquare, Save, Send, Clock, Receipt, CircleDot } from "lucide-react";

type ProjectStatus = "quote_sent" | "booked" | "in_progress" | "on_hold" | "complete" | "awaiting_payment";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  quote_sent: "Quote Sent",
  booked: "Booked",
  in_progress: "In Progress",
  on_hold: "On Hold",
  complete: "Complete",
  awaiting_payment: "Awaiting Payment",
};

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
  avatar_url?: string | null;
}

interface ProjectDetailProps {
  project: Project | null;
  customers: Profile[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
}

interface Message {
  id: string;
  content: string;
  sender_id: string | null;
  created_at: string;
  is_read: boolean;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string | null;
  created_at: string;
}

interface TimelineEvent {
  id: string;
  type: "message" | "invoice" | "created";
  timestamp: string;
  data: any;
}

const ProjectDetail = ({ project, customers, open, onOpenChange, onRefresh }: ProjectDetailProps) => {
  const supabase = getSupabaseBrowserClient();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ description: "", address: "", notes: "", quote_amount: "", start_date: "", end_date: "", status: "" as ProjectStatus });
  const [messages, setMessages] = useState<Message[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const timelineEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) {
      setForm({
        description: project.description || "",
        address: project.address || "",
        notes: project.notes || "",
        quote_amount: project.quote_amount?.toString() || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        status: project.status,
      });
      setEditing(false);
      setNewMessage("");
      supabase.from("messages").select("*").eq("project_id", project.id).order("created_at", { ascending: true })
        .then(({ data }) => setMessages(data || []));
      supabase.from("invoices").select("id, invoice_number, amount, status, due_date, created_at").eq("project_id", project.id)
        .then(({ data }) => setInvoices(data || []));
    }
  }, [project]);

  useEffect(() => {
    timelineEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!project) return null;

  const customer = (() => {
    if (!project.customer_id) return null;
    return customers.find(c => c.id === project.customer_id) || null;
  })();
  const customerName = customer?.full_name || customer?.email || "Unassigned";

  const getInitials = (name: string | null, email: string | null) => {
    if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    if (email) return email[0].toUpperCase();
    return "?";
  };

  // Build timeline from messages + invoices + project creation
  const timeline: TimelineEvent[] = [
    { id: "created", type: "created" as const, timestamp: project.created_at, data: { title: project.title } },
    ...messages.map(m => ({ id: m.id, type: "message" as const, timestamp: m.created_at, data: m })),
    ...invoices.map(i => ({ id: i.id, type: "invoice" as const, timestamp: i.created_at, data: i })),
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const handleSave = async () => {
    const { error } = await supabase.from("projects").update({
      description: form.description || null,
      address: form.address || null,
      notes: form.notes || null,
      quote_amount: form.quote_amount ? parseFloat(form.quote_amount) : null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: form.status,
    }).eq("id", project.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Project updated");
      setEditing(false);
      onRefresh();
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      content: newMessage.trim(),
      project_id: project.id,
      sender_id: user.id,
    });
    if (error) {
      toast.error(error.message);
    } else {
      setNewMessage("");
      // Refresh messages
      const { data } = await supabase.from("messages").select("*").eq("project_id", project.id).order("created_at", { ascending: true });
      setMessages(data || []);
    }
    setSending(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[560px] overflow-y-auto p-0">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border">
          <SheetHeader className="pb-0">
            <SheetTitle className="font-heading text-xl">{project.title}</SheetTitle>
          </SheetHeader>
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-6 w-6">
              {customer?.avatar_url && <AvatarImage src={customer.avatar_url} alt={customerName} />}
              <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                {getInitials(customer?.full_name || null, customer?.email || null)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{customerName}</span>
          </div>

          {/* Status & Quick Info */}
          <div className="flex flex-wrap gap-3 mt-3">
            {editing ? (
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as ProjectStatus }))}>
                <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className="text-xs">{STATUS_LABELS[project.status]}</Badge>
            )}
            {project.address && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {project.address}
              </span>
            )}
            {project.quote_amount && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <PoundSterling className="h-3 w-3" /> £{project.quote_amount.toLocaleString("en-GB")}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Editable Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-heading font-semibold">Details</h3>
              {!editing ? (
                <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="text-xs h-7">Edit</Button>
              ) : (
                <Button size="sm" onClick={handleSave} className="text-xs h-7"><Save className="h-3 w-3 mr-1" /> Save</Button>
              )}
            </div>
            {editing ? (
              <div className="space-y-3">
                <div><Label className="text-xs">Description</Label><Textarea className="mt-1 text-sm" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                <div><Label className="text-xs">Address</Label><Input className="mt-1 text-sm" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Quote (£)</Label><Input type="number" className="mt-1 text-sm" value={form.quote_amount} onChange={e => setForm(f => ({ ...f, quote_amount: e.target.value }))} /></div>
                  <div><Label className="text-xs">Start Date</Label><Input type="date" className="mt-1 text-sm" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} /></div>
                </div>
                <div><Label className="text-xs">Notes</Label><Textarea className="mt-1 text-sm" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-muted-foreground">
                {project.description && <p>{project.description}</p>}
                {project.start_date && (
                  <p className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Started {format(new Date(project.start_date), "dd MMM yyyy")}</p>
                )}
                {project.notes && <p className="italic border-l-2 border-muted pl-3 mt-2">{project.notes}</p>}
                {!project.description && !project.notes && <p className="italic">No details added yet.</p>}
              </div>
            )}
          </div>

          <Separator />

          {/* Activity Timeline */}
          <div>
            <h3 className="text-sm font-heading font-semibold flex items-center gap-1 mb-4">
              <Clock className="h-4 w-4" /> Activity Timeline
            </h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-4">
                {timeline.map(event => {
                  if (event.type === "created") {
                    return (
                      <div key={event.id} className="flex gap-3 relative">
                        <div className="w-6 h-6 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shrink-0 z-10">
                          <CircleDot className="h-3 w-3 text-primary" />
                        </div>
                        <div className="pt-0.5">
                          <p className="text-xs font-medium text-foreground">Project created</p>
                          <p className="text-[10px] text-muted-foreground">{format(new Date(event.timestamp), "dd MMM yyyy, HH:mm")}</p>
                        </div>
                      </div>
                    );
                  }

                  if (event.type === "invoice") {
                    const inv = event.data as Invoice;
                    return (
                      <div key={event.id} className="flex gap-3 relative">
                        <div className="w-6 h-6 rounded-full bg-accent border-2 border-accent-foreground/20 flex items-center justify-center shrink-0 z-10">
                          <Receipt className="h-3 w-3 text-accent-foreground" />
                        </div>
                        <div className="pt-0.5 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-foreground">
                              Invoice <span className="font-mono">{inv.invoice_number}</span> — £{inv.amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                            </p>
                            <Badge variant="outline" className="text-[10px] capitalize h-5">{inv.status}</Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{format(new Date(event.timestamp), "dd MMM yyyy, HH:mm")}</p>
                        </div>
                      </div>
                    );
                  }

                  if (event.type === "message") {
                    const msg = event.data as Message;
                    const isAdmin = msg.sender_id !== project.customer_id;
                    const sender = isAdmin ? "Greenhills" : customerName;
                    return (
                      <div key={event.id} className="flex gap-3 relative">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          isAdmin ? "bg-primary text-primary-foreground" : "bg-muted border-2 border-border"
                        }`}>
                          <MessageSquare className="h-3 w-3" />
                        </div>
                        <div className="pt-0.5 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-foreground">{sender}</span>
                            <span className="text-[10px] text-muted-foreground">{format(new Date(event.timestamp), "dd MMM, HH:mm")}</span>
                          </div>
                          <p className={`text-xs p-2 rounded-lg ${isAdmin ? "bg-primary/10" : "bg-muted"}`}>{msg.content}</p>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
                <div ref={timelineEndRef} />
              </div>
            </div>

            {/* Admin Reply Box */}
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Send a message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                className="text-sm"
              />
              <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim() || sending}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProjectDetail;
