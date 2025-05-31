import { ThreadItem } from "app/services/agent";


export function currentThread(td: ThreadItem[]) {
  const nodes = new Set<string>();
  return td.filter(i => {
    const exist = nodes.has(i.name)
    if (!exist) {
      nodes.add(i.name);
    }
    return !exist;
  })
}
