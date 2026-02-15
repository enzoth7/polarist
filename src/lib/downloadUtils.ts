
export const forceDownload = async (url: string, filename: string) => {
    // Detect Mobile/Tablet
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        // Strategy for Mobile/PWA:
        // 1. Try Web Share API (Best UX, native menu)
        // 2. Fallback to Direct Navigation (Forces browser to handle download)
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            // Force PNG type explicitly to avoid .png.jpeg issues on some mobile browsers
            const file = new File([blob], filename, { type: 'image/png' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Descargar Imagen',
                    // Empty text prevents some platforms from converting to link
                    text: '',
                });
                return; // Shared successfully
            }
        } catch (e) {
            console.warn('Share API failed, falling back to direct download:', e);
        }

        // Fallback: Direct Navigation triggers native download manager
        const downloadUrl = new URL(url);
        // Ensure we request strict attachment content-disposition
        downloadUrl.searchParams.set('download', filename);
        window.location.href = downloadUrl.toString();

    } else {
        // Strategy for Desktop (PC):
        // Fetch + Blob + Anchor (Works perfectly on PC, allows renaming without server changes)
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

        } catch (error) {
            console.error('Desktop download failed, falling back to direct link:', error);
            const downloadUrl = new URL(url);
            downloadUrl.searchParams.set('download', filename);
            window.location.href = downloadUrl.toString();
        }
    }
};
