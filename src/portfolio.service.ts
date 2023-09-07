import { Injectable, BadRequestException } from '@nestjs/common';
import { AddTradeDto, PortfolioDto, SecurityDto, TradeDto } from './portfolio.dto';

@Injectable()
export class PortfolioService {
  private portfolio: PortfolioDto = {
    securities: [],
    trades: [],
  };

  addTrade(addTradeDto: AddTradeDto): { message: string } {
    // Create a new SecurityDto object
    const trade: TradeDto = {
      ticker: addTradeDto.ticker,
      qty: addTradeDto.qty,
      type: addTradeDto.type,
      success: false, // Initialize with failure status
    };
    let t = addTradeDto.type;
    if (t === 'Sell') {
      let ticker = addTradeDto.ticker;
      for (const security of this.portfolio.securities) {
        if (security.ticker === ticker) {
          if (addTradeDto.qty <= security.shares) {
            security.shares -= addTradeDto.qty;
            trade.success = true;
            this.portfolio.trades.push(trade);
            return { message: 'Transaction successful' };
          } 
          else {
            this.portfolio.trades.push(trade);
            throw new BadRequestException('Not enough shares to sell');
          }
        }
      }
    } else {
      let flag = false;
      let ticker = addTradeDto.ticker;
      for (const security of this.portfolio.securities) {
        if (security.ticker === ticker) {
          flag = true;
          let qty_present = security.shares;
          security.avgBuyPrice =
            ((qty_present * security.avgBuyPrice) +
              addTradeDto.qty * addTradeDto.price) /
            (qty_present + addTradeDto.qty);
          security.shares += addTradeDto.qty;
          trade.success = true;
          this.portfolio.trades.push(trade);
          return { message: 'Transaction successful' };
        }
      }
      if (!flag) {
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
    this.portfolio.trades.push(trade);
    throw new BadRequestException('Invalid trade request');
  }

  getPortfolio(): PortfolioDto {
    return this.portfolio;
  }
}
