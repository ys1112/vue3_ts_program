export const getCachedRoutes = () => {
  return localStorage.getItem('dynamic_routes') as string || ''
}

export const setCachedRoutes = (routes:string) => {
  localStorage.setItem('dynamic_routes', routes)
}