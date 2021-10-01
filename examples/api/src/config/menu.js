import { icons } from '$lib/icons'

export const menu = [
  { icon: icons.Home, label: 'Explore', target: '/', current: true },
  { icon: icons.Categories, label: 'Categories', target: 'categories' },
  { icon: icons.Tag, label: 'Reading', target: 'reading' },
  { icon: icons.BookMark, label: 'Saved', target: 'saved' },
  { icon: icons.Logout, label: 'Logout', target: 'logout' },
]
