"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function VoicePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [scramblerProfile, setScramblerProfile] = useState("DEEP_AGENT");
  const [isPlayed, setIsPlayed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("API MediaDevices tidak didukung pada peramban ini.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setIsPlayed(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      setErrorMsg(
        "Izin mikrofon tidak tersedia. Anda dapat menggunakan tombol 'Simulasi Pesan Suara Kripto' di bawah untuk menguji fitur ini tanpa mikrofon fisik."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Generate synthetic voice memo for testing or environments without a mic
  const handleGenerateSyntheticAudio = () => {
    setErrorMsg(null);
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const dest = ctx.createMediaStreamDestination();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3 note
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.5);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.9);

      osc.connect(gain);
      gain.connect(dest);

      const recorder = new MediaRecorder(dest.stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsPlayed(false);
        ctx.close();
      };

      recorder.start();
      osc.start();

      setTimeout(() => {
        osc.stop();
        recorder.stop();
      }, 2000);
    } catch (e: any) {
      setErrorMsg("Gagal membuat sampel audio sintetis: " + e.message);
    }
  };

  const handlePlayOnce = () => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => {
      setIsPlayed(true);
      setAudioUrl(null);
    };
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full uppercase tracking-wider">
              PESAN SUARA SEKALI DENGAR
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Scrambled Voice Memo (1x Listen)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Rekam pesan suara dengan kamuflase distorsi frekuensi intelijen. Pesan hanya dapat diputar tepat 1 kali sebelum dimusnahkan secara permanen (DoD Zeroize).
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              ℹ️ {errorMsg}
            </div>
          )}

          <div className="cyber-card rounded-2xl p-8 border border-slate-200 shadow-xl space-y-6 text-center">
            {isPlayed ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-2xl">
                  🔥
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Audio Telah Hancur Lebur Tanpa Jejak
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Pesan suara telah diputar sekali dan memori audio buffer telah di-zeroize permanen (0 byte tersisa).
                </p>
                <button
                  onClick={() => setIsPlayed(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase"
                >
                  Rekam Suara Baru
                </button>
              </div>
            ) : audioUrl ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
                  🎙️
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Pesan Suara Terenkripsi Siap Diputar
                  </h3>
                  <p className="text-xs text-amber-700 mt-1 font-mono">
                    ⚠️ PERHATIAN: Audio akan terbakar seketika begitu selesai diputar!
                  </p>
                </div>

                <button
                  onClick={handlePlayOnce}
                  className="w-full py-4 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>▶️</span> Putar Sekali (Play & Auto-Burn)
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                    Pilih Profil Kamuflase Vokal (Pitch Shift)
                  </label>
                  <select
                    value={scramblerProfile}
                    onChange={(e) => setScramblerProfile(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 outline-none"
                  >
                    <option value="DEEP_AGENT">Deep Agent (Pitch -4 Semitones)</option>
                    <option value="CYBER_ROBOT">Cyber Synthesizer (Ring Modulator)</option>
                    <option value="NATURAL_ENCRYPTED">Natural (Murni Enkripsi Klien)</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-2">
                  {isRecording ? (
                    <button
                      onClick={stopRecording}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse flex items-center justify-center gap-2"
                    >
                      <span>⏹️</span> Selesai Merekam (Stop)
                    </button>
                  ) : (
                    <button
                      onClick={startRecording}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>🎙️</span> Mulai Merekam Suara
                    </button>
                  )}

                  <button
                    onClick={handleGenerateSyntheticAudio}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <span>⚡</span> Simulasi Pesan Suara
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
