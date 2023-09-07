import { Controller, Get, Post, Body } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { AddTradeDto,PortfolioDto } from './portfolio.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('add-trade')
  addTrade(@Body() addTradeDto: AddTradeDto): { message: string } {
    return this.portfolioService.addTrade(addTradeDto);
  }

  @Get()
  getPortfolio(): PortfolioDto {
    return this.portfolioService.getPortfolio();
  }
}
