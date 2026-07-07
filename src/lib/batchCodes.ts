/**
 * Static batch-code lookup for the Batch Code Checker tool.
 *
 * IMPORTANT: This is a DEMO / EDUCATIONAL lookup using ILLUSTRATIVE codes,
 * not an official manufacturer database. It must NOT be relied on as proof
 * of authenticity. The component renders a visible disclaimer to this effect.
 *
 * The data below is fabricated for demonstration of the tool's interface
 * and logic. Real batch codes vary by brand, factory, and era, and only
 * the brand itself can verify authenticity.
 */
export interface BatchCodeEntry {
  /** The brand slug this code format applies to (matches brandsData.ts). */
  brandSlug: string;
  brandName: string;
  /** Human-readable format description. */
  format: string;
  /** Example code matching the format. */
  exampleCode: string;
  /** How to read the date from the code. */
  dateLogic: string;
  /** A few illustrative codes + their (fabricated) decoded dates. */
  samples: { code: string; decodedDate: string; factory: string }[];
}

export const batchCodeDatabase: BatchCodeEntry[] = [
  {
    brandSlug: "chanel",
    brandName: "Chanel",
    format: "4-digit code: first digit = year, remaining 3 = day-of-year",
    exampleCode: "2104",
    dateLogic:
      "The first digit is the last digit of the manufacturing year (e.g. '2' = 2022). The remaining three digits are the day-of-year (001–366). Chanel uses a rolling 10-year cycle, so context matters.",
    samples: [
      { code: "2104", decodedDate: "April 14, 2022", factory: "Chanel BEP, France" },
      { code: "9001", decodedDate: "January 1, 2019", factory: "Chanel BEP, France" },
      { code: "3180", decodedDate: "June 29, 2023", factory: "Chanel BEP, France" },
    ],
  },
  {
    brandSlug: "dior",
    brandName: "Dior",
    format: "4-character alphanumeric, open-date format varies by era",
    exampleCode: "9A01",
    dateLogic:
      "Dior uses a rolling code where the first digit is the year and the letter encodes the month (A=Jan, B=Feb, etc.). The last two digits are the day. Post-2020 codes have shifted to a different scheme.",
    samples: [
      { code: "9A01", decodedDate: "January 1, 2019", factory: "Dior, Saint Jean de Braye" },
      { code: "2L15", decodedDate: "December 15, 2022", factory: "Dior, Saint Jean de Braye" },
      { code: "4C30", decodedDate: "March 30, 2024", factory: "Dior, Saint Jean de Braye" },
    ],
  },
  {
    brandSlug: "creed",
    brandName: "Creed",
    format: "4-character alphanumeric (e.g. A19, A20, etc.)",
    exampleCode: "A21",
    dateLogic:
      "Creed's batch format has varied over the years. Recent codes use a letter + two-digit year (A21 = 2021). Earlier codes were longer. Creed does not publicly document the scheme.",
    samples: [
      { code: "A21", decodedDate: "2021 (year only)", factory: "Creed, Paris" },
      { code: "A23", decodedDate: "2023 (year only)", factory: "Creed, Paris" },
      { code: "19A12", decodedDate: "2019 (older format)", factory: "Creed, Paris" },
    ],
  },
  {
    brandSlug: "tom-ford",
    brandName: "Tom Ford",
    format: "5-character code: first char = year, next 3 = day-of-year, last = lot",
    exampleCode: "2117A",
    dateLogic:
      "Tom Ford (Estée Lauder) uses a code where the first digit is the last digit of the year, the next three are the day-of-year, and the trailing letter is the lot identifier.",
    samples: [
      { code: "2117A", decodedDate: "April 27, 2022", factory: "Estée Lauder, Belgium" },
      { code: "9001Z", decodedDate: "January 1, 2019", factory: "Estée Lauder, Belgium" },
      { code: "4220B", decodedDate: "August 7, 2024", factory: "Estée Lauder, Belgium" },
    ],
  },
  {
    brandSlug: "maison-francis-kurkdjian",
    brandName: "Maison Francis Kurkdjian",
    format: "5-character alphanumeric",
    exampleCode: "22A01",
    dateLogic:
      "MFK uses a code where the first two digits are the year and the remaining characters encode the batch. MFK does not publish a public decoder.",
    samples: [
      { code: "22A01", decodedDate: "2022", factory: "MFK, France" },
      { code: "23B14", decodedDate: "2023", factory: "MFK, France" },
      { code: "21C09", decodedDate: "2021", factory: "MFK, France" },
    ],
  },
  {
    brandSlug: "hermes",
    brandName: "Hermès",
    format: "5-character alphanumeric",
    exampleCode: "2A001",
    dateLogic:
      "Hermès uses a code where the first digit is the year and the letter encodes the month. The last three digits are the lot. Hermès does not publicly document the full scheme.",
    samples: [
      { code: "2A001", decodedDate: "January 2022", factory: "Hermès, France" },
      { code: "4L120", decodedDate: "December 2024", factory: "Hermès, France" },
      { code: "3F045", decodedDate: "June 2023", factory: "Hermès, France" },
    ],
  },
  {
    brandSlug: "armaf",
    brandName: "Armaf",
    format: "4-digit code + batch letter",
    exampleCode: "2204A",
    dateLogic:
      "Armaf (Sterling Parfums, UAE) uses a code where the first two digits are the year and the next two are the month, with a trailing lot letter. Format is less standardized than Western houses.",
    samples: [
      { code: "2204A", decodedDate: "April 2022", factory: "Sterling Parfums, UAE" },
      { code: "2311B", decodedDate: "November 2023", factory: "Sterling Parfums, UAE" },
      { code: "2109C", decodedDate: "September 2021", factory: "Sterling Parfums, UAE" },
    ],
  },
  {
    brandSlug: "parfums-de-marly",
    brandName: "Parfums de Marly",
    format: "5-character alphanumeric",
    exampleCode: "22A04",
    dateLogic:
      "Parfums de Marly uses a code where the first two digits are the year, followed by a month letter and a lot number. The house does not publish an official decoder.",
    samples: [
      { code: "22A04", decodedDate: "January 2022", factory: "PdM, France" },
      { code: "23L09", decodedDate: "December 2023", factory: "PdM, France" },
      { code: "21F12", decodedDate: "June 2021", factory: "PdM, France" },
    ],
  },
];

export function getBatchInfo(brandSlug: string): BatchCodeEntry | undefined {
  return batchCodeDatabase.find((b) => b.brandSlug === brandSlug);
}

/**
 * Attempts to look up a specific code within a brand's sample list.
 * Returns the matching sample, or undefined if the brand or code isn't found.
 * This is purely illustrative — not a real authenticity check.
 */
export function lookupCode(
  brandSlug: string,
  code: string
): { entry: BatchCodeEntry; sample: BatchCodeEntry["samples"][number] } | undefined {
  const entry = getBatchInfo(brandSlug);
  if (!entry) return undefined;
  const normalized = code.trim().toUpperCase();
  const sample = entry.samples.find((s) => s.code.toUpperCase() === normalized);
  if (!sample) return undefined;
  return { entry, sample };
}
