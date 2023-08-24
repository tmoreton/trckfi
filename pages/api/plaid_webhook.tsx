import getRawBody from 'raw-body'

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default async (req, res) => {
  // const { webhook_code, item_id, } = req.body
  console.log(process.env.NEXT_PUBLIC_BASE_URL)
  let test = 'SYNC_UPDATES_AVAILABLE'
  console.log(JSON.parse(req.body))
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
