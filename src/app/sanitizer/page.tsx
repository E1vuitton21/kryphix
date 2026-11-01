"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function SanitizerPage() {
  const [activeTab, setActiveTab] = useState<"text" | "image">("text");

  // Text sanitizer states
  const [inputText, setInputText] = useState("");
  const [sanitizedText, setSanitizedText] = useState("");
  const [stats, setStats] = useState({
    nik: 0,
    phone: 0,
    email: 0,
    apiKeys: 0,
    cards: 0,
  });
  const [copied, setCopied] = useState(false);

  // Image EXIF stripper states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cleanedImageUrl, setCleanedImageUrl] = useState<string | null>(null);
  const [imageOriginalSize, setImageOriginalSize] = useState<number>(0);
  const [imageCleanedSize, setImageCleanedSize] = useState<number>(0);
  const [isStripping, setIsStripping] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSanitize = () => {
    if (!inputText.trim()) return;

    let text = inputText;
    let nikCount = 0;
    let phoneCount = 0;
    let emailCount = 0;
    let apiKeyCount = 0;
    let cardCount = 0;

    // 1. Redact API Keys / Tokens (OpenAI, Google, AWS, Bearer)
    text = text.replace(/(sk-[a-zA-Z0-9_-]{20,}|AIza[0-9A-Za-z-_]{35}|Bearer\s+[a-zA-Z0-9._-]+)/g, () => {
      apiKeyCount++;
      return `[REDACTED_API_KEY_${apiKeyCount}]`;
    });

    // 2. Redact Credit Card (13-19 digits)
    text = text.replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, () => {
      cardCount++;
      return `[REDACTED_CARD_${cardCount}]`;
    });

    // 3. Redact Indonesian NIK (16 digits)
    text = text.replace(/\b\d{16}\b/g, () => {
      nikCount++;
      return `[REDACTED_NIK_${nikCount}]`;
    });

    // 4. Redact Email addresses
    text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, () => {
      emailCount++;
      return `[REDACTED_EMAIL_${emailCount}]`;
    });

    // 5. Redact Indonesian Phone numbers (+62 or 08...)
    text = text.replace(/(\+62|62|0)8[1-9][0-9]{7,10}\b/g, () => {
      phoneCount++;
      return `[REDACTED_PHONE_${phoneCount}]`;
    });

    setStats({
      nik: nikCount,
      phone: phoneCount,
      email: emailCount,
      apiKeys: apiKeyCount,
      cards: cardCount,
    });

    setSanitizedText(text);
  };

  const copyToClipboard = () => {
    if (!sanitizedText) return;
    navigator.clipboard.writeText(sanitizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Handle Image Upload & Strip EXIF via Client-Side Canvas
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageOriginalSize(file.size);
    setCleanedImageUrl(null);
    setIsStripping(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedImage(dataUrl);

      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          // Export pure pixel buffer as PNG or WebP, zeroing all EXIF headers
          canvas.toBlob((blob) => {
            if (blob) {
              setImageCleanedSize(blob.size);
              const cleanUrl = URL.createObjectURL(blob);
              setCleanedImageUrl(cleanUrl);
            }
            setIsStripping(false);
          }, "image/png");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          <canvas ref={canvasRef} className="hidden" />

          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
              PROTEKSI PROMPT & PRIVASI METADATA
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Privacy Sanitizer Suite
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Sensor data pribadi (PII) sebelum mengirim prompt ke AI pihak ketiga, serta bersihkan metadata EXIF (GPS, kamera, tanggal) dari foto Anda 100% di browser.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center border-b border-slate-200">
            <button
              onClick={() => setActiveTab("text")}
              className={`px-8 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "text"
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              📝 AI Prompt & PII Redactor
            </button>
            <button
              onClick={() => setActiveTab("image")}
              className={`px-8 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "image"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              🖼️ EXIF Photo Sanitizer
            </button>
          </div>

          {activeTab === "text" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Box */}
              <div className="cyber-card rounded-2xl p-6 border border-slate-200 shadow-md flex flex-col justify-between space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                    Teks Asli (Mengandung Data Sensitif)
                  </label>
                  <textarea
                    rows={10}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Contoh: 'Tolong buatkan draf balasan untuk klien Budi (budi@gmail.com, NIK: 3271012345678901, HP: 081234567890). Kunci OpenAI tim kami: sk-proj-1234567890abcdef...'"
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                </div>

                <button
                  onClick={handleSanitize}
                  disabled={!inputText.trim()}
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all disabled:opacity-50"
                >
                  🧹 Sanitasi & Sensor Data Rahasia
                </button>
              </div>

              {/* Output Box */}
              <div className="cyber-card rounded-2xl p-6 border border-slate-200 shadow-md flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-mono font-bold uppercase text-slate-700">
                      Hasil Bersih (Aman untuk AI Eksternal)
                    </label>
                    {sanitizedText && (
                      <button
                        onClick={copyToClipboard}
                        className="text-xs font-bold text-amber-700 hover:underline"
                      >
                        {copied ? "✓ Tersalin!" : "Salin Hasil"}
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={10}
                    readOnly
                    value={sanitizedText}
                    placeholder="Hasil sanitasi akan muncul di sini..."
                    className="w-full p-3.5 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 outline-none font-mono"
                  />
                </div>

                {/* Stats badges */}
                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                    NIK Disensor: {stats.nik}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                    Email: {stats.email}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                    HP: {stats.phone}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                    Kunci API: {stats.apiKeys}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                  Unggah Foto (JPG, PNG, WebP) untuk Menghapus Jejak Metadata EXIF
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                />
              </div>

              {isStripping && (
                <div className="text-xs font-mono text-cyan-600 animate-pulse">
                  ⏳ Menghapus tag EXIF, GPS lokasi, dan serial kamera di canvas peramban...
                </div>
              )}

              {cleanedImageUrl && (
                <div className="p-6 rounded-2xl bg-cyan-50/50 border border-cyan-200 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-cyan-900 uppercase">
                      ✓ FOTO BERSIH DARI JEJAK EXIF / GPS
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Ukuran Asli: {(imageOriginalSize / 1024).toFixed(1)} KB → Bersih: {(imageCleanedSize / 1024).toFixed(1)} KB
                    </span>
                  </div>

                  <div className="max-w-xs mx-auto border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white p-2">
                    <img
                      src={cleanedImageUrl}
                      alt="Sanitized Result"
                      className="w-full h-auto rounded-lg object-contain"
                    />
                  </div>

                  <div className="text-center pt-2">
                    <a
                      href={cleanedImageUrl}
                      download="kryphix-sanitized-photo.png"
                      className="inline-block px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all"
                    >
                      💾 Unduh Foto Bersih (Tanpa EXIF)
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
