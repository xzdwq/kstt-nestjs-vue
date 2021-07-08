export default (): object => ({
  app: {
    title: 'kstt'
  },
  port: +process.env.PORT,
  database: {
    ms_kstt: {
      type:     process.env.DB_MS_KSTT_TYPE,
      host:     process.env.DB_MS_KSTT_HOST,
      port:     +process.env.DB_MS_KSTT_PORT,
      username: process.env.DB_MS_KSTT_USERNAME,
      password: process.env.DB_MS_KSTT_PASSWORD,
      database: process.env.DB_MS_KSTT_DB
    }
  }
});