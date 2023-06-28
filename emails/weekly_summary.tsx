import {
  Body,
  Button,
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

export default function ({ thisWeek, lastWeek }) {
  let thisWeekSum = thisWeek.reduce((accumulator, currentValue) => accumulator + Number(currentValue.amount), 0)
  let lastWeekSum = lastWeek.reduce((accumulator, currentValue) => accumulator + Number(currentValue.amount), 0)
  const thisWeekSorted = thisWeek.sort((a,b) =>  Number(b.amount) - Number(a.amount))
  const lastWeekSorted = lastWeek.sort((a,b) =>  Number(b.amount) - Number(a.amount))

  return (
    <Html>
      <Head />
      <Preview>Trckfi - Weekly Summary</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="mx-auto w-[465px]">
            <Section className="flex flex-1 justify-center items-center my-auto mx-auto">
              <Heading className="flex flex-1 justify-center items-center my-auto mx-auto text-black text-[24px] font-normal p-0 mx-0">
                <Img
                  src='https://www.trckfi.com/trckfi.png'
                  width="50"
                  height="50"
                  alt="Trckfi"
                  className="p-2"
                />
                <strong>Trckfi</strong>
              </Heading>
            </Section>
            <Text className="text-[#666666] text-[20px] leading-[24px] text-center mb-[16px]">Weekly Spending Summary</Text>
            <Text className="text-black text-[16px] leading-[12px] text-center mb-[26px]">This Week: <strong className="text-[20px]">${Number(thisWeekSum).toFixed(2)}</strong></Text>
            <Section>
              <Row>
                <Column align="left">
                  <Text className="text-black text-[18px] leading-[12px] mb-[22px] font-bold">Top 5 Purchases</Text>
                  <Text className="text-black text-[15px] leading-[6px]">{thisWeekSorted[0].name}: <strong>${thisWeekSorted[0].amount}</strong></Text>
                  <Text className="text-black text-[15px] leading-[6px]">{thisWeekSorted[1].name}: <strong>${thisWeekSorted[1].amount}</strong></Text>
                  <Text className="text-black text-[15px] leading-[6px]">{thisWeekSorted[2].name}: <strong>${thisWeekSorted[2].amount}</strong></Text>
                  <Text className="text-black text-[15px] leading-[6px]">{thisWeekSorted[3].name}: <strong>${thisWeekSorted[3].amount}</strong></Text>
                  <Text className="text-black text-[15px] leading-[6px]">{thisWeekSorted[4].name}: <strong>${thisWeekSorted[4].amount}</strong></Text>
                </Column>
                <Column align="left">
                  <Img
                    src='https://www.trckfi.com/color-credit-card.png'
                    width="200"
                    alt="Credit Card"
                    className="p-2"
                  />
                </Column>
              </Row>
            </Section>
            <Text className="text-[#666666] text-[20px] leading-[24px] text-center my-[32px]">VS.</Text>
            <Text className="text-black text-[16px] leading-[12px] text-center mb-[26px]">Last Week: <strong className="text-[20px]">${Number(lastWeekSum).toFixed(2)}</strong></Text>
            <Section>
              <Row>
                <Column align="right">
                  <Img
                    src='https://www.trckfi.com/color-calendar.png'
                    width="150"
                    alt="Calendar"
                    className="p-2"
                  />
                </Column>
                <Column align="left">
                  <Text className="text-black text-[18px] leading-[12px] mb-[22px] font-bold">Top 5 Purchases</Text>
                  <Text className="text-black text-[15px] leading-[6px]">{lastWeekSorted[0]?.name}: <strong>${lastWeekSorted[0]?.amount}</strong></Text>
                  <Text className="text-black text-[15px] leading-[6px]">{lastWeekSorted[1]?.name}: <strong>${lastWeekSorted[1]?.amount}</strong></Text>
                  <Text className="text-black text-[15px] leading-[6px]">{lastWeekSorted[2]?.name}: <strong>${lastWeekSorted[2]?.amount}</strong></Text>
                  <Text className="text-black text-[15px] leading-[6px]">{lastWeekSorted[3]?.name}: <strong>${lastWeekSorted[3]?.amount}</strong></Text>
                  <Text className="text-black text-[15px] leading-[6px]">{lastWeekSorted[4]?.name}: <strong>${lastWeekSorted[4]?.amount}</strong></Text>
                </Column>
              </Row>
            </Section>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              If you were not expecting this invitation, you can ignore this email.
              If you are concerned about your account's safety, please reply 
              to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};