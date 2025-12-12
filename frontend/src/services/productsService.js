import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from './firebase';

export const getProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

export const searchProducts = async (searchTerm) => {
  try {
    const products = await getProducts();
    const term = searchTerm.toLowerCase();
    
    return products.filter(product => 
      product.name?.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term) ||
      product.brand?.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error('Error al buscar productos:', error);
    throw error;
  }
};

export const filterProducts = (products, filters) => {
  let filtered = [...products];

  // Filtro por categoría
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(product => 
      filters.categories.includes(product.category)
    );
  }

  // Filtro por rango de precio
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(product => product.price >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(product => product.price <= filters.maxPrice);
  }

  // Filtro por tipo (individual/mayoreo)
  if (filters.productType) {
    if (filters.productType === 'wholesale') {
      filtered = filtered.filter(product => product.wholesalePrice);
    }
  }

  // Filtro por color (si existe)
  if (filters.color) {
    filtered = filtered.filter(product => 
      product.color?.toLowerCase() === filters.color.toLowerCase()
    );
  }

  // Ordenamiento
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        // Recomendado (por defecto, ordenar por fecha)
        break;
    }
  }

  return filtered;
};

