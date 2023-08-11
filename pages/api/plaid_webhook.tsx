const nodemailer = require('nodemailer')

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const { webhook_code, item_id, } = req.body
  console.log(req.body)
  switch (webhook_code) {
    case 'SYNC_UPDATES_AVAILABLE': {
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
