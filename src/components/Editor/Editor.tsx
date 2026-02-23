import { MarkdownEditor, MarkdownPreview } from '@/components';
import { useMarkdownStore } from '@/store/markdownStore';

function Editor() {
  const { isPreviewOpen } = useMarkdownStore();
  return (
    <div className="flex size-full">
      <MarkdownEditor />
      {!isPreviewOpen && <div className="bg-markdown-neutral-200 dark:bg-markdown-gray-600 min-h-screen w-px" />}
      <MarkdownPreview />
    </div>
  );
}

export default Editor;
