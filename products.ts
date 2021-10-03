export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  lifeTime: number;
}

export const products : Product[] = [
  { 
    id: 'emoji:pizza', 
    name: 'Dodawaj emoji do swoich wpisów', 
    lifeTime: 7, 
    description: 'ElPresidente będzie dodawał emoji do każdego twojego wpisu.', 
    price: 30 
  }
]