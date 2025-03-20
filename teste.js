const fs = require('fs');

function categorizeProducts(data) {
  if (!data || !Array.isArray(data)) {
    console.error("Erro: Dados inválidos ou ausentes.");
    return [];
  }

  const categories = {};

  data.forEach(product => {
    if (!product || typeof product.title !== 'string') {
      console.warn("Aviso: Produto com título inválido ou ausente. Ignorando.");
      return;
    }

    const normalizedName = normalizeProductName(product.title);

    if (!categories[normalizedName]) {
      categories[normalizedName] = {
        category: product.title, // Usar o título original do primeiro produto como categoria
        count: 0,
        products: []
      };
    }

    categories[normalizedName].count++;
    categories[normalizedName].products.push({
      title: product.title,
      supermarket: product.supermarket
    });
  });

  return Object.values(categories);
}

function normalizeProductName(name) {
  if (typeof name !== 'string') {
    return "";
  }

  // Normalizações dinâmicas
  name = name.toLowerCase();
  name = name.replace(/(\s|-)?desnatado/g, 'desnatado'); // Remove hífens ou espaços antes de "desnatado"
  name = name.replace(/\btipo\b|\bquilo\b/g, ''); // Remove "tipo" e "quilo"
  name = name.replace(/\b1\s*(kg|litro|l)\b/g, '1'); // Normaliza unidades de medida para "1"
  name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove caracteres especiais
  name = name.replace(/\s+/g, ' ').trim(); // Remove espaços extras

  // Ordenar palavras
  return name.split(' ').sort().join(' ');
}

try {
  // Carrega os dados do arquivo JSON
  const data = JSON.parse(fs.readFileSync('data01.json', 'utf8'));

  // Categoriza os produtos
  const categorizedProducts = categorizeProducts(data);

  // Imprime o resultado
  console.log(JSON.stringify(categorizedProducts, null, 2));
} catch (error) {
  console.error("Erro ao processar o arquivo data01.json:", error);
}