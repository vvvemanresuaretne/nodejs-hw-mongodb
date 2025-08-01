import { getAllContacts, getContactById } from '../services/contacts.js';
import { patchContact } from '../controllers/contacts.js';

export const getContacts = async (req, res, next) => {
  try {
    const userId = req.user._id; // здесь req.user должен быть установлен middleware аутентификации

    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,
      isFavourite,
    } = req.query;

    const result = await getAllContacts({
      userId,
      page,
      perPage,
      sortBy,
      sortOrder,
      type,
      isFavourite,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: result.data,
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        hasPreviousPage: result.hasPreviousPage,
        hasNextPage: result.hasNextPage,
      },
    });
  } catch (error) {
    next(error);
  }
};
