import { useState, useEffect, useContext } from "react";
import { registerUser, fetchUserScore } from "../services/userService";
import { GameContext } from "../context/GameContext";

const ChallengeFriend = () => {
  const { score } = useContext(GameContext)!;
  const [username, setUsername] = useState("");
  const [inviter, setInviter] = useState<string | null>(null);
  const [inviterScore, setInviterScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviterFromUrl = params.get("inviter");

    if (inviterFromUrl) {
      setInviter(inviterFromUrl);
      handleFetchScore(inviterFromUrl);
    }
  }, []);

  const handleRegister = async () => {
    try {
      await registerUser(username, score);
      setInviter(username);
      setError(null);
      handleFetchScore(username);
      generateImage(username, score);
    } catch (err) {
      setError("Username already taken or registration failed. " + err);
    }
  };

  const handleFetchScore = async (user: string) => {
    try {
      const userScore = await fetchUserScore(user);
      setInviterScore(userScore);
      generateImage(user, userScore);
    } catch (err) {
      setError("Failed to fetch score. " + err);
    }
  };

  const generateInviteLink = () => {
    return `${window.location.origin}/play?inviter=${inviter}`;
  };

  const generateImage = (user: string, score: number) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 300;
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000";
    ctx.font = "24px Arial";
    ctx.fillText(`🔥 ${user} is challenging you!`, 50, 100);
    ctx.fillText(`Score: ${score}`, 50, 150);
    ctx.fillText("Can you beat them?", 50, 200);
    
    const image = canvas.toDataURL("image/png");
    setImageUrl(image);
  };

  const handleShareInvite = () => {
    if (!inviter) return;
    const inviteMessage = `🔥 Join me in The Globetrotter Challenge! My score: ${inviterScore}. Play now: ${generateInviteLink()}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteMessage)}`;
    window.open(whatsappUrl);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-3 px-6 bg-orange-500 text-white shadow-md border-2 border-black rounded-xl text-lg transition hover:bg-orange-600"
      >
        Challenge Friend
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] text-center">
            <h2 className="text-2xl font-bold mb-4">Challenge a Friend</h2>

            {!inviter ? (
              <>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="p-2 w-full border rounded mb-4"
                />
                <button
                  onClick={handleRegister}
                  className="p-3 px-6 bg-orange-500 text-white shadow-md border-2 border-black rounded-xl text-lg transition hover:bg-orange-600"
                >
                  Register & Challenge
                </button>
              </>
            ) : (
              <>
                <p className="mt-2 text-lg">Invited by: <b>{inviter}</b></p>
                {inviterScore !== null && <p className="mt-2 text-lg">Their Score: {inviterScore}</p>}
                {imageUrl && <img src={imageUrl} alt="Invite Preview" className="mt-4 w-full rounded-lg border shadow-md" />}
                <button
                  onClick={handleShareInvite}
                  className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg"
                >
                  Share Challenge
                </button>
              </>
            )}

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 ml-5 px-8 py-3 bg-orange-500 text-white text-lg font-semibold rounded-xl transition hover:bg-orange-600 shadow-md border-2 border-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeFriend;
