import React from "react";


import PayrollStepper from "./PayrollStepper";



const PayrollWorkflow = ({ workflowData = {} }) => {

  // Static default data for immediate display

  const staticDefaultData = {

    title: "Payroll System Built for All Industries",

    description: "Streamline your entire payroll lifecycle — from onboarding to salary disbursement — with a secure, intuitive platform.",

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



  // اعتمد على البيانات القادمة من props مع fallback للبيانات الافتراضية الثابتة

  const displayData = {

    title: workflowData?.title || staticDefaultData.title,

    description: workflowData?.description || staticDefaultData.description,

    steps: workflowData?.steps?.length > 0 ? workflowData.steps : staticDefaultData.steps,

  };



  // Debug logging for real-time updates

  console.log(" [PayrollWorkflow] Component received data:", {

    hasPropsData: !!(workflowData && Object.keys(workflowData).length > 0),

    propsData: workflowData,

    finalData: displayData,

    timestamp: new Date().toISOString(),

  });



  return (

    <>


      

      <section className="py-20 bg-white light-section">

        <div className="container mx-auto px-6 max-w-6xl">

          <div className="text-center max-w-3xl mx-auto mb-16">

            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">

              {displayData.title}

            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">

              {displayData.description}

            </p>

          </div>

          

          <PayrollStepper 

            steps={displayData.steps}

            title={displayData.title}

            description={displayData.description}

          />

        </div>

      </section>

    </>

  );

};



export default PayrollWorkflow;
