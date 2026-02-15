import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, Image as ImageIcon, Download } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface UserImage {
    id: string;
    image_url: string;
    type: 'upload' | 'enhanced';
    created_at: string;
    status: string;
    parent_id: string | null;
    metadata: Record<string, any>;
}

const Gallery = () => {
    const { toast } = useToast();
    const [images, setImages] = useState<UserImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('user_images')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

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

            // 3. Save to Database
            const { error: dbError } = await supabase
                .from('user_images')
                .insert({
                    user_id: user.id,
                    image_url: publicUrl,
                    type: 'upload',
                    status: 'ready'
                });

            if (dbError) throw dbError;

            toast({
                title: "Producto subido",
                description: "Tu imagen se ha guardado correctamente.",
            });

            fetchImages(); // Refresh

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

    const uploads = images.filter(img => img.type === 'upload');
    const enhanced = images.filter(img => img.type === 'enhanced');
    const hasNewImages = enhanced.length > 0;

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Galería de Contenido</h1>
                        <p className="text-muted-foreground mt-1">
                            Sube tus productos y descarga contenido mejorado.
                        </p>
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
                                            <a href={img.image_url} download target="_blank" rel="noopener noreferrer">
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
                            <h3 className="text-xl font-semibold">Tu galería está vacía</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                                Comienza subiendo fotos de tus productos para recibir contenido mejorado.
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
                                                    <a href={img.image_url} target="_blank" rel="noopener noreferrer">
                                                        <Download className="w-3 h-3 mr-2" />
                                                        Ver
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
            </div>
        </div>
    );
};

export default Gallery;
