const messages = {
  en: {
    invalidCredentials: "Invalid email or password",
    userExists: "User already exists",
    userCreated: "User created successfully",
    serverError: "Server error",
    requiredFields: "All fields are required",
    categoryExists: "Category already exists",
    categoryAdded: "Category added successfully"
  },
  ro: {
    invalidCredentials: "Email sau parolă incorectă",
    userExists: "Utilizatorul există deja",
    userCreated: "Utilizator creat cu succes",
    serverError: "Eroare de server",
    requiredFields: "Toate câmpurile sunt obligatorii",
    categoryExists: "Categoria există deja",
    categoryAdded: "Categoria a fost adăugată"
  }
};

const getMessage = (lang, key) => {
  return messages[lang]?.[key] || messages.en[key] || "Unknown error";
};

module.exports = getMessage;
