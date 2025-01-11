import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TradingViewWidget from "./TradingViewWidget";
import btcImg from "../assets/btc.png";
import ethImg from "../assets/eth.png"; // Add ETH image to assets

interface CryptoData {
  inr: number;
  inr_24h_change: number;
  usd: number;
  usd_24h_change: number;
}

const cryptoOptions = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", image: btcImg, rank: 1 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", image: ethImg, rank: 2 },
];

function Crypto(): JSX.Element {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();

  const [selectedCrypto, setSelectedCrypto] = useState(
    cryptoOptions.find((c) => c.id === token) || cryptoOptions[0]
  );
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);

  useEffect(() => {
    const cryptoFromUrl = cryptoOptions.find((c) => c.id === token);
    if (cryptoFromUrl) {
      setSelectedCrypto(cryptoFromUrl);
    } else {
      navigate("/bitcoin");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{
          [key: string]: CryptoData;
        }>(
          `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto.id}&vs_currencies=inr%2Cusd&include_24hr_change=true`
        );
        setCryptoData(response.data[selectedCrypto.id]);
      } catch (error) {}
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [selectedCrypto]);

  const handleCryptoChange = (cryptoId: string) => {
    navigate(`/${cryptoId}`);
  };

  return (
    <div className="bg-white h-max rounded-lg my-5 p-6">
      <select
        className="mb-4 p-2 border rounded"
        value={selectedCrypto.id}
        onChange={(e) => handleCryptoChange(e.target.value)}
      >
        {cryptoOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name} ({option.symbol})
          </option>
        ))}
      </select>

      <div className="flex items-center">
        <div>
          <img
            src={selectedCrypto.image}
            className="w-9"
            alt={selectedCrypto.name}
          />
        </div>
        <div className="text-2xl font-semibold text-[#0B1426] pl-2">
          {selectedCrypto.name}
        </div>
        <div className="text-sm text-[#5D667B] pl-2">
          {selectedCrypto.symbol}
        </div>
        <div className="bg-[#808A9D] px-3 py-2 text-white rounded-lg ml-7">
          Rank #{selectedCrypto.rank}
        </div>
      </div>

      {/* Rest of your component remains the same, just using selectedCrypto.name where needed */}
      <div className="mt-8 flex">
        <div>
          <div className="text-3xl font-semibold text-[#0B1426]">
            {(cryptoData && `$${cryptoData.usd}`) || `$66759`}
          </div>
          <div className="text-lg font-medium text-[#0B1426]">
            {(cryptoData && `₹ ${cryptoData.inr}`) || `₹ 5535287`}
          </div>
        </div>
        {/* Rest of your price display code... */}
      </div>
      <hr className="my-4" />
      <div className="lg:flex mb-4 justify-between">
        <div className="ls:text-lg text-sm font-semibold text-[#0B1426]">
          {selectedCrypto.name} Price Chart (USD)
        </div>
        {/* Rest of your time period buttons... */}
      </div>
      <div className="lg:h-[420px] h-[300px]">
        <TradingViewWidget symbol={`${selectedCrypto.symbol}USD`} />
      </div>
    </div>
  );
}

export default Crypto;
