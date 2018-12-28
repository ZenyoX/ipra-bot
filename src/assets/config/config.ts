process.env.NODE_ENV = 'development';

export default {
  isInProduction: (process.env.NODE_ENV === 'production') ? true : false
}
