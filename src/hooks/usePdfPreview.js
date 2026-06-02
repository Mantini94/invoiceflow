import { useState } from "react";

import { createInvoicePdfSignedUrl } from "../services/storageService";

export function usePdfPreview() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const loadInvoicePdf = async (filePath) => {
    if (!filePath) {
      setPdfUrl("");
      return;
    }

    const { data, error } = await createInvoicePdfSignedUrl(filePath);

    if (error) {
      console.error("Błąd PDF:", error);
      setPdfUrl("");
      return;
    }

    setPdfUrl(data?.signedUrl || "");
  };

  return {
    pdfUrl,
    setPdfUrl,
    pdfModalOpen,
    setPdfModalOpen,
    loadInvoicePdf,
  };
}
