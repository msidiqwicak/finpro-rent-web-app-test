import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-surface/80 dark:bg-surface-container/80 backdrop-blur-md shadow-sm dark:shadow-none docked full-width top-0 sticky z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop h-20 max-w-[var(--spacing-container-max)] mx-auto">
        <Link to="/" className="text-headline-sm font-headline-sm text-primary dark:text-primary-fixed tracking-tight">
          Evergreen Escapes
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/search" className="text-primary dark:text-primary-fixed font-bold border-b-2 border-primary dark:border-primary-fixed pb-1 font-body-md text-body-md font-label-md text-label-md hover:text-primary dark:hover:text-primary-fixed transition-colors">
            Find Stays
          </Link>
          <Link to="/sustainability" className="text-on-surface-variant dark:text-on-tertiary-container font-body-md text-body-md font-label-md text-label-md hover:text-primary dark:hover:text-primary-fixed transition-colors">
            Sustainability
          </Link>
          <Link to="/about" className="text-on-surface-variant dark:text-on-tertiary-container font-body-md text-body-md font-label-md text-label-md hover:text-primary dark:hover:text-primary-fixed transition-colors">
            About Us
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/tenant/register" className="hidden md:block bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-label-md text-label-md hover:shadow-md transition-all">
            Host Your Eco-Stay
          </Link>
          <Link to="/login" aria-label="Profile" className="p-2 text-primary hover:bg-surface-container rounded-full transition-colors flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
