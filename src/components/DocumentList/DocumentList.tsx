import { DocumentCard } from '@/components';
import { db } from '@/indexeddb/db';
import { useLiveQuery } from 'dexie-react-hooks';

function DocumentList() {
  const documents = useLiveQuery(() =>
    db.table('documents').orderBy('createdAt').reverse().toArray(),
  );

  return (
    <div className="flex w-full flex-col gap-6 overflow-y-auto">
      {documents?.map((doc) => (
        <DocumentCard key={doc.id} docData={doc} />
      ))}
    </div>
  );
}

export default DocumentList;
