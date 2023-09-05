const knex = require('../connection');
const schemaVerifyProduct = require('../middlewares/schemaVerifyProduct');

const  updateProduct = async (req, res) => {
    try {

    const { code, newPrice } = req.body; 

    await schemaVerifyProduct.validate(req.body)
    const product = await knex('products').where({code}).first();

    if(!product) {
      return res.status(400).json({message: "Este produto não foi encontrado"});
    }

      if (newPrice < Number(product.cost_price)) {
        return res.status(400).json({message: 'O novo preço não pode ser menor que o custo.'});
      }
  
      const maxPrice = Number(product.cost_price) * 1.1;
      const minPrice = Number(product.cost_price) * 0.9;
  
      if (newPrice > maxPrice || newPrice < minPrice) {
        return res.status(400).json({ message: 'O novo preço deve estar dentro de 10% do preço atual.' });
      }
  
      const updatedProduct = await knex('products').update('sales_price', newPrice).where({code});
  
      if (!updateProduct){
        return res.status(400).json({ error: 'O produto não foi atualizado.' });
      }

      const packProduct = await knex('packs').where('product_id', code).first();
      console.log(packProduct)

      if (packProduct) {
        const pricePack = newPrice * packProduct.qty;
        const updatePricePack = await knex('products').update('sales_price', pricePack).where('code', Number(packProduct.pack_id))
      }

      const newProduct = await knex('products').where({ code }).first();
      
      return res.status(200).json(newProduct);
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};    

const  updatePack = async (req, res) => {
  try {
    const { pack_id, newPrice } = req.body;

    const pack = await knex('packs').where({pack_id}).first();
    if (!pack) {
      return res.status(400).json({ message: 'Este pacote não foi encontrado' });
    }

    const product = await knex('products').where('code', pack.product_id).first();

    if(!product) {
      return res.status(400).json({ message: 'Este pacote não possui nenhum produto cadastrado' });
    }

    const newPriceProduct = newPrice / pack.qty;

    const maxPrice = product.cost_price * 1.1;
    const minPrice = product.cost_price * 0.9;

    if (newPriceProduct > maxPrice || newPriceProduct < minPrice) {
      return res.status(400).json({ message: 'O novo preço deve estar dentro de 10% do preço atual do produto.' });
    }

    if(newPriceProduct < product.cost_price) {
      return res.status(400).json({ message: 'O novo preço deve ser mais que o preço de custo.' });
    }

    const updatedProduct = await knex('products').update('sales_price', newPriceProduct).where('code', pack.product_id);
    const updatePack = await knex('products').update('sales_price', newPrice).where('code', pack_id);

    const productPack = await knex('products').where('code', pack_id).first();

    return res.status(200).json(productPack);


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}; 

module.exports = {
updateProduct,
updatePack
}

