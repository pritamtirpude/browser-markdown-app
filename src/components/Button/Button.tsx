import { cn } from '@/util';

type ButtonProps = {
  title: string;
  icon?: string;
  handleEvent?: () => void;
};
function Button({ title, icon, handleEvent }: ButtonProps) {
  return (
    <button
      className={cn(
        'bg-markdown-orange-500 group text-roboto-regular relative z-50 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-sm p-4 text-white md:px-4 md:py-2.5',
        icon ? 'gap-2' : '',
      )}
      onClick={handleEvent}
    >
      {icon && <img src={icon} alt={`${title} icon`} />}
      <span className="hidden md:block">{title}</span>

      <div className="group-hover:bg-markdown-orange-300 absolute inset-0 top-full -z-30 size-full transition-all duration-200 ease-in-out group-hover:top-0" />
    </button>
  );
}

export default Button;
