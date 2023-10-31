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
import { Markdown } from "@react-email/markdown";
import markdownStyles from '../components/markdown-styles.module.css'

export default function ({ content }){
  return (
    <Html>
      <Head />
      <Preview>Trckfi - Weekly</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="my-[40px] mx-auto p-[20px] max-w-2xl">
            <Section>
              <Img
                src='https://www.trckfi.com/trckfi-black-sm.png'
                width="250"
                height="75"
                alt="Trckfi"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Trckfi Weekly
            </Heading>
            <Section className="max-w-3xl mx-auto">
              {/* <div
                style={{maxWidth: "650px"}}
                className={markdownStyles['markdown']}
                dangerouslySetInnerHTML={{ __html: content }}
              /> */}
            </Section>
            <Section className="react-email-custom-markdown">
              <Markdown
                markdownCustomStyles={{
                  h1: { color: "red" },
                  h2: { color: "blue" },
                  codeInline: { background: "grey" },
                }}
                markdownContainerStyles={{
                  padding: "12px",
                  border: "solid 1px black",
                }}
              >
                {content}
              </Markdown>
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
