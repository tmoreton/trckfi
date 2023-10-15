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
            <Heading className="text-black text-[32px] font-bold text-center p-0 my-[36px] mx-0 leading-[40px]">
              You've been invited to become a Trckfi early adopter!
            </Heading>

            <Section>
              <Text className="text-[20px] text-center">This means you will be able to use our personal finance for <strong>free</strong> for a period of <strong>3 months</strong>! All we ask is for you to provide your honest feedback. You can cancel anytime.</Text>
            </Section>

            <Section className="my-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-pink-600 rounded-2xl text-white text-[21px] font-semibold no-underline text-center"
                href='https://www.trckfi.com/beta'
              >
                Accept Invitation
              </Button>
            </Section>

            <Section>
              <Text className="text-[20px] text-center my-[8px]">After accepting the invitation, you'll land on a pricing page. Simply click the <strong>'EARLY ADOPTER'</strong> button, and you'll be directed to the Plaid checkout page, where we've already <strong>added a discount code for a 90-day free trial.</strong> </Text>
              <Text className="text-[20px] text-center my-[8px]">Complete your information (no charges will be incurred), hit <strong>'subscribe'</strong>, and you'll receive an email granting access to your account. 🎉</Text>
              <Text className="text-[20px] text-center my-[8px]"><strong>Data Security:</strong> Your Privacy Matters. We never retain any personal information, login credentials or private transaction details. Trackfi uses a third party plaid to securely encrypt and connect accounts to our platform.</Text>
              <Text className="text-[20px] text-center my-[8px]">Have any questions or need assistance along the way? Please reach out to our friendly support team at support@trckfi.com. Remember, your feedback is invaluable as we fine-tune Trckfi to make it the best it can be. </Text>
            </Section>

            <Text className="text-black text-[18px] leading-[24px]">
              Love, <br/> Trckfi Team
            </Text>  
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default BetaInvite;

{/* <Link href="https://youtu.be/uDkEiNo8P7E">
  <Img
    src='https://www.trckfi.com/email-video-gray.png'
    width="465"
    alt="Trckfi Intro Video"
    className="my-0 mx-auto"
  />
</Link> */}