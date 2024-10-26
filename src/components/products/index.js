import { global } from './global'

export const productCategories = []
// export const productCategories = ['Create', 'Commerce', 'Utility', 'Dev Tools']


export const products = [
  global,
].sort((a, b) => a.name.localeCompare(b.name))
