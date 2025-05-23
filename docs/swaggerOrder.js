/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Beställningsflöde
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Skapa en ny order från en kundvagn
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartId
 *             properties:
 *               cartId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Order skapad
 *       400:
 *         description: Kundvagnen är tom eller ogiltig
 *       500:
 *         description: Serverfel vid skapande av order
 */

/**
 * @swagger
 * /order/status/{orderId}:
 *   get:
 *     summary: Hämta status och återstående leveranstid för en order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID för ordern
 *     responses:
 *       200:
 *         description: Orderstatus returnerad
 *       404:
 *         description: Ordern hittades inte
 *       500:
 *         description: Serverfel vid hämtning
 */

/**
 * @swagger
 * /order/history/{userId}:
 *   get:
 *     summary: Hämta orderhistorik för en användare
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID för användaren
 *     responses:
 *       200:
 *         description: Orderhistorik returnerad
 *       500:
 *         description: Serverfel vid hämtning
 */

/**
 * @swagger
 * /order/status/{orderId}/update:
 *   put:
 *     summary: Uppdatera status för en order (admin)
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID för ordern
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, out_for_delivery, delivered]
 *                 example: delivered
 *     responses:
 *       200:
 *         description: Orderstatus uppdaterad
 *       400:
 *         description: Ogiltig status
 *       404:
 *         description: Ordern hittades inte
 *       500:
 *         description: Serverfel vid uppdatering
 */
