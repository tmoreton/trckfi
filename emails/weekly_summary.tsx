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
            <Section>
              <Img
                src='https://www.trckfi.com/trckfi.png'
                width="50"
                height="50"
                alt="Trckfi"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 mb-[30px] mx-0">
              <strong>Trckfi</strong>
            </Heading>
            <Text className="text-[#666666] text-[20px] leading-[24px] text-center mb-[16px]">Weekly Spending Summary</Text>
            <Section className="text-center mt-[32px] mb-[32px]">
            <Text className="text-black text-[16px] leading-[12px] text-center mb-[26px]">This Week</Text>
              <Button
                pX={20}
                pY={12}
                className="bg-[#ff3378] rounded text-white text-[12px] font-semibold no-underline text-center"
                href='https://www.trckfi.com/my-dashboard'
              >
                <strong className="text-[20px] text-white">${Number(thisWeekSum).toFixed(2)}</strong>
              </Button>
            </Section>
            <Section>
              <Row>
                <Column align="left">
                  <Text className="text-black text-[18px] leading-[12px] mb-[22px] font-bold">Top 5 Purchases</Text>
                  <Text className="text-[#666666] text-[12px] leading-[6px]">{thisWeekSorted[0].name}: <strong>${thisWeekSorted[0].amount}</strong></Text>
                  <Text className="text-[#666666] text-[12px] leading-[6px]">{thisWeekSorted[1].name}: <strong>${thisWeekSorted[1].amount}</strong></Text>
                  <Text className="text-[#666666] text-[12px] leading-[6px]">{thisWeekSorted[2].name}: <strong>${thisWeekSorted[2].amount}</strong></Text>
                  <Text className="text-[#666666] text-[12px] leading-[6px]">{thisWeekSorted[3].name}: <strong>${thisWeekSorted[3].amount}</strong></Text>
                  <Text className="text-[#666666] text-[12px] leading-[6px]">{thisWeekSorted[4].name}: <strong>${thisWeekSorted[4].amount}</strong></Text>
                </Column>
                <Column align="left">
                  <Img
                    src='https://www.trckfi.com/color-credit-card.png'
                    width="150"
                    alt="Credit Card"
                    className="p-2"
                  />
                </Column>
              </Row>
            </Section>
            <Text className="text-[#666666] text-[20px] leading-[24px] text-center mt-[22px] mb-[32px] font-bold">VS.</Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Text className="text-black text-[16px] leading-[12px] text-center mb-[26px]">Last Week</Text>
              <Button
                pX={20}
                pY={12}
                className="bg-[#ff3378] rounded text-white text-[12px] font-semibold no-underline text-center"
                href='https://www.trckfi.com/my-dashboard'
              >
                <strong className="text-[20px] text-white">${Number(lastWeekSum).toFixed(2)}</strong>
              </Button>
            </Section>
            {/* <Text className="text-black text-[16px] leading-[12px] text-center mb-[26px]">Last Week: <strong className="text-[20px]">${Number(lastWeekSum).toFixed(2)}</strong></Text> */}
            <Section>
              <Row>
                <Column align="left">
                  <Img
                    src='https://www.trckfi.com/color-calendar.png'
                    width="125"
                    alt="Calendar"
                    className="p-2"
                  />
                </Column>
                <Column align="left">
                  <Text className="text-black text-[18px] leading-[12px] mb-[22px] font-bold">Top 5 Purchases</Text>
                  <Text className="text-[#666666] text-[12px] leading-[6px]">{lastWeekSorted[0]?.name}: <strong>${lastWeekSorted[0]?.amount}</strong></Text>
                  <Text className="text-[#666666] text-[12px] leading-[6px]">{lastWeekSorted[1]?.name}: <strong>${lastWeekSorted[1]?.amount}</strong></Text>
                  <Text className="text-[#666666] text-[12px] leading-[6px]">{lastWeekSorted[2]?.name}: <strong>${lastWeekSorted[2]?.amount}</strong></Text>
                  <Text className="text-[#666666] text-[12px] leading-[6px]">{lastWeekSorted[3]?.name}: <strong>${lastWeekSorted[3]?.amount}</strong></Text>
                  <Text className="text-[#666666] text-[12px] leading-[6px]">{lastWeekSorted[4]?.name}: <strong>${lastWeekSorted[4]?.amount}</strong></Text>
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