/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Hantering av kundvagnar
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Skapa en ny kundvagn
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account_id
 *             properties:
 *               account_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Kundvagn skapad
 */

/**
 * @swagger
 * /cart/{cartId}/items:
 *   post:
 *     summary: Lägg till en produkt i kundvagnen
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID på kundvagnen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Produkten lades till i kundvagnen
 */

/**
 * @swagger
 * /cart/{cartId}:
 *   get:
 *     summary: Hämta innehållet i en kundvagn
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID på kundvagnen
 *     responses:
 *       200:
 *         description: Returnerar produkter i kundvagnen
 */

/**
 * @swagger
 * /cart/{cartId}/items/{itemId}:
 *   delete:
 *     summary: Ta bort en produkt från kundvagnen
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produkten togs bort från kundvagnen
 */

/**
 * @swagger
 * /cart/{cartId}/share:
 *   get:
 *     summary: Generera en delningslänk till en kundvagn
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Delningslänk skapad
 */
