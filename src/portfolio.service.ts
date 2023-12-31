import { Injectable, BadRequestException } from '@nestjs/common';
import { AddTradeDto, PortfolioDto, SecurityDto, TradeDto } from './portfolio.dto';

@Injectable()
export class PortfolioService {
  private portfolio: PortfolioDto = {
    securities: [],
    trades: [],
  };

  addTrade(addTradeDto: AddTradeDto): { message: string } {
   // Validate the request to ensure it only contains the required properties
   const { purchasingType, ticker, qty, price } = addTradeDto;
    
   if (Object.keys(addTradeDto).length !== 4 || !purchasingType || !ticker || !qty || !price) {
     throw new BadRequestException('Invalid request. Required properties: type, ticker, qty, price');
   }
   if(qty<=0) {
    throw new BadRequestException('Invalid request. inptut qantity in negative');

   }
   // Validate the type to ensure it's either "Buy" or "Sell"
   if (purchasingType !== 'Buy' && purchasingType !== 'Sell') {
     throw new BadRequestException('Invalid trade type. Type must be "Buy" or "Sell"');
   }
    // Create a new SecurityDto object
    const trade: TradeDto = {
      ticker: addTradeDto.ticker,
      qty: addTradeDto.qty,
      type: addTradeDto.purchasingType,
      success: false, // Initialize with failure status
    };
    let type = addTradeDto.purchasingType;
    if (type === 'Sell') {   //if the req is for sell
      let ticker = addTradeDto.ticker;
      for (const security of this.portfolio.securities) {
        if (security.ticker === ticker) {   //if we find the req one already presnet in the database
          if (addTradeDto.qty <= security.shares) { // if the transtion is possible
            security.shares -= addTradeDto.qty;
            trade.success = true;
            this.portfolio.trades.push(trade);
            return { message: 'Transaction successful' };
          } 
          else {
            this.portfolio.trades.push(trade);
            throw new BadRequestException('Not enough shares to sell'); // if the req transation is presnt but the quantity are more
          }
        }
      }
    } else {
      let flag = false; // if it is a buy option
      let ticker = addTradeDto.ticker;
      for (const security of this.portfolio.securities) {
        if (security.ticker === ticker) {   //if we already have some transtion on the req ticker
          flag = true;
          let qty_present = security.shares;
          security.avgBuyPrice =                         // calculating the new avg price
            ((qty_present * security.avgBuyPrice) +
              addTradeDto.qty * addTradeDto.price) /
            (qty_present + addTradeDto.qty);
          security.shares += addTradeDto.qty;
          trade.success = true;
          this.portfolio.trades.push(trade);
          return { message: 'Transaction successful' };
        }
      }
      if (!flag) {                        // if no req have been made for this ticker before
        const newSecurity: SecurityDto = {
          ticker: addTradeDto.ticker,
          avgBuyPrice: addTradeDto.price, // Assuming the initial avgBuyPrice is the trade price
          shares: addTradeDto.qty,
        };
        trade.success = true;
        this.portfolio.trades.push(trade);
        this.portfolio.securities.push(newSecurity);
        return { message: 'Transaction successful' };
      }
    }
    this.portfolio.trades.push(trade);        // request for sell of a ticker which has never been bought
    throw new BadRequestException('Invalid trade request');
  }

  getPortfolio(): PortfolioDto {
    return this.portfolio;
  }
}
