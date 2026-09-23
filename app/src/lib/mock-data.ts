export type MenuBadge = 'Vegan' | 'Gluten-Free' | 'Spicy'

export type MenuCategory = {
  id: string
  name: string
  accent: string
}

export type MenuItem = {
  id: string
  title: string
  description: string
  price: number
  categoryId: string
  imageUrl: string
  badges: MenuBadge[]
  outOfStock: boolean
  allergyWarning?: string
}

export type RestaurantProfile = {
  id: string
  name: string
  slug: string
  logoUrl: string
  coverImage: string
  active: boolean
  isOpen: boolean
}

export const restaurant: RestaurantProfile = {
  id: 'sabor-cia',
  name: 'Sabor & Cia',
  slug: 'sabor-cia',
  logoUrl:
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=200&q=80',
  coverImage:
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
  active: true,
  isOpen: true,
}

export const menuCategories: MenuCategory[] = [
  { id: 'starters', name: 'Starters', accent: '#fb923c' },
  { id: 'mains', name: 'Main Course', accent: '#f59e0b' },
  { id: 'drinks', name: 'Drinks', accent: '#10b981' },
  { id: 'desserts', name: 'Desserts', accent: '#a78bfa' },
]

export const menuItems: MenuItem[] = [
  {
    id: 'item-1',
    title: 'Citrus Ceviche Bowl',
    description: 'Fresh lime-cured fish, avocado, mango, and herb salad with crisp chili crunch.',
    price: 15.9,
    categoryId: 'starters',
    imageUrl:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
    badges: ['Vegan', 'Spicy'],
    outOfStock: false,
    allergyWarning: 'Contains shellfish and sesame.',
  },
  {
    id: 'item-2',
    title: 'Charred Corn Tostadas',
    description: 'Three crisp tostadas layered with smoky corn crema and pickled onion.',
    price: 12.5,
    categoryId: 'starters',
    imageUrl:
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
    badges: ['Vegan'],
    outOfStock: false,
    allergyWarning: 'Contains corn and sesame.',
  },
  {
    id: 'item-3',
    title: 'Fire-Roasted Chicken',
    description: 'Juicy chicken thigh with saffron rice, roasted vegetables, and citrus herb glaze.',
    price: 23.75,
    categoryId: 'mains',
    imageUrl:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
    badges: ['Spicy'],
    outOfStock: false,
    allergyWarning: 'Contains gluten and dairy.',
  },
  {
    id: 'item-4',
    title: 'Garden Protein Bowl',
    description: 'Quinoa, roasted cauliflower, tahini dressing, charred greens, and avocado.',
    price: 18.5,
    categoryId: 'mains',
    imageUrl:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80',
    badges: ['Vegan', 'Gluten-Free'],
    outOfStock: false,
    allergyWarning: 'Contains sesame and tahini.',
  },
  {
    id: 'item-5',
    title: 'Coconut Lime Spritz',
    description: 'House-made sparkling cooler with basil, fresh lime, and a hint of coconut.',
    price: 7.5,
    categoryId: 'drinks',
    imageUrl:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80',
    badges: ['Vegan'],
    outOfStock: false,
    allergyWarning: 'Contains coconut.',
  },
  {
    id: 'item-6',
    title: 'Basil Hibiscus Iced Tea',
    description: 'A floral house tea with natural sweetness and fresh basil finish.',
    price: 5.8,
    categoryId: 'drinks',
    imageUrl:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
    badges: ['Vegan'],
    outOfStock: true,
    allergyWarning: 'No major allergens.',
  },
  {
    id: 'item-7',
    title: 'Brown Butter Tart',
    description: 'Velvety caramel custard with toasted hazelnuts and a flaky pastry shell.',
    price: 9.4,
    categoryId: 'desserts',
    imageUrl:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
    badges: ['Gluten-Free'],
    outOfStock: false,
    allergyWarning: 'Contains nuts and dairy.',
  },
  {
    id: 'item-8',
    title: 'Cocoa Lava Cake',
    description: 'Warm dark chocolate center, sea salt dust, and vanilla bean cream.',
    price: 11.15,
    categoryId: 'desserts',
    imageUrl:
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80',
    badges: ['Spicy'],
    outOfStock: false,
    allergyWarning: 'Contains gluten and dairy.',
  },
]
