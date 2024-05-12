import CellularAutomatonCanvas from "@/components/CellularAutomatonCanvas";
import Popup from "@/components/Popup";
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

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
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

  const getPattern = async () => {
    const url = `http://localhost:8000/${patternNumber}`;
    try {
      const response = await axios.get(url);
      const rules = response.data["rules"];
      setRulePatterns(rules);
      setIsPopupOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setRulePatterns(null);
  };

  return (
    <div className="flex flex-row items-center justify-center h-screen gap-20 w-screen overflow-auto">
      <div className="flex flex-col gap-5 items-center w-full justify-center">
        <h1 className="text-xl text-center text-blue-600">
          Elementary Cellular Automata
        </h1>
        <form className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
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
            <div className="w-full md:w-1/2 px-3">
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
        <div className="flex flex-row gap-5">
          <button
            onClick={getGenerations}
            className={` ${
              disableButton ? "bg-gray-300 " : "bg-blue-500 hover:bg-blue-700"
            }  text-white font-bold py-2 px-4 rounded-full`}
            disabled={disableButton}
          >
            {loading ? "Loading..." : "Generate"}
          </button>
          <button
            onClick={getPattern}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full"
          >
            Rules
          </button>
        </div>
        {generations.length > 0 && (
          <CellularAutomatonCanvas generations={generations} />
        )}
        {isPopupOpen && rulePatterns && (
          <Popup
            patterns={rulePatterns}
            onClose={closePopup}
            rule={patternNumber}
          />
        )}
      </div>
    </div>
  );
}
