const Products = require('../models/product.model.js');

// --- ROTAS PROTEGIDAS ---

module.exports.addProduct = async (req, res) => {
    try {
        const { plat, plong, pname, pdesc, category } = req.body;
        const pimage = req.files.pimage ? req.files.pimage[0].path : null;
        const pimage2 = req.files.pimage2 ? req.files.pimage2[0].path : null;

        const product = new Products({
            pname, pdesc, category, pimage, pimage2,
            addedBy: req.user._id, // ID do utilizador vem do token
            pLoc: { type: 'Point', coordinates: [plat, plong] }
        });

        await product.save();
        res.status(201).send({ message: 'Produto adicionado com sucesso.' });

    } catch (err) {
        console.error("Erro ao adicionar produto:", err);
        res.status(500).send({ message: 'Erro no servidor ao adicionar produto.' });
    }
};

module.exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params; // ID do produto vem da URL
        const userId = req.user._id;      // ID do proprietário vem do token
        const updatedData = { ...req.body };

        if (req.files) {
            if (req.files.pimage) updatedData.pimage = req.files.pimage[0].path;
            if (req.files.pimage2) updatedData.pimage2 = req.files.pimage2[0].path;
        }

        const updatedProduct = await Products.findOneAndUpdate(
            { _id: productId, addedBy: userId }, // Garante que só o proprietário pode editar
            updatedData,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).send({ message: 'Produto não encontrado ou utilizador não autorizado.' });
        }
        res.send({ message: 'Produto atualizado com sucesso.', product: updatedProduct });

    } catch (error) {
        res.status(500).send({ message: 'Erro no servidor.' });
    }
};

module.exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const deleted = await Products.findOneAndDelete({ _id: productId, addedBy: userId });

        if (!deleted) {
            return res.status(404).send({ message: 'Produto não encontrado ou utilizador não autorizado.' });
        }
        res.send({ message: 'Produto apagado com sucesso.' });

    } catch (error) {
        res.status(500).send({ message: 'Erro no servidor.' });
    }
};

module.exports.myProducts = async (req, res) => {
    try {
        const products = await Products.find({ addedBy: req.user._id });
        res.send({ message: 'Sucesso.', products });

    } catch (error) {
        res.status(500).send({ message: 'Erro no servidor.' });
    }
};

// --- ROTAS PÚBLICAS ---

module.exports.getProducts = async (req, res) => {
    try {
        const { catName } = req.query;
        const filter = catName ? { category: catName } : {};
        const products = await Products.find(filter);
        res.send({ message: 'Sucesso.', products });

    } catch (error) {
        res.status(500).send({ message: 'Erro no servidor.' });
    }
};

module.exports.getProductsById = async (req, res) => {
    try {
        const { productId } = req.params; // Parâmetro da rota padronizado
        const product = await Products.findById(productId);

        if (!product) {
            return res.status(404).send({ message: 'Produto não encontrado.' });
        }
        res.send({ message: 'Sucesso.', product });

    } catch (error) {
        res.status(500).send({ message: 'Erro no servidor.' });
    }
};

module.exports.search = async (req, res) => {
    try {
        const { search, loc } = req.query;
        const query = {};

        // 1. Adiciona o filtro de texto (nome/descrição) se 'search' for fornecido
        if (search) {
            query.$or = [
                { pname: { $regex: search, $options: 'i' } },
                { pdesc: { $regex: search, $options: 'i' } },
            ];
        }

        // 2. Adiciona o filtro de geolocalização APENAS SE 'loc' for fornecido
        if (loc) {
            const [latitude, longitude] = loc.split(',');
            if (!isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))) {
                query.pLoc = {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(latitude), parseFloat(longitude)]
                        },
                        $maxDistance: 500 * 1000, // 500km
                    }
                };
            }
        }
        
        // 3. Executa a busca somente se houver algum critério de busca
        if (!search && !loc) {
             return res.send({ message: 'Nenhum critério de busca fornecido.', products: [] });
        }

        const products = await Products.find(query);
        res.send({ message: 'Sucesso.', products });

    } catch (error) {
        // 4. Captura qualquer erro inesperado
        console.error("Erro na busca de produtos:", error);
        res.status(500).send({ message: 'Erro no servidor ao realizar a busca.' });
    }
};