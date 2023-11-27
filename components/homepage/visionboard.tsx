import Image from 'next/image'

export default function () {
  return (
    <div className="my-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl sm:text-center">
          <h2 className="text-3xl font-bold leading-7 text-pink-600 my-6">Visualize your future</h2>
          <p className="mt-2 font-semibold tracking-tight text-gray-900 text-3xl">Experience your finances stress free by visualizing goals</p>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            Customize every aspect of the screen with stickers, emojis, images, videos and much more to visualize the financial future you see for yourself!
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Image
            src="/assets/visionboard.png"
            alt="Vision Board"
            className="w-full"
            width={2432}
            height={1442}
            unoptimized={true}
          />
        </div>
      </div>
    </div>
  )
}