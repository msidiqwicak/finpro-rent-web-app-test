export default function Footer() {
  return (
    <footer className="bg-surface-container-low dark:bg-surface-container-highest py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[var(--spacing-container-max)] mx-auto">
        <div className="space-y-4">
          <span className="text-headline-sm font-headline-sm text-primary dark:text-primary-fixed">Evergreen Escapes</span>
          <p className="font-body-md text-body-md font-caption text-caption text-on-surface-variant dark:text-on-tertiary-container">
            © {new Date().getFullYear()} Evergreen Escapes. All rights reserved.
          </p>
        </div>
        
        <div className="col-span-1 md:col-span-2 flex flex-wrap gap-x-8 gap-y-4 md:justify-end items-center">
          <a href="#" className="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed underline transition-all duration-300 font-body-md text-body-md font-caption text-caption">Legal</a>
          <a href="#" className="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed underline transition-all duration-300 font-body-md text-body-md font-caption text-caption">Company</a>
          <a href="#" className="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed underline transition-all duration-300 font-body-md text-body-md font-caption text-caption">Privacy Policy</a>
          <a href="#" className="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed underline transition-all duration-300 font-body-md text-body-md font-caption text-caption">Terms of Service</a>
          <a href="#" className="text-on-surface-variant dark:text-on-tertiary-container hover:text-primary dark:hover:text-primary-fixed underline transition-all duration-300 font-body-md text-body-md font-caption text-caption">Contact</a>
        </div>
      </div>
    </footer>
  );
}
