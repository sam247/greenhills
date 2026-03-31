import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Check, Loader2, RefreshCw, Unplug } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AccountingConnection {
  id: string;
  provider: string;
  status: string;
  last_synced_at: string | null;
  connected_at: string;
}

const PROVIDERS = [
  { value: "quickbooks", label: "QuickBooks" },
  { value: "sage", label: "Sage" },
  { value: "xero", label: "Xero" },
];

const getProviderLabel = (value: string) =>
  PROVIDERS.find((p) => p.value === value)?.label || value;

const AccountingConnection = () => {
  const supabase = getSupabaseBrowserClient();
  const [connection, setConnection] = useState<AccountingConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState("quickbooks");
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [hovered, setHovered] = useState(false);

  const fetchConnection = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("accounting_connections")
      .select("id, provider, status, last_synced_at, connected_at")
      .order("created_at", { ascending: false })
      .limit(1);
    setConnection(data && data.length > 0 ? (data[0] as AccountingConnection) : null);
    setLoading(false);
  };

  useEffect(() => {
    fetchConnection();
  }, [supabase]);

  const handleConnect = async () => {
    if (!supabase) return;
    setConnecting(true);
    const { error } = await supabase.from("accounting_connections").insert({
      provider: selectedProvider,
      status: "connected",
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Connected to ${getProviderLabel(selectedProvider)}`);
      await fetchConnection();
    }
    setConnecting(false);
  };

  const handleDisconnect = async () => {
    if (!connection || !supabase) return;
    const { error } = await supabase
      .from("accounting_connections")
      .delete()
      .eq("id", connection.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Accounting software disconnected");
      setConnection(null);
    }
  };

  const handleSync = async () => {
    if (!connection || !supabase) return;
    setSyncing(true);
    // Simulate sync delay
    await new Promise((r) => setTimeout(r, 1500));
    const { error } = await supabase
      .from("accounting_connections")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("id", connection.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Invoices synced successfully");
      await fetchConnection();
    }
    setSyncing(false);
  };

  if (loading) return null;

  // NOT CONNECTED
  if (!connection) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger className="w-[130px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROVIDERS.map((p) => (
                <SelectItem key={p.value} value={p.value} className="text-xs">
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleConnect} disabled={connecting} className="text-xs h-8">
            {connecting && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
            Connect
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Connect your accounting software to sync invoices
        </p>
      </div>
    );
  }

  // CONNECTED
  const label = getProviderLabel(connection.provider);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className={`text-xs h-8 transition-colors ${
            hovered
              ? "border-destructive/40 text-destructive hover:bg-destructive/10"
              : "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleDisconnect}
        >
          {hovered ? (
            <>
              <Unplug className="h-3 w-3 mr-1" />
              Disconnect {label}
            </>
          ) : (
            <>
              <Check className="h-3 w-3 mr-1" />
              {label} Connected
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-8"
          onClick={handleSync}
          disabled={syncing}
        >
          {syncing ? (
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3 mr-1" />
          )}
          Sync Now
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">
        {connection.last_synced_at
          ? `Last synced: ${formatDistanceToNow(new Date(connection.last_synced_at), { addSuffix: true })}`
          : "Not synced yet"}
      </p>
    </div>
  );
};

export default AccountingConnection;
