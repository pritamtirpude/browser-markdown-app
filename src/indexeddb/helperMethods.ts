import { v4 as uuid } from 'uuid';
import { db } from './db';

export const addOrUpdateDocument = async (
  title: string,
  content: string,
  id?: string,
  setDocumentId?: (id: string) => void,
) => {
  try {
    const docId = id || uuid();
    // put() will update if exists, otherwise add
    await db
      .table('documents')
      .put({ id: docId, title, content, createdAt: new Date().toISOString() });
    if (setDocumentId) {
      setDocumentId(docId);
    }
  } catch (error) {
    console.error('Error saving document:', error);
  }
};
