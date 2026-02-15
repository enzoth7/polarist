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
        // Fallback: If fetch fails (CORS), try to force download via header or new window
        const downloadUrl = new URL(url);
        downloadUrl.searchParams.set('download', filename); // Supabase specific: forces Content-Disposition: attachment

        // Try creating a link with the modified URL
        const link = document.createElement('a');
        link.href = downloadUrl.toString();
        link.download = filename;
        link.target = '_blank'; // Required for some mobile browsers to trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
