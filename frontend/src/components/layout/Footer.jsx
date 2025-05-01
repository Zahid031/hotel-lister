// src/components/layout/Footer.jsx
const Footer = () => {
    return (
      <footer className="bg-white dark:bg-gray-800 shadow-inner mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Simple Hotel Lister. All rights reserved.
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;