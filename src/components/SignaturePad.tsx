import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Type, Check, Eraser } from 'lucide-react';

interface SignaturePadProps {
  signatureData: string; // Base64 dataURL or empty
  typedName: string;
  onSignatureChange: (dataUrl: string) => void;
  className?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  signatureData,
  typedName,
  onSignatureChange,
  className = '',
}) => {
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI canvas setup
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e3a8a'; // dark navy ink
    ctx.lineWidth = 2.5;

    // If existing signatureData, load it
    if (signatureData && signatureData.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = signatureData;
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSignatureChange(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSignatureChange('');
  };

  const generateSignatureFromType = () => {
    if (!typedName) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'italic 28px "Caveat", "Brush Script MT", "Segoe Script", cursive';
    ctx.fillStyle = '#1e3a8a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName, rect.width / 2, rect.height / 2);
    setHasDrawn(true);
    onSignatureChange(canvas.toDataURL('image/png'));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <PenTool className="w-4 h-4 text-blue-600" />
          <span>Podpis pracownika (cyfrowy lub odręczny)</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
              mode === 'draw'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Rysuj
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('type');
              generateSignatureFromType();
            }}
            className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
              mode === 'type'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Styl pisma
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            className="p-1 text-xs text-rose-600 hover:bg-rose-50 rounded"
            title="Wyczyść podpis"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-28 cursor-crosshair touch-none"
        />

        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400">
            {mode === 'draw'
              ? 'Złóż podpis tutaj za pomocą myszy lub palca'
              : 'Kliknij "Styl pisma" aby wygenerować na podstawie imienia i nazwiska'}
          </div>
        )}
      </div>
    </div>
  );
};
