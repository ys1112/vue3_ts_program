interface MenuItem {
  path?: string;
  name?: string;
  meta: {
    title: string;
    icon?: string;
  };
  component?: string;
  hidden: number;
  children?: MenuItem[];
}

interface FlatMenuItem {
  path?: string;
  component?: string;
  name?: string;
}
const modules = import.meta.glob("@/views/**/*.vue") // Vite 动态导入方式

export const formatRoutes = (menu: MenuItem[]): FlatMenuItem[]=> {
  const result: FlatMenuItem[] = [];

  const traverse = (items: MenuItem[]) => {
    for (const item of items) {
      if (item.hidden === 0) {
        result.push({
          path: item.path,
          component: modules[`/src/views/${item.component}.vue`] as any,
          name: item.name
        });
      }
      
      if (item.children?.length) {
        traverse(item.children);
      }
    }
  };

  traverse(menu);
  return result;
}