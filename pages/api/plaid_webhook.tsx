export default async (req, res) => {
  const { webhook_code: webhookCode, item_id: plaidItemId, } = req.body

  switch (webhookCode) {
    case 'SYNC_UPDATES_AVAILABLE': {
      // Fired when new transactions data becomes available.
      console.log(plaidItemId)
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
