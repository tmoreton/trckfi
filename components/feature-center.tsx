import { TagIcon, FolderArrowDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Emoji } from 'emoji-picker-react'

const features = [
  {
    name: 'Custom Categories',
    description: 'Multiple levels of categorization with Emoji support & search',
    icon: TagIcon,
  },
  {
    name: 'Searchable.',
    description: 'Quick & easy access to combine various search criteria',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Download CSV',
    description: 'Create custom search datasets and download your data anytime',
    icon: FolderArrowDownIcon,
  },
]

// const features = [
//   {
//     name: 'Custom Categories',
//     description: 'Multiple levels of categorization with Emoji support & search',
//     icon: TagIcon,
//   },
//   {
//     name: 'Searchable.',
//     description: 'Quick & easy access to combine various search criteria',
//     icon: MagnifyingGlassIcon,
//   },
//   {
//     name: 'Download CSV',
//     description: 'Create custom search datasets and download your data anytime',
//     icon: FolderArrowDownIcon,
//   },
// ]

export default function () {
  return (
    <div className="mt-32 mb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-pink-600">Visualize your future</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Customizable Visionboard</p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Customize every aspect of the screen with stickers, emojis, images, videos and much more to visualize the financial future you see for yourself!
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <img
            src="/assets/visionboard.jpg"
            alt="Vision Board"
            className="mb-[-20%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            width={2432}
            height={1442}
          />
          <div className="relative" aria-hidden="true">
            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
          </div>
        </div>
      </div>
      {/* <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
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
      </div> */}
    </div>
  )
}

// <div className="mt-32 mb-32">
//   <div className="mx-auto max-w-7xl px-6 lg:px-8">
//     <div className="mx-auto max-w-2xl sm:text-center">
//       <h2 className="text-base font-semibold leading-7 text-pink-600">Your data, how you need it</h2>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex"><div className="mr-3 mt-1"><Emoji unified={'1f50d'} size={30} /></div> Customizable Search & Categorization</p>
//       <p className="mt-6 text-lg leading-8 text-gray-600">
//         With custom rules and the ability to download your data at anytime, you can really track how much money is coming in & out.
//       </p>
//     </div>
//   </div>
//   <div className="relative overflow-hidden pt-16">
//     <div className="mx-auto max-w-7xl px-6 lg:px-8">
//       <img
//         src="/assets/visionboard.jpg"
//         alt="Vision Board"
//         className="mb-[-20%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
//         width={2432}
//         height={1442}
//       />
//       <div className="relative" aria-hidden="true">
//         <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
//       </div>
//     </div>
//   </div>
//   <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
//     <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
//       {features.map((feature) => (
//         <div key={feature.name} className="relative pl-9">
//           <dt className="inline font-semibold text-gray-900">
//             <feature.icon className="absolute left-1 top-1 h-5 w-5 text-pink-600" aria-hidden="true" />
//             {feature.name}
//           </dt>{' '}
//           <dd>{feature.description}</dd>
//         </div>
//       ))}
//     </dl>
//   </div>
// </div>