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
      <Preview>Howdy friend! 👋</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="my-[40px] mx-auto p-[20px] max-w-2xl">
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
              Howdy money friend! 👋
            </Text>
            <Text className="text-black text-[17px] leading-[24px] mb-[12px]">
              We were so excited to see you have joined the Trckfi club! But we saw you haven't linked any accounts yet. No biggie, life gets busy.
            </Text>
            <Text className="text-black text-[17px] leading-[24px] mb-[12px]">
              Here's the tea - connecting accounts takes just 2 little minutes. And it unlocks Trckfi's financial magic to start serving up personalized money motivation.
            </Text>
            <Text className="text-black text-[17px] leading-[24px] mb-[12px]">
              We want to welcome you fully into the community! Linking your accounts helps you create vision boards, crush 2024 goals, and transform your money mindset with our finance platform. It's not too early to start planning for 2024!
            </Text>
            <Text className="text-black text-[17px] leading-[24px] mb-[12px]">
              Whenever you have a sec, click below to complete setup. Then get ready to transform your money situation by focusing on mindset and education no just the numbers.
            </Text>
            <Section className="my-[32px] mx-auto text-center">
              <Button
                pX={18}
                pY={10}
                className="bg-pink-600 rounded-2xl text-white text-lg font-semibold no-underline mx-auto text-center"
                href='https://www.trckfi.com/auth/email-signin'
              >
                Complete Set Up
              </Button>
            </Section>
            <Text className="text-black text-[17px] leading-[24px] mb-[12px]">
              Can't wait to fuel your financial freedom! Let's do this.
            </Text>
            <Text className="text-black text-[17px] leading-[24px] mb-[6px]">
              Love, <br/> Trckfi Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}