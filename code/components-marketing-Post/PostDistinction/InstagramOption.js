import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import { HiCheckCircle } from 'react-icons/hi';
import { INSTA_ICONS } from "./constants";
import { DEFAULT_SETTINGS } from "@/components/Admin/BoostSettings/constants";

const INSTA_OPTS = [
  { key: "story", label: "ستوري" }, 
  { key: "post", label: "بوست" },
  { key: "reel", label: "ريلز" },
];

const InstagramOption = ({ selected, onSelect }) => {
  const instagramSettings = DEFAULT_SETTINGS.instagram;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-100">
          <FaInstagram className="text-white text-3xl" />
        </div>
        <div>
          <h4 className="text-xl font-black text-gray-800">
            {instagramSettings.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-sm text-gray-500 font-medium">
              {instagramSettings.description}
            </p>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {INSTA_OPTS
          .filter(opt => instagramSettings[opt.key]?.enabled)
          .map(({ key, label }) => {
            const isSelected = selected.includes(key);
            const price = instagramSettings[key]?.price || 0;

            return (
              <div
                key={key}
                onClick={() => onSelect(key)}
                className={`relative overflow-hidden group border-2 p-5 rounded-2xl flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-orange-500 bg-orange-50/50 ring-4 ring-orange-50"
                    : "border-gray-100 hover:border-orange-200 hover:bg-gray-50/50"
                }`}
              >
                {/* Check icon */}
                {isSelected && (
                  <HiCheckCircle className="absolute top-2 left-2 text-orange-500 text-xl" />
                )}

                {/* Icon */}
                <div
                  className={`text-3xl transition-transform duration-300 ${
                    isSelected
                      ? "scale-110"
                      : "group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
                  }`}
                >
                  {INSTA_ICONS[key]}
                </div>

                {/* Label + Price */}
                <div className="text-center">
                  <span
                    className={`block font-bold text-sm mb-1 ${
                      isSelected ? "text-orange-700" : "text-gray-600"
                    }`}
                  >
                    {label}
                  </span>

                  <div className="flex items-baseline justify-center gap-0.5">
                    <span
                      className={`font-sans text-lg font-black ${
                        isSelected ? "text-orange-600" : "text-gray-900"
                      }`}
                    >
                      {price}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      د.ك
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default InstagramOption;