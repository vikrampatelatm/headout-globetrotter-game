import { Link } from "react-router-dom";
import Logo from "../assets/Logo.svg";

const Header = () => {
  return (
    <header className="p-4 flex items-center justify-between absolute top-0 left-0 w-full z-20">
      {/* Left: Logo shifted slightly right */}
      <Link to="/" className="ml-6">
        <img 
          src={Logo} 
          alt="Globetrotter Logo" 
          className="h-12 cursor-pointer filter brightness-0 invert"
        />
      </Link>

      {/* Right: Transparent Buttons with Spacing */}
      <div className="flex items-center space-x-8 mr-6">
        <button className="text-white font-medium hover:underline">
          English / INR
        </button>
        <button className="text-white font-medium hover:underline">
          Help ?
        </button>
        <button className="text-white font-medium hover:underline">
          Sign In
        </button>
      </div>
    </header>
  );
};

export default Header;
