import pino from 'pino';

export default pino({
  level: !process.env.NODE_ENV ? 'info' : 'debug',
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    error: pino.stdSerializers.err,
    message: (err) => {
      if (err instanceof Error) {
        return err.message;
      }

      return err;
    }
  }
});
