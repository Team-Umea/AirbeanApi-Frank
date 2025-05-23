/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Hantering av produkter i menyn
 */

/**
 * @swagger
 * /product/items:
 *   get:
 *     summary: Hämta alla produkter
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Returnerar en lista av produkter
 */

/**
 * @swagger
 * /product/additem:
 *   post:
 *     summary: Lägg till en ny produkt (endast för admin)
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_name
 *               - product_price
 *               - product_info
 *               - product_stock
 *             properties:
 *               product_name:
 *                 type: string
 *                 example: Cappuccino
 *               product_price:
 *                 type: number
 *                 example: 39.50
 *               product_info:
 *                 type: string
 *                 example: Kaffedryck med mjölkskum
 *               product_stock:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Produkten skapades
 */

/**
 * @swagger
 * /product/delete/{itemID}:
 *   delete:
 *     summary: Ta bort en produkt (endast för admin)
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: itemID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID för produkten som ska tas bort
 *     responses:
 *       200:
 *         description: Produkten har tagits bort
 *       404:
 *         description: Produkten hittades inte
 */

/**
 * @swagger
 * /product/update/{itemID}:
 *   patch:
 *     summary: Uppdatera en produkt (endast för admin)
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: itemID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID för produkten som ska uppdateras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *                 example: Espresso
 *               product_price:
 *                 type: number
 *                 example: 32.00
 *               product_info:
 *                 type: string
 *                 example: Stark och liten kaffedryck
 *     responses:
 *       201:
 *         description: Produkten har uppdaterats
 */
