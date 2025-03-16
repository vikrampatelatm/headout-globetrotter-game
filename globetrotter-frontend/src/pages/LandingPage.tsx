import { Link } from "react-router-dom";
import backGround from "../assets/Background.mp4";
import Header from "../components/Header";

const LandingPage = () => {
  return (
    <>
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={backGround}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-white text-center z-10">
          <p className="text-5xl  max-w-3xl mb-8 leading-snug drop-shadow-lg tracking-wide">
            Guess famous destinations and challenge your friends!
          </p>
          <Link to="/play">
            <button className="px-8 py-4 text-lg border border-white text-white font-bold rounded-lg shadow-lg transition hover:bg-white hover:text-black">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
