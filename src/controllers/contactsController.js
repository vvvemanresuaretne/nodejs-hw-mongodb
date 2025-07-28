import { getAllContacts, getContactById } from '../services/contacts.js';
import { patchContact } from '../controllers/contacts.js';

export const getContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,           // query параметр для фільтрації по contactType
      isFavourite,    // query параметр для фільтрації по isFavourite
    } = req.query;

    const result = await getAllContacts({ page, perPage, sortBy, sortOrder, type, isFavourite });

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



export const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
        data: null,
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
