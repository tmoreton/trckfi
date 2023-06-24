import LoginBtn from './login-btn'

export default function () {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center">
              My Dashboard! 📊
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Sign in or sign up to check your data!
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
