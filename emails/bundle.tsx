import {
  Body,
  Button,
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

export default function ({ name }){
  return (
    <Html>
      <Head />
      <Preview>The Expense Tracker is yours!</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="py-[20px] max-w-2xl mx-auto">
            <Section>
              <Img
                src='https://www.trckfi.com/trckfi-black-sm.png'
                height="50"
                alt="Trckfi Logo"
                className="my-0 mx-auto"
              />
            </Section>

            <Section>
              <Text className="text-[18px] mt-[20px]"><b>Hi {name} 👋</b></Text>
              <Text className="text-[15px]">Awesome, you’re here! The Expense Tracker is yours! </Text>
              <Text className="text-[15px]">It’s time for you to make the most of your hard-earned money by first tracking it! You work way too hard to feel this stressed about money!</Text>
              <Text className="text-[15px]">Ready to get started?</Text>
              <Text className="text-[15px]"><Link href="https://docs.google.com/spreadsheets/d/1VHDJ4gsCkQCCZX8q4wD8AOdYv2prU3Du2A0iGzEiJjE">Click Here</Link> to make your own copy of the Expense Tracker and…</Text>
              <Text className="text-[15px]">If you're interested in automation, explore our <Link href="https://trckfi.com/beta">Personal Finance web app</Link></Text>
              <Text className="text-[15px]">If you’ve been feeling like you’re just winging it when it comes to the money, you’re not alone!</Text>
              <Text className="text-[15px]">Here’s the good news…using this expense tracker to figure out where your money is going and what your cash flow is a great first step.</Text>
              <Text className="text-[15px]">You’ll be amazed at how something so simple can lead to the BIG aha that finally brings the clarity you need.</Text>
            </Section>

            <Section className="my-[32px] mx-auto text-center">
              <Button
                pX={20}
                pY={12}
                className="bg-pink-600 rounded-2xl text-white text-[32px] font-semibold no-underline mx-auto text-center"
                href='https://docs.google.com/spreadsheets/d/1VHDJ4gsCkQCCZX8q4wD8AOdYv2prU3Du2A0iGzEiJjE'
              >
                Download Tracker Here
              </Button>
            </Section>

            <Section>
              <Text className="text-[15px]">Next step? Knowing your financial situation will give you the freedom to make informed decisions and optimize both your time and money.</Text>
              <Text className="text-[15px]">No more working to exhaustion or burnout without a real clue of what you're working for and what your finances look like. You’re in the right place to figure it out.</Text>
              <Text className="text-[15px]">Don't have time for manual number crunching? We've got you covered.</Text>
              <Text className="text-[15px]">Our finance app automatically connects to your accounts, categorizes spending, and provides insights. No more guessing - just clarity!</Text>
            </Section>

            <Section className="my-[32px] mx-auto text-center">
              <Button
                pX={20}
                pY={12}
                className="bg-pink-600 rounded-2xl text-white text-[32px] font-semibold no-underline mx-auto text-center"
                href='https://trckfi.com/beta'
              >
                Access Now!
              </Button>
            </Section>

            <Text className="text-[15px]">Stop flying blind with your finances. Take control of your money with effortless tracking!</Text>

            <Text className="text-black text-[15px] leading-[24px]">
              Love, <br/> Trckfi Team
            </Text>  
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}