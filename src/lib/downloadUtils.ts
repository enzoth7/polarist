export const forceDownload = async (url: string, filename: string) => {
    try {
        const downloadUrl = new URL(url);
        // Supabase Storage specific: 
        // The 'download' query param sets the Content-Disposition filename
        downloadUrl.searchParams.set('download', filename);

        const link = document.createElement('a');
        link.href = downloadUrl.toString();
        // explicit download attribute for browsers that support it
        link.setAttribute('download', filename);
        link.setAttribute('target', '_self'); // Fix for PWA: _blank causes white screen hang on iOS/Android WebViews
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Download failed:', error);
        window.open(url, '_blank');
    }
};
