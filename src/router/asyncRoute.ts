interface RouteItem {
  path: string
  component: string
  name: string
}
const modules = import.meta.glob("@/views/**/*.vue") // Vite 动态导入方式

export const formatRoutes = (arr: any[]) =>
  arr
    .reduce(
      (acc, route) => [
        ...acc,
        ...(route.hidden ? [] : [route]),
        ...(route?.children || []),
      ],
      [] as RouteItem[]
    )
    .map(({ path, component, name }: RouteItem) => ({
      path,
      component: modules[`/src/views/${component}.vue`],
      name,
    }))