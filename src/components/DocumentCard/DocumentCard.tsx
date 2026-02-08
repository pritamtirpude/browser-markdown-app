import type { MarkdownDocument } from '@/indexeddb/db';
import { useMarkdownStore } from '@/store/markdownStore';
import { cn } from '@/util';
import { format } from 'date-fns';

type DocumentCardProps = {
  docData: MarkdownDocument;
};

function DocumentCard({ docData }: DocumentCardProps) {
  const { setDocumentId, documentId } = useMarkdownStore((state) => state);

  return (
    <div
      onClick={() => setDocumentId(docData.id)}
      className="flex cursor-pointer items-center gap-4"
    >
      <div>
        <img src="/assets/icon-document.svg" alt="icon document" loading="lazy" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-roboto-lightbody text-markdown-zinc-500">
          {format(docData?.createdAt, 'dd MMMM yyyy')}
        </span>
        <span
          className={cn(
            'text-roboto-regular hover:text-markdown-orange-500 text-white transition-all duration-200',
            docData.id === documentId && 'text-markdown-orange-500',
          )}
        >
          {docData.title}
        </span>
      </div>
    </div>
  );
}

export default DocumentCard;
