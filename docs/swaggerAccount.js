/**
 * @swagger
 * tags:
 *   name: Account
 *   description: Användarregistrering och inloggning
 */

/**
 * @swagger
 * /account/register:
 *   post:
 *     summary: Registrera ett nytt användarkonto
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - surname
 *               - phone_number
 *               - address
 *               - post_number
 *               - city
 *               - email
 *               - password
 *             properties:
 *               profile_picture:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               firstname:
 *                 type: string
 *                 example: Ada
 *               surname:
 *                 type: string
 *                 example: Lovelace
 *               phone_number:
 *                 type: string
 *                 example: "0701234567"
 *               address:
 *                 type: string
 *                 example: Datorgatan 1
 *               post_number:
 *                 type: string
 *                 example: "12345"
 *               city:
 *                 type: string
 *                 example: Techville
 *               email:
 *                 type: string
 *                 example: ada@example.com
 *               password:
 *                 type: string
 *                 example: starkthecode123
 *     responses:
 *       201:
 *         description: Konto skapat
 *       500:
 *         description: Databasfel
 */

/**
 * @swagger
 * /account/login:
 *   post:
 *     summary: Logga in ett befintligt konto
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: ada@example.com
 *               password:
 *                 type: string
 *                 example: starkthecode123
 *     responses:
 *       200:
 *         description: Inloggning lyckades
 *       401:
 *         description: Fel lösenord eller e-post
 *       404:
 *         description: Konto hittades inte
 *       500:
 *         description: Serverfel vid inloggning
 */
