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
  
  export default function ({ signup_url, access_code, from_email }) {
    return (
      <Html>
        <Head />
        <Preview>Trckfi - Link Account from {from_email}</Preview>
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
              <Heading className="text-black text-[24px] font-normal text-center p-0 mt-[30px] mb-[10px] mx-0">
                Join <strong>Trckfi</strong>
              </Heading>
              <Text className="text-[#666666] text-[14px] leading-[24px] text-center">
                {from_email} invited you to join their Trckfi account!
              </Text>
              <Text className="text-[#666666] text-[14px] leading-[24px] text-center">
                Let's start by creating an account by clicking the link below.
              </Text>
              <Section className="text-center mt-[10px] mb-[32px]">
                <Button
                  pX={20}
                  pY={12}
                  className="bg-pink-600 rounded text-white text-[12px] font-semibold no-underline text-center"
                  href={signup_url}
                >
                  Create Account
                </Button>
              </Section>
              <Text className="text-[#666666] text-[10px] leading-[24px] text-center">
                Please be sure to click create account link within 24 hours as will will expire.
              </Text>
              {/* <Section className="w-full bg-gray-100 rounded text-white text-[12px] font-semibold no-underline text-center">
                <Text className="text-black text-[24px] font-normal text-center p-8 my-[30px] mx-0 text-center">{access_code}</Text>
              </Section> */}
              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
              <Text className="text-[#666666] text-[10px] leading-[24px]">
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
  