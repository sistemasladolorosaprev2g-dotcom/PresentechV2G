export const institutionConfig = {
  name:
    import.meta.env.VITE_INSTITUTION_NAME ||
    'Unidad Educativa Fe y Alegría La Dolorosa',
  city: import.meta.env.VITE_INSTITUTION_CITY || '',
  logoUrl:
    import.meta.env.VITE_INSTITUTION_LOGO_URL ||
    '/logo_fe_y_alegria.png',
}
