"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CsvImportButton({ groupId, currentUserId }: { groupId: string, currentUserId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage("Parsing CSV...");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        // Split by lines and remove completely empty ones
        const lines = csvText.split('\n').filter(line => line.trim() !== '');

        // Skip the first row (assuming it is the header: Title,Amount,Currency,Date)
        const dataLines = lines.slice(1);
        let successCount = 0;

        for (const line of dataLines) {
          // Simple comma split
          const [title, amount, currency, date] = line.split(',');

          // Skip malformed rows
          if (!title || !amount || !currency || !date) continue;

          // Build the exact payload our API expects
          const payload = {
            groupId,
            title: title.trim(),
            amount: parseFloat(amount.trim()),
            currency: currency.trim().toUpperCase() || "INR",
            date: new Date(date.trim()).toISOString(),
            paidBy: currentUserId, // Defaulting to the uploader for simplicity
            splitType: "EQUAL" 
          };

          // Send it to your existing backend
          await fetch("/api/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          successCount++;
        }

        setMessage(`✅ Imported ${successCount} expenses!`);
        router.refresh(); // Automatically reload the page to show the new data
      } catch (err) {
         setMessage("❌ Error parsing CSV.");
         console.error(err);
      } finally {
         setIsUploading(false);
         // Reset the file input so you can upload the same file again if needed
         if (fileInputRef.current) fileInputRef.current.value = "";
         // Clear the success message after 4 seconds
         setTimeout(() => setMessage(""), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center space-x-3">
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {message && <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">{message}</span>}
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm text-sm flex items-center space-x-2"
      >
        <span>{isUploading ? "⏳ Uploading..." : "📄 Import CSV"}</span>
      </button>
    </div>
  );
}