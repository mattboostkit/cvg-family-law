// Document Upload API Route
// Secure file upload with encryption and validation

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Document, DocumentCategory, DocumentStatus, DocumentType } from '@/types/client-portal';
import { generateEncryptionKey, encryptFile, generateChecksum } from '@/lib/encryption';

// Mock storage for uploaded files
const uploadedFiles = new Map<string, { buffer: Buffer; metadata: Partial<Document> }>();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as DocumentCategory;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'File type not allowed' } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 50MB limit' } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Generate encryption key
    const encryptionKey = generateEncryptionKey();

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate checksum for integrity verification
    const checksum = generateChecksum(buffer);

    // Encrypt file
    const encryptedFile = encryptFile(buffer, encryptionKey);

    // Create document metadata
    const document: Document = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      caseId: 'current-case-id', // In production, get from authenticated user
      name: file.name,
      originalName: file.name,
      type: getDocumentTypeFromMime(file.type),
      category: category || DocumentCategory.OTHER,
      size: file.size,
      mimeType: file.type,
      uploadedBy: 'current-user-id', // In production, get from authenticated user
      uploadedAt: new Date(),
      version: 1,
      isLatestVersion: true,
      encryptionKey,
      checksum,
      status: DocumentStatus.PROCESSING,
      accessLog: []
    };

    // Store encrypted file (mock implementation)
    uploadedFiles.set(document.id, {
      buffer: encryptedFile.encrypted,
      metadata: document
    });

    // Simulate processing time
    setTimeout(() => {
      const stored = uploadedFiles.get(document.id);
      if (stored) {
        stored.metadata.status = DocumentStatus.READY;
        uploadedFiles.set(document.id, stored);
      }
    }, 2000);

    return NextResponse.json(
      {
        success: true,
        data: { document }
      } as ApiResponse<{ document: Document }>,
      { status: 201 }
    );

  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload document' } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

/**
 * Determines document type from MIME type
 */
function getDocumentTypeFromMime(mimeType: string): Document['type'] {
  if (mimeType.startsWith('image/')) {
    return DocumentType.IMAGE;
  }
  if (mimeType.includes('pdf')) {
    return DocumentType.PDF;
  }
  if (mimeType.includes('word') || mimeType.includes('document')) {
    return DocumentType.WORD;
  }
  if (mimeType.startsWith('video/')) {
    return DocumentType.VIDEO;
  }
  if (mimeType.startsWith('audio/')) {
    return DocumentType.AUDIO;
  }
  return DocumentType.OTHER;
}