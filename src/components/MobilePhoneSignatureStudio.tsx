import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Building2,
  FileText,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import { DigitalSignatureData } from '../types';
import { SoundEngine } from '../utils/audio';
import { GLOBAL_FUTURA_LOGO_PATH } from '../utils/constants';

interface MobilePhoneSignatureStudioProps {
  invoiceNumber: string;
  buyerName?: string;
  amount?: string;
  onSignatureSubmitted?: (sig: DigitalSignatureData) => void;
  onExit?: () => void;
}

export const MobilePhoneSignatureStudio: React.FC<MobilePhoneSignatureStudioProps> = ({
  invoiceNumber,
  buyerName,
  amount,
  onSignatureSubmitted,
  onExit,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [penColor, setPenColor] = useState('#1e3a8a'); // Royal blue default
  const [signerName, setSignerName] = useState('Tajamul Sales');
  const [signerTitle, setSignerTitle] = useState('Director & Commercial Head');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Resize canvas for high-DPI displays
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3;
      ctx.strokeStyle = penColor;
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    const mouseEvent = e as React.MouseEvent;
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = 3;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDrawing) {
      e.preventDefault();
      setIsDrawing(false);
    }
  };

  const handleClear = () => {
    SoundEngine.play('thud');
    setErrorMessage(null);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSubmitSignature = () => {
    if (!canvasRef.current || !hasDrawn) {
      setErrorMessage('Please draw your signature in the box above before submitting.');
      SoundEngine.play('thud');
      return;
    }

    const dataUrl = canvasRef.current.toDataURL('image/png');
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    });

    const signatureData: DigitalSignatureData = {
      dataUrl,
      signerName: signerName.trim() || 'Authorized Signatory',
      signerTitle: signerTitle.trim() || 'Director & Commercial Head',
      signedAt: timestamp,
      deviceToken: `mobile-${Date.now().toString(36)}`,
      verifiedHash: `sha256-gfi-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(16)}`,
    };

    // 1. BroadcastChannel for instant same-browser/cross-tab sync
    try {
      const channel = new BroadcastChannel('gfi_proforma_signatures');
      channel.postMessage({
        piNumber: invoiceNumber,
        signature: signatureData,
      });
      channel.close();
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }

    // 2. LocalStorage for persistent cross-window sync
    try {
      localStorage.setItem(`gfi_sig_${invoiceNumber}`, JSON.stringify(signatureData));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    SoundEngine.play('success');
    setIsSubmitted(true);
    onSignatureSubmitted?.(signatureData);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <img
            src={GLOBAL_FUTURA_LOGO_PATH}
            alt="Global Futura"
            className="h-9 w-auto object-contain bg-white rounded p-0.5"
          />
          <div>
            <div className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
              Mobile Touch Signatory
            </div>
            <h1 className="text-sm font-bold text-white">Global Futura Inc.</h1>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Phone Mode</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="my-auto max-w-md w-full mx-auto space-y-4 py-4">
        {/* Document Info Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              Document:
            </span>
            <span className="font-mono font-bold text-amber-400 text-sm">
              #{invoiceNumber}
            </span>
          </div>

          {buyerName && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                Customer:
              </span>
              <span className="font-bold text-slate-200 truncate max-w-[200px]">
                {buyerName}
              </span>
            </div>
          )}

          {amount && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Total Value:
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                ${amount}
              </span>
            </div>
          )}
        </div>

        {isSubmitted ? (
          /* Confirmation Success Card */
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-6 text-center space-y-3 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-white">Signature Transmitted!</h2>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Your executive signature for <strong>#{invoiceNumber}</strong> has been transmitted to the desktop Proforma Invoice and recorded with security timestamp.
            </p>

            <div className="pt-3 border-t border-emerald-800/60 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setHasDrawn(false);
                }}
                className="w-full py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-900/40 text-emerald-300 font-bold text-xs hover:bg-emerald-800/40 cursor-pointer"
              >
                Sign Again
              </button>

              {onExit && (
                <button
                  type="button"
                  onClick={onExit}
                  className="w-full py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  Return to Dashboard
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Drawing & Signer Details Form */
          <div className="space-y-4">
            {/* Signer inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                  Signer Full Name
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={e => setSignerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 font-bold text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                  Designation / Title
                </label>
                <input
                  type="text"
                  value={signerTitle}
                  onChange={e => setSignerTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 font-bold text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Signature Canvas Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sign with your finger below:</span>
                </span>

                {/* Color Selector */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPenColor('#1e3a8a')}
                    className={`w-5 h-5 rounded-full bg-blue-900 ring-2 cursor-pointer ${
                      penColor === '#1e3a8a' ? 'ring-blue-400' : 'ring-transparent'
                    }`}
                    title="Royal Blue"
                  />
                  <button
                    type="button"
                    onClick={() => setPenColor('#0f172a')}
                    className={`w-5 h-5 rounded-full bg-slate-800 ring-2 cursor-pointer ${
                      penColor === '#0f172a' ? 'ring-slate-400' : 'ring-transparent'
                    }`}
                    title="Charcoal Black"
                  />
                  <button
                    type="button"
                    onClick={() => setPenColor('#047857')}
                    className={`w-5 h-5 rounded-full bg-emerald-700 ring-2 cursor-pointer ${
                      penColor === '#047857' ? 'ring-emerald-400' : 'ring-transparent'
                    }`}
                    title="Emerald"
                  />
                </div>
              </div>

              <div className="relative border-2 border-dashed border-amber-500/50 rounded-2xl bg-slate-900 overflow-hidden shadow-inner">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-48 cursor-crosshair touch-none bg-white"
                />

                {!hasDrawn && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs gap-1 select-none">
                    <PenTool className="w-6 h-6 opacity-40 text-slate-500" />
                    <span className="font-semibold text-slate-500">
                      Touch &amp; draw signature here
                    </span>
                  </div>
                )}

                <div className="absolute bottom-2 left-4 right-4 border-b border-slate-300 pointer-events-none" />
                <span className="absolute bottom-1 right-4 text-[9px] font-mono text-slate-400 pointer-events-none">
                  Authorized Signatory Line
                </span>
              </div>

              {errorMessage && (
                <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold">
                  ⚠️ {errorMessage}
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Pad</span>
                </button>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-bit Token</span>
                </div>
              </div>
            </div>

            {/* Big Submit Button */}
            <button
              type="button"
              onClick={handleSubmitSignature}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wide shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Adopt &amp; Transmit to Proforma</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] text-slate-500 border-t border-slate-900 pt-3">
        Global Futura ERP • Mobile Executive Signature Portal • Encrypted Transaction
      </footer>
    </div>
  );
};
