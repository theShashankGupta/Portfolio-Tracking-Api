export class AddTradeDto {
    type: string; // Buy or Sell
    ticker: string;
    qty: number;
    price: number;
  }
  
  export class SecurityDto {
    ticker: string;
    avgBuyPrice: number;
    shares: number;
  }
  
  export class TradeDto {
    ticker: string;
    qty: number;
    type: string; // Buy or Sell
    success: boolean;
  }

  export class PortfolioDto {
    securities: SecurityDto[]; // An array of SecurityDto
    trades: TradeDto[]; // Array to store buy/sell operations
  }
  