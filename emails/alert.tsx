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
  import { Emoji } from 'emoji-picker-react';
  import { addComma } from '../lib/lodash'

  export const SignInEmail = ({ transaction }) => {
    return (
      <Html>
        <Head />
        <Preview>Trckfi - Alert</Preview>
        <Tailwind>
          <Body className="bg-white my-auto mx-auto font-sans">
            <Container className="mx-auto p-[20px] w-[465px]">
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
                <span className="mr-2" ><Emoji unified='1f6a8' size={20}/></span><strong>Trckfi Alert</strong>                
              </Heading>
              <Text className="text-[#666666] text-[16px] mt-4 leading-[24px] text-center font-bold block mx-auto">
                <Emoji unified={transaction.unified} size={20}/>
                <span className="ml-1">{transaction.name}</span>
                <span className="ml-1">{addComma(transaction.amount)}</span>
              </Text>
              <Text className="text-[#666666] text-[12px] my-4 leading-[24px] text-center block">
                {transaction.notes}
              </Text>
              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  pX={20}
                  pY={12}
                  className="bg-pink-600 rounded text-white text-[12px] font-semibold no-underline text-center"
                  href='https://www.trckfi.com/dashboard'
                >
                  Go to Dashboard
                </Button>
              </Section>
              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                If you were not expecting this invitation, you can ignore this email.
                If you are concerned about your account's safety, please reply 
                to this email to get in touch with us.
              </Text>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  
  export default SignInEmail;