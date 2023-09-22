const fs = require("fs").promises;
require("colors");
const { nanoid } = require("nanoid");

const path = require("path");

const contactsPath = path.join("models", "contacts.json");

const listContacts = async () => {
  try {
    const jsonReadResult = await fs.readFile(contactsPath);
    const contacts = JSON.parse(jsonReadResult);

    return contacts;
  } catch (error) {
    console.log(error.message.red);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contactById = contacts.find((contact) => contact.id === contactId);

    if (!contactById) {
      return null;
    }

    return contactById;
  } catch (error) {
    console.log(error.message.red);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    // const contact = contacts.find((contact) => String(contact.id) === id);
    const contact = contacts.find((contact) => contact.id === contactId);

    if (contact) {
      const contactUdpate = contacts.filter(
        (contact) => contact.id !== contactId
      );
      await fs.writeFile(
        contactsPath,
        JSON.stringify(contactUdpate, null, " ")
      );

      return contact;
    } else {
      return console.log("Not found");
    }
  } catch (error) {
    console.log(error.message.red);
  }
};

const addContact = async (body) => {
  try {
    const addNewContact = {
      id: nanoid(),
      ...body,
    };

    const contacts = await listContacts();
    contacts.push(addNewContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, " "));
    console.log(`The contact is added in ${contactsPath}`.yellow);

    return addNewContact;
  } catch (error) {
    console.log(error.message.red);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    const updateContact = contacts.find((contact) => contact.id === contactId);

    if (updateContact) {
      const index = contacts.indexOf(updateContact);
      contacts[index] = { ...contacts[index], ...body };
      await fs.writeFile(contactsPath, JSON.stringify(contacts, null, " "));

      return contacts[index];
    } else {
      return null;
    }
  } catch (error) {}
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
