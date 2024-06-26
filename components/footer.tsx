import Link from 'next/link'
import { social_icons } from '../components/social-icons'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Privacy', href: '/privacy-policy' },
  { name: 'Terms', href: '/terms-of-use' },
]

const Footer = () => {
  return (
    <footer>
      <div className="mx-auto max-w-7xl overflow-hidden px-6 pt-20 pb-8">
        <Link href='/'>
          <svg className="h-10 w-auto mx-auto h-10 w-auto mb-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="75" height="75" ><path fill="#db2777" d="M400 96l0 .7c-5.3-.4-10.6-.7-16-.7H256c-16.5 0-32.5 2.1-47.8 6c-.1-2-.2-4-.2-6c0-53 43-96 96-96s96 43 96 96zm-16 32c3.5 0 7 .1 10.4 .3c4.2 .3 8.4 .7 12.6 1.3C424.6 109.1 450.8 96 480 96h32l-18.8 75.1c15.8 14.8 28.7 32.8 37.5 52.9H544c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32H512c-9.1 12.1-19.9 22.9-32 32v64c0 17.7-14.3 32-32 32H416c-17.7 0-32-14.3-32-32V448H256v32c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V416c-34.9-26.2-58.7-66.3-63.2-112H68c-37.6 0-68-30.4-68-68s30.4-68 68-68h4c13.3 0 24 10.7 24 24s-10.7 24-24 24H68c-11 0-20 9-20 20s9 20 20 20H99.2c12.1-59.8 57.7-107.5 116.3-122.8c12.9-3.4 26.5-5.2 40.5-5.2H384zm64 136c0-13.3-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24s24-10.7 24-24z"/></svg>
        </Link>
        <nav className="flex justify-between columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex space-x-6 justify-center py-4">
          {social_icons.map((item) => (
            <a key={item.name} href={item.href} target="_blank" className="text-pink-600 hover:text-pink-500">
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-8 w-8" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="text-center text-xs leading-5 text-gray-500">
          &copy; 2023 Trckfi, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer