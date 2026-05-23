export default function Footer() {
  return (
    <footer className='bg-card border-t border-border px-8 py-10 mt-20'>
      <div className='grid grid-cols-4 gap-8 mb-8'>
        <div>
          <h3 className='text-xl font-bold mb-4'>EduFlow</h3>
          <p className='text-gray-400'>
            Premium online learning platform
          </p>
        </div>

        <div>
          <h4 className='font-bold mb-4'>Product</h4>
          <ul className='space-y-2 text-gray-400'>
            <li className='hover:text-primary transition cursor-pointer'>
              Features
            </li>
            <li className='hover:text-primary transition cursor-pointer'>
              Pricing
            </li>
            <li className='hover:text-primary transition cursor-pointer'>
              Security
            </li>
          </ul>
        </div>

        <div>
          <h4 className='font-bold mb-4'>Company</h4>
          <ul className='space-y-2 text-gray-400'>
            <li className='hover:text-primary transition cursor-pointer'>
              About
            </li>
            <li className='hover:text-primary transition cursor-pointer'>
              Blog
            </li>
            <li className='hover:text-primary transition cursor-pointer'>
              Contact
            </li>
          </ul>
        </div>

        <div>
          <h4 className='font-bold mb-4'>Legal</h4>
          <ul className='space-y-2 text-gray-400'>
            <li className='hover:text-primary transition cursor-pointer'>
              Privacy
            </li>
            <li className='hover:text-primary transition cursor-pointer'>
              Terms
            </li>
            <li className='hover:text-primary transition cursor-pointer'>
              Cookies
            </li>
          </ul>
        </div>
      </div>

      <div className='border-t border-border pt-8 text-center text-gray-400'>
        <p>&copy; 2024 EduFlow. All rights reserved.</p>
      </div>
    </footer>
  );
}