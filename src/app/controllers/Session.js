import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(request, response) {
    const { email, password } = request.body;
    const { secret, expiresIn} = authConfig;

    const user = await User.findOne({ where: { email }})

    if(!user) {
      return response.status(400).json({ error: 'User does not exists.' })
    }

    const correctPassword = await user.checkPassword(password)

    if(!correctPassword) {
      return response.status(400).json({ error: 'Password incorrect.' })
    }

    const { id, name } = user;
    const token = jwt.sign({ id }, secret, {
      expiresIn
    })

    return response.json({
      user: {
        id,
        name,
        email
      },
      token
    })
  }
}

export default new SessionController();
