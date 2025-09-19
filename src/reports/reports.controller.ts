import { Controller, Post, Body, UseGuards, Param, Patch,Get, Query } from '@nestjs/common';
import { CreateReportDto } from '../dtos/create.report.dto';
import { ReportsService } from './reports.service'
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decoration/current-user.decorator';
import { User } from '../users/user.entity';
import { serialize } from '../interseptors/serialize.interceptor'
import { ReportDto } from '../dtos/report.dto';
import { ApprovedReportDto } from '../dtos/approve.report.dto'
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from '../dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private ReportsService: ReportsService){}

  @Get()
  getEstimate(@Query() query:GetEstimateDto){
    return this.ReportsService.createEstimat(query)
  }

  @Post()
  @UseGuards(AuthGuard)
  @serialize(ReportDto)
  createReport(@Body() body:CreateReportDto, @CurrentUser() user:User){
    return this.ReportsService.create(body,user)
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  changeApprove(@Param('id') id:string, @Body() body:ApprovedReportDto){
   return  this.ReportsService.changeApproval(id,body.approved)
  }
}
