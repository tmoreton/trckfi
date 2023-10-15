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
      <Preview>You're invited to be a Trckfi early adopter!</Preview>
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
            <Heading className="text-black text-[32px] font-bold text-center p-0 mt-[36px] mx-0 leading-[40px]">
              You've been invited to become a Trckfi early adopter!
            </Heading>

            <Section>
              <Text className="text-[15px] text-center">This means you will be able to use our personal finance for <strong>free</strong> for a period of <strong>3 months</strong>! All we ask is for you to provide your honest feedback. You can cancel anytime.</Text>
            </Section>

            <Section className="my-[32px] mx-auto text-center">
              <Button
                pX={20}
                pY={12}
                className="bg-pink-600 rounded-2xl text-white text-[32px] font-semibold no-underline mx-auto text-center"
                href='https://www.trckfi.com/beta'
              >
                Accept Invitation
              </Button>
            </Section>

            <Section>
              <Text className="text-[15px] text-center my-[20px]">Once you accept the invitation, click <strong>'EARLY ADOPTER'</strong> on the pricing page. You'll be taken to our Plaid checkout with a <strong>90-day free trial</strong> discount applied. Fill in your information, click <strong>'subscribe'</strong>, and you'll soon receive an email with a link to access your account. 🎉</Text>
              <Text className="text-[12px] text-center my-[20px]"><strong>Data Security:</strong> Your Privacy Matters. We never retain any personal information, login credentials or private transaction details. Trckfi uses a third party <Link href="https://plaid.com/safety/">Plaid</Link> to securely encrypt and connect accounts to our platform.</Text>
              <Text className="text-[15px] text-center mt-[30px] mb-[20px]">Have any questions or need assistance along the way? Please reach out to our friendly support team at support@trckfi.com. Remember, your feedback is invaluable as we fine-tune Trckfi to make it the best it can be. </Text>
            </Section>

            <Text className="text-black text-[15px] leading-[24px]">
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