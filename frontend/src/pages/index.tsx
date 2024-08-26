import CellularAutomatonCanvas from "@/components/CellularAutomatonCanvas";
import Rules from "@/components/Rules";
import { apiRequestBodySchema } from "@/utils/types";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [generations, setGenerations] = useState<number[][]>([]);
  const [patternNumber, setPatternNumber] = useState<number>(90);
  const [generationsNumber, setGenerationsNumber] = useState<number>(50);

  const [loading, setLoading] = useState<boolean>(false);

  const [patternError, setPatternError] = useState<string>("");
  const [generationsError, setGenerationsError] = useState<string>("");

  const [initialGeneration, setInitialGeneration] = useState<number>(0);

  const [rulePatterns, setRulePatterns] = useState<Record<
    number,
    number
  > | null>(null);

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

  const handleInitialGenerationChoice = (index: number) => {
    setInitialGeneration(index);
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

  const getPattern = async (pattern: number) => {
    const url = `http://localhost:8000/${pattern}`;
    try {
      const response = await axios.get(url);
      const rules = response.data["rules"];
      setRulePatterns(rules);
    } catch (error) {
      console.log(error);
    }
  };

  const generateResults = async () => {
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
    getPattern(patternNumber);
  };

  return (
    <div className="flex flex-row items-center justify-center min-h-screen w-screen overflow-auto">
      <div className="flex flex-col gap-3 items-center w-full justify-center mt-1">
        <h1 className="text-xl text-center text-blue-600">
          Elementary Cellular Automata
        </h1>
        <form className="w-full max-w-xl">
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 md:mb-0 text-center">
              <label
                htmlFor="patternNumber"
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
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
                className={`border-2 block leading-tight rounded w-full py-2 px-4 text-gray-700 focus:outline-none ${
                  patternError ? "border-red-500" : "border-gray-200"
                }`}
              />
              <div className="error-message absolute text-red-500 text-xs mt-1">
                {patternError}
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3 text-center">
              <label
                htmlFor="generationsNumber"
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
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
                className={`border-2 block leading-tight rounded w-full py-2 px-4 text-gray-700 focus:outline-none ${
                  generationsError ? "border-red-500" : "border-gray-200"
                }`}
              />
              <div className="error-message absolute text-red-500 text-xs mt-1">
                {generationsError}
              </div>
            </div>
          </div>
        </form>
        <div className="flex w-full items-center justify-center max-w-xl">
          <div className="flex flex-col w-1/2 items-center justify-center">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Initial generation
            </label>
            <div className="flex w-full gap-2">
              <div
                onClick={() => handleInitialGenerationChoice(0)}
                className={`cursor-pointer py-1 px-8 border-2 rounded-lg ${
                  initialGeneration === 0
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                Single cell
              </div>
              <div
                onClick={() => handleInitialGenerationChoice(1)}
                className={`cursor-pointer py-1 px-8 border-2 rounded-lg ${
                  initialGeneration === 1
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                Random
              </div>
            </div>
          </div>
          <div className="flex w-1/2 justify-center">
            <button
              onClick={generateResults}
              className={` ${
                disableButton ? "bg-gray-300 " : "bg-blue-500 hover:bg-blue-700"
              }  text-white font-bold py-3 px-5 rounded-full`}
              disabled={disableButton}
            >
              {loading ? "Loading..." : "Generate"}
            </button>
          </div>
        </div>
        {generations.length > 0 && rulePatterns && (
          <>
            <Rules
              patterns={rulePatterns}
              setPatternNumber={setPatternNumber}
              setRulePatterns={setRulePatterns}
            />
            <CellularAutomatonCanvas generations={generations} />
          </>
        )}
      </div>
    </div>
  );
}
