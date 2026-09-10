import fs from "fs";
import path from "path";
import pdf from "pdf-poppler";

export async function convertPDFToImages(
  pdfPath: string
): Promise<string[]> {
  console.log(" Converting PDF pages to images...");

  const outputDir = path.join(
    path.dirname(pdfPath),
    "generated-pages"
  );

  fs.mkdirSync(outputDir, {
    recursive: true,
  });

  const pdfName = path.basename(
    pdfPath,
    path.extname(pdfPath)
  );

  const outputPrefix = path.join(
    outputDir,
    pdfName
  );

  const options = {
    format: "png" as const,
    out_dir: outputDir,
    out_prefix: pdfName,
    page: null,
    scale: 1800,
  };

  await pdf.convert(pdfPath, options);

  const files = fs
    .readdirSync(outputDir)
    .filter(
      (file) =>
        file.startsWith(`${pdfName}-`) &&
        file.endsWith(".png")
    )
    .sort((a, b) => {
      const pageA = Number(
        a.match(/-(\d+)\.png$/)?.[1] ?? 0
      );

      const pageB = Number(
        b.match(/-(\d+)\.png$/)?.[1] ?? 0
      );

      return pageA - pageB;
    });

  const imagePaths = files.map((file) =>
    path.join(outputDir, file)
  );

  console.log(
    ` Converted ${imagePaths.length} PDF pages`
  );

  return imagePaths;
}