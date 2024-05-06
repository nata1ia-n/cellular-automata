import CellularAutomatonCanvas from "@/components/CellularAutomatonCanvas";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [generations, setGenerations] = useState<number[][]>([]);
  const [patternNumber, setPatternNumber] = useState<number>(218);
  const [generationsNumber, setGenerationsNumber] = useState<number>(50);

  const [loading, setLoading] = useState<boolean>(false);

  const getGenerations = async () => {
    const url = `http://localhost:8000/${patternNumber}/${generationsNumber}`;
    setLoading(true);
    try {
      const response = await axios.get(url);
      setGenerations(response.data["generations"]);
      console.log("🦙 response: ", response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatternNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPatternNumber(parseInt(event.target.value));
  };

  const handleGenerationsNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGenerationsNumber(parseInt(event.target.value));
  };

  console.log("pattern: ", patternNumber);
  console.log("generations: ", generationsNumber);

  return (
    <div className="flex flex-row items-center justify-center h-screen gap-40 w-screen overflow-auto">
      <div className="flex flex-col gap-5 items-center justify-center">
        <h1 className="text-xl text-center text-blue-600">
          Elementary Cellular Automata
        </h1>
        <div className="flex flex-row gap-2">
          <div className="flex flex-col">
            <label
              htmlFor="patternNumber"
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            >
              Pattern number
            </label>
            <input
              id="patternNumber"
              type="number"
              min={0}
              max={255}
              value={patternNumber}
              onChange={handlePatternNumberChange}
              className="border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="generationsNumber"
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            >
              Number of generations
            </label>
            <input
              id="generationsNumber"
              type="number"
              min={0}
              max={1000}
              value={generationsNumber}
              onChange={handleGenerationsNumberChange}
              className="border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>
        </div>
        <button
          onClick={getGenerations}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate"}
        </button>
        {generations.length > 0 && (
          <CellularAutomatonCanvas generations={generations} />
        )}
      </div>
    </div>
  );
}
