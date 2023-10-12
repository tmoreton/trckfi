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

export const BetaInvite = () => {
  return (
    <Html>
      <Head />
      <Preview>Trckfi - You've Been Invited to Join!</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="py-[20px] w-[650px] mx-auto">
            <Section>
              <Img
                src='https://www.trckfi.com/trckfi-black-sm.png'
                height="50"
                alt="Trckfi Logo"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[36px] font-bold text-center p-0 my-[36px] mx-0 leading-[40px]">
              You've been invited to become a Trckfi early adopter!
            </Heading>
            {/* <Text className="text-[#666666] text-[12px] leading-[12px]">
              If you were not expecting this invitation, you can ignore this email.
              If you are concerned about your account's safety, please reply 
              to this email to get in touch with us.
            </Text> */}
            <Link href="https://youtu.be/uDkEiNo8P7E">
              <Img
                src='https://www.trckfi.com/email-video-gray.png'
                width="465"
                alt="Trckfi Intro Video"
                className="my-0 mx-auto"
              />
            </Link>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-pink-600 rounded-2xl text-white text-[21px] font-semibold no-underline text-center"
                href='https://www.trckfi.com/beta'
              >
                Accept Invitation
              </Button>
            </Section>            
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default BetaInvite;