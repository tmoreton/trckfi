import {
  Body,
  Container,
  Head,
  Heading,
  Button,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

export default function (){
  return (
    <Html>
      <Head />
      <Preview>Hey money friend! 👋</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="my-[40px] mx-auto p-[20px] max-w-3xl">
            <Section>
              <Img
                src='https://www.trckfi.com/trckfi.png'
                width="75"
                height="75"
                alt="Trckfi"
                className="my-0 mx-auto"
              />
            </Section>
            <Text className="text-black text-[17px] leading-[24px] mb-[12px]">
              <b>Hey money friend! 👋</b>
            </Text>
            <Text className="text-black text-[15px] leading-[24px] mb-[12px]">
              We are so excited to have you join Trckfi! But we noticed you haven't linked any accounts yet. No biggie, life gets busy.
            </Text>
            <Text className="text-black text-[15px] leading-[24px] mb-[12px]">
              Hooking up accounts now helps you create your vision boards, crush 2024 goals, and get your money mindset shifts into high gear right away. The faster the better with goal setting!
            </Text>
            <Section className="my-[32px] mx-auto text-center">
              <Button
                pX={18}
                pY={10}
                className="bg-pink-600 rounded-2xl text-white text-xl font-semibold no-underline mx-auto text-center"
                href='https://www.trckfi.com/auth/email-signin'
              >
                Complete Set Up
              </Button>
            </Section>
            <Text className="text-black text-[15px] leading-[24px]">
              Our team made updates to the platform and cleared bugs to enhance your user experience - complete your account setup and take a look yourself!
            </Text>
            <Section className="my-[16px] block mx-auto text-center flex justify-center items-center">
              <Img src="https://www.trckfi.com/assets/email-cheer.gif" alt="Cheering!" width="200" height="250" />
            </Section>
            <Text className="text-black text-[15px] leading-[24px] mb-[12px]">
              Let's transform your money situation together!
            </Text>
            <Text className="text-black text-[15px] leading-[24px] mb-[6px]">
              <b>Love, <br/> Trckfi Team</b>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}