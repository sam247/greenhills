import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Trash2, MapPin, Loader2, Image as ImageIcon } from "lucide-react";
import { SERVICES } from "@/data/services";

const SERVICE_OPTIONS = SERVICES.map((s) => ({ value: s.slug, label: s.name }));

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface JobUpload {
  id: string;
  title: string | null;
  description: string | null;
  location: string | null;
  service: string;
  image_urls: string[];
  created_at: string;
}

const RecentJobsTab = () => {
  const supabase = getSupabaseBrowserClient();
  const [jobs, setJobs] = useState<JobUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");

  const fetchJobs = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("job_uploads")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setJobs(data as JobUpload[]);
    if (error) toast.error("Failed to load jobs");
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const valid = selected.filter(f => {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        toast.error(`${f.name}: Only JPG, PNG, and WebP accepted`);
        return false;
      }
      if (f.size > MAX_FILE_SIZE) {
        toast.error(`${f.name}: Max 3MB per file`);
        return false;
      }
      return true;
    });
    setFiles(prev => [...prev, ...valid]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!service) { toast.error("Please select a service"); return; }
    if (files.length === 0) { toast.error("Please add at least one image"); return; }
    if (!supabase) return;

    setUploading(true);
    try {
      const imageUrls: string[] = [];

      for (const file of files) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("job-images")
          .upload(path, file, { contentType: file.type });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("job-images")
          .getPublicUrl(path);

        imageUrls.push(urlData.publicUrl);
      }

      const serviceName = SERVICES.find((s) => s.slug === service)?.name || service;
      const locationSlug = location ? location.toLowerCase().replace(/\s+/g, "-") : null;

      const { error } = await supabase.from("job_uploads").insert({
        title: title || null,
        description: description || null,
        location: location || null,
        service: serviceName,
        service_slug: service,
        location_slug: locationSlug,
        image_urls: imageUrls,
      });

      if (error) throw error;

      toast.success("Job uploaded successfully");
      setTitle("");
      setLocation("");
      setService("");
      setDescription("");
      setFiles([]);
      fetchJobs();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const deleteJob = async (job: JobUpload) => {
    if (!supabase) return;
    // Delete images from storage
    for (const url of job.image_urls) {
      const path = url.split("/job-images/")[1];
      if (path) {
        await supabase.storage.from("job-images").remove([path]);
      }
    }
    const { error } = await supabase.from("job_uploads").delete().eq("id", job.id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Job deleted");
      setJobs(prev => prev.filter(j => j.id !== job.id));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Recent Jobs</h1>
        <p className="text-sm text-muted-foreground">Upload job photos to automatically populate the gallery and service pages.</p>
      </div>

      {/* Upload Form */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-heading font-semibold text-lg">Add New Job</h2>

          {/* File input */}
          <div className="space-y-2">
            <Label>Images (JPG, PNG, WebP — max 3MB each)</Label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-muted transition-colors text-sm font-medium">
                <Upload className="h-4 w-4" />
                Choose Files
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-muted-foreground">{files.length} file(s) selected</span>
            </div>
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {files.map((f, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="h-20 w-20 object-cover rounded-md border border-border"
                    />
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Title (optional)</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Full rewire — 3 bed semi" />
            </div>
            <div className="space-y-2">
              <Label>Location (optional)</Label>
              <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Watford" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Service *</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                <SelectContent>
                  {SERVICE_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief note about the job..." rows={1} />
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={uploading} className="font-heading font-bold">
            {uploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4 mr-2" /> Add Job</>}
          </Button>
        </CardContent>
      </Card>

      {/* Jobs List */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-heading font-semibold">No jobs uploaded yet</p>
          <p className="text-sm">Upload your first job above to get started.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <Card key={job.id} className="overflow-hidden">
              {job.image_urls[0] && (
                <img src={job.image_urls[0]} alt={job.title || "Job photo"} className="w-full aspect-[4/3] object-cover" />
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {job.title && <h3 className="font-heading font-semibold text-sm truncate">{job.title}</h3>}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">{job.service}</span>
                      {job.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(job.created_at).toLocaleDateString("en-GB")}
                      {job.image_urls.length > 1 && ` · ${job.image_urls.length} photos`}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteJob(job)} className="text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentJobsTab;
