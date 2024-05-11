import CellularAutomatonCanvas from "@/components/CellularAutomatonCanvas";
import { apiRequestBodySchema } from "@/utils/types";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [generations, setGenerations] = useState<number[][]>([]);
  const [patternNumber, setPatternNumber] = useState<number>(218);
  const [generationsNumber, setGenerationsNumber] = useState<number>(50);

  const [loading, setLoading] = useState<boolean>(false);

  const [patternError, setPatternError] = useState<string>("");
  const [generationsError, setGenerationsError] = useState<string>("");

  const disableButton = loading || !!patternError || !!generationsError;

  const handlePatternNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value);
    setPatternNumber(value);
    validatePatternNumber(value);
  };

  const handleGenerationsNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value);
    setGenerationsNumber(value);
    validateGenerationsNumber(value);
  };

  const validatePatternNumber = (value: number) => {
    const validationResult = apiRequestBodySchema
      .partial()
      .pick({ pattern_number: true })
      .safeParse({ pattern_number: value });
    if (!validationResult.success) {
      setPatternError(validationResult.error.errors[0].message);
    } else {
      setPatternError("");
    }
  };

  const validateGenerationsNumber = (value: number) => {
    const validationResult = apiRequestBodySchema
      .partial()
      .pick({ generations_number: true })
      .safeParse({ generations_number: value });
    if (!validationResult.success) {
      setGenerationsError(validationResult.error.errors[0].message);
    } else {
      setGenerationsError("");
    }
  };

  const getGenerations = async () => {
    validatePatternNumber(patternNumber);
    validateGenerationsNumber(generationsNumber);

    if (!patternError && !generationsError) {
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
    }
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
            <div className="input-container">
              <input
                id="patternNumber"
                type="number"
                min={0}
                max={255}
                value={patternNumber}
                onChange={handlePatternNumberChange}
                className={`border-2 rounded w-full py-2 px-4 text-gray-700 focus:outline-none ${
                  patternError ? "border-red-500" : "border-gray-200"
                }`}
              />
              {patternError && (
                <div className="text-red-500 text-xs mt-1">{patternError}</div>
              )}
            </div>
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
              className={`border-2 rounded w-full py-2 px-4 text-gray-700 focus:outline-none ${
                generationsError ? "border-red-500" : "border-gray-200"
              }`}
            />
            {generationsError && (
              <div className="text-red-500 text-xs mt-1">
                {generationsError}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={getGenerations}
          className={` ${
            disableButton ? "bg-gray-300 " : "bg-blue-500 hover:bg-blue-700"
          }  text-white font-bold py-2 px-4 rounded-full`}
          disabled={disableButton}
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
