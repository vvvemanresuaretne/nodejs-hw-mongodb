export async function addContact(req, res, next) {
  try {
    const { name, phoneNumber, email, isFavourite = false, contactType } = req.body;

    if (!name) {
      throw createError(400, 'Missing required field: name');
    }
    if (!phoneNumber) {
      throw createError(400, 'Missing required field: phoneNumber');
    }
    if (!contactType) {
      throw createError(400, 'Missing required field: contactType');
    }

    const newContact = await createContact({ name, phoneNumber, email, isFavourite, contactType });

 
    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
}
