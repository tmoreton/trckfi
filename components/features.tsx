import {
    ArrowPathIcon,
    DevicePhoneMobileIcon,
    UsersIcon,
    FingerPrintIcon,
    LockClosedIcon,
    BuildingLibraryIcon,
    AdjustmentsHorizontalIcon,
    AtSymbolIcon
  } from '@heroicons/react/20/solid'
  import { Emoji } from 'emoji-picker-react';

  const features = [
    {
      name: 'At a glance',
      description: 'All of your accounts are in one dashboard',
      icon: DevicePhoneMobileIcon,
    },
    {
      name: 'Keep your personal data private',
      description: "Your data is never shared, sold or rented to outside companies.",
      icon: LockClosedIcon,
    },
    {
      name: '10,000+ available bank connections',
      description: 'Get real-time bank, loan, stock, crypto and many more updates on all of your accounts.',
      icon: BuildingLibraryIcon,
    },
    {
      name: 'Designed for security',
      description: 'With passwordless login & multi-factor authentication, your data is safe and secure.',
      icon: FingerPrintIcon,
    },
    {
      name: 'Shared access',
      description: "Ability to share access to a partner's data with their own unique login",
      icon: UsersIcon,
    },
    {
      name: 'Custom rules & reminders',
      description: 'Create custom rules to auto-categorize any new transactions.',
      icon: AdjustmentsHorizontalIcon,
    },
    {
      name: 'Keep track of recurring transactions',
      description: "Today everything is a monthly fee so it's easy to lose track of what your paying for. Well not anymore!",
      icon: ArrowPathIcon,
    },
    {
      name: 'Email Reminders',
      description: 'Get Monthly & Weekly email recaps to keep up to date with your finances without logging in.',
      icon: AtSymbolIcon,
    },
  ]
  
  export default function () {
    return (
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-base font-semibold leading-7 text-pink-600">Why Trckfi?</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex">Your Data, For Your Eyes Only <div className="ml-4"><Emoji unified={'1f440'} size={50} /></div></p>
            <p className="mt-6 text-lg leading-8 text-gray-900">
              Today with the average user having 10+ financial accounts with unique passwords for each, it's easy to lose track of your accounts or unknown transactions. With Trckfi, all of your accounts are in one simple and easy to read dashboard.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 text-gray-900 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <feature.icon className="absolute left-1 top-1 h-5 w-5 text-pink-600" aria-hidden="true" />
                  {feature.name}
                </dt>{' '}
                <dd>{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    )
  }
  