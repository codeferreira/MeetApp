import * as Yup from 'yup';
import { Op } from 'sequelize';
import { isBefore, startOfDay, endOfDay, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(request, response) {
    const where = {};
    const page = request.query.page || 1;

    if (request.query.date) {
      const searchDate = parseISO(request.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      include: [User],
      limit: 10,
      offset: 10 * page - 10,
    });

    return response.json(meetups);
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      file_id: Yup.number().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    if (isBefore(parseISO(request.body.date), new Date())) {
      return response.status(400).json({ error: 'Meetup date invalid' });
    }

    const user_id = request.userId;

    const meetup = await Meetup.create({
      ...request.body,
      user_id,
    });

    return response.json(meetup);
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      file_id: Yup.number(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const user_id = request.userId;

    const meetup = await Meetup.findByPk(request.params.id);

    if (meetup.user_id !== user_id) {
      return response.status(401).json({ error: 'Not authorized.' });
    }

    if (isBefore(parseISO(request.body.date), new Date())) {
      return response.status(400).json({ error: 'Meetup date invalid' });
    }

    if (meetup.past) {
      return response.status(400).json({ error: "Can't update past meetups." });
    }

    await meetup.update(request.body);

    return response.json(meetup);
  }

  async delete(request, response) {
    const user_id = request.userId;

    const meetup = await Meetup.findByPk(request.params.id);

    if (meetup.user_id !== user_id) {
      return response.status(401).json({ error: 'Not authorized.' });
    }

    if (meetup.past) {
      return response.status(400).json({ error: "Can't delete past meetups." });
    }

    await meetup.destroy();

    return response.send();
  }
}

export default new MeetupController();
