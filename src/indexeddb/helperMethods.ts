import { v4 as uuid } from 'uuid';
import { db } from './db';

export const addOrUpdateDocument = async (title: string, content: string, id?: string) => {
  try {
    const docId = id || uuid();
    // put() will update if exists, otherwise add
    await db.table('documents').put({ id: docId, title, content });
  } catch (error) {
    console.error('Error saving document:', error);
  }
};
