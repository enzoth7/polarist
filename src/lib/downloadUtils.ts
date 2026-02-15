/**
 * Force download a file from a URL, handling PWA and Browser differences.
 * @param url The URL of the file to download
 * @param filename The name to save the file as
 */
export const forceDownload = async (url: string, filename: string) => {
    try {
        const response = await fetch(url);
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
        console.error('Download failed:', error);
        // Fallback to simple open if fetch fails (e.g. CORS)
        window.open(url, '_blank');
    }
};
