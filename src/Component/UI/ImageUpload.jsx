import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { API_ORIGIN } from '../../api/index.js';

const ImageUpload = ({
  value,
  onChange,
  label = "Course Image",
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp']
  },
  targetWidth = 800,
  targetHeight = 600,
  quality = 80,
  className = ""
}) => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [pendingFileName, setPendingFileName] = useState('image.jpg');
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const imgRef = useRef(null);
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 0, y: 0 });

  const resolveImageUrl = useCallback((image) => {
    if (!image) return null;
    if (typeof image !== 'string') return null;
    if (image.startsWith('blob:') || image.startsWith('data:')) return image;
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    if (image.startsWith('/')) return `${API_ORIGIN}${image}`;
    return `${API_ORIGIN}/${image}`;
  }, []);

  useEffect(() => {
    if (value && typeof value === 'string') {
      setPreview(resolveImageUrl(value));
      return;
    }
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [value, resolveImageUrl]);

  const cropBox = useMemo(() => {
    // A fixed crop box matching target aspect ratio
    const aspect = targetWidth / targetHeight;
    const maxW = 520;
    const w = maxW;
    const h = Math.round(w / aspect);
    return { w, h };
  }, [targetWidth, targetHeight]);

  const clampOffset = useCallback((imgEl, nextOffset, nextZoom) => {
    if (!imgEl) return { x: 0, y: 0 };
    const naturalW = imgEl.naturalWidth;
    const naturalH = imgEl.naturalHeight;

    // Compute displayed image size inside crop box with "cover" behavior
    const scaleCover = Math.max(cropBox.w / naturalW, cropBox.h / naturalH);
    const baseW = naturalW * scaleCover;
    const baseH = naturalH * scaleCover;
    const scaledW = baseW * nextZoom;
    const scaledH = baseH * nextZoom;

    const maxX = Math.max(0, (scaledW - cropBox.w) / 2);
    const maxY = Math.max(0, (scaledH - cropBox.h) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, nextOffset.x)),
      y: Math.min(maxY, Math.max(-maxY, nextOffset.y)),
    };
  }, [cropBox.h, cropBox.w]);

  const resetCropState = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const openCropper = useCallback((file) => {
    setPendingFileName(file?.name || 'image.jpg');
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(String(reader.result));
      resetCropState();
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
  }, [resetCropState]);

  const exportCroppedFile = useCallback(async () => {
    const imgEl = imgRef.current;
    if (!imgEl) return;

    const naturalW = imgEl.naturalWidth;
    const naturalH = imgEl.naturalHeight;

    const scaleCover = Math.max(cropBox.w / naturalW, cropBox.h / naturalH);
    const baseW = naturalW * scaleCover;
    const baseH = naturalH * scaleCover;
    const scaledW = baseW * zoom;
    const scaledH = baseH * zoom;

    // Convert current offset (px in crop box coords) into source crop rect
    const dx = offset.x;
    const dy = offset.y;

    const leftInScaled = (scaledW - cropBox.w) / 2 - dx;
    const topInScaled = (scaledH - cropBox.h) / 2 - dy;

    const sx = leftInScaled / (scaleCover * zoom);
    const sy = topInScaled / (scaleCover * zoom);
    const sWidth = cropBox.w / (scaleCover * zoom);
    const sHeight = cropBox.h / (scaleCover * zoom);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      imgEl,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );

    const blob = await new Promise((resolve) => {
      canvas.toBlob(
        (b) => resolve(b),
        'image/jpeg',
        Math.min(1, Math.max(0.1, quality / 100))
      );
    });

    if (!blob) return;

    const out = new File([blob], pendingFileName.replace(/\.[^.]+$/, '') + '.jpg', {
      type: 'image/jpeg'
    });

    const previewUrl = URL.createObjectURL(out);
    setPreview(previewUrl);
    onChange(out);
    setIsCropOpen(false);
  }, [cropBox.h, cropBox.w, offset.x, offset.y, onChange, pendingFileName, quality, targetHeight, targetWidth, zoom]);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setError('');

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some(err => err.code === 'file-too-large')) {
        setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      if (rejection.errors.some(err => err.code === 'file-invalid-type')) {
        setError('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      setError('Invalid file');
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);

    try {
      openCropper(file);
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [maxSize, openCropper]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxSize,
    multiple: false
  });

  const removeImage = () => {
    setPreview(null);
    setError('');
    onChange(null);
  };

  const onCropMouseDown = (e) => {
    draggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    offsetStartRef.current = { ...offset };
  };

  const onCropMouseMove = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const next = { x: offsetStartRef.current.x + dx, y: offsetStartRef.current.y + dy };
    setOffset(clampOffset(imgRef.current, next, zoom));
  };

  const onCropMouseUp = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    if (!isCropOpen) return;
    const onUp = () => onCropMouseUp();
    window.addEventListener('mouseup', onUp);
    return () => window.removeEventListener('mouseup', onUp);
  }, [isCropOpen]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Course preview"
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors flex flex-col items-center justify-center ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                <p className="text-sm text-gray-500">Processing image...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {isDragActive ? (
                  <Upload className="text-blue-500 mb-2" size={32} />
                ) : (
                  <ImageIcon className="text-gray-400 mb-2" size={32} />
                )}
                <p className="text-sm text-gray-600 text-center">
                  {isDragActive
                    ? 'Drop the image here'
                    : 'Drag & drop an image here, or click to select'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, GIF, WebP up to {maxSize / (1024 * 1024)}MB
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {isCropOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Adjust image</h3>
              <button
                type="button"
                onClick={() => {
                  setIsCropOpen(false);
                  setCropSrc(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex justify-center">
              <div
                className="relative overflow-hidden bg-gray-100 rounded-lg border"
                style={{ width: cropBox.w, height: cropBox.h, cursor: 'grab' }}
                onMouseDown={onCropMouseDown}
                onMouseMove={onCropMouseMove}
              >
                {cropSrc && (
                  <img
                    ref={imgRef}
                    src={cropSrc}
                    alt="Crop source"
                    draggable={false}
                    onLoad={() => {
                      setOffset(clampOffset(imgRef.current, { x: 0, y: 0 }, zoom));
                    }}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
                      transformOrigin: 'center center',
                      userSelect: 'none'
                    }}
                  />
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => {
                  const nextZoom = Number(e.target.value);
                  setZoom(nextZoom);
                  setOffset(clampOffset(imgRef.current, offset, nextZoom));
                }}
                className="w-full"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setIsCropOpen(false);
                  setCropSrc(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={exportCroppedFile}
              >
                Use Image
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
