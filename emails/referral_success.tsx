import {
  Body,
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

export default function (){
  return (
    <Html>
      <Head />
      <Preview>Trckfi - You Referred a Friend!</Preview>
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
            <Heading className="text-black text-[24px] font-bold text-center p-0 my-[30px] mx-0">
              Great News!
            </Heading>
            <Text className="text-black text-[16px] font-normal mt-4 mb-0 leading-[24px] text-center block">
              A friend of yours just used your referral link! A $10 credit has been added to your account and will be automtically applied to your monthly subscription.
            </Text>
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
}