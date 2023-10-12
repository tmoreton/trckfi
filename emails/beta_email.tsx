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
} from '@react-email/components';
import * as React from 'react';
import { Link } from '@react-email/link';

export default function (){
  return (
    <Html>
      <Head />
      <Preview>Welcome to Trckfi Beta!</Preview>
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
            <Section>
              <Text className="text-[20px]">Hi 👋,</Text>
              <Text className="text-[18px]">Welcome to the <strong>Trckfi Beta community</strong>! We're excited to have you on board as one of our valued beta testers. Get ready to start your journey towards financial empowerment and smarter money management.</Text>
              <Text className="text-[18px]"><strong>Data Security:</strong> Your Privacy Matters. We never retain any personal information, login credentials or private transaction details. Trackfi uses a third party <Link href="https://plaid.com/en-eu/security/">plaid</Link> to <u>securely encrypt</u> and connect accounts to our platform.</Text>
            </Section>

            <Section>
              <Text className="text-[20px]"><strong>Step 1: Create Your Account</strong></Text>
              <Text className="text-[18px] my-[5px]">To kick things off, follow these simple steps:</Text>
              <Text className="text-[15px] ml-[10px] my-[5px]">- <Link href="https://www.trckfi.com/beta">Click here to access the link.</Link> (Don't worry, we've already applied a discount code for a 90-day free trial.) 🙌</Text>
              <Text className="text-[15px] ml-[10px] my-[5px]">- Fill out your information (rest assured, you won't be charged!)</Text>
              <Text className="text-[15px] ml-[10px] my-[5px] pb-[10px]">- Look out for an email that will grant you access to your account. 🎉</Text>
            </Section>

            <Section>
              <Text className="text-[18px]"><strong>Step 2: Connect Your Bank Accounts</strong></Text>
              <Text className="text-[18px]">Once you're in, the first thing you'll want to do is connect your bank accounts. Please allow up to 24 hours for this information to sync.</Text>
            </Section>

            <Section>
              <Text className="text-[20px]"><strong>Step 3: Explore the Features</strong></Text>
              <Text className="text-[18px]">Now, let's dive into Trckfi's features. We've broken them down into easily digestible sections for you:</Text>
              <Text className="text-[18px]"><strong>Vision Board:</strong> This is your creative space! Upload images and videos, jot down notes, and find inspiration to visualize your financial goals. 🌈✨</Text>
            </Section>

            <Section>
              <Text className="text-[18px] my-[5px]"><strong>Dashboard:</strong> Gain a clearer picture of your expenses, neatly organized by categories, to better understand your spending habits. 📊💸</Text>
              <Text className="text-[15px] ml-[10px] my-[5px]">- You can also create custom spending categories and groups.</Text>
              <Text className="text-[15px] ml-[10px] my-[5px]">- Define custom rules for tricky transactions.</Text>
              <Text className="text-[15px] ml-[10px] my-[5px] pb-[10px]">- Download your data for easy Excel work.</Text>
            </Section>

            <Section>
              <Text className="text-[18px]"><strong>Net Worth and Accounts:</strong> Manage all your bank connections (credit cards, savings, checking, retirement, etc.), and use our flexible asset entry. Add real estate, crypto, stocks, or even manual entries for non-digital assets like art. 💰📈</Text>
              <Text className="text-[18px]"><strong>Recurring Charges:</strong> Easily identify upcoming recurring expenses and discover hidden subscriptions you may not even be aware of. 🔎🤔</Text>
            </Section>

            <Section> 
              <Text className="text-[18px] my-[5px]"><strong>Goals:</strong> Your financial planning hub! Start by setting your goals, specifying what you're saving for, your initial amount, your savings target, and the timeframe. Upload an image to keep your goal visual and manifest your financial dreams! 🏖️🏠🧳</Text>
              <Text className="text-[15px] ml-[10px] my-[5px]">- Over time, our system will learn about your income and spending habits, providing guidance on goal achievability.</Text>
              <Text className="text-[15px] ml-[10px] my-[5px] pb-[10px]">- Receive insights on whether you're on track, need to adjust your expenses, or increase your income.</Text>
            </Section>

            <Section>
              <Text className="text-[18px] my-[5px]"><strong>Profile:</strong> Manage your subscription and invite family members to access your financial data. Ideal for sharing financial visibility within your family. ✨🙂</Text>
              <Text className="text-[15px] ml-[10px] my-[5px]">- Adjust email and notification preferences.</Text>
              <Text className="text-[15px] ml-[10px] my-[5px] pb-[10px]">- Create custom rules for your convenience.</Text>
            </Section>

            <Section>
              <Text className="text-[18px]">We'll also provide a <Link href="https://youtu.be/uDkEiNo8P7E">step-by-step video</Link> to make everything crystal clear.</Text>
              <Text className="text-[18px]">Remember, <strong>your feedback</strong> is invaluable as we fine-tune Trckfi to make it the best it can be. If you have any questions or need assistance along the way, feel free to reach out to our friendly support team at support@trckfi.com.</Text>
              <Text className="text-[18px]">Thank you for being a part of this exciting journey with us. Together, we're going to transform the way we manage our finances.</Text>
              <Text className="text-[18px]"><strong>Let's get started!</strong></Text>
            </Section>

            <Text className="text-black text-[18px] leading-[24px]">
              Love, <br/> Trckfi Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}