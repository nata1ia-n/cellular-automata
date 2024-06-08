import React from "react";

interface PopupProps {
  patterns: Record<number, number>;
}

const Popup: React.FC<PopupProps> = ({ patterns }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-lg w-full">
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(patterns).map(([ruleNumber, output]) => {
          const binaryRule = (+ruleNumber).toString(2).padStart(3, "0");
          const ruleCells = binaryRule
            .split("")
            .map((bit, index) => (
              <div
                key={`ruleCell-${index}`}
                className={`w-5 h-5 mr-1 ${
                  bit === "1" ? "bg-black" : "bg-white "
                } border border-gray-300`}
              />
            ));
          const outputCell = (
            <div
              key={`outputCell-${ruleNumber}`}
              className={`w-5 h-5 mr-1 ${
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
  );
};

export default Popup;
