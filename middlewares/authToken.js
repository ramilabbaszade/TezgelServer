import jwt from 'jsonwebtoken';


async function authToken(req, res, next) {
  const header = req.headers?.authorization;
  if (header !== 'Bearer null' && req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      const decodedToken = jwt.verify(idToken, process.env.SECRET_KEY);
      req['currentUser'] = decodedToken;
    } catch (err) {
      console.log(err.message)
    }
  }
  next();
}

export default authToken;
