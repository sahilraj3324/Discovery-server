import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    if (this.connection.readyState === 1) {
      this.logger.log('Successfully connected to MongoDB');
    }
    
    this.connection.on('connected', () => {
      this.logger.log('Successfully connected to MongoDB');
    });

    this.connection.on('error', (err) => {
      this.logger.error(`MongoDB connection error: ${err}`);
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('Disconnected from MongoDB');
    });
  }
}
