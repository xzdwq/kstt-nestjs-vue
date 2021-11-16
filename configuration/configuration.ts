const MODE = process.env.NODE_ENV;

export default (): object => ({
  mode: MODE,
  port: +process.env.PORT,
  session_secret_key: process.env.SESSION_SECRET_KEY,
  session_age: process.env.SESSION_AGE,
  databus_code: process.env.DATABUS_CODE,
  databus_url: process.env.DATABUS_URL,
  database: {
    ms_kstt: {
      type:     process.env.DB_MS_KSTT_TYPE,
      host:     process.env.DB_MS_KSTT_HOST,
      port:     +process.env.DB_MS_KSTT_PORT,
      username: process.env.DB_MS_KSTT_USERNAME,
      password: process.env.DB_MS_KSTT_PASSWORD,
      database: process.env.DB_MS_KSTT_DB
    }
  },
  upload_location: process.env.UPLOAD_LOCATION,
  email_from: process.env.EMAIL_FROM,
  log_file_path: process.env.LOG_FILE_PATH,
  log_file_max_size: process.env.LOG_FILE_MAX_SIZE,
  log_max_files: process.env.LOG_MAX_FILES
});