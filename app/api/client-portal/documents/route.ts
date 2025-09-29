// Client Portal Documents API Route
// Secure document listing with filtering and pagination

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Document, DocumentCategory, DocumentStatus, DocumentType } from '@/types/client-portal';

// Mock documents storage - In production, use a database
const documents = new Map<string, Document>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const category = searchParams.get('category') as DocumentCategory;
    const status = searchParams.get('status') as DocumentStatus;
    const search = searchParams.get('search');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '20'), 100);

    // Mock documents data - In production, fetch from database
    const mockDocuments: Document[] = [
      {
        id: '1',
        caseId: 'case-1',
        name: 'Court Order - Final.pdf',
        originalName: 'court-order-final.pdf',
        type: DocumentType.PDF,
        category: DocumentCategory.COURT_DOCUMENTS,
        size: 2048576, // 2MB
        mimeType: 'application/pdf',
        uploadedBy: 'user-1',
        uploadedAt: new Date('2024-01-15'),
        version: 1,
        isLatestVersion: true,
        encryptionKey: 'encrypted-key-1',
        checksum: 'sha256-hash-1',
        status: DocumentStatus.READY,
        accessLog: []
      },
      {
        id: '2',
        caseId: 'case-1',
        name: 'Medical Report - Dr Smith.pdf',
        originalName: 'medical-report-smith.pdf',
        type: DocumentType.PDF,
        category: DocumentCategory.MEDICAL_RECORDS,
        size: 1536000, // 1.5MB
        mimeType: 'application/pdf',
        uploadedBy: 'user-1',
        uploadedAt: new Date('2024-01-20'),
        version: 1,
        isLatestVersion: true,
        encryptionKey: 'encrypted-key-2',
        checksum: 'sha256-hash-2',
        status: DocumentStatus.READY,
        accessLog: []
      }
    ];

    // Apply filters
    let filteredDocuments = mockDocuments;

    if (category) {
      filteredDocuments = filteredDocuments.filter(doc => doc.category === category);
    }

    if (status) {
      filteredDocuments = filteredDocuments.filter(doc => doc.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredDocuments = filteredDocuments.filter(doc =>
        doc.name.toLowerCase().includes(searchLower) ||
        doc.originalName.toLowerCase().includes(searchLower)
      );
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredDocuments = filteredDocuments.filter(doc => doc.uploadedAt >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      filteredDocuments = filteredDocuments.filter(doc => doc.uploadedAt <= toDate);
    }

    // Apply pagination
    const totalCount = filteredDocuments.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

    return NextResponse.json(
      {
        success: true,
        data: {
          documents: paginatedDocuments,
          totalCount,
          currentPage: page,
          pageSize,
          totalPages
        }
      } as ApiResponse<{
        documents: Document[];
        totalCount: number;
        currentPage: number;
        pageSize: number;
        totalPages: number;
      }>,
      { status: 200 }
    );

  } catch (error) {
    console.error('Documents API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse<never>,
      { status: 500 }
    );
  }
}