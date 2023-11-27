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
              Howdy friend! 👋
            </Text>
            <Text className="text-black text-[17px] leading-[24px] mb-[12px]">
              You signed up recently to beta-test the platform (YAAY), but didn’t connect your accounts yet. 
            </Text>
            <Text className="text-black text-[17px] leading-[24px] mb-[12px]">
              To the best experience we invite you to complete the set-up process - I promise it will take less than 2 min.
            </Text>
            <Section className="my-[32px] mx-auto text-center">
              <Button
                pX={20}
                pY={12}
                className="bg-pink-600 rounded-2xl text-white text-[32px] font-semibold no-underline mx-auto text-center"
                href='https://www.trckfi.com/auth/email-signin'
              >
                Complete Set Up
              </Button>
            </Section>

            <Text className="text-black text-[17px] leading-[24px] mb-[6px]">
              Love, <br/> Trckfi Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}