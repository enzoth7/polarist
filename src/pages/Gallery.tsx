import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, Image as ImageIcon, Download } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface UserImage {
    id: string;
    image_url: string;
    type: 'upload' | 'generation';
    created_at: string;
    status: string;
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
                .from('user-uploads') // Make sure this bucket exists!
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('user-uploads')
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
                title: "Imagen subida",
                description: "Tu imagen de referencia se ha guardado.",
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

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Galería de Estilo</h1>
                        <p className="text-muted-foreground mt-1">
                            Sube tus referencias y recibe tus imágenes generadas.
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
                                    Subir Referencia
                                </span>
                            </Button>
                        </label>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : images.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl">
                        <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold">Tu galería está vacía</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                            Comienza subiendo imágenes de referencia o completa el cuestionario para recibir propuestas.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((img) => (
                            <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden border bg-card">
                                <img
                                    src={img.image_url}
                                    alt="User content"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <div className="text-white">
                                        <p className="text-xs font-medium uppercase tracking-wider mb-1">
                                            {img.type === 'upload' ? 'Tu Referencia' : 'Generada por IA'}
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
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${img.type === 'upload'
                                            ? 'bg-background/80 text-foreground border-border'
                                            : 'bg-primary text-primary-foreground border-primary'
                                        }`}>
                                        {img.type === 'upload' ? 'REF' : 'AI'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
