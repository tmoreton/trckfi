import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
  Row, 
  Column
} from '@react-email/components';
import * as React from 'react';
import { addComma } from '../lib/lodash'
import { Emoji } from 'emoji-picker-react';

export default function ({ groupByMonth, groupByMonthIncome, primaryCategories, detailedCategories, transactions, recurring }) {
  return (
    <Html>
      <Head />
      <Preview>Your Monthly Finance Summary</Preview>
      <Tailwind>
        <Body className="bg-[#f3f3f5] my-auto mx-auto font-sans">
          <Container className="mx-auto w-[465px]">
            <Img
              src='https://www.trckfi.com/trckfi.png'
              width="40"
              height="40"
              alt="Trckfi"
              className="mx-auto my-2"
            />
            <Section className="bg-[#ffffff] rounded text-center">
              <Hr className="w-full border-t-3 border-pink-500 mx-auto my-0" />
              <Heading className="text-[#464c63] text-[22px] mt-4  inline-flex items-center">
                <span className="mr-2" ><Emoji unified='1f4b8' size={20}/></span><strong>Monthly Finance Summary</strong>
              </Heading>
              <Text className="text-[#666666] text-[12px] mt-0 mb-4">
                Let's review your finances from last month
              </Text>
              <Text className="text-[#464c63] font-light text-[16px] my-0 font-semibold">
                Expenses
              </Text>
              <Row className="w-full">
                <Column className="w-60" align="center">
                  <Text className="text-[#666666] text-[12px] mb-0 mt-0 ">
                    Last Month
                  </Text>
                  <Text className="text-red-500 text-[28px] font-bold my-0">
                    {addComma(Math.abs(groupByMonth[1]?._sum?.amount))}
                  </Text>
                  <Text className="text-[#888888] text-[8px] mt-0">
                    {groupByMonth[1]?._count?.amount} transactions
                  </Text>
                </Column>
                <Column align="center">
                  <Text className="text-[#666666] text-[12px] fold-bold">
                    VS.
                  </Text>
                </Column>
                <Column className="w-60" align="center">
                  <Text className="text-[#666666] text-[12px] mb-0 mt-0">
                    This Month
                  </Text>
                  <Text className="text-red-500 text-[28px] font-bold my-0">
                    {addComma(Math.abs(groupByMonth[0]?._sum?.amount))}
                  </Text>
                  <Text className="text-[#888888] text-[8px] mt-0">
                    {groupByMonth[0]?._count?.amount} transactions
                  </Text>
                </Column>
              </Row>

              { groupByMonth[0]?._sum?.amount < groupByMonth[1]?._sum?.amount &&
                <Text className="text-[#464c63] font-semibold text-[12px] mt-1 mb-8 inline-flex items-center">
                  Nice Work! 
                  <span className="px-1"><Emoji unified='1f973' size={20}/></span>
                  You spent 
                  <span className="text-green-500  font-bold text-[16px] px-1">
                    {addComma(Math.abs(Number(groupByMonth[1]?._sum?.amount) - Number(groupByMonth[0]?._sum?.amount)))} 
                  </span>
                  less this month!
                </Text>
              }

              <Text className="text-[#464c63] font-light text-[16px] my-0 font-semibold">
                Income
              </Text>
              <Row className="mb-8">
                <Column className="w-60" align="center">
                  <Text className="text-[#666666] text-[12px] my-0 ">
                    Last Month
                  </Text>
                  <Text className="text-green-500 text-[28px] font-bold my-0">
                    {addComma(Math.abs(groupByMonthIncome[1]?._sum?.amount))}
                  </Text>
                </Column>
                <Column align="center">
                  <Text className="text-[#666666] text-[12px] fold-bold">
                    VS.
                  </Text>
                </Column>
                <Column className="w-60" align="center">
                  <Text className="text-[#666666] text-[12px] my-0">
                    This Month
                  </Text>
                  <Text className="text-green-500 text-[28px] font-bold my-0">
                    {addComma(Math.abs(groupByMonthIncome[0]?._sum?.amount))}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* <Section className="bg-[#ffffff] rounded text-center my-5">
              <Hr className="w-full border-t-3 border-pink-500 mx-auto my-0" />
              <Section className="mt-0 mb-4">
                <Text className="text-[#464c63] font-light text-[22px] mb-1">
                  Primary Category Spend
                </Text>
                <Hr className="w-1/3 border-t border-gray-300 mx-auto mb-4" />
                {primaryCategories.map((item) => (
                  <Row key={item.id}>
                    <Column className="w-80" align="left">
                      <Text className="text-[#666666] text-[12px] my-0 mb-1 pl-4">
                        {item.category}
                      </Text>
                    </Column>
                    <Column align="right">
                      <Text className="text-red-500 text-[16px] my-0 font-semibold pr-4">
                        ${Math.abs(Math.round(item.this_month_amount))}
                      </Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            </Section> */}

            <Section className="bg-[#ffffff] rounded text-center my-5">
              <Hr className="w-full border-t-3 border-pink-500 mx-auto my-0" />
              <Section className="mt-0 mb-4">
                <Text className="text-[#464c63] font-light text-[22px] mb-1">
                  Detailed Category Spend
                </Text>
                <Hr className="w-1/3 border-t border-gray-300 mx-auto mb-4" />
                {detailedCategories.map((item) => (
                  <Row key={item.id}>
                    <Column className="w-80" align="left">
                      <Text className="text-[#666666] text-[12px] my-0 mb-1 pl-4">
                        {item.category}
                      </Text>
                    </Column>
                    <Column align="right">
                      <Text className="text-red-500 text-[16px] my-0 font-semibold pr-4">
                        ${Math.abs(Math.round(item.this_month_amount))}
                      </Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            </Section>

            <Section className="bg-[#ffffff] rounded text-center my-5">
              <Hr className="w-full border-t-3 border-pink-500 mx-auto my-0" />
              <Section className="mt-0 mb-4">
                <Text className="text-[#464c63] font-light text-[22px] mb-1">
                  Top Expenses
                </Text>
                <Hr className="w-1/3 border-t border-gray-300 mx-auto mb-4" />
                {transactions.map((item) => {
                  return (
                    <Row key={item.id}>
                      <Column className="w-44" align="left">
                        <Text className="text-[#666666] text-[11px] my-0 my-0 font-semibold pl-4">
                          {item.custom_name ? item.custom_name : item.name?.substring(0, 15).toUpperCase().replace('.',' ')}
                        </Text>
                      </Column>
                      <Column className="w-40" align="left">
                        <Text className="text-[#666666] text-[7px] my-0 ml-8">
                          {item.primary_category.split('_').join(' ')}
                        </Text>
                      </Column>
                      <Column align="right">
                        <Text className="text-red-500 text-[14px] my-0 font-semibold pr-4">
                          ${Math.abs(Math.round(item.amount))}
                        </Text>
                      </Column>
                    </Row>
                  )
                })}
              </Section>
            </Section>

            { recurring.length > 0 &&
            <Section className="bg-[#ffffff] rounded text-center my-5">
              <Hr className="w-full border-t-3 border-pink-500 mx-auto my-0" />
              <Section className="mt-0 mb-4">
                <Text className="text-[#464c63] font-light text-[22px] mb-1">
                  Upcoming Recurring Charges
                </Text>
                <Hr className="w-1/3 border-t border-gray-300 mx-auto mb-4" />
                {recurring.map((item) => {
                  return (
                    <Row key={item.id}>
                      <Column className="w-44" align="left">
                        <Text className="text-[#666666] text-[11px] my-0 ml-6 my-0 font-semibold">
                          {item.custom_name ? item.custom_name : item.name?.substring(0, 15).toUpperCase().replace('.',' ')}
                        </Text>
                      </Column>
                      <Column className="w-40" align="left">
                        <Text className="text-[#666666] text-[7px] my-0 ml-8">
                          {item.upcoming_date}
                        </Text>
                      </Column>
                      <Column align="right">
                        <Text className="text-red-500 text-[14px] my-0 mr-6 font-semibold">
                          ${Math.abs(Math.round(item.last_amount))}
                        </Text>
                      </Column>
                    </Row>
                  )
                })}
              </Section>
            </Section>}
            
            <Hr className="border border-solid border-[#eaeaea] my-[16px] mx-0 w-full" />
            <Text className="text-[#666666] text-[8px] text-center">
              If you were not expecting this email please contact us at support@trckfi.com
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}