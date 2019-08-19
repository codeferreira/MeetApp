import User from '../models/User';

class UserController {
  async store(request, response) {
    const userExists = await User.findOne({
      where: { email: request.body.email },
    });
    if (userExists) {
      return response.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email } = await User.create(request.body);

    return response.json({
      id,
      name,
      email,
    });
  }

  async update(request, response) {
    const { email, oldPassword } = request.body;

    const user = await User.findByPk(request.headers.userId);

    if (email !== user.email) {
      const emailInUse = await User.findOne({ where: { email } });

      if (emailInUse) {
        return response.status(400).json({ error: 'Email already in use.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return response.status(401).json({ error: 'Password incorrect.' });
    }

    const { id, name, provider } = await user.update(request.body);

    return response.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
