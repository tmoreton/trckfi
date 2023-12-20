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
              <Text className="text-[15px] mt-[50px]">This economy has been rough lately, am I right? Between inflation, recession worries, and everything else - money has felt extra stressful.</Text>
              <Text className="text-[15px]">You're probably managing things just fine on the surface. <b>But deep down, do any of these sound familiar at all?</b></Text>
              <Text className="text-[15px] ml-[10px] my-0">- Never knowing exactly where all your money actually goes each month</Text>
              <Text className="text-[15px] ml-[10px] my-0">- Not saving or investing as much as you'd like</Text>
              <Text className="text-[15px] ml-[10px] my-0">- Feeling overwhelmed trying to make big financial decisions</Text>
              <Text className="text-[15px] ml-[10px] mt-0">- Getting money advice that just doesn't stick</Text>
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