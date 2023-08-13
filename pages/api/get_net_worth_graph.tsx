// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { user } = req.body
  const user_id = user?.id
  if (!user_id ) return res.status(500)
  const { id, linked_user_id } = user
  const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]

  const acount_types = [
    { subtype: 'credit card', type: 'credit', amount: 0},
    { subtype: 'savings', type: 'depository', amount: 0},
    { subtype: 'checking', type: 'depository', amount: 0},
    { subtype: 'brokerage', type: 'investment', amount: 0},
    { subtype: 'ira', type: 'investment', amount: 0},
    { subtype: '401k', type: 'investment', amount: 0},
    { subtype: 'real estate', type: 'investment', amount: 0},
    { subtype: 'mortgage', type: 'loan', amount: 0},
    { subtype: 'auto loan', type: 'loan', amount: 0},
    { subtype: 'line of credit', type: 'loan', amount: 0},
    { subtype: 'student loan', type: 'loan', amount: 0},
  ]
  
  try {
    const accounts = await prisma.accounts.groupBy({
      by: ['type', 'subtype'],
      where: {
        OR: query,
        active: true,
      },
      _sum: {
        amount: true,
      },
    })

    const net_worth_accounts = [
      { type: 'Cash', amount: 0, color: '#36a2eb'},
      { type: 'Stocks', amount: 0, color: '#9ad0f5'},
      { type: 'Crypto', amount: 0, color: '#ff6384'},
      { type: 'Real Estate', amount: 0, color: '#ffb1c1'},
      { type: 'Retirement', amount: 0, color: '#4bc0c0'},
      { type: 'Other', amount: 0, color: '#a5dfdf'},
    ]

    accounts.forEach(a => {
      switch (a.subtype) {
        case 'credit card':
          net_worth_accounts[net_worth_accounts.findIndex(el => el.type === 'Cash')].amount += Math.round(Number(a._sum.amount))
          break;
        case 'savings':
          net_worth_accounts[net_worth_accounts.findIndex(el => el.type === 'Cash')].amount += Math.round(Number(a._sum.amount))
          break;
        case 'checking':
          net_worth_accounts[net_worth_accounts.findIndex(el => el.type === 'Cash')].amount += Math.round(Number(a._sum.amount))
          break;
        case 'brokerage':
          net_worth_accounts[net_worth_accounts.findIndex(el => el.type === 'Stocks')].amount += Math.round(Number(a._sum.amount))
          break;
        case 'stocks':
          net_worth_accounts[net_worth_accounts.findIndex(el => el.type === 'Stocks')].amount += Math.round(Number(a._sum.amount))
          break;
        case 'ira':
          net_worth_accounts[net_worth_accounts.findIndex(el => el.type === 'Retirement')].amount += Math.round(Number(a._sum.amount))
          break;
        case '401k':
          net_worth_accounts[net_worth_accounts.findIndex(el => el.type === 'Retirement')].amount += Math.round(Number(a._sum.amount))
          break;
        case 'mortgage':
          net_worth_accounts[net_worth_accounts.findIndex(el => el.type === 'Real Estate')].amount += Math.round(Number(a._sum.amount))
          break;
        case 'real estate':
          net_worth_accounts[net_worth_accounts.findIndex(el => el.type === 'Real Estate')].amount += Math.round(Number(a._sum.amount))
          break;
        case 'crypto':
          net_worth_accounts[net_worth_accounts.findIndex(el => el.type === 'Crypto')].amount += Math.round(Number(a._sum.amount))
          break;
        default:
          net_worth_accounts[net_worth_accounts.findIndex(el => el.type === 'Other')].amount += Math.round(Number(a._sum.amount))
      }
    })
    let updated = net_worth_accounts.filter(i => i.amount > 0 && i)
    return res.status(200).json({ data: updated})
    
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}