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

  export const SignInEmail = ({ transaction }) => {
    return (
      <Html>
        <Head />
        <Preview>Trckfi - Alert</Preview>
        <Tailwind>
          <Body className="bg-white my-auto mx-auto font-sans">
            <Container className="mx-auto p-[20px] max-w-2xl">
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
                <span className="mr-2" ><Emoji unified='1f6a8' size={25}/></span><strong>Trckfi Reminder</strong>                
              </Heading>
              <Hr className="w-full border-t-3 border-pink-500 mx-auto my-0" />
              <Text className="text-[#666666] text-[16px] font-semibold mt-4 mb-0 leading-[24px] text-center block">
                {transaction.name}
              </Text>
              { transaction.amount < 0 ?
                <Text className="text-red-500 text-[18px] leading-[16px] text-center block font-bold">
                  ${Math.abs(Math.round(transaction.amount))}
                </Text>
                :
                <Text className="text-green-500 text-[18px] leading-[16px] text-center block font-bold">
                  ${Math.abs(Math.round(transaction.amount))}
                </Text>
              }
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