import Container from './container'
import { EXAMPLE_PATH } from '../lib/constants'
import Newsletter from './newsletter'

const Footer = () => {
  return (
    <footer>
      <Newsletter />
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          <div className="pb-6">
            <a href='/' className="text-sm leading-6 text-gray-600 hover:text-gray-900">
              Home
            </a>
          </div>
          <div className="pb-6">
            <a href='/blog' className="text-sm leading-6 text-gray-600 hover:text-gray-900">
              Blog
            </a>
          </div>
        </nav>
        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; 2023 Trckfi, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
