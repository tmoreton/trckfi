import getRawBody from 'raw-body'

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  // const { webhook_code, item_id, } = req.body
  let test = 'SYNC_UPDATES_AVAILABLE'
  // console.log('req', req)
  const rawBody = await getRawBody(req)
  console.log(rawBody)
  switch (test) {
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
