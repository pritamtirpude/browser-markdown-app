import { MarkdownEditor, MarkdownPreview } from '@/components';
import { useMarkdownStore } from '@/store/markdownStore';

function Editor() {
  const { isPreviewOpen } = useMarkdownStore();
  return (
    <div className="flex min-h-screen">
      <MarkdownEditor />
      {!isPreviewOpen && (
        <div className="bg-markdown-neutral-200 dark:bg-markdown-gray-600 h-screen w-px" />
      )}
      <MarkdownPreview />
    </div>
  );
}

export default Editor;
