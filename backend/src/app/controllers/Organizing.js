import Meetup from '../models/Meetup';

class OrganizingController {
  async index(request, response) {
    const meetups = await Meetup.findAll({
      where: { user_id: request.userId },
    });

    return response.json(meetups);
  }
}

export default new OrganizingController();
