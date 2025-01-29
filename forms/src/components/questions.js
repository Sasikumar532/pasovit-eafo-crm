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
        {
          id: "gender",
          question: "7. Gender",
          type: "radio",
          options: ["Male", "Female", "Other"], // New question
        },
      ],
    },
  ],
  page2: [
    {
      section: "2. COURSE SELECTION & FILE UPLOADS",
      questions: [
        {
          id: "courseSelection",
          question: "8. Please select the course you want to attend:",
          type: "radio",
          options: ["Course A", "Course B", "Course C"],
        },
        {
          id: "accommodation",
          question: "9. Do you require accommodation?",
          type: "radio",
          options: ["With Accommodation", "Without Accommodation"],
        },
        {
          id: "submitAbstract",
          question: "10. Do you want to submit an abstract?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          id: "abstractFile",
          question: "11. Upload your abstract (only if 'Yes' to submitting an abstract):",
          type: "file",
          condition: (answers) => answers.submitAbstract === "Yes", // Only show if "Yes" is selected for submitAbstract
        },
        {
          id: "additionalFile",
          question: "12. Upload any additional supporting documents:",
          type: "file", // New file upload question
        },
      ],
    },
  ],
  page3: [
    {
      section: "3. FINAL DETAILS",
      questions: [
        {
          id: "couponCode",
          question: "13. Do you have a coupon code?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          id: "couponCodeInput",
          question: "14. Enter your coupon code:",
          type: "text",
          condition: (answers) => answers.couponCode === "Yes", // Only show if "Yes" is selected for couponCode
        },
        {
          id: "termsAndConditions",
          question: "15. Accept the terms and conditions",
          type: "checkbox", // New checkbox for terms and conditions
        },
      ],
    },
  ],
};
