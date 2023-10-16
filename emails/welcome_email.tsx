import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
  Heading,
  Button
} from '@react-email/components';
import * as React from 'react';
import { Link } from '@react-email/link';

export default function (){
  return (
    <Html>
      <Head />
      <Preview>Welcome to Trckfi!</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="my-[10px] mx-auto p-[20px] w-[650px]">
            <Section>
              <Img
                src='https://www.trckfi.com/trckfi.png'
                width="75"
                height="75"
                alt="Trckfi"
                className="my-0 mx-auto"
              />
            </Section>
            
            <Heading className="text-black text-[32px] font-bold text-center p-0 mt-[36px] mx-0 leading-[40px]">
              Hello, Trckfi early adopter!
            </Heading>

            <Section className="my-[16px] mx-auto text-center">
              <Button
                pX={18}
                pY={10}
                className="bg-pink-600 rounded-2xl text-white text-[24px] font-semibold no-underline mx-auto text-center"
                href='https://www.trckfi.com/visionboard'
              >
                Visionboard
              </Button>
            </Section>

            <Text className="text-[15px] text-black text-center" >Welcome to our Beta community! We're thrilled to have you on board.</Text>
            
            <Section>
              <Text className="text-[15px]"><strong>Your Privacy Matters: </strong> We never retain any personal information, login credentials or private transaction details. Trckfi uses a third party <Link href="https://plaid.com/en-eu/security/">Plaid</Link> to securely encrypt and connect accounts to our platform.</Text>
              <Text className="text-[18px] pt-[15px]"><strong>Getting Started:</strong></Text>
              <Text className="text-[15px] mt-0">Now, let's dive into making the most of the platform. You can visit <Link href="https://www.youtube.com/watch?v=q1vrfbfnGlA&list=PLhdVvRlgkCzp0gkEEcJ3ATvroEViP_sgn">Trckfi YouTube Library</Link> with quick tutorials to get started or follow these simple steps:</Text>
              <Text className="text-[18px] pt-[15px]"><strong>Step 1: Connect Your Bank Accounts</strong></Text>
              <Text className="text-[15px] mt-0">As a first step, connect your bank accounts. Please allow up to 24 hours for this information to sync.</Text>
              <Text className="text-[18px] pt-[15px]"><strong>Step 2: Explore Our Features</strong></Text>
              <Text className="text-[15px] mt-0"><strong>Vision Board:</strong> This is your creative space! Upload images, videos, write down notes, and find inspiration to visualize your financial goals.🌈✨</Text>
              <Text className="text-[15px] mb-0"><strong>Dashboard: </strong>Gain insights into your expenses, neatly organized by categories, for better understanding your spending habits.📊💸</Text>
              <Text className="text-[15px] ml-[10px] my-0">- You can also create custom spending categories and groups.</Text>
              <Text className="text-[15px] ml-[10px] my-0">- Define custom rules for tricky transactions.</Text>
              <Text className="text-[15px] ml-[10px] my-0">- Download your data for easy Excel work.</Text>
              <Text className="text-[15px]"><strong>Net Worth and Accounts:</strong> Manage all your financial connections, including credit cards, savings, checking, and more. You can also add real estate, crypto, stocks, or manual entries for non-digital assets. 💰📈</Text>
              <Text className="text-[15px]"><strong>Recurring Charges:</strong> Easily identify upcoming recurring expenses and discover hidden subscriptions you may not even be aware of. 🔎🤔</Text>
              <Text className="text-[15px]"><strong>Goals:</strong> Your financial planning hub! Set your goals, track your progress, and receive insights on whether you're on track. 🏖️🏠</Text>
              <Text className="text-[15px]"><strong>Profile:</strong> Manage your subscription and invite your partner to view family financial data. Adjust email and notification preferences for your convenience. ✨🙂</Text>
              <Text className="text-[18px] pt-[15px]"><strong>Step 3: Take Control of Your Finances</strong></Text>
              <Text className="text-[15px] mt-0">It's time to transform your money mindset and gain control of your finances. We'll continue to enhance the platform and introduce new features, including an academy section for financial learning.</Text>
              <Text className="text-[15px]">Remember, <strong>your feedback is invaluable</strong> as we fine-tune Trckfi. If you have questions or need assistance, our friendly support team is just an email away at support@trckfi.com.</Text>
              <Text className="text-[15px]">Thank you for joining us on this financial journey. Together, we'll improve the way we handle our finances and support you in reaching your financial goals.</Text>
              <Text className="text-[15px]"><strong>Let's get started!</strong></Text>
            </Section>

            <Section className="my-[16px] mx-auto text-center">
              <Button
                pX={18}
                pY={10}
                className="bg-pink-600 rounded-2xl text-white text-[24px] font-semibold no-underline mx-auto text-center"
                href='https://www.trckfi.com/visionboard'
              >
                Visionboard
              </Button>
            </Section>

            <Text className="text-black text-[15px] leading-[24px]">
              Love, <br/> Trckfi Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}