import { useMarkdownStore } from '@/store/markdownStore';

function FilenameInput() {
  const { setFilename, filename } = useMarkdownStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(e.target.value);
  };

  return (
    <input
      type="text"
      id="filename"
      name="filename"
      value={filename}
      className="text-roboto-regular w-100 border-b border-transparent text-white transition-all duration-200 focus:border-white focus:outline-none"
      onChange={handleChange}
    />
  );
}

export default FilenameInput;
