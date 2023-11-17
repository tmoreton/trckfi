import Icon from './icon';
import ConfettiExplosion from 'react-confetti-explosion'

export default function ({ email, text, active }) {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
        <div className="sm:mx-auto sm:w-full mb-4">
          <Icon />
          <div className="mx-auto pt-4 max-w-2xl text-center space-y-3">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight md:leading-none mb-4">
              {text}
            </h1>
            { active &&
              <>
                <p className="text-md text-gray-600">
                  A magic sign-in link has been sent to your email: <span className="text-lg font-semibold text-gray-900">{email}</span>
                </p>
                <p className="mt-6 text-base leading-7 text-gray-600">Having trouble logging in?</p>
                <div className="mt-1 flex items-center justify-center gap-x-6">
                  <a href="mailto:support@trckfi.com" className="text-sm font-semibold text-gray-900">
                    Contact support <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </>
            }
            <ConfettiExplosion />
          </div>
        </div>
      </div>
    </main>
  )
}
