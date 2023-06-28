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

  return (
    <Html>
      <Head />
      <Preview>Trckfi - Weekly Summary</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="my-[40px] mx-auto p-[20px] w-[465px]">
            <Section>
              <Img
                src='https://www.trckfi.com/trckfi.png'
                width="50"
                height="50"
                alt="Trckfi"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 mt-[30px] mx-0">
              <strong>Trckfi</strong>
            </Heading>
            <Text className="text-[#666666] text-[20px] leading-[24px] text-center mb-[36px]">Weekly Spending Summary</Text>
            <Section>
              <Row>
                <Column align="right">
                  <Text className="text-[#000000] text-[20px] leading-[24px] text-center mb-[36px]">Top 3 Purchases</Text>
                  <Text className="text-[#000000] text-[12px] leading-[24px] text-center">${thisWeek[0].merchant_name}</Text>
                  <Text className="text-[#000000] text-[12px] leading-[24px] text-center">${thisWeek[1].merchant_name}</Text>
                  <Text className="text-[#000000] text-[12px] leading-[24px] text-center">${thisWeek[2].merchant_name}</Text>
                </Column>
                <Column align="left">
                  <Text className="text-[#000000] text-[20px] leading-[24px] text-center mb-[36px]">This Week</Text>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  <Text className="text-[#000000] text-[12px] leading-[24px] text-center">${thisWeekSum}</Text>
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