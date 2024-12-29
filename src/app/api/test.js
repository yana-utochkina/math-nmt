/**
 * @swagger
 * /test:
 *   get:
 *     description: Returns a greeting
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello, World!
 */
export default function handler(req, res) {
    res.status(200).json({ message: 'Hello, World!' });
  }
  