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
                  <Text className="text-[20px] leading-[24px] text-center mb-[36px] font-bold">Top 3 Purchases</Text>
                  <Text className="text-[12px]">{thisWeek[0].name}</Text>
                  <Text className="text-[12px]">{thisWeek[1].name}</Text>
                  <Text className="text-[12px]">{thisWeek[2].name}</Text>
                </Column>
                <Column align="left">
                  <Img
                    src='https://www.trckfi.com/credit-card.png'
                    width="50"
                    height="50"
                    alt="Credit Card"
                    className="my-0 mx-auto"
                  />
                  <Text className="text-[20px] leading-[24px] text-center mb-[36px] font-bold">This Week</Text>
                  <Text className="text-[12px] leading-[24px] text-center">${thisWeekSum}</Text>
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