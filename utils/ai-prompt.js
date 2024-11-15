import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const analyzeContract = async (contract, setResults, setLoading) => {
  setLoading(true);

  const prompt = `Your role and goal is to be an AI Smart Contract Auditor. Your job is to perform an audit on the given smart contract. Here is the smart contract:

  ${contract}

  Please provide the results in the following array format for easy front-end display:

  [
    {
      "section": "Audit Report",
      "details": "A detailed audit report of the smart contract, covering security, performance, and any other relevant aspects."
    },
    {
      "section": "Metric Scores",
      "details": [
        {
                "metric": "Security",
                "score": 0-10
              },
              {
                "metric": "Performance",
                "score": 0-10
              },
              {
                "metric": "Other Key Areas",
                "score": 0-10
              },
              {
                "metric": "Gas Efficiency",
                "score": 0-10
              },
              {
                "metric": "Code Quality",
                "score": 0-10
              },
              {
                "metric": "Documentation",
                "score": 0-10
              }
      ]
    },
    {
      "section": "Suggestions for Improvement",
      "details": "Suggestions for improving the smart contract in terms of security, performance, and any other identified weaknesses."
    }
  ]

  Thank you.`;

  try {
    const response = await model.generateContent(prompt);
    let temp = response.response.text();

    const startIndex = temp.indexOf("[");
    const endIndex = temp.lastIndexOf("]");

    const jsonArrayString = temp.substring(startIndex, endIndex + 1);

    // Parse the extracted string into a JavaScript object
    const jsonArray = JSON.parse(jsonArrayString);

    // const auditResults = JSON.parse(response.response.text());
    setResults(jsonArray);
  } catch (error) {
    console.error("Error generating audit results:", error);
    // Handle potential errors gracefully (e.g., display an error message to the user)
  }

  setLoading(false);
};

export const fixIssues = async (
  contract,
  suggestions,
  setContract,
  setLoading
) => {
  setLoading(true);

  const prompt = `Here is the smart contract with the following issues: ${suggestions}. Please provide a fixed version of the contract, considering potential security risks and performance implications:

  ${contract}`;

  try {
    const response = await model.generateContent(prompt);
    const fixedContract = response.response.text().trim();

    // **Optional:** Consider using auditSmartContract (if provided) for more complex fixes
    if (auditSmartContract) {
      const furtherAudit = await auditSmartContract(fixedContract);
      // Handle the further audit results (e.g., update suggestions or display additional warnings)
    }

    setContract(fixedContract);
  } catch (error) {
    console.error("Error generating fixed contract:", error);
    // Handle potential errors gracefully (e.g., display an error message to the user)
  }

  setLoading(false);
};
