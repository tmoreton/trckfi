// import {
//   Body,
//   Container,
//   Head,
//   Heading,
//   Hr,
//   Html,
//   Img,
//   Preview,
//   Section,
//   Tailwind,
//   Text,
// } from '@react-email/components';
// import * as React from 'react';
// import { Link } from '@react-email/link';
// import markdownStyles from '../components/markdown-styles.module.css'

// export default function ({ content }){
//   return (
//     <Html>
//       <Head />
//       <Preview>Newsletter</Preview>
//       <Tailwind>
//         <Body className="bg-white my-auto mx-auto font-sans">
//           <Container className="my-[40px] mx-auto p-[20px] w-[650px]">
//             <Section>
//               <Img
//                 src='https://www.trckfi.com/trckfi-black-sm.png'
//                 width="250"
//                 height="75"
//                 alt="Trckfi"
//                 className="my-0 mx-auto"
//               />
//             </Section>
//             <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
//               Newsletter
//             </Heading>
//             <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
//             <div
//               className={markdownStyles['markdown']}
//               dangerouslySetInnerHTML={{ __html: content }}
//             />
//           </Container>
//         </Body>
//       </Tailwind>
//     </Html>
//   );
// }


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
              Trckfi Weekly
            </Heading>
            <Section className="mt-[32px] mb-[32px] w-100">
              <Markdown
                markdownCustomStyles={{
                  h1: { color: "red" },
                  h2: { color: "blue" },
                  codeInline: { background: "grey" },
                  image: { maxWidth: "650px"}
                }}
                markdownContainerStyles={{
                  padding: "12px",
                  maxWidth: "650px"
                }}
              >{content}</Markdown>
              {/* <div
                className={markdownStyles['markdown']}
                dangerouslySetInnerHTML={{ __html: content }}
              /> */}
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
