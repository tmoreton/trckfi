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
import PostBody from '../components/post-body'
import { Link } from '@react-email/link';
import markdownStyles from '../components/markdown-styles.module.css'

export default function ({ post }){
  console.log(post)
  return (
    <Html>
      <Head />
      <Preview>Newsletter</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="my-[40px] mx-auto p-[20px] w-[650px]">
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
              Newsletter
            </Heading>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <PostBody content={post.content} />
            <div
              className={markdownStyles['markdown']}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}