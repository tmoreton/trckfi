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
  const thisWeekSum = thisWeek.reduce((accumulator, currentValue) => accumulator + Number(currentValue.amount), 0)
  const lastWeekSum = lastWeek.reduce((accumulator, currentValue) => accumulator + Number(currentValue.amount), 0)
  const sorted = thisWeek.sort((a,b) => {
      return Number(a.amount) - Number(b.amount);
  });
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
            <Text className="text-black text-[16px] leading-[12px] text-center mb-[32px]">This Week: <strong className="text-[20px]">${Number(thisWeekSum).toFixed(2)}</strong></Text>
            <Section>
              <Row>
                <Column align="left">
                  <Text className="text-black text-[18px] leading-[12px] mb-[22px] font-bold">Top 5 Purchases</Text>
                  <Text className="text-black text-[16px] leading-[6px]">{sorted[0].name}: <strong>${sorted[0].amount}</strong></Text>
                  <Text className="text-black text-[16px] leading-[6px]">{sorted[1].name}: <strong>${sorted[1].amount}</strong></Text>
                  <Text className="text-black text-[16px] leading-[6px]">{sorted[2].name}: <strong>${sorted[2].amount}</strong></Text>
                  <Text className="text-black text-[16px] leading-[6px]">{sorted[3].name}: <strong>${sorted[3].amount}</strong></Text>
                  <Text className="text-black text-[16px] leading-[6px]">{sorted[4].name}: <strong>${sorted[4].amount}</strong></Text>
                </Column>
                <Column align="left">
                  <Img
                    src='https://www.trckfi.com/color-credit-card.png'
                    width="200"
                    alt="Credit Card"
                    className="my-0"
                  />
                </Column>
              </Row>
            </Section>
            <Text className="text-[#666666] text-[20px] leading-[24px] text-center my-[32px]">VS.</Text>
            <Text className="text-black text-[16px] leading-[12px] text-center mb-[32px]">Last Week: <strong className="text-[20px]">${Number(lastWeekSum).toFixed(2)}</strong></Text>
            <Section>
              <Row>
                <Column align="right">
                  <Img
                    src='https://www.trckfi.com/color-calendar.png'
                    width="200"
                    alt="Calendar"
                    className="my-0"
                  />
                </Column>
                <Column align="left">
                  <Text className="text-black text-[18px] leading-[12px] mb-[22px] font-bold">Top 5 Purchases</Text>
                  <Text className="text-black text-[16px] leading-[6px]">{lastWeek[0]?.name}: <strong>${lastWeek[0]?.amount}</strong></Text>
                  <Text className="text-black text-[16px] leading-[6px]">{lastWeek[1]?.name}: <strong>${lastWeek[1]?.amount}</strong></Text>
                  <Text className="text-black text-[16px] leading-[6px]">{lastWeek[2]?.name}: <strong>${lastWeek[2]?.amount}</strong></Text>
                  <Text className="text-black text-[16px] leading-[6px]">{lastWeek[3]?.name}: <strong>${lastWeek[3]?.amount}</strong></Text>
                  <Text className="text-black text-[16px] leading-[6px]">{lastWeek[4]?.name}: <strong>${lastWeek[4]?.amount}</strong></Text>
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