import { useBankContext } from "../../../context/BankContext";
import "./DashHeader.css"; // Importation du fichier CSS

const Header = ({ user, bankAccounts, onAccountChange }) => {
  const { selectedAccount, setSelectedAccount } = useBankContext();

  const handleAccountChange = (event) => {
    const newAccountId = event.target.value;
    setSelectedAccount(newAccountId);
    onAccountChange(newAccountId);
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
