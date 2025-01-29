export const questionsByPage = {
    page1: [
      {
        section: "1. BASIC DETAILS",
        questions: [
          { id: "fullName", question: "1. Full Name", type: "text" },
          { id: "email", question: "2. Email", type: "email" },
          { id: "phoneNumber", question: "3. Phone Number", type: "tel" },
          { id: "dateOfBirth", question: "4. Date of Birth", type: "date" },
          { id: "city", question: "5. City", type: "text" },
          { id: "country", question: "6. Country", type: "text" },
        ],
      },
      {
        section: "2. COURSE SELECTION",
        questions: [
          {
            id: "courseSelection",
            question: "7. Please select the course you want to attend:",
            type: "radio",
            options: ["Course A", "Course B", "Course C"],
          },
          {
            id: "accommodation",
            question: "8. Do you require accommodation?",
            type: "radio",
            options: ["With Accommodation", "Without Accommodation"],
          },
          {
            id: "submitAbstract",
            question: "9. Do you want to submit an abstract?",
            type: "radio",
            options: ["Yes", "No"],
          },
          {
            id: "abstractFile",
            question: "10. Upload your abstract (only if 'Yes' to submitting an abstract):",
            type: "file",
            condition: (answers) => answers.submitAbstract === "Yes", // Only show if "Yes" is selected for submitAbstract
          },
          {
            id: "couponCode",
            question: "11. Do you have a coupon code?",
            type: "radio",
            options: ["Yes", "No"],
          },
          {
            id: "couponCodeInput",
            question: "12. Enter your coupon code:",
            type: "text",
            condition: (answers) => answers.couponCode === "Yes", // Only show if "Yes" is selected for couponCode
          },
        ],
      },
    ],
  };
  