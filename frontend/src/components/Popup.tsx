import React from "react";

interface PopupProps {
  patterns: Record<number, number>;
  onClose: () => void;
  rule: number;
}

const Popup: React.FC<PopupProps> = ({ patterns, onClose, rule }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          className="absolute top-1 right-3 text-xl text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="text-lg text-center font-bold mb-5">Rule {rule}</div>
        <div className="grid grid-cols-4 gap-6">
          {Object.entries(patterns).map(([ruleNumber, output]) => {
            const binaryRule = (+ruleNumber).toString(2).padStart(3, "0");
            const ruleCells = binaryRule
              .split("")
              .map((bit, index) => (
                <div
                  key={`ruleCell-${index}`}
                  className={`w-8 h-8 mr-1 ${
                    bit === "1" ? "bg-black" : "bg-white "
                  } border border-gray-300`}
                />
              ));
            const outputCell = (
              <div
                key={`outputCell-${ruleNumber}`}
                className={`w-8 h-8 mr-1 ${
                  output === 1 ? "bg-black" : "bg-white"
                } border border-gray-300`}
              />
            );
            return (
              <div
                key={`ruleRow-${ruleNumber}`}
                className="flex flex-col items-center"
              >
                <div className="flex">{ruleCells}</div>
                <div className="mt-2">{outputCell}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Popup;
