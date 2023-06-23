
import prisma from '../../lib/prisma';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.development,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const request = {
    access_token: 'access-development-868ac3ce-4626-4ce1-9d4c-f31fb63e11ae',
    start_date: '2023-05-01',
    end_date: '2023-06-23',
    options: {
      include_personal_finance_category: true
    }
  };
  const response = await client.transactionsGet(request);
  let transactions = response.data.transactions;
  console.log(response)
  // const total_transactions = response.data.total_transactions;
  // // Manipulate the offset parameter to paginate
  // // transactions and retrieve all available data
  // while (transactions.length < total_transactions) {
  //   const paginatedRequest = {
  //     access_token: 'access-development-868ac3ce-4626-4ce1-9d4c-f31fb63e11ae',
  //     start_date: '2025-01-01',
  //     end_date: '2023-06-23',
  //     options: {
  //       offset: transactions.length,
  //       include_personal_finance_category: true
  //     },
  //   };
  //   const paginatedResponse = await client.transactionsGet(paginatedRequest);
  //   transactions = transactions.concat(
  //     paginatedResponse.data.transactions,
  //   );
  // }
  // console.log(transactions)
}