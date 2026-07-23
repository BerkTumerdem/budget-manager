const messages = {
  en: {
    invalidCredentials: "Invalid email or password",
    userExists: "User already exists",
    userCreated: "User created successfully",
    serverError: "Server error",
    requiredFields: "All fields are required",
    passwordTooShort: "Password must be at least 6 characters",
    invalidEmail: "Please enter a valid email",
    notFound: "Resource not found",
    noToken: "No token, authorization denied",
    invalidToken: "Token is not valid",
    categoryExists: "Category already exists",
    categoryAdded: "Category added successfully",
    categoryDeleted: "Category deleted",
    categoryUpdated: "Category updated",
    expenseDeleted: "Transaction deleted",
    expenseUpdated: "Transaction updated",
    savingsGoalSaved: "Savings goal saved",
  },
  ro: {
    invalidCredentials: "Email sau parolă incorectă",
    userExists: "Utilizatorul există deja",
    userCreated: "Utilizator creat cu succes",
    serverError: "Eroare de server",
    requiredFields: "Toate câmpurile sunt obligatorii",
    passwordTooShort: "Parola trebuie să aibă cel puțin 6 caractere",
    invalidEmail: "Introdu un email valid",
    notFound: "Resursa nu a fost găsită",
    noToken: "Lipsă token, acces refuzat",
    invalidToken: "Token invalid",
    categoryExists: "Categoria există deja",
    categoryAdded: "Categoria a fost adăugată",
    categoryDeleted: "Categoria a fost ștearsă",
    categoryUpdated: "Categoria a fost actualizată",
    expenseDeleted: "Tranzacția a fost ștearsă",
    expenseUpdated: "Tranzacția a fost actualizată",
    savingsGoalSaved: "Ținta de economii a fost salvată",
  },
};

const normalizeLang = (lang) => {
  if (!lang) return "en";
  const code = String(lang).split(",")[0].trim().slice(0, 2).toLowerCase();
  return code === "ro" ? "ro" : "en";
};

const getMessage = (lang, key) => {
  const normalized = normalizeLang(lang);
  return messages[normalized]?.[key] || messages.en[key] || "Unknown error";
};

module.exports = getMessage;
module.exports.normalizeLang = normalizeLang;
