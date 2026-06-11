export const CATEGORIES = {
  'Lácteos & Huevos': ['Leche sin lactosa','Leche 2%','Huevos','Yogurt griego','Queso barrita','Queso rebanado','Queso Gouda','Queso cheddar','Queso provolone','Queso mozzarella','Crema de leche','Mantequilla','Cream cheese'],
  'Proteínas': ['Pollo thigh','Pollo tenderloin','Carne bisteck','Carne molida','Pavo molido','Pavo','Salmon','Sausage','Salchichas alemanas','Albóndigas italian','Atún en agua','Sardinas en aceite','Sardinas en tomate','Hard salami','Prosciutto','Hamburguesas'],
  'Pan & Granos': ['Pan','Bagel','Arroz basmati','Pasta corta','Pasta larga','Harina pan','Harina','Galletas de soda','Tortellinis','Fideos','Rice cakes','Hawaiian bread','Flatbreads pepperoni','Casabe','Pan integral'],
  'Frutas': ['Cambures','Fresas','Aguacate','Manzanas gala','Mandarinas','Otras berries','Piña','Melón','Patilla','Mangos','Limones','Naranja'],
  'Vegetales': ['Lechuga','Tomates cherry','Tomates roma','Pepino','Cebolla','Cebollín','Cilantro','Perejil fresco','Brócoli','Zanahoria','Calabacín','Repollo','Rábanos','Ajo pelado','Espinacas','Espárragos','Sweet peas','Maíz entero','Garbanzos','Lentejas'],
  'Despensa': ['Peanut butter','Nutella','Aceite oliva','Aceite','Salsa soya','Mostaza','Ketchup','Mayo','Miel','Mermelada','Azúcar','Sal','Aceite de sésamo','Adobo','Cubito de pollo','Ginger en polvo','Turmeric en polvo','Italian herbs','Basil seco','Parsley seco','Chocolate chips','Chia seeds','Dressing ranch','Curry'],
  'Congelados': ['Bolsa papas congeladas','Bolsa sweet potatoes','Helado chocolate','Tajadas'],
  'Bebidas': ['Refrescos','Coca-Cola light','Jugo de naranja','Limonada','Café Sello Rojo','Café'],
  'Hogar': ['Servilletas','Detergente','Wipes cocina','Pods dishwasher','Cajita Brillo','Guantes desechables','Papel toilet','Papel absorbo','Desinfectante','Toallín','Jabón ropa','Pads','Esponja','Pasta diente'],
  'Snacks & Otros': ['Galletas María','Cereal','Granola','Pretzels','Gelatina','Chobani flip','Acai'],
};

export const STORES = ['Aldi','Publix','Walmart','Key Foods',"Trader Joe's",'Whole Foods','Costco','Otro'];
export const DEFAULT_STORE = 'Aldi';

export const ALDI_SECTIONS = [
  { order:1,  name:'Frutas y vegetales',                 emoji:'🥦', items:['Lechuga','Tomates cherry','Tomates roma','Pepino','Cebolla','Cebollín','Cilantro','Perejil fresco','Brócoli','Zanahoria','Calabacín','Repollo','Rábanos','Ajo pelado','Espinacas','Espárragos','Sweet peas','Garbanzos','Lentejas','Maíz entero','Cambures','Fresas','Aguacate','Manzanas gala','Mandarinas','Otras berries','Piña','Melón','Patilla','Mangos','Limones','Naranja'] },
  { order:2,  name:'Panes, dulces y chocolates',         emoji:'🍞', items:['Pan','Bagel','Pan integral','Hawaiian bread','Galletas María','Cereal','Granola','Chobani flip','Gelatina'] },
  { order:3,  name:'Peanut butter, untables y deli',     emoji:'🥜', items:['Peanut butter','Nutella','Miel','Mermelada','Dressing ranch','Adobo','Curry','Ginger en polvo','Turmeric en polvo','Italian herbs','Basil seco','Parsley seco','Hard salami','Prosciutto'] },
  { order:4,  name:'Snacks y popcorn',                   emoji:'🍿', items:['Galletas de soda','Pretzels','Rice cakes','Flatbreads pepperoni','Casabe','Acai','Chia seeds'] },
  { order:5,  name:'Crema de leche, choc chips y aceites',emoji:'🫙', items:['Crema de leche','Chocolate chips','Aceite oliva','Aceite','Aceite de sésamo','Salsa soya','Mostaza','Ketchup','Mayo','Cubito de pollo','Sal','Azúcar'] },
  { order:6,  name:'Quesos y pavo',                      emoji:'🧀', items:['Queso barrita','Queso rebanado','Queso Gouda','Queso cheddar','Queso provolone','Queso mozzarella','Cream cheese','Pavo','Sausage','Salchichas alemanas'] },
  { order:7,  name:'Hogar y limpieza',                   emoji:'🏠', items:['Servilletas','Detergente','Wipes cocina','Pods dishwasher','Cajita Brillo','Guantes desechables','Papel toilet','Papel absorbo','Desinfectante','Toallín','Jabón ropa','Pads','Esponja','Pasta diente'] },
  { order:8,  name:'Pasta, enlatados e internacionales', emoji:'🥫', items:['Pasta corta','Pasta larga','Tortellinis','Fideos','Harina pan','Harina','Atún en agua','Sardinas en aceite','Sardinas en tomate','Albóndigas italian'] },
  { order:9,  name:'Proteínas y pescados',               emoji:'🥩', items:['Pollo thigh','Pollo tenderloin','Carne bisteck','Carne molida','Pavo molido','Salmon','Hamburguesas'] },
  { order:10, name:'Arroz',                              emoji:'🍚', items:['Arroz basmati'] },
  { order:11, name:'Dairy, refrigerados y huevos',       emoji:'🥛', items:['Leche sin lactosa','Leche 2%','Huevos','Yogurt griego','Mantequilla','Jugo de naranja'] },
  { order:12, name:'Refrescos y congelados',             emoji:'❄️', items:['Refrescos','Coca-Cola light','Limonada','Café','Café Sello Rojo','Bolsa papas congeladas','Bolsa sweet potatoes','Helado chocolate','Tajadas'] },
];

export const SECTION_MAP = {};
ALDI_SECTIONS.forEach(s => s.items.forEach(name => { SECTION_MAP[name] = s.order; }));

export function getSectionOrder(item) {
  if (item.store !== DEFAULT_STORE) return 99;
  return SECTION_MAP[item.name] ?? 98;
}

export const DEFAULT_UNITS = {
  'Huevos':'doc','Atún en agua':'lata','Sardinas en aceite':'lata','Sardinas en tomate':'lata',
  'Cambures':'und','Limones':'bolsa','Aguacate':'bolsa','Refrescos':'paq',
  'Coca-Cola light':'paq','Queso rebanado':'paq','Galletas de soda':'paq',
  'Rice cakes':'paq','Otras berries':'paq','Sweet peas':'paq',
  'Chocolate chips':'paq','Chia seeds':'paq','Granola':'paq',
};

let _id = 1;
export function buildInitialItems() {
  const list = [];
  Object.entries(CATEGORIES).forEach(([cat, products]) => {
    products.forEach(name => {
      list.push({ id: _id++, name, qty: 0, unit: DEFAULT_UNITS[name] ?? 'und', cat, store: DEFAULT_STORE, note: '', inCart: false });
    });
  });
  return list;
}
