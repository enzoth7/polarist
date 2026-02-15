export const forceDownload = async (url: string, filename: string) => {
    try {
        // Method 1: Fetch and Blob (Best for renaming and PWA experience)
        // Requires CORS 'Access-Control-Allow-Origin: *' which Supabase storage provides for public buckets
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
        console.error('Blob download failed, falling back to direct link:', error);

        // Method 2: Direct Link with ?download param (Fallback)
        // Forces browser to handle Content-Disposition: attachment
        const downloadUrl = new URL(url);
        downloadUrl.searchParams.set('download', filename);

        // Usage of _self avoids opening new tabs which can be blocked or cause white screens in PWAs
        window.location.href = downloadUrl.toString();
    }
};
