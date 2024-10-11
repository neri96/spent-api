export enum TransactionType {
  Income = "Income",
  Expense = "Expense",
  Investment = "Investment",
}

export enum IncomeType {
  Salary = "Salary",
  Business = "Business",
  Rent = "Rent",
  Pension = "Pension",
  SocialSecurity = "Social Security Benefits",
  Gift = "Gift",
}

export enum ExpenseType {
  Rent = "Rent",
  Mortgage = "Mortgage",
  Utilities = "Utilities",
  Groceries = "Groceries",
  Transportation = "Transportation",
  Insurance = "Insurance",
  Healthcare = "Healthcare",
  Education = "Education",
  Subscriptions = "Subscriptions",
  DiningOut = "Dining Out",
  Entertainment = "Entertainment",
  Clothing = "Clothing",
  Debt = "Debt",
  Repairs = "Repairs",
  Travel = "Travel",
  Gift = "Gifts",
  Cosmetics = "Cosmetics",
}

export enum InvestmentType {
  Stocks = "Stocks",
  Bonds = "Bonds",
  RealEstate = "Real Estate",
  Cryptocurrency = "Cryptocurrency",
  Other = "Other",
}

export type CategoryType = IncomeType | ExpenseType | InvestmentType;

export type AllorStringArray = "All" | string[];
