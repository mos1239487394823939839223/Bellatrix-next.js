import React, { useState, useEffect } from 'react';

const ImplementationStepper = ({ steps }) => {
  const [current, setCurrent] = useState(0);
  
  // Ensure steps is an array
  const safeSteps = Array.isArray(steps) ? steps : [];

  // Auto-progression functionality - runs automatically
  useEffect(() => {
    if (safeSteps.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % safeSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [safeSteps.length]);

  return (
    <div className="w-full">
      {/* Step indicators - Desktop */}
      <div className="hidden md:flex mb-20 relative">
        <div className="flex justify-between items-center w-full relative">
          {/* Progress bar */}
          <div className="absolute top-7 left-7 right-7 h-2 bg-gray-200 rounded-full z-0"></div>
          <div
            className="absolute top-7 left-7 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full z-0 transition-all duration-500 ease-in-out"
            style={{
              width: safeSteps.length > 1 ? `${7 + (current / (safeSteps.length - 1)) * (100 - 14)}%` : '7%',
            }}
          ></div>
          {/* Step circles */}
          {safeSteps.map((step, idx) => (
            <div key={idx} className="z-10 flex flex-col items-center relative">
              <button
                onClick={() => setCurrent(idx)}
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300 border-2 shadow-lg hover:scale-105
                  ${idx <= current 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-blue-200' 
                    : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                  }`}
              >
                {idx <= current ? (
                  <div className="text-white">{step.icon || (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}</div>
                ) : (
                  <span className="font-semibold">{idx + 1}</span>
                )}
              </button>
              <span
                className={`text-sm font-medium max-w-[140px] text-center transition-colors duration-300 leading-tight absolute top-16
                ${idx <= current ? 'text-blue-700' : 'text-gray-500'}`}
              >
                {typeof step.title === 'string'
                  ? step.title
                  : step.title?.title || step.title?.name || 'Step Title'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step indicators - Mobile */}
      <div className="flex md:hidden mb-6 overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex space-x-3">
          {safeSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg border text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center space-x-2
                ${idx === current 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
            >
              <span className="text-xs">{idx + 1}</span>
              <span>
                {typeof step.title === 'string'
                  ? step.title
                  : step.title?.title || step.title?.name || 'Step Title'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
          <div className="lg:w-2/5">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              {safeSteps[current]?.title || 'Step Title'}
            </h3>
            <p className="text-lg font-medium text-gray-700 mb-6">
              {safeSteps[current]?.desc || 'Step description'}
            </p>
            
            {/* Key Benefits */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Key Deliverables</h4>
              <div className="grid grid-cols-2 gap-2">
                {(safeSteps[current]?.benefits || []).map((benefit, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation controls - Desktop */}
            <div className="hidden md:flex mt-6">
              <button
                type="button"
                aria-label="Previous step"
                onClick={() => setCurrent((prev) => Math.max(0, prev - 1))}
                disabled={current === 0}
                className={`mr-3 p-3 rounded-full border-2 transition-all duration-200 ${
                  current === 0 
                    ? 'text-gray-300 border-gray-200 cursor-not-allowed' 
                    : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next step"
                onClick={() => setCurrent((prev) => Math.min(steps.length - 1, prev + 1))}
                disabled={current === steps.length - 1}
                className={`p-3 rounded-full border-2 transition-all duration-200 ${
                  current === steps.length - 1 
                    ? 'text-gray-300 border-gray-200 cursor-not-allowed' 
                    : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="lg:w-3/5">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Implementation Details</h4>
              <p className="text-gray-700 leading-relaxed mb-6">
                {typeof safeSteps[current]?.details === 'string'
                  ? safeSteps[current]?.details
                  : safeSteps[current]?.details?.details || safeSteps[current]?.description || 'Step Details'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center text-blue-600 mb-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-medium">Efficient</span>
                  </div>
                  <p className="text-sm text-gray-600">Streamlined process with proven methodologies</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center text-green-700 mb-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Proven</span>
                  </div>
                  <p className="text-sm text-gray-600">Tested methodology with 98% success rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation controls */}
      <div className="flex justify-center mt-6 md:hidden">
        <button
                type="button"
                aria-label="Previous step"
          onClick={() => setCurrent((prev) => Math.max(0, prev - 1))}
          disabled={current === 0}
          className={`mr-3 p-3 rounded-full border-2 transition-all duration-200 ${
            current === 0 
              ? 'text-gray-300 border-gray-200 cursor-not-allowed' 
              : 'text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="flex items-center px-3 sm:px-4 text-sm text-gray-500 font-medium whitespace-nowrap" aria-live="polite">
          {current + 1} of {steps.length}
        </span>
        <button
                type="button"
                aria-label="Next step"
          onClick={() => setCurrent((prev) => Math.min(steps.length - 1, prev + 1))}
          disabled={current === steps.length - 1}
          className={`p-3 rounded-full border-2 transition-all duration-200 ${
            current === steps.length - 1 
              ? 'text-gray-300 border-gray-200 cursor-not-allowed' 
              : 'text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImplementationStepper;
