import path from "path";
import sharp from "sharp";

export async function preprocessImage(
  imagePath: string
): Promise<string> {
  const outputPath = path.join(
    path.dirname(imagePath),
    `${path.basename(
      imagePath,
      path.extname(imagePath)
    )}-processed.png`
  );

  console.log("🧹 Preprocessing image...");

  await sharp(imagePath)
    .rotate() 
    .grayscale() 
    .linear(1.2, -10) 
    .png()
    .toFile(outputPath);

  console.log(
    ` Processed image: ${outputPath}`
  );

  return outputPath;
}