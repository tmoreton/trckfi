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

export default function ({ month, thisMonth, categories, thisMonthTotal, lastMonthTotal, thisMonthIncome, lastMonthIncome }) {
  categories.sort((a, b) => b._sum.amount-a._sum.amount)
  return (
    <Html>
      <Head />
      <Preview>Your {month} Finance Summary</Preview>
      <Tailwind>
        <Body className="bg-[#f3f3f5] my-auto mx-auto font-sans">
          <Container className="mx-auto w-[465px]">
            <Img
              src='https://www.trckfi.com/trckfi.png'
              width="25"
              height="25"
              alt="Trckfi"
              className="mx-auto my-2"
            />

            <Section className="bg-[#ffffff] rounded text-center">
              <Hr className="w-full border-t-3 border-pink-500 mx-auto my-0" />
              <Heading className="text-[#464c63] text-[22px] mt-4">
                <strong>{month}'s Summary</strong>
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
                    ${Math.abs(Math.round(lastMonthTotal._sum.amount))}
                  </Text>
                  <Text className="text-[#888888] text-[8px] mt-0">
                    {lastMonthTotal._count.amount} transactions
                  </Text>
                </Column>
                <Column align="center">
                  <Text className="text-[#666666] text-[16px] fold-bold">
                    VS.
                  </Text>
                </Column>
                <Column className="w-60" align="center">
                  <Text className="text-[#666666] text-[12px] mb-0 mt-0">
                    This Month
                  </Text>
                  <Text className="text-red-500 text-[28px] font-bold my-0">
                    ${Math.abs(Math.round(thisMonthTotal._sum.amount))}
                  </Text>
                  <Text className="text-[#888888] text-[8px] mt-0">
                    {thisMonthTotal._count.amount} transactions
                  </Text>
                </Column>
              </Row>

              

              <Text className="text-[#464c63] font-light text-[16px] my-0 font-semibold">
                Income
              </Text>
              <Row className="mb-8">
                <Column className="w-60" align="center">
                  <Text className="text-[#666666] text-[12px] my-0 ">
                    Last Month
                  </Text>
                  <Text className="text-green-500 text-[28px] font-bold my-0">
                    ${Math.abs(Math.round(lastMonthIncome._sum.amount))}
                  </Text>
                </Column>
                <Column align="center">
                  <Text className="text-[#666666] text-[16px] fold-bold">
                    VS.
                  </Text>
                </Column>
                <Column className="w-60" align="center">
                  <Text className="text-[#666666] text-[12px] my-0">
                    This Month
                  </Text>
                  <Text className="text-green-500 text-[28px] font-bold my-0">
                    ${Math.abs(Math.round(thisMonthIncome._sum.amount))}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="bg-[#ffffff] rounded text-center my-5">
              <Hr className="w-full border-t-3 border-pink-500 mx-auto my-0" />
              <Section className="mt-0 mb-4">
                <Text className="text-[#464c63] font-light text-[22px] mb-1">
                  Category Spend
                </Text>
                <Hr className="w-1/3 border-t border-gray-300 mx-auto mb-4" />
                {categories.map((item) => (
                  <Row >
                    <Column className="w-64" align="left">
                      <Text className="text-[#666666] text-[12px] my-0 ml-8 mb-1">
                        {item.primary_category.split('_').join(' ')}
                      </Text>
                    </Column>
                    <Column align="left">
                      <Text className="text-[#666666] text-[10px] my-0 ml-8">
                      </Text>
                    </Column>
                    <Column align="right">
                      {
                        item._sum.amount > 0 ?
                        <Text className="text-red-500 text-[16px] my-0 mr-8 font-semibold">
                          ${Math.abs(Math.round(item._sum.amount))}
                        </Text>
                        :
                        <Text className="text-green-500 text-[16px] my-0 mr-8 font-semibold">
                          ${Math.abs(Math.round(item._sum.amount))}
                        </Text>
                      }
                    </Column>
                  </Row>
                ))}
              </Section>
            </Section>

            <Section className="bg-[#ffffff] rounded text-center my-5">
              <Hr className="w-full border-t-3 border-pink-500 mx-auto my-0" />
              <Section className="mt-0 mb-4">
                <Text className="text-[#464c63] font-light text-[22px] mb-1">
                  Top 10 Expenses
                </Text>
                <Hr className="w-1/3 border-t border-gray-300 mx-auto mb-4" />
                {thisMonth.map((item) => {
                  if(Number(item.amount) > 0){
                    return (
                    <Row >
                      <Column className="w-40" align="left">
                        <Text className="text-[#666666] text-[11px] my-0 ml-8 my-0 font-semibold">
                          {item.name.substring(0, 14).toUpperCase().replace('.',' ')}
                        </Text>
                      </Column>
                      <Column className="w-36" align="left">
                        <Text className="text-[#666666] text-[8px] my-0 ml-8">
                          {item.primary_category.split('_').join(' ')}
                        </Text>
                      </Column>
                      <Column align="right">
                        <Text className="text-red-500 text-[16px] my-0 mr-8 font-semibold">
                          ${Math.abs(Math.round(item.amount))}
                        </Text>
                      </Column>
                    </Row>
                    )
                  }
                })}
              </Section>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[16px] mx-0 w-full" />
            <Text className="text-[#666666] text-[8px] text-center">
              If you were not expecting this email please contact us at support@trckfi.com
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};