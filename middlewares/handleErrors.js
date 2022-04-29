import { GeneralError } from '../utils/errors.js';

const handleErrors = async (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: 'error',
      msg: err?.message
    });
  }
  console.log(err)
  return res.status(500).json({
    status: 'error',  
    msg: 'System error'
  });
}

export default handleErrors;
