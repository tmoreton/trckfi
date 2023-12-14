import {
  Body,
  Button,
  Container,
  Head,
  Heading,
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
      <Preview>Does this sound familiar?</Preview>
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
              <Text className="text-[15px] mt-[50px]"><b>Does this sound familiar?</b></Text>
              <Text className="text-[15px] ml-[10px] my-0">- You make good money but don't know where it should go</Text>
              <Text className="text-[15px] ml-[10px] my-0">- You don't feel you're saving or investing enough</Text>
              <Text className="text-[15px] ml-[10px] my-0">- You're unsure if you can afford big life decisions</Text>
              <Text className="text-[15px] ml-[10px] mt-0">- You feel overwhelmed and stressed out about finances</Text>
            </Section>

            <Section>
              <Text className="text-[15px]">Let's get real. Personal finance is like a secret club we're not taught to join. If you've ever felt like you're just winging it with money, you're in good company.</Text>
              <Text className="text-[15px]">But here's the deal: Trckfi is here to change the game.</Text>
              <Text className="text-[15px]"><b>With Trckfi, you can:</b></Text>
              <Text className="text-[15px] ml-[10px] my-0">🔍 See exactly where every dollar goes</Text>
              <Text className="text-[15px] ml-[10px] my-0">💰 Gain control of your cash flow</Text>
              <Text className="text-[15px] ml-[10px] my-0">🤓 Make smart money decisions</Text>
              <Text className="text-[15px] ml-[10px] mt-0">🎉 Reduce financial stress!</Text>
            </Section>

            <Text className="text-[15px]">Ready to take control of your money? Join us now and take advantage of a <b>30-day free trial!</b></Text>

            <Section className="my-[32px] mx-auto text-center">
              <Button
                pX={20}
                pY={12}
                className="bg-pink-600 rounded-2xl text-white text-[32px] font-semibold no-underline mx-auto text-center"
                href='https://www.trckfi.com/pricing'
              >
                Access Now!
              </Button>
            </Section>

            <Text className="text-[15px]">It's time to finally get clarity on your spending and make the most of the money you work so hard for!</Text>

            <Text className="text-black text-[15px] leading-[24px]">
              Love, <br/> Trckfi Team
            </Text>  
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}