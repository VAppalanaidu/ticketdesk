import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Download, FileText, Image, Paperclip, Trash2 } from 'lucide-react';
import { attachmentService } from '../../services/attachmentService';
import { formatDate, formatFileSize } from '../../utils/formatters';
import toast from 'react-hot-toast';

export const AttachmentCard = ({ attachment, onDelete, canDelete = false }) => {
  if (!attachment) return null;

  const handleDownload = async () => {
    try {
      await attachmentService.downloadAttachment(attachment.id, attachment.fileName);
      toast.success('File download started');
    } catch (err) {
      toast.error('Failed to download attachment');
    }
  };

  const isImage = attachment.contentType?.startsWith('image/');

  return (
    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
            {isImage ? <Image size={24} /> : <FileText size={24} />}
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h6 className="fw-bold text-slate-900 mb-0">{attachment.fileName}</h6>
              <span className="badge bg-light text-muted border font-monospace text-2xs">
                {formatFileSize(attachment.size)}
              </span>
            </div>
            <p className="text-muted text-2xs mb-0 font-monospace">
              Uploaded by {attachment.uploadedBy?.fullName || 'User'} on {formatDate(attachment.uploadedAt)}
            </p>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            className="rounded-3 px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 shadow-2xs"
          >
            <Download size={15} /> Download
          </Button>

          {canDelete && onDelete && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={onDelete}
              className="rounded-3 p-1.5 shadow-2xs"
              title="Delete Attachment"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
