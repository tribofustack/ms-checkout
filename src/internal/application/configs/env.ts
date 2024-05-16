export const env = {
  isTest: process.env.NODE_ENV === 'test',
  port: Number(process.env.PORT || 3002),

  dbHost: String(process.env.DB_HOST),
  dbPort: Number(process.env.DB_PORT),
  dbName: String(process.env.DB_NAME),
  dbUser: String(process.env.DB_USERNAME),
  dbPassword: String(process.env.DB_PASSWORD),
  dbDialect: String(process.env.DB_DIALECT),

  amqpUserName: String(process.env.AMQP_USERNAME),
  amqpPass: String(process.env.AMQP_PASSWORD),
  ampqCookie: String(process.env.AMQP_COOKIE),
  amqpPort: Number(process.env.AMQP_PORT || 5672),
  amqpHost: String(process.env.AMQP_HOST),

  checkinHost: String(process.env.CHECKIN_HOST),
  checkinPort: Number(process.env.CHECKIN_PORT || 3001)
};
