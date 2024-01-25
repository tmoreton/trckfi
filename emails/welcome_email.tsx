import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
  Heading,
  Button,
  Hr
} from '@react-email/components';
import * as React from 'react';
import { Link } from '@react-email/link';

export default function (){
  return (
    <Html>
      <Head />
      <Preview>Start Using Trckfi Now: Reach Your Money Goals Faster!</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="my-[10px] mx-auto p-[20px] max-w-3xl">
            <Section>
              <Img
                src='https://www.trckfi.com/trckfi.png'
                width="75"
                height="75"
                alt="Trckfi"
                className="my-0 mx-auto"
              />
            </Section>
            
            <Heading className="text-black text-[32px] font-bold text-center p-0 mt-[36px] mx-0 leading-[40px]">
              Start Using Trckfi Now: Reach Your Money Goals Faster!
            </Heading>

            <Text className="text-[15px] text-black">We're thrilled to have you on board.</Text>
            <Text className="text-[15px] text-black">I want to help YOU make the most of Trckfi together and hit your money goals this year. Feel confident about your finances – you can totally do this!</Text>
            <Text className="text-[15px] text-black">Just complete a few quick setup steps, and you're all set to take control of your finances. Let's do this!</Text>
        
            <Section>
              <Hr className="mt-8"/>
              <Text className="text-[18px] pt-[15px]"><strong>Step 1: Finish your account setup!</strong></Text>
              <Text className="text-[15px] mt-0">Quick Connect: Link your accounts in under 2 minutes for the full platform experience. <br/> Allow 24 hours for syncing. Check out our brief <strong><Link href="https://youtu.be/2ouLvCuiphg">how-to video!</Link></strong></Text>
            </Section>

            <Section className="my-[16px] mx-auto text-center">
              <Button
                pX={18}
                pY={10}
                className="bg-pink-600 rounded-2xl text-white text-lg font-semibold no-underline mx-auto text-center"
                href='https://www.trckfi.com/auth/email-signin'
              >
                Complete Setup Today!
              </Button>
            </Section>

            <Section>
              <Text className="text-[15px] mt-0"><b>P/S:</b> Save time and connect as many accounts as you can. This will help YOU visualize your data better and have a personalized experience</Text>
              <Hr className="mt-8"/>
              <Text className="text-[18px] pt-[15px]"><strong>Step 2: Congrats, You're Committed to Make Money Moves!</strong></Text>
              <Text className="text-[15px] mt-0">Let's explore the platform together! We've broken it down into 7 bite-sized sections for you:</Text>
              
              <Text className="text-[15px]"><strong>1. Vision Board:</strong> This is your CREATIVE SPACE! Upload images and videos, write down notes, and find inspiration to visualize your financial goals.</Text>
              <Text className="text-[15px] mt-0">Being great at money is not just about numbers, it's also about mindset and motivation.</Text>
              <Img src="https://www.trckfi.com/assets/email/VisionBoard.png" alt="Visionboard" width="100%" />
              <Text className="text-[13px] mt-0 italic">*Exclusive for desktop: Make your money dates more effective and focused. Try it out!</Text>

              <Text className="text-[15px]"><strong>2. Dashboard:</strong> Here's where you'll find a quick snapshot of your finances, your cash flow: income, expenses, saving %, and also your net worth!</Text>
              <Text className="text-[15px] mt-0">To get a full picture of your finances, add all your connections. If you haven't connected everything, go to the account tab and connect your accounts.</Text>
              <Img src="https://www.trckfi.com/assets/email/Dashboard.png" alt="Dashboard" width="100%" />

              <Text className="text-[15px]"><strong>3. Transactions:</strong> Manage ALL your transactions in one place! Automatically pull your cash flow data.</Text>
              <Text className="text-[15px] mt-0">You can edit and relabel your transactions in a way that WORKS for YOU. Simply use the edit button and reorganize the data.</Text>
              <Img src="https://www.trckfi.com/assets/email/Transactions.png" alt="Transactions" width="100%" />

              <Text className="text-[15px]"><strong>4. Net Worth & Accounts:</strong> Track your Net Worth! This tab is also where you can adjust and connect any new accounts:</Text>
              <Text className="text-[13px] ml-[10px] my-0 mt-0">- new bank accounts</Text>
              <Text className="text-[13px] ml-[10px] my-0">- crypto coins investment</Text>
              <Text className="text-[13px] ml-[10px] my-0">- single stocks</Text>
              <Text className="text-[13px] ml-[10px] my-0">- and your retirement accounts</Text>
              <Text className="text-[15px]">Also add your home value and any other assets through manual flexible entry: e.i. car, art or even overseas account amounts</Text>
              <Text className="text-[15px] mt-0">Wait a minute, I don't see my Fidelity retirement connection. <b>What do I do next?</b></Text>
              <Text className="text-[15px] mt-0">Use the <b>+Stock button</b> to add your e.i. FXAIX shares from Fidelity - just check your fidelity account for the number of shares.</Text>
              <Text className="text-[15px] mt-0">This keeps track of your retirement investments, giving you a clear estimate of their value.</Text>
              <Img src="https://www.trckfi.com/assets/email/NetWorth.png" alt="NetWorth" width="100%" />
              <Text className="text-[13px] mt-0 italic">Update your Fidelity retirement shares monthly with the +Stock button to keep your data accurate as your contributions grow.</Text>

              <Text className="text-[15px]"><strong>5. Recurring Charges:</strong> Easily identify upcoming recurring expenses and discover hidden subscriptions you may not even be aware of!</Text>
              <Img src="https://www.trckfi.com/assets/email/RecurringCharges.png" alt="RecurringCharges"width="100%" />
              <Text className="text-[13px] mt-0 italic">P/S: To see recurring transactions, you first need to connect your accounts!</Text>

              <Text className="text-[15px]"><strong>6. Goals:</strong> Want to achieve your dreams? Start by setting your goals, specifying what you're saving for, your initial amount, your savings target, and the timeframe.</Text>
              <Text className="text-[15px] mt-0">Upload an image to keep your goal visual and manifest your financial dreams!</Text>
              <Img src="https://www.trckfi.com/assets/email/Goals.png" alt="Goals" width="100%" />

              <Text className="text-[15px]"><strong>7. Profile:</strong> Manage your subscription and invite collaborators to access your financial data. This is ideal for sharing financial visibility with your partner or financial coach.</Text>
              <Text className="text-[13px] ml-[10px] my-0 mt-0">- Adjust email and notification preferences</Text>
              <Text className="text-[13px] ml-[10px] my-0">- Invite a collaborator</Text>
              <Text className="text-[13px] ml-[10px] my-0">- Create custom rules for your convenience</Text>
              <Text className="text-[13px] ml-[10px] my-0">- Manage your subscription</Text>
              <Img src="https://www.trckfi.com/assets/email/ManageProfile.png" alt="ManageProfile" width="100%" />
              <Text className="text-[13px] mt-0 italic">* Remember, your subscription auto-renews post-trial. Manage it anytime in your profile!</Text>
            </Section>

            <Section className="my-[16px] mx-auto text-center">
              <Text className="text-[15px]"><b>Ready to make the most of your money in 2024?</b></Text>
              <Button
                pX={18}
                pY={10}
                className="bg-pink-600 rounded-2xl text-white text-lg font-semibold no-underline mx-auto text-center"
                href='https://www.trckfi.com/auth/email-signin'
              >
                Login
              </Button>
            </Section>

            <Section>
              <Text className="text-[15px]">Don't forget, your feedback shapes Trckfi! Any questions or need help? Our support team at support@trckfi.com is here for you</Text>
              <Text className="text-[15px]">Thanks for joining us! Together, we're going to transform the way we manage our finances.</Text>
            </Section>

            <Text className="text-black text-[15px] leading-[24px]">
              Love, <br/> Trckfi Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}