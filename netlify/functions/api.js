import express, { Router } from "express";
import serverless from "serverless-http";
import bodyParser from "body-parser";
import cors from "cors";

const TAX_BRACKETS = {
  2019: [
    { min: 0, max: 47630, rate: 0.15 },
    { min: 47630, max: 95259, rate: 0.205 },
    { min: 95259, max: 147667, rate: 0.26 },
    { min: 147667, max: 210371, rate: 0.29 },
    { min: 210371, rate: 0.33 },
  ],
  2020: [
    { min: 0, max: 48535, rate: 0.15 },
    { min: 48535, max: 97069, rate: 0.205 },
    { min: 97069, max: 150473, rate: 0.26 },
    { min: 150473, max: 214368, rate: 0.29 },
    { min: 214368, rate: 0.33 },
  ],
  2021: [
    { min: 0, max: 49020, rate: 0.15 },
    { min: 49020, max: 98040, rate: 0.205 },
    { min: 98040, max: 151978, rate: 0.26 },
    { min: 151978, max: 216511, rate: 0.29 },
    { min: 216511, rate: 0.33 },
  ],
  2022: [
    { min: 0, max: 50197, rate: 0.15 },
    { min: 50197, max: 100392, rate: 0.205 },
    { min: 100392, max: 155625, rate: 0.26 },
    { min: 155625, max: 221708, rate: 0.29 },
    { min: 221708, rate: 0.33 },
  ],
  2023: [
    { min: 0, max: 53359, rate: 0.15 },
    { min: 53359, max: 106717, rate: 0.205 },
    { min: 106717, max: 165430, rate: 0.26 },
    { min: 165430, max: 235675, rate: 0.29 },
    { min: 235675, rate: 0.33 },
  ],
};

const delayOneSec = () => {
  return new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
};

const getUnreliableBrackets = async (taxYear) => {
  await delayOneSec();

  // Simulate "evil" random failure
  if (Math.floor(Math.random() * 4) + 1 === 3) {
    throw new Error("Something is wrong when getting tax bracket");
  }

  // Retrieve tax brackets for the requested year
  const brackets = TAX_BRACKETS[taxYear];
  if (!brackets) {
    throw new Error(`Tax brackets for year ${taxYear} not found.`);
  }

  return brackets;
};

const api = express();
api.use(bodyParser.json());

api.use(
  cors({
    origin: true,
  })
);

const router = Router();

router.get("/tax-calculator/tax-year/:tax_year", async (req, res) => {
  const { tax_year } = req.params;

  try {
    const taxBrackets = await getUnreliableBrackets(tax_year);
    res.json({ tax_brackets: taxBrackets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

api.use("/api/", router);

export const handler = serverless(api);
