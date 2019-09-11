import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    const validRequestBody = await schema.isValid(request.body);

    if (!validRequestBody) {
      return response.status(400).json({ error: 'Data validation fail.' });
    }

    const { email, password } = request.body;
    const { secret, expiresIn } = authConfig;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return response.status(400).json({ error: 'User does not exists.' });
    }

    const correctPassword = await user.checkPassword(password);

    if (!correctPassword) {
      return response.status(400).json({ error: 'Password incorrect.' });
    }

    const { id, name } = user;
    const token = jwt.sign({ id }, secret, {
      expiresIn,
    });

    return response.json({
      user: {
        id,
        name,
        email,
      },
      token,
    });
  }
}

export default new SessionController();
