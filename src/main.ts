import { NestFactory } from "@nestjs/core";
import { swaggerConfig } from "./internal/application/configs/swagger.config";
import { SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { env } from "./internal/application/configs/env";
import helmet from "helmet";
import { NextFunction, Request, Response } from "express";

async function bootstrap() {
  console.time("Start app");

  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  // Remove o cabeçalho "X-Powered-By"
  app.use(helmet.hidePoweredBy());

  // Remove completamente o cabeçalho "Server"
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.removeHeader("Server");
    next();
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("/", app, document);

  await app.listen(env.port);

  console.timeEnd("Start app");
}
bootstrap();
