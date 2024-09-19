import { useState, useEffect } from "react";
import "./DashHeader.css"; // Importation du fichier CSS

const Header = ({ user, bankAccounts, onAccountChange }) => {
  const [selectedAccount, setSelectedAccount] = useState("");

  // Cette fonction se déclenche uniquement si aucun compte n'est encore sélectionné.
  useEffect(() => {
    if (bankAccounts.length > 0 && selectedAccount === "") {
      setSelectedAccount(bankAccounts[0].id);
      onAccountChange(bankAccounts[0].id);
    }
  }, [bankAccounts, onAccountChange, selectedAccount]);

  const handleAccountChange = (event) => {
    setSelectedAccount(event.target.value);
    onAccountChange(event.target.value);
  };

  return (
    <header className="dashheader">
      <h1 className="greeting">
        Bonjour, {user.firstName} {user.lastName} !
      </h1>
      <div className="account-select">
        <select
          id="bank-account"
          value={selectedAccount}
          onChange={handleAccountChange}
          className="select"
        >
          {bankAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default Header;
