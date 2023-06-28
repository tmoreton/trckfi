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

export default function () {
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
                  <Img className="rounded-full" src='https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-user.png' width="64" height="64" />
                </Column>
                <Column align="center">
                  <Img
                    src='https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-arrow.png'
                    width="12"
                    height="9"
                    alt="invited you to"
                  />
                </Column>
                <Column align="left">
                  <Img className="rounded-full" src='https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-team.png' width="64" height="64" />
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