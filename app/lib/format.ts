// Utility formatting functions
// Formats a byte size into a human-readable string using KB, MB, GB (base 1024)
// Examples:
//  - formatSize(0) => "0 KB"
//  - formatSize(1024) => "1 KB"
//  - formatSize(1536) => "1.5 KB"
//  - formatSize(1048576) => "1 MB"
//  - formatSize(1073741824) => "1 GB"
export function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";

  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  let value: number;
  let unit: "KB" | "MB" | "GB";

  if (bytes >= GB) {
    value = bytes / GB;
    unit = "GB";
  } else if (bytes >= MB) {
    value = bytes / MB;
    unit = "MB";
  } else {
    value = bytes / KB; // anything less than 1 MB shows as KB
    unit = "KB";
  }

  // Round to one decimal place, but drop trailing .0
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);

  return `${text} ${unit}`;
}


export const generateUUID = () => crypto.randomUUID();