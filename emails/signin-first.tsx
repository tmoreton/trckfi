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
} from '@react-email/components';
import * as React from 'react';
import { Link } from '@react-email/link';

export const SignInEmail = ({ url }) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to 30-day Free Trial!</Preview>
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
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Welcome to 30-day Free Trial!
            </Heading>
            <Text className="text-black text-[17px] leading-[24px] mb-[12px]">
              <b>Hey money friend! 👋</b>
            </Text>
            <Text className="text-black text-[15px] leading-[24px] mb-[12px]">
              We're thrilled you're here! 
            </Text>
            <Text className="text-black text-[15px] leading-[24px] mb-[12px]">
              You'll soon receive an email from us with a few tips to make the most out of your Trckfi membership and reach your money goals.
            </Text>
            <Text className="text-black text-[15px] leading-[24px] mb-[12px]">
              In the meantime, here's a quick video <strong><Link href="https://youtu.be/2ouLvCuiphg">here</Link></strong> to help you complete your account and get started!
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-pink-600 rounded text-white text-[12px] font-semibold no-underline text-center"
                href={url}
              >
                Confirm Email
              </Button>
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

export default SignInEmail;