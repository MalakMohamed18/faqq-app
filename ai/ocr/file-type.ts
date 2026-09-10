import path from "path";

export type SupportedFileType = "image" | "pdf";

export function detectFileType(
  filePath: string
): SupportedFileType {
  const extension = path
    .extname(filePath)
    .toLowerCase();

  if (extension === ".pdf") {
    return "pdf";
  }

  if (
    [".jpg", ".jpeg", ".png", ".webp"].includes(
      extension
    )
  ) {
    return "image";
  }

  throw new Error(
    `Unsupported file type: ${extension}`
  );
}