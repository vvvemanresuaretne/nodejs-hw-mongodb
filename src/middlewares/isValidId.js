import { Types } from 'mongoose';

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }
  next();
};

export default isValidId;
