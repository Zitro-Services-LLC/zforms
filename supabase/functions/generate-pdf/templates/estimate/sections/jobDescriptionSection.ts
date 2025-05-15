
/**
 * Adds a job description section to the estimate PDF
 */
export function addJobDescriptionSection(
  page: any,
  currentY: number,
  width: number,
  boldFont: any,
  font: any,
  jobDescription: string | undefined
): number {
  if (!jobDescription) {
    return currentY; // Return unchanged position if no job description
  }
  
  currentY -= 20;
  page.drawText("JOB DESCRIPTION", {
    x: 50,
    y: currentY,
    size: 12,
    font: boldFont,
  });
  
  currentY -= 20;
  page.drawText(jobDescription, {
    x: 50,
    y: currentY,
    size: 10,
    font: font,
    maxWidth: width - 100,
  });
  
  return currentY - 40; // Return the new Y position
}
