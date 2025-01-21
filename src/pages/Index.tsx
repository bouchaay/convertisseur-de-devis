import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search } from "lucide-react";

// Liste complète des devises avec leurs pays
const CURRENCIES = [
  { code: "EUR", name: "Euro (Union Européenne)" },
  { code: "USD", name: "Dollar (États-Unis)" },
  { code: "GBP", name: "Livre (Royaume-Uni)" },
  { code: "JPY", name: "Yen (Japon)" },
  { code: "CHF", name: "Franc (Suisse)" },
  { code: "AUD", name: "Dollar (Australie)" },
  { code: "CAD", name: "Dollar (Canada)" },
  { code: "CNY", name: "Yuan (Chine)" },
  { code: "MAD", name: "Dirham (Maroc)" },
  { code: "DZD", name: "Dinar (Algérie)" },
  { code: "TND", name: "Dinar (Tunisie)" },
  { code: "EGP", name: "Livre (Égypte)" },
  { code: "NGN", name: "Naira (Nigeria)" },
  { code: "ZAR", name: "Rand (Afrique du Sud)" },
  { code: "INR", name: "Roupie (Inde)" },
  { code: "BRL", name: "Real (Brésil)" },
  { code: "MXN", name: "Peso (Mexique)" },
  { code: "AED", name: "Dirham (Émirats Arabes Unis)" },
  { code: "SAR", name: "Riyal (Arabie Saoudite)" },
  { code: "RUB", name: "Rouble (Russie)" },
  { code: "SGD", name: "Dollar (Singapour)" },
  { code: "NZD", name: "Dollar (Nouvelle-Zélande)" },
  { code: "TRY", name: "Lire (Turquie)" },
  { code: "SEK", name: "Couronne (Suède)" },
  { code: "NOK", name: "Couronne (Norvège)" },
  { code: "DKK", name: "Couronne (Danemark)" }
];

const Index = () => {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("EUR");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  const { data: exchangeRate, isLoading } = useQuery({
    queryKey: ["exchangeRate", fromCurrency, toCurrency],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        );
        const data = await response.json();
        return data.rates[toCurrency];
      } catch (error) {
        toast.error("Erreur lors de la récupération des taux de change");
        throw error;
      }
    },
    refetchInterval: 60000,
  });

  const convertedAmount = exchangeRate 
    ? (parseFloat(amount) * exchangeRate).toFixed(2) 
    : "0.00";

  const filteredFromCurrencies = CURRENCIES.filter(
    currency => 
      currency.code.toLowerCase().includes(fromSearch.toLowerCase()) ||
      currency.name.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToCurrencies = CURRENCIES.filter(
    currency => 
      currency.code.toLowerCase().includes(toSearch.toLowerCase()) ||
      currency.name.toLowerCase().includes(toSearch.toLowerCase())
  );

  const handleFromSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setFromSearch(searchValue);
    
    // Sélectionner automatiquement la première devise correspondante
    const matchingCurrencies = CURRENCIES.filter(
      currency =>
        currency.code.toLowerCase().includes(searchValue.toLowerCase()) ||
        currency.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    if (matchingCurrencies.length > 0) {
      setFromCurrency(matchingCurrencies[0].code);
    }
  };

  const handleToSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setToSearch(searchValue);
    
    // Sélectionner automatiquement la première devise correspondante
    const matchingCurrencies = CURRENCIES.filter(
      currency =>
        currency.code.toLowerCase().includes(searchValue.toLowerCase()) ||
        currency.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    if (matchingCurrencies.length > 0) {
      setToCurrency(matchingCurrencies[0].code);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-8 space-y-8 shadow-lg border-t-4 border-t-purple-500">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            Convertisseur de Devises
          </h1>
          <p className="text-sm text-center text-gray-500">
            Taux de change en temps réel
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Montant</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Entrez un montant"
              min="0"
              className="text-lg font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">De</label>
              <div className="space-y-2">
                <div className="relative group">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 transition-colors group-hover:text-purple-500" />
                  <Input
                    type="text"
                    placeholder="Rechercher une devise..."
                    value={fromSearch}
                    onChange={handleFromSearch}
                    className="pl-9 pr-4 transition-all border-gray-200 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400"
                  />
                </div>
                <Select
                  value={fromCurrency}
                  onValueChange={setFromCurrency}
                >
                  <SelectTrigger className="bg-white border-gray-200 hover:border-purple-400 focus:border-purple-500 focus:ring-purple-500 transition-colors">
                    <SelectValue placeholder="Sélectionnez une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredFromCurrencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Vers</label>
              <div className="space-y-2">
                <div className="relative group">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 transition-colors group-hover:text-purple-500" />
                  <Input
                    type="text"
                    placeholder="Rechercher une devise..."
                    value={toSearch}
                    onChange={handleToSearch}
                    className="pl-9 pr-4 transition-all border-gray-200 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400"
                  />
                </div>
                <Select
                  value={toCurrency}
                  onValueChange={setToCurrency}
                >
                  <SelectTrigger className="bg-white border-gray-200 hover:border-purple-400 focus:border-purple-500 focus:ring-purple-500 transition-colors">
                    <SelectValue placeholder="Sélectionnez une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredToCurrencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-inner">
            <h2 className="text-center text-sm font-medium mb-3 text-gray-600">Résultat</h2>
            <p className="text-3xl text-center font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
              {isLoading ? (
                "Chargement..."
              ) : (
                `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`
              )}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;