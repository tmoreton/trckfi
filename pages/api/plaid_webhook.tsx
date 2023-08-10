const nodemailer = require('nodemailer')

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const { webhook_code: webhookCode, item_id: plaidItemId, } = req.body

  switch (webhookCode) {
    case 'SYNC_UPDATES_AVAILABLE': {
      const body = {
        from: process.env.EMAIL_ADDRESS,
        to: 'tmoreton89@gmail.com',
        subject: `Plaid webhook`,
        html: `<p>${JSON.stringify(plaidItemId)}</p>`,
      }
    
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        secure: false,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
    
      await transporter.sendMail(body)
      break;
    }
    case 'DEFAULT_UPDATE':
    case 'INITIAL_UPDATE':
    case 'HISTORICAL_UPDATE':
      /* ignore - not needed if using sync endpoint + webhook */
      break;
    default:
      break;
  }
  return res.status(200).json({ status: 'OK' })
}
