import { parseAsString, useQueryStates } from 'nuqs';

export function useMarkdownParams() {
  const [params, setParams] = useQueryStates({
    id: parseAsString,
  });

  return { params, setParams };
}
