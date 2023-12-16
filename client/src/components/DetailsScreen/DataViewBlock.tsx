import { useState } from "react";

export function DataViewBlock({
    title,
    value,
    showBorder = false,
    helperText,
  }: {
    title: string;
    value: string;
    showBorder?: boolean;
    helperText?: string;
  }) {
    const [showHelper, setShowHelper] = useState(false);
  
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
    return (
      <div
        className={`flex ${
          showBorder ? "border-r-2" : ""
        } border-[#dad3ff] border-b-2 p-3 `}
      >
        <div className="w-full relative text-black ">
          <div
            onMouseMove={(e) => {
              setMousePosition({ x: e.clientX, y: e.clientY });
            }}
            onMouseEnter={() => {
              setShowHelper(true);
            }}
            onMouseLeave={() => {
              setShowHelper(false);
            }}
            className="w-fit hover:cursor-help"
          >
            {title}
            {showHelper && (
              <div
                style={{
                  left: mousePosition.x,
                  top: mousePosition.y,
                  position: "fixed",
                }}
                className=" m-8 inset-0 text-black font-medium bg-white  border-2 p-3 w-fit h-fit rounded-md z-50"
              >
                {helperText}
              </div>
            )}
          </div>
        </div>
        <div className="w-full text-blue-600 truncate">{value}</div>
      </div>
    );
  }