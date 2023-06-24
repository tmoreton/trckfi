import LoginBtn from './login-btn'

export default function () {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center">
              Welcome! 🎉
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              You took the first step to a better understanding of your own finances
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 ">
              <LoginBtn />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
