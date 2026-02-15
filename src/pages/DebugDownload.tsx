
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function DebugDownload() {
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [testUrl, setTestUrl] = useState<string>('');

    const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    // Fetch a real image to test
    const fetchRealImage = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('user_images')
            .select('image_url')
            .limit(1)
            .single();

        if (error || !data) {
            addLog(`Error fetching image: ${error?.message}`);
        } else {
            setTestUrl(data.image_url);
            addLog(`Ready to test with: ${data.image_url.slice(0, 30)}...`);
        }
        setLoading(false);
    };

    // Method 1: Fetch + Blob (Current)
    const testFetchBlob = async () => {
        if (!testUrl) return;
        addLog('Testing Method 1 (Fetch + Blob)...');
        try {
            const response = await fetch(testUrl);
            const blob = await response.blob();
            addLog(`Blob created: ${blob.type}, size: ${blob.size}`);

            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `debug-method1-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
            addLog('Link clicked.');
        } catch (e: any) {
            addLog(`Method 1 Failed: ${e.message}`);
        }
    };

    // Method 2: Direct Link (Self)
    const testDirectSelf = () => {
        if (!testUrl) return;
        addLog('Testing Method 2 (Direct Self)...');
        const url = new URL(testUrl);
        url.searchParams.set('download', `debug-method2-${Date.now()}.png`);
        window.location.href = url.toString();
        addLog('Navigated to URL.');
    };

    // Method 3: Direct Link (Blank)
    const testDirectBlank = () => {
        if (!testUrl) return;
        addLog('Testing Method 3 (Direct Blank)...');
        const url = new URL(testUrl);
        url.searchParams.set('download', `debug-method3-${Date.now()}.png`);
        window.open(url.toString(), '_blank');
        addLog('Opened new window.');
    };

    // Method 4: Web Share API (Mobile Friendly)
    const testShare = async () => {
        if (!testUrl) return;
        addLog('Testing Method 4 (Share API)...');
        try {
            const response = await fetch(testUrl);
            const blob = await response.blob();
            const file = new File([blob], `visual-growth-${Date.now()}.png`, { type: blob.type });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Descargar Imagen',
                    text: 'Aquí está tu imagen generada.',
                });
                addLog('Share API successful.');
            } else {
                addLog('Share API not supported or cannot share files.');
            }
        } catch (e: any) {
            addLog(`Method 4 Failed: ${e.message}`);
        }
    };

    return (
        <div className="p-4 space-y-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold">Download Debug Tool</h1>

            <Button onClick={fetchRealImage} disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : '1. Load Test Image'}
            </Button>

            {testUrl && (
                <div className="space-y-2 grid grid-cols-1">
                    <Button onClick={testFetchBlob} variant="outline">Test 1: Fetch + Blob (PC Standard)</Button>
                    <Button onClick={testDirectSelf} variant="outline">Test 2: Direct Link (Same Tab)</Button>
                    <Button onClick={testDirectBlank} variant="outline">Test 3: Direct Link (New Tab)</Button>
                    <Button onClick={testShare} variant="secondary" className="border-2 border-blue-500">Test 4: Share API (Mobile Best)</Button>
                </div>
            )}

            <div className="bg-gray-100 p-2 rounded text-xs font-mono h-48 overflow-auto border">
                {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
        </div>
    );
}
