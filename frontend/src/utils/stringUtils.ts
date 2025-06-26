export function truncateFilename(filename?: string, maxLength: number = 12): string {
    if (!filename) return '';
  
    const dotIndex = filename.lastIndexOf('.');
    const name = dotIndex !== -1 ? filename.slice(0, dotIndex) : filename;
    const ext = dotIndex !== -1 ? filename.slice(dotIndex) : '';
  
    const truncated = name.length > maxLength ? name.slice(0, maxLength) + '…' : name;
  
    return truncated + ext;
  }
  