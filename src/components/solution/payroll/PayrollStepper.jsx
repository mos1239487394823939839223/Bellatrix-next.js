import React, { useState, useEffect, useMemo } from "react";
import { staticContent } from "../../../services/StaticContentRepository";




const PayrollStepper = ({ steps = [], title, description }) => {

  const [current, setCurrent] = useState(0);

  const [defaultData, setDefaultData] = useState(null);



  // Static default data for immediate display

  const staticDefaultData = {

    title: "Streamlined Payroll Workflow",

    description: "Follow our step-by-step process to automate your entire payroll lifecycle efficiently",

    steps: [

      {

        title: "Employee Data Import",

        stepTitle: "Employee Data Import",

        description: "Easily onboard and manage employee records in one place.",

        stepDescription: "Import employee data from spreadsheets or integrated HR systems. Supports bulk uploads and data validation with real-time error checking.",

        features: [

          "Bulk import from Excel/CSV",

          "Data validation",

          "Duplicate detection",

          "HR system integration"

        ],

        automated: "Reduces manual work by 80%",

        compliant: "Built-in regulatory compliance"

      },

      {

        title: "Time & Attendance Sync",

        stepTitle: "Time & Attendance Sync",

        description: "Integrate timesheets and attendance for accurate payroll.",

        stepDescription: "Syncs with your time tracking tools to ensure accurate hours and leave data for every employee. Supports multiple time tracking systems.",

        features: [

          "Real-time sync",

          "Multiple time systems",

          "Leave management",

          "Overtime calculation"

        ],

        automated: "Automated time tracking integration",

        compliant: "Accurate compliance reporting"

      },

      {

        title: "Salary & Tax Calculation",

        stepTitle: "Salary & Tax Auto-Calculation",

        description: "Automate salary, tax, and deduction calculations.",

        stepDescription: "Calculates gross and net pay, taxes, and deductions automatically based on your rules and local compliance. Handles complex tax scenarios.",

        features: [

          "Auto tax calculation",

          "Compliance built-in",

          "Deduction management",

          "Bonus processing"

        ],

        automated: "100% automated calculations",

        compliant: "Tax law compliance guaranteed"

      },

      {

        title: "Approval Workflows",

        stepTitle: "Approval Workflows",

        description: "Streamline approvals with role-based access.",

        stepDescription: "Multi-level approval flows for payroll runs, with notifications and audit trails. Customizable approval hierarchies.",

        features: [

          "Multi-level approval",

          "Email notifications",

          "Audit trails",

          "Role-based access"

        ],

        automated: "Automated approval routing",

        compliant: "Complete audit trail"

      },

      {

        title: "Payment Execution",

        stepTitle: "Payment Execution",

        description: "Execute payments securely through integrated bank APIs.",

        stepDescription: "Initiate salary payments directly from the platform with secure, bank-level integrations. Supports multiple payment methods.",

        features: [

          "Bank API integration",

          "Multiple payment methods",

          "Secure transactions",

          "Payment tracking"

        ],

        automated: "One-click payment processing",

        compliant: "Bank-level security compliance"

      },

      {

        title: "Payslip & Reporting",

        stepTitle: "Payslip Generation & Reporting",

        description: "Generate payslips and compliance-ready reports instantly.",

        stepDescription: "Employees get digital payslips; admins get downloadable, compliance-ready reports. Customizable templates and automated distribution.",

        features: [

          "Digital payslips",

          "Custom templates",

          "Auto distribution",

          "Compliance reports"

        ],

        automated: "Instant report generation",

        compliant: "Regulatory compliance ready"

      }

    ]

  };



  useEffect(() => {

    const fetchData = async () => {

      try {

        const data = await staticContent.load("payroll");

        setDefaultData(data.coreWorkflow);

      } catch (error) {

        console.error("Failed to load payroll data:", error);

        setDefaultData(staticDefaultData);

      }

    };

    fetchData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // staticDefaultData is a constant defined outside the component, no need to include in deps



  // PRIORITIZE props data over default data for real-time preview

  const displaySteps = useMemo(

    () => (steps.length > 0 ? steps : defaultData?.steps || staticDefaultData.steps),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [steps, defaultData?.steps] // staticDefaultData.steps is a constant defined outside the component

  );

  const displayTitle = title || defaultData?.title || staticDefaultData.title;

  const displayDescription = description || defaultData?.description || staticDefaultData.description;



  // Debug logging for real-time updates

  console.log(" [PayrollStepper] Component received data:", {

    hasPropsData: steps.length > 0,

    propsData: { steps, title, description },

    hasDefaultData: !!defaultData,

    finalData: { displaySteps, displayTitle, displayDescription },

    timestamp: new Date().toISOString(),

  });



  useEffect(() => {

    if (!displaySteps || displaySteps.length === 0) return;



    const interval = setInterval(() => {

      setCurrent((prev) => (prev + 1) % displaySteps.length);

    }, 4000);

    return () => clearInterval(interval);

  }, [displaySteps]);



  // Early return if no steps provided

  if (!displaySteps || displaySteps.length === 0) {

    return (

      <div className="w-full">

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">

          <p className="text-yellow-800">

            No workflow steps available to display.

          </p>

        </div>

      </div>

    );

  }



  return (

    <>


      

      <div className="w-full">

      



        {/* Desktop Stepper */}

        <div className="hidden md:flex mb-12 relative">

          <div className="flex justify-between items-center w-full relative">

            <div className="absolute top-7 left-7 right-7 h-2 bg-gray-200 rounded-full z-0"></div>

            <div

              className="absolute top-7 left-7 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full z-0 transition-all duration-500"

              style={{

                width: `${7 + (current / (displaySteps.length - 1)) * (100 - 14)}%`,

              }}

            ></div>



            {displaySteps.map((step, idx) => (

              <div

                key={idx}

                className="z-10 flex flex-col items-center relative"

              >

                <button

                  onClick={() => setCurrent(idx)}

                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300 border-2 shadow-lg

                  ${

                    idx <= current

                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600"

                      : "bg-white text-gray-500 border-gray-300"

                  }`}

                >

                  {idx + 1}

                </button>

                <span

                  className={`text-sm font-medium max-w-[120px] text-center absolute top-16

                ${

                  idx <= current

                    ? "text-blue-600"

                    : "text-gray-500"

                }`}

                >

                  {step?.title?.split(" ")[0] || `Step ${idx + 1}`}

                </span>

              </div>

            ))}

          </div>

        </div>



        {/* Mobile Stepper */}

        <div className="flex md:hidden mb-8 overflow-x-auto pb-4">

          <div className="flex space-x-3">

            {displaySteps.map((step, idx) => (

              <button

                key={idx}

                onClick={() => setCurrent(idx)}

                className={`flex-shrink-0 px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-300 flex items-center space-x-2

                ${

                  idx === current

                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg"

                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"

                }`}

              >

                <span className="text-xs font-bold">{idx + 1}</span>

                <span>{step?.title?.split(" ")[0] || `Step ${idx + 1}`}</span>

              </button>

            ))}

          </div>

        </div>



        {/* Step Content */}

        <article

          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"

          role="article"

          aria-label={`Payroll step: ${

            displaySteps[current]?.stepTitle ||

            displaySteps[current]?.title ||

            `Step ${current + 1}`

          }`}

        >

          <div className="flex flex-col lg:flex-row gap-8">

            <div className="lg:w-1/2">

              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">

                {displaySteps[current]?.stepTitle ||

                  displaySteps[current]?.title ||

                  `Step ${current + 1}`}

              </h3>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">

                {displaySteps[current]?.stepDescription ||

                  displaySteps[current]?.description ||

                  "No description available."}

              </p>



              {displaySteps[current]?.features &&

                Array.isArray(displaySteps[current].features) &&

                displaySteps[current].features.length > 0 && (

                  <div className="mb-6">

                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">

                      Key Features

                    </h4>

                    <div className="space-y-3">

                      {displaySteps[current].features.map((detail, idx) => (

                        <div

                          key={idx}

                          className="flex items-center text-gray-700"

                        >

                          <svg

                            className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0"

                            fill="none"

                            stroke="currentColor"

                            viewBox="0 0 24 24"

                          >

                            <path

                              strokeLinecap="round"

                              strokeLinejoin="round"

                              strokeWidth={2}

                              d="M5 13l4 4L19 7"

                            />

                          </svg>

                          <span>{detail}</span>

                        </div>

                      ))}

                    </div>

                  </div>

                )}

            </div>



            <div className="lg:w-1/2">

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">

                    <div className="flex items-center text-blue-600 mb-2">

                      <svg

                        className="w-5 h-5 mr-2"

                        fill="none"

                        stroke="currentColor"

                        viewBox="0 0 24 24"

                      >

                        <path

                          strokeLinecap="round"

                          strokeLinejoin="round"

                          strokeWidth={2}

                          d="M13 10V3L4 14h7v7l9-11h-7z"

                        />

                      </svg>

                      <span className="font-medium">{displaySteps[current]?.automatedLabel || "Automated"}</span>

                    </div>

                    <p className="text-sm text-gray-600">

                      {displaySteps[current]?.automated ||

                        "Reduces manual work by 80%"}

                    </p>

                  </div>



                  <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">

                    <div className="flex items-center text-green-700 mb-2">

                      <svg

                        className="w-5 h-5 mr-2"

                        fill="none"

                        stroke="currentColor"

                        viewBox="0 0 24 24"

                      >

                        <path

                          strokeLinecap="round"

                          strokeLinejoin="round"

                          strokeWidth={2}

                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"

                        />

                      </svg>

                      <span className="font-medium">{displaySteps[current]?.compliantLabel || "Compliant"}</span>

                    </div>

                    <p className="text-sm text-gray-600">

                      {displaySteps[current]?.compliant ||

                        "Built-in regulatory compliance"}

                    </p>

                  </div>

                </div>



                {/* Navigation controls */}

                <div className="flex justify-center mt-6 space-x-4">

                  <button

                    onClick={() => setCurrent((prev) => Math.max(0, prev - 1))}

                    disabled={current === 0}

                    className={`flex items-center px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${

                      current === 0

                        ? "text-gray-400 border-gray-300 cursor-not-allowed"

                        : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"

                    }`}

                  >

                    <svg

                      className="w-4 h-4 mr-2"

                      fill="none"

                      stroke="currentColor"

                      viewBox="0 0 24 24"

                    >

                      <path

                        strokeLinecap="round"

                        strokeLinejoin="round"

                        strokeWidth={2}

                        d="M15 19l-7-7 7-7"

                      />

                    </svg>

                    Previous

                  </button>

                  

                  <span className="flex items-center px-3 sm:px-4 text-sm text-gray-500 font-medium whitespace-nowrap" aria-live="polite">

                    {current + 1} of {displaySteps.length}

                  </span>

                  

                  <button

                    onClick={() =>

                      setCurrent((prev) => Math.min(displaySteps.length - 1, prev + 1))

                    }

                    disabled={current === displaySteps.length - 1}

                    className={`flex items-center px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${

                      current === displaySteps.length - 1

                        ? "text-gray-400 border-gray-300 cursor-not-allowed"

                        : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"

                    }`}

                  >

                    Next

                    <svg

                      className="w-4 h-4 ml-2"

                      fill="none"

                      stroke="currentColor"

                      viewBox="0 0 24 24"

                    >

                      <path

                        strokeLinecap="round"

                        strokeLinejoin="round"

                        strokeWidth={2}

                        d="M9 5l7 7-7 7"

                      />

                    </svg>

                  </button>

                </div>

              </div>

            </div>

          </div>

        </article>

      </div>

    </>

  );

};



export default PayrollStepper;
