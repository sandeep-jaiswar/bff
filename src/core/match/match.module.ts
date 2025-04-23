import { Global, Module } from '@nestjs/common';
import { MatchService } from './match.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
