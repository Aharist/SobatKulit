'use client';

import { useState, useRef, useCallback } from 'react';

export default function ScannerCamera({ onCapture }) {
  const [mode, setMode] = useState('select'); // select | camera | preview
  const [stream, setStream] = useState(null);
  const [preview, setPreview] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      setStream(mediaStream);
      setMode('camera');
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      alert('Tidak dapat mengakses kamera. Pastikan Anda memberikan izin kamera dan menggunakan HTTPS.');
    }
  }, []);

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const base64 = dataUrl.split(',')[1];
    stopCamera();
    setPreview(dataUrl);
    setMode('preview');
    onCapture({ base64, mimeType: 'image/jpeg', preview: dataUrl });
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const base64 = dataUrl.split(',')[1];
      setPreview(dataUrl);
      setMode('preview');
      onCapture({ base64, mimeType: file.type, preview: dataUrl });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      {mode === 'select' && (
        <div className="scanner-box" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="scanner-corner scanner-corner--tl" />
          <div className="scanner-corner scanner-corner--tr" />
          <div className="scanner-corner scanner-corner--bl" />
          <div className="scanner-corner scanner-corner--br" />
          <div className="scanner-line" />
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '24px',
          }}>
            <i className="las la-camera" style={{ fontSize: '3rem', color: 'rgba(var(--accent-cyan-rgb), 0.5)' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              Ambil foto langsung atau unggah gambar kondisi kulit Anda
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={startCamera} id="btn-open-camera">
                <i className="las la-camera" />
                BUKA KAMERA
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => fileInputRef.current?.click()}
                id="btn-upload-file"
              >
                <i className="las la-upload" />
                UNGGAH FOTO
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            aria-label="Upload foto kulit"
          />
        </div>
      )}

      {mode === 'camera' && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="scanner-box" style={{ position: 'relative' }}>
            <div className="scanner-corner scanner-corner--tl" />
            <div className="scanner-corner scanner-corner--tr" />
            <div className="scanner-corner scanner-corner--bl" />
            <div className="scanner-corner scanner-corner--br" />
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                inset: 0,
                borderRadius: 'var(--radius-lg)',
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '16px',
            alignItems: 'center',
          }}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => { stopCamera(); setMode('select'); }}
              aria-label="Batal"
              title="Batal"
            >
              <i className="las la-times" />
            </button>
            <button
              className="btn btn-primary btn-icon btn-icon-lg"
              onClick={capturePhoto}
              id="btn-capture"
              aria-label="Ambil foto"
              title="Ambil Foto"
            >
              <i className="las la-camera" />
            </button>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}
    </div>
  );
}
