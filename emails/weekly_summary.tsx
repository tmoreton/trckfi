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
import { Emoji } from 'emoji-picker-react';
import { addComma, commaShort, classNames } from '../lib/lodash'

export default function ({ groupByWeek, primaryCategories, detailedCategories, transactions, recurring }) {
  return (
    <Html>
      <Head />
      <Preview>Your Weekly Finance Summary</Preview>
      <Tailwind>
        <Body className="bg-[#f3f3f5] my-auto mx-auto font-sans">
          <Container className="mx-auto max-w-xl">
            <Img
              src='https://www.trckfi.com/trckfi.png'
              width="40"
              height="40"
              alt="Trckfi"
              className="mx-auto my-2"
            />
            <Section className="bg-[#ffffff] rounded text-center">
              <Hr className="w-full border-t-3 border-pink-500 mx-auto my-0" />
              <Heading className="text-[#464c63] text-[22px] mt-4 inline-flex items-center">
                <span className="mr-2" ><Emoji unified='1f4b8' size={20}/></span><strong>Weekly Finance Summary</strong>
              </Heading>
              <Text className="text-[#666666] text-[12px] mt-0 mb-4">
                Let's review your finances from last week
              </Text>
              <Text className="text-[#464c63] font-light text-[16px] my-0 font-semibold">
                Expenses
              </Text>
              <Row className="w-full">
                <Column className="w-60" align="center">
                  <Text className="text-[#666666] text-[12px] mb-0 mt-0 ">
                    Last Week
                  </Text>
                  <Text className="text-red-500 text-[28px] font-bold my-0">
                    {addComma(Math.abs(groupByWeek[1]?._sum?.amount))}
                  </Text>
                  <Text className="text-[#888888] text-[8px] mt-0">
                    {groupByWeek[1]?._count?.amount} transactions
                  </Text>
                </Column>
                <Column align="center">
                  <Text className="text-[#666666] text-[16px] fold-bold">
                    VS.
                  </Text>
                </Column>
                <Column className="w-60" align="center">
                  <Text className="text-[#666666] text-[12px] mb-0 mt-0">
                    This Week
                  </Text>
                  <Text className="text-red-500 text-[28px] font-bold my-0">
                    {addComma(Math.abs(groupByWeek[0]?._sum?.amount))}
                  </Text>
                  <Text className="text-[#888888] text-[8px] mt-0">
                    {groupByWeek[0]?._count?.amount} transactions
                  </Text>
                </Column>
              </Row>
              { groupByWeek[0]?._sum?.amount < groupByWeek[1]?._sum?.amount &&
                <Text className="text-[#464c63] font-semibold text-[12px] mt-1 mb-2 inline-flex items-center">
                  Nice Work! 
                  <span className="px-1"><Emoji unified='1f973' size={20}/></span>
                  You spent 
                  <span className="text-green-500  font-bold text-[16px] px-1">
                    {addComma(Math.abs(Number(groupByWeek[1]?._sum?.amount) - Number(groupByWeek[0]?._sum?.amount)))} 
                  </span>
                  less this week!
                </Text>
              }
            </Section>

            {/* <Section className="bg-[#ffffff] rounded text-center my-5">
              <Hr className="w-full border-t-3 border-pink-500 mx-auto my-0" />
              <Section className="mt-0 mb-4">
                <Text className="text-[#464c63] font-light text-[22px] mb-1">
                  Primary Category Spend
                </Text>
                <Hr className="w-1/3 border-t border-gray-300 mx-auto mb-4" />
                <Row>
                  <Column className="w-64" align="left"></Column>
                  <Column align="right">
                    <Text className="text-[#666666] text-[12px] font-bold mr-5 my-0 mb-1">
                      This Week
                    </Text>
                  </Column>
                </Row>
                {primaryCategories.map((item) => (
                  <Row key={item.id}>
                    <Column className="w-64" align="left">
                      <Text className="text-[#666666] text-[12px] my-0 ml-6 mb-1">
                        {item.category}
                      </Text>
                    </Column>
                    <Column align="right">
                      <Text className="text-red-500 text-[16px] my-0 mr-6 font-semibold">
                        ${Math.abs(Math.round(item.this_week_amount))}
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
                <Row>
                  <Column className="w-64" align="left"></Column>
                  <Column align="right">
                    <Text className="text-[#666666] text-[12px] font-bold mr-5 my-0 mb-1">
                      This Week
                    </Text>
                  </Column>
                </Row>
                {detailedCategories.map((item) => (
                  <Row key={item.id}>
                    <Column className="w-64" align="left">
                      <Text className="text-[#666666] text-[12px] my-0 ml-6 mb-1">
                        {item.category}
                      </Text>
                    </Column>
                    <Column align="right">
                      <Text className="text-red-500 text-[16px] my-0 mr-6 font-semibold">
                        {commaShort(item.this_week_amount)}
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
                        <Text className="text-[#666666] text-[11px] my-0 ml-6 my-0 font-semibold">
                          {item.custom_name ? item.custom_name : item.name?.substring(0, 15).toUpperCase().replace('.',' ')}
                        </Text>
                      </Column>
                      <Column className="w-40" align="left">
                        <Text className="text-[#666666] text-[7px] my-0 ml-8">
                          {item.primary_category.split('_').join(' ')}
                        </Text>
                      </Column>
                      <Column align="right">
                        <Text className="text-red-500 text-[14px] my-0 mr-6 font-semibold">
                          {commaShort(item.amount)}
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
                        <Text className={classNames(
                          item.amount > 0 ? 'text-green-500' : 'text-red-500',
                            'text-[14px] my-0 mr-6 font-semibold'
                          )}>
                          {commaShort(item.amount)}
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