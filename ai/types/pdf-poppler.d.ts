declare module "pdf-poppler" {
  type ConvertOptions = {
    format: "png" | "jpeg" | "jpg";
    out_dir: string;
    out_prefix: string;
    page?: number | null;
    scale?: number;
  };

  function convert(
    filePath: string,
    options: ConvertOptions
  ): Promise<void>;

  const pdf: {
    convert: typeof convert;
  };

  export default pdf;
}