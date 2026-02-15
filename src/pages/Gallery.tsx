import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, Image as ImageIcon, Download, FolderPlus, ArrowLeft, Folder } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Campaign {
    id: string;
    name: string;
    created_at: string;
    // user_images is an array of objects, picked via select query
    user_images?: { image_url: string; type: string; viewed: boolean }[];
}

interface UserImage {
    id: string;
    image_url: string;
    type: 'upload' | 'enhanced';
    created_at: string;
    status: string;
    campaign_id: string;
    viewed?: boolean;
}

const Gallery = () => {
    const { toast } = useToast();
    const { forceDownload } = { forceDownload: (url: string, name: string) => import('@/lib/downloadUtils').then(m => m.forceDownload(url, name)) };


    // View State
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

    // Data State
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [images, setImages] = useState<UserImage[]>([]);

    // UI State
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [creatingCampaign, setCreatingCampaign] = useState(false);
    const [newCampaignName, setNewCampaignName] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // DEBUG STATE
    const [debugInfo, setDebugInfo] = useState<{ userId: string | null, email: string | null }>({ userId: null, email: null });

    useEffect(() => {
        fetchCampaigns();
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setDebugInfo({ userId: user.id, email: user.email || 'no-email' });
        }
    };

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch campaigns with image preview and type for notification
            const { data, error } = await supabase
                .from('campaigns')
                .select('*, user_images(image_url, type, viewed)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Limit user_images to 1 per campaign (client-side filtering if Supabase limit logic is tricky in join)
            // Or just take the first one in render logic.
            setCampaigns(data || []);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchImages = async (campaignId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('user_images')
                .select('*')
                .eq('campaign_id', campaignId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCampaign = async () => {
        if (!newCampaignName.trim()) return;

        try {
            setCreatingCampaign(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            const { error } = await supabase
                .from('campaigns')
                .insert({
                    user_id: user.id,
                    name: newCampaignName.trim()
                });

            if (error) throw error;

            toast({ title: "Campaña creada" });
            setIsDialogOpen(false);
            setNewCampaignName("");
            fetchCampaigns();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setCreatingCampaign(false);
        }
    };

    const handleEnterCampaign = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        fetchImages(campaign.id);
        setView('detail');
    };

    const handleBack = () => {
        setSelectedCampaign(null);
        setImages([]);
        fetchCampaigns(); // Refresh to update previews
        setView('list');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file || !selectedCampaign) return;

            setUploading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            // 1. Upload to Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);

            // 3. Save to Database with campaign_id
            const { error: dbError } = await supabase
                .from('user_images')
                .insert({
                    user_id: user.id,
                    image_url: publicUrl,
                    type: 'upload',
                    status: 'ready',
                    campaign_id: selectedCampaign.id
                });

            if (dbError) throw dbError;

            toast({
                title: "Producto subido",
                description: "Tu imagen se ha guardado en la campaña.",
            });

            fetchImages(selectedCampaign.id);

        } catch (error: any) {
            console.error('Upload error:', error);
            toast({
                title: "Error al subir",
                description: error.message || "No se pudo subir la imagen.",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const uploads = images.filter(img => img.type === 'upload' || !img.type || (img.type?.toLowerCase() !== 'enhanced' && img.viewed));
    const enhanced = images.filter(img => img.type?.toLowerCase().trim() === 'enhanced' && !img.viewed);
    const hasNewImages = enhanced.length > 0;

    // --- RENDER ---

    if (view === 'list') {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Galería de Contenido</h1>
                            <p className="text-muted-foreground mt-1">
                                Organiza tus productos en campañas.
                            </p>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="cursor-pointer">
                                    <FolderPlus className="w-4 h-4 mr-2" />
                                    Crear Campaña
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Nueva Campaña</DialogTitle>
                                    <DialogDescription>
                                        Crea una carpeta para organizar tus productos.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Nombre
                                        </Label>
                                        <Input
                                            id="name"
                                            value={newCampaignName}
                                            onChange={(e) => setNewCampaignName(e.target.value)}
                                            className="col-span-3"
                                            placeholder="Ej. Colección Verano"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCreateCampaign} disabled={creatingCampaign}>
                                        {creatingCampaign && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Crear
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Campaigns Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed rounded-xl">
                            <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Folder className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold">No tienes campañas</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                                Crea tu primera campaña para empezar a subir productos.
                            </p>
                            <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                                Crear Campaña
                            </Button>
                        </div>
                    ) : (
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {campaigns.map((campaign) => {
                                // Get first image for preview
                                const previewImage = campaign.user_images?.[0]?.image_url;
                                // Check for new/enhanced content (case insensitive) and NOT VIEWED
                                const hasNewContent = campaign.user_images?.some(img => img.type?.toLowerCase().trim() === 'enhanced' && !img.viewed);

                                return (
                                    <div
                                        key={campaign.id}
                                        onClick={() => handleEnterCampaign(campaign)}
                                        className="group cursor-pointer border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-all relative"
                                    >
                                        {/* Preview Area */}
                                        <div className="aspect-video bg-secondary/30 relative overflow-hidden flex items-center justify-center">
                                            {previewImage ? (
                                                <img
                                                    src={previewImage}
                                                    alt={campaign.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        </div>

                                        {/* Info Area */}
                                        <div className="p-4">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg truncate">{campaign.name}</h3>
                                                {hasNewContent && (
                                                    <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="Nuevas imágenes" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {new Date(campaign.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Detail View (Similar to previous Gallery, but filtered)
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handleBack}>
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">{selectedCampaign?.name}</h1>
                            <p className="text-muted-foreground mt-1">
                                Gestiona las imágenes de esta campaña.
                            </p>
                        </div>
                    </div>

                    <div>
                        <input
                            type="file"
                            id="upload-image"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                        <label htmlFor="upload-image">
                            <Button
                                className="cursor-pointer"
                                asChild
                                disabled={uploading}
                            >
                                <span>
                                    {uploading ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Upload className="w-4 h-4 mr-2" />
                                    )}
                                    Subir Producto
                                </span>
                            </Button>
                        </label>
                    </div>
                </div>

                {/* New Enhanced Images Section */}
                {hasNewImages && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                            </div>
                            <h2 className="text-xl font-bold">Imágenes Nuevas</h2>
                            <span className="text-sm text-muted-foreground">({enhanced.length})</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {enhanced.map((img) => (
                                <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-green-500/30 bg-card shadow-lg shadow-green-500/5">
                                    <img
                                        src={img.image_url}
                                        alt="Contenido mejorado"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />

                                    {/* Overlay with Download */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                        <Button size="sm" variant="secondary" className="h-8 w-full" asChild>
                                            <a
                                                href={img.image_url}
                                                download={`visual-growth-${img.id}.png`}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    // 1. Force Download
                                                    await forceDownload(img.image_url, `visual-growth-${img.id}.png`);

                                                    // 2. Mark as Viewed (Database)
                                                    const { error } = await supabase
                                                        .from('user_images')
                                                        .update({ viewed: true })
                                                        .eq('id', img.id);

                                                    if (!error) {
                                                        // 3. Mark as Viewed (Local State)
                                                        setImages(prev => prev.map(item => item.id === img.id ? { ...item, viewed: true } : item));
                                                        toast({ title: "Imagen descargada y marcada como vista" });
                                                    }
                                                }}
                                            >
                                                <Download className="w-3 h-3 mr-2" />
                                                Descargar
                                            </a>
                                        </Button>
                                    </div>

                                    {/* Green Badge */}
                                    <div className="absolute top-2 left-2">
                                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-500 text-white border border-green-600 flex items-center gap-1">
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white" />
                                            NUEVA
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Mark as Seen Action */}
                {hasNewImages && (
                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                                const ids = enhanced.map(img => img.id);
                                await supabase.from('user_images').update({ viewed: true }).in('id', ids);
                                // Optimistic update
                                setImages(prev => prev.map(img => ids.includes(img.id) ? { ...img, viewed: true } : img));
                                toast({ title: "Imágenes marcadas como vistas" });
                            }}
                        >
                            Marcar todo como visto
                        </Button>
                    </div>
                )}

                {/* Separator */}
                {hasNewImages && uploads.length > 0 && (
                    <div className="border-t border-border" />
                )}

                {/* Products Grid */}
                <section className="space-y-4">
                    {uploads.length > 0 && (
                        <h2 className="text-lg font-semibold text-muted-foreground">Mis Productos</h2>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : uploads.length === 0 && !hasNewImages ? (
                        <div className="text-center py-20 border-2 border-dashed rounded-xl">
                            <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold">Campaña vacía</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                                Sube fotos de tus productos a esta campaña.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {uploads.map((img) => (
                                <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden border bg-card">
                                    <img
                                        src={img.image_url}
                                        alt="Producto"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                        <div className="text-white">
                                            <p className="text-xs font-medium uppercase tracking-wider mb-1">
                                                Original
                                            </p>
                                            <div className="flex gap-2 mt-2">
                                                <Button size="sm" variant="secondary" className="h-8 w-full" asChild>
                                                    <a
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            forceDownload(img.image_url, `visual-growth-prod-${img.id}.png`);
                                                        }}
                                                    >
                                                        <Download className="w-3 h-3 mr-2" />
                                                        Descargar
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Badge */}
                                    <div className="absolute top-2 left-2">
                                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-background/80 text-foreground border border-border">
                                            PROD
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                {/* DEBUG FOOTER - REMOVE BEFORE PRODUCTION */}
                <div className="fixed bottom-0 left-0 right-0 bg-black/90 text-white p-2 text-[10px] font-mono z-50 flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity">
                    <div>
                        User: {debugInfo.userId || 'Not Logged In'} <br />
                        Email: {debugInfo.email}
                    </div>
                    <div className="text-right">
                        Campaigns Found: {campaigns.length} <br />
                        Loading: {loading ? 'Yes' : 'No'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gallery;
