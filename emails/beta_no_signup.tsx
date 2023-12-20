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
          <Container className="py-[20px] max-w-3xl mx-auto">
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
              <Text className="text-[15px]"><b>You're not alone.</b> So many of us feel in over our heads with personal finance, even if our careers are on track. It's like trying to crack the code to a secret club no one taught us how to join.</Text>
            </Section>

            <Section className="my-[16px] mx-auto text-center">
              <Button
                pX={18}
                pY={10}
                className="bg-pink-600 rounded-2xl text-white text-xl font-semibold no-underline mx-auto text-center"
                href='https://www.trckfi.com/'
              >
                Join Trckfi community!
              </Button>
            </Section>

            <Section>
              <Text className="text-[15px]"><b>But what if it didn't have to be this way?</b></Text>
              <Text className="text-[15px]">Trckfi was created to be that easy-to-understand guide. We simplify money management and help you see where you truly stand right now, without judgment. Instead of just budget spreadsheets, we focus on mindsets, education, and building motivation to reach your money goals.</Text>
              <Text className="text-[15px]"><b>Intrigued?</b> We're offering new members a 30-day free trial so you can experience relief from money stress! No commitments, cancel anytime.</Text>
              <Text className="text-[15px]">Let's gain control together.</Text>
            </Section>

            <Section className="my-[16px] mx-auto text-center">
              <Button
                pX={18}
                pY={10}
                className="text-pink-600 text-xl font-semibold no-underline mx-auto text-center"
                href='https://www.trckfi.com/pricing'
              >
                Tap Here to Start Your 30-Day Free Trial
              </Button>
            </Section>

            <Section>
              <Text className="text-[15px]"><b>With Trckfi, you can:</b></Text>
              <Text className="text-[15px] ml-[10px] my-0">🔍 See exactly where every dollar goes</Text>
              <Text className="text-[15px] ml-[10px] my-0">🌈 Create your vision board & stay motivated</Text>
              <Text className="text-[15px] ml-[10px] my-0">💸 Gain control of your cash flow & build wealth!</Text>
              <Text className="text-[15px] ml-[10px] my-0">💡 Make smart educated money decisions</Text>
              <Text className="text-[15px] ml-[10px] mt-0">💆‍♀️ Reduce financial stress - live a better life</Text>
            </Section>

            <Text className="text-[15px]">Ready to take control of your money? Join us now and take advantage of a <b>30-day free trial!</b></Text>

            <Section className="my-[32px] mx-auto text-center">
              <Button
                pX={18}
                pY={10}
                className="bg-pink-600 rounded-2xl text-white text-xl font-semibold no-underline mx-auto text-center"
                href='https://www.trckfi.com/'
              >
                Start your 30-day free trial!
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