import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FileText, Image, Paperclip, UploadCloud, X } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

export const AttachmentUploader = ({ selectedFile, onFileSelect, onFileRemove, maxSizeBytes = 10485760 }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validateAndPass = (file) => {
    setErrorMsg('');
    if (!file) return;

    if (file.size > maxSizeBytes) {
      setErrorMsg(`File size exceeds limit (${formatFileSize(maxSizeBytes)} max)`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPass(e.target.files[0]);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        className="d-none"
        accept="image/jpeg,image/png,application/pdf"
        onChange={handleChange}
      />

      {!selectedFile ? (
        <div
          className={`p-4 border-2 border-dashed rounded-4 text-center cursor-pointer transition-all ${
            dragActive ? 'border-primary bg-primary bg-opacity-10' : 'border-slate-300 bg-light hover-bg-slate-100'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="d-inline-flex align-items-center justify-content-center p-3 bg-white rounded-circle shadow-2xs mb-2">
            <UploadCloud size={32} className="text-primary" />
          </div>
          <h6 className="fw-bold text-slate-800 mb-1">Click to upload or drag & drop file</h6>
          <p className="text-muted text-xs mb-0">PNG, JPG, JPEG, or PDF documents (Max 10 MB)</p>
          {errorMsg && <p className="text-danger text-xs fw-semibold mt-2 mb-0">{errorMsg}</p>}
        </div>
      ) : (
        <div className="p-3 bg-white border border-slate-200 rounded-3 d-flex align-items-center justify-content-between shadow-2xs">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
              {selectedFile.type.startsWith('image/') ? <Image size={24} /> : <FileText size={24} />}
            </div>
            <div>
              <h6 className="fw-bold text-slate-900 mb-0 text-truncate" style={{ maxWidth: 260 }}>
                {selectedFile.name}
              </h6>
              <span className="text-muted text-xs font-monospace">{formatFileSize(selectedFile.size)}</span>
            </div>
          </div>
          <Button variant="light" size="sm" onClick={onFileRemove} className="text-danger border-0 p-1.5 rounded-circle">
            <X size={20} />
          </Button>
        </div>
      )}
    </div>
  );
};
