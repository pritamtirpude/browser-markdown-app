import { MarkdownEditor, MarkdownPreview } from '@/components';
function Editor() {
  return (
    <div className="flex size-full">
      <MarkdownEditor />
      <div className="bg-markdown-neutral-200 min-h-screen w-px" />
      <MarkdownPreview />
    </div>
  );
}

export default Editor;
