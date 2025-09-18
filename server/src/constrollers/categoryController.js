const { Category, Post } = require("../models");


    const getCategories = async (req, res) => {
        try {
            const { categoryName } = req.params;

            const category = await Category.findOne({ where: { categoryName } });
            if (!category) {
                return res.status(404).json({ message: 'Категорията не е намерена' });
            }

            const posts = await Post.findAll({
                where: { categoryId: category.id },
                include: [{ model: Category, as: 'category', attributes: ['categoryName'] }]
            });
            posts.map(p => ({ id: p.id, title: p.title, category: p.category.categoryName }));
            res.json(posts);

        } catch (error) {
            console.error('Грешка при вземане на постове:', error);
            res.status(500).json({ message: 'Сървърна грешка' });
        }
    };

    const getCategoriesName = async (req, res) => {
        try {
            const category = await Category.findAll();
            res.json(category);
        } catch (error) {
            console.error('Грешка при вземане на постове:', error);
            res.status(500).json({ message: 'Сървърна грешка' });
        }
    };

    const getCategoriesDropdown = async (req, res) => {
        try {
            const { categoryId } = req.query;
            const posts = await Post.findAll({
                where: { categoryId }
            });
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: "Грешка при зареждане на постовете." });
        }
    }

    module.exports = { getCategories, getCategoriesName, getCategoriesDropdown }