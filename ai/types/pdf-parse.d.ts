declare module "pdf-parse" {
  type PDFParseOptions = {
    data: Buffer;
  };

  type PDFTextResult = {
    text: string;
    total: number;
  };

  export class PDFParse {
    constructor(options: PDFParseOptions);
    getText(): Promise<PDFTextResult>;
    destroy(): Promise<void>;
  }
}