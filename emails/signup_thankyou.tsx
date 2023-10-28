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
import { Link } from '@react-email/link';

export default function (){
  return (
    <Html>
      <Head />
      <Preview>Thanks for joining Trckfi!</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="my-[40px] mx-auto p-[20px] w-[650px]">
            <Section>
              <Img
                src='https://www.trckfi.com/trckfi.png'
                width="75"
                height="75"
                alt="Trckfi"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Thanks for joining <strong>Trckfi!</strong> <br/>You are awesome!
            </Heading>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-black text-[17px] leading-[24px] mb-[12px]">
              We're thrilled that you want to <strong>beta test our platform!</strong> Your input is very valuable to the success of <strong>Trckfi</strong>. You're currently in the <strong>waitlist!</strong> We'll notified you once you can start using the platform and will provide you with all the info you need, be in the lookout for an email from our team ☺️
            </Text>
            <Text className="text-black text-[17px] leading-[24px] mb-[12px]">
              We are working nonstop to build a great financial hub to help you boost your financial literacy, feel empowered and achieve your goals!
            </Text>
            <Text className="text-black text-[17px] mb-[12px]">
              <strong>In the meantime, here are 2 articles to get you started:</strong>
              <br/>
              <Link href="https://www.trckfi.com/blog/expense-management-guide">Expense Guide Management</Link>
              <br/>
              <Link href="https://www.trckfi.com/blog/financial-success-in-your-20s-guide">Guide to Financial Success in your 20's</Link>
            </Text>
            <Text className="text-black text-[17px] leading-[24px] mb-[12px]">
              Visit our <strong><Link href="https://www.trckfi.com/blog">Blog</Link></strong> to learn more 🥳
            </Text>
            {/* <Text className="text-black text-[17px] leading-[24px] mb-[12px]">
              Get an insight into how our platform works with this <strong><Link href="https://www.trckfi.com/">Video</Link></strong> 
            </Text> */}
            <Text className="text-black text-[17px] leading-[24px] mb-[18px]">
              Want more? Follow us on Instagram <strong><Link href="https://www.instagram.com/trckfi/">@Trckfi</Link></strong> for daily doses of financial tips and motivation. 
            </Text>
            <Text className="text-black text-[17px] leading-[24px] mb-[6px]">
              Love, <br/> Trckfi Team
            </Text>
            <Text className="text-black text-[17px] leading-[24px]">
              <strong>P.S. What could I write to provide value to you?</strong>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}