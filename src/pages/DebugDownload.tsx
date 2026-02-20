import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function DebugDownload() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [testUrl, setTestUrl] = useState<string>("");
  const { t } = useTranslation();

  const addLog = (msg: string) => setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const fetchRealImage = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("user_images").select("image_url").limit(1).single();

    if (error || !data) {
      addLog(t("debugDownload.logs.fetchError", { message: error?.message ?? t("common.unknownError") }));
    } else {
      setTestUrl(data.image_url);
      addLog(t("debugDownload.logs.ready", { url: `${data.image_url.slice(0, 30)}...` }));
    }
    setLoading(false);
  };

  const testFetchBlob = async () => {
    if (!testUrl) return;
    addLog(t("debugDownload.logs.method1Start"));
    try {
      const response = await fetch(testUrl);
      const blob = await response.blob();
      addLog(t("debugDownload.logs.blobCreated", { type: blob.type, size: blob.size }));

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `debug-method1-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      addLog(t("debugDownload.logs.linkClicked"));
    } catch (e: any) {
      addLog(t("debugDownload.logs.methodFailed", { method: "1", message: e.message }));
    }
  };

  const testDirectSelf = () => {
    if (!testUrl) return;
    addLog(t("debugDownload.logs.method2Start"));
    const url = new URL(testUrl);
    url.searchParams.set("download", `debug-method2-${Date.now()}.png`);
    window.location.href = url.toString();
    addLog(t("debugDownload.logs.navigated"));
  };

  const testDirectBlank = () => {
    if (!testUrl) return;
    addLog(t("debugDownload.logs.method3Start"));
    const url = new URL(testUrl);
    url.searchParams.set("download", `debug-method3-${Date.now()}.png`);
    window.open(url.toString(), "_blank");
    addLog(t("debugDownload.logs.openedWindow"));
  };

  const testShare = async () => {
    if (!testUrl) return;
    addLog(t("debugDownload.logs.method4Start"));
    try {
      const response = await fetch(testUrl);
      const blob = await response.blob();
      const file = new File([blob], `visual-growth-${Date.now()}.png`, { type: blob.type });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: t("debugDownload.shareTitle"),
          text: t("debugDownload.shareText"),
        });
        addLog(t("debugDownload.logs.shareSuccess"));
      } else {
        addLog(t("debugDownload.logs.shareNotSupported"));
      }
    } catch (e: any) {
      addLog(t("debugDownload.logs.methodFailed", { method: "4", message: e.message }));
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4 p-4">
      <h1 className="text-xl font-bold">{t("debugDownload.title")}</h1>

      <Button onClick={fetchRealImage} disabled={loading} className="w-full">
        {loading ? <Loader2 className="animate-spin" /> : t("debugDownload.loadTestImage")}
      </Button>

      {testUrl && (
        <div className="grid grid-cols-1 space-y-2">
          <Button onClick={testFetchBlob} variant="outline">
            {t("debugDownload.test1")}
          </Button>
          <Button onClick={testDirectSelf} variant="outline">
            {t("debugDownload.test2")}
          </Button>
          <Button onClick={testDirectBlank} variant="outline">
            {t("debugDownload.test3")}
          </Button>
          <Button onClick={testShare} variant="secondary" className="border-2 border-blue-500">
            {t("debugDownload.test4")}
          </Button>
        </div>
      )}

      <div className="h-48 overflow-auto rounded border bg-gray-100 p-2 font-mono text-xs">
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
}
