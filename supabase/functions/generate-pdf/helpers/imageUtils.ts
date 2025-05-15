
// Helper function to embed a logo image in the PDF
export async function embedLogoIfExists(
  pdfDoc: any,
  logoUrl: string | null | undefined
): Promise<{
  logo: any,
  logoWidth: number,
  logoHeight: number
} | null> {
  if (!logoUrl) return null;

  try {
    // Fetch the logo image
    const response = await fetch(logoUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch logo: ${response.status} ${response.statusText}`);
      return null;
    }

    // Convert the response to an ArrayBuffer
    const imageBytes = new Uint8Array(await response.arrayBuffer());

    // Determine image type from URL (simplified)
    let logo;
    if (logoUrl.toLowerCase().endsWith('.jpg') || logoUrl.toLowerCase().endsWith('.jpeg')) {
      logo = await pdfDoc.embedJpg(imageBytes);
    } else if (logoUrl.toLowerCase().endsWith('.png')) {
      logo = await pdfDoc.embedPng(imageBytes);
    } else {
      // Default to PNG
      try {
        logo = await pdfDoc.embedPng(imageBytes);
      } catch (err) {
        try {
          logo = await pdfDoc.embedJpg(imageBytes);
        } catch (err) {
          console.warn('Unable to embed logo, unsupported format');
          return null;
        }
      }
    }

    // Return the embedded logo with dimensions
    const { width, height } = logo.scale(0.5); // Scale down a bit for the header
    return { logo, logoWidth: width, logoHeight: height };
  } catch (error) {
    console.warn('Error embedding logo:', error);
    return null;
  }
}
