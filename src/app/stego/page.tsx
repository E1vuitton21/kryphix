"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function StegoPage() {
  const [activeTab, setActiveTab] = useState<"embed" | "extract">("embed");

  // Embed states
  const [embedImage, setEmbedImage] = useState<string | null>(null);
  const [secretText, setSecretText] = useState("");
  const [encodedResultUrl, setEncodedResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract states
  const [extractImage, setExtractImage] = useState<string | null>(null);
  const [extractedSecret, setExtractedSecret] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleEmbedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEmbedImage(event.target?.result as string);
        setEncodedResultUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setExtractImage(event.target?.result as string);
        setExtractedSecret(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // LSB Embedding Algorithm
  const handleEncode = () => {
    if (!embedImage || !secretText.trim() || !canvasRef.current) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.src = embedImage;
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Header: length of secret string (4 bytes = 32 bits)
      const textBytes = new TextEncoder().encode(secretText);
      const totalBytes = textBytes.length;

      // Pack length as 32-bit int
      const header = new Uint8Array(4);
      header[0] = (totalBytes >> 24) & 0xff;
      header[1] = (totalBytes >> 16) & 0xff;
      header[2] = (totalBytes >> 8) & 0xff;
      header[3] = totalBytes & 0xff;

      const payload = new Uint8Array(4 + totalBytes);
      payload.set(header, 0);
      payload.set(textBytes, 4);

      // Check capacity: each byte needs 8 color channels
      if (payload.length * 8 > (data.length * 3) / 4) {
        alert("Gambar terlalu kecil untuk menampung pesan rahasia ini.");
        setIsProcessing(false);
        return;
      }

      let payloadBitIndex = 0;
      const totalBits = payload.length * 8;

      for (let i = 0; i < data.length && payloadBitIndex < totalBits; i++) {
        // Skip Alpha channel (every 4th byte: 3, 7, 11...)
        if ((i + 1) % 4 === 0) continue;

        const byteIndex = Math.floor(payloadBitIndex / 8);
        const bitOffset = 7 - (payloadBitIndex % 8);
        const bit = (payload[byteIndex] >> bitOffset) & 1;

        // Replace LSB
        data[i] = (data[i] & 0xfe) | bit;
        payloadBitIndex++;
      }

      ctx.putImageData(imgData, 0, 0);
      const resultDataUrl = canvas.toDataURL("image/png");
      setEncodedResultUrl(resultDataUrl);
      setIsProcessing(false);
    };
  };

  // LSB Extraction Algorithm
  const handleDecode = () => {
    if (!extractImage || !canvasRef.current) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.src = extractImage;
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Read 32 bits header
      const headerBits: number[] = [];
      let dataIndex = 0;

      while (headerBits.length < 32 && dataIndex < data.length) {
        if ((dataIndex + 1) % 4 !== 0) {
          headerBits.push(data[dataIndex] & 1);
        }
        dataIndex++;
      }

      // Convert header to length
      let secretLen = 0;
      for (let i = 0; i < 32; i++) {
        secretLen = (secretLen << 1) | headerBits[i];
      }

      if (secretLen <= 0 || secretLen > 1000000) {
        alert("Tidak ada pesan rahasia tersembunyi yang terdeteksi pada gambar ini.");
        setIsProcessing(false);
        return;
      }

      // Read payload bytes
      const secretBits: number[] = [];
      const totalBitsNeeded = secretLen * 8;

      while (secretBits.length < totalBitsNeeded && dataIndex < data.length) {
        if ((dataIndex + 1) % 4 !== 0) {
          secretBits.push(data[dataIndex] & 1);
        }
        dataIndex++;
      }

      const secretBytes = new Uint8Array(secretLen);
      for (let i = 0; i < secretLen; i++) {
        let byteVal = 0;
        for (let b = 0; b < 8; b++) {
          byteVal = (byteVal << 1) | secretBits[i * 8 + b];
        }
        secretBytes[i] = byteVal;
      }

      const decodedText = new TextDecoder().decode(secretBytes);
      setExtractedSecret(decodedText);
      setIsProcessing(false);
    };
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          <canvas ref={canvasRef} className="hidden" />

          {/* Header */}
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-pink-600 bg-pink-50 border border-pink-200 px-3 py-1 rounded-full uppercase tracking-wider">
              STEGANOGRAFI DIGITAL LSB
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Kryphix Stego Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Sembunyikan pesan rahasia di dalam pixel foto PNG tanpa perubahan visual yang terdeteksi. Seluruh komputasi berjalan 100% lokal di browser Anda.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center border-b border-slate-200">
            <button
              onClick={() => setActiveTab("embed")}
              className={`px-8 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "embed"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              📥 Sisipkan Rahasia (Embed)
            </button>
            <button
              onClick={() => setActiveTab("extract")}
              className={`px-8 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "extract"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              📤 Ekstraksi Rahasia (Extract)
            </button>
          </div>

          {/* TAB 1: EMBED */}
          {activeTab === "embed" && (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 animate-fadeIn">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                    1. Pilih Foto Pembawa (Cover PNG)
                  </label>
                  <input
                    type="file"
                    accept="image/png"
                    onChange={handleEmbedFileChange}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
                </div>

                {embedImage && (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={embedImage} alt="Cover Preview" className="w-full h-full object-contain" />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                    2. Masukkan Pesan Rahasia yang Akan Disembunyikan
                  </label>
                  <textarea
                    rows={4}
                    value={secretText}
                    onChange={(e) => setSecretText(e.target.value)}
                    placeholder="Tuliskan kata sandi, instruksi rahasia, atau koordinat..."
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                  />
                </div>

                <button
                  onClick={handleEncode}
                  disabled={!embedImage || !secretText.trim() || isProcessing}
                  className="w-full py-4 rounded-xl font-bold text-sm bg-pink-600 hover:bg-pink-500 text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? "Menyisipkan Bit Kriptografi..." : "⚡ Sisipkan Rahasia ke Dalam Gambar"}
                </button>
              </div>

              {encodedResultUrl && (
                <div className="p-6 rounded-xl bg-pink-50 border border-pink-200 space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-pink-900 font-bold text-sm">
                    <span>✓</span> Gambar Stego Berhasil Dibuat!
                  </div>
                  <p className="text-xs text-pink-700">
                    Pesan rahasia kini tertanam di tingkat bit terendah (LSB). Anda dapat mengunduh gambar ini dan mengirimkannya ke siapa pun tanpa menimbulkan kecurigaan.
                  </p>
                  <a
                    href={encodedResultUrl}
                    download="kryphix-stego-image.png"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-pink-600 hover:bg-pink-500 text-white shadow-md"
                  >
                    ⬇️ Unduh Gambar Stego (PNG)
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXTRACT */}
          {activeTab === "extract" && (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 animate-fadeIn">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                    Pilih Gambar Stego yang Mengandung Rahasia
                  </label>
                  <input
                    type="file"
                    accept="image/png"
                    onChange={handleExtractFileChange}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  />
                </div>

                {extractImage && (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={extractImage} alt="Extract Preview" className="w-full h-full object-contain" />
                  </div>
                )}

                <button
                  onClick={handleDecode}
                  disabled={!extractImage || isProcessing}
                  className="w-full py-4 rounded-xl font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? "Menganalisa Pixel LSB..." : "🔍 Ekstraksi & Baca Pesan Tersembunyi"}
                </button>
              </div>

              {extractedSecret && (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-300 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <span>✓</span> Pesan Rahasia Berhasil Diekstraksi:
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-emerald-200 font-mono text-sm text-slate-900 whitespace-pre-wrap leading-relaxed">
                    {extractedSecret}
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

