export interface CategoryOption {
  value: string;
  label: string;
}

// Values match the category names used by the word lists in words.ts.
const CATEGORIES: Record<'pt' | 'en' | 'es', CategoryOption[]> = {
  pt: [
    { value: 'all', label: 'Qualquer' },
    { value: 'Natureza', label: 'Natureza e Clima' },
    { value: 'Animais', label: 'Animais' },
    { value: 'Alimentos', label: 'Alimentos' },
    { value: 'Objetos', label: 'Objetos do Cotidiano' },
    { value: 'Tecnologia', label: 'Tecnologia' },
    { value: 'Locais', label: 'Lugares' }
  ],
  en: [
    { value: 'all', label: 'Any' },
    { value: 'Nature', label: 'Nature & Climate' },
    { value: 'Animals', label: 'Animals' },
    { value: 'Foods', label: 'Food' },
    { value: 'Objects', label: 'Everyday Objects' },
    { value: 'Tech', label: 'Technology' },
    { value: 'Places', label: 'Places' }
  ],
  es: [
    { value: 'all', label: 'Cualquiera' },
    { value: 'Naturaleza', label: 'Naturaleza y Clima' },
    { value: 'Animales', label: 'Animales' },
    { value: 'Alimentos', label: 'Alimentos' },
    { value: 'Objetos', label: 'Objetos Cotidianos' },
    { value: 'Tecnología', label: 'Tecnología' },
    { value: 'Lugares', label: 'Lugares' }
  ]
};

export function getCategories(lang: 'pt' | 'en' | 'es'): CategoryOption[] {
  return CATEGORIES[lang];
}
