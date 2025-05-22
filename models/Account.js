import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

class Account {
  constructor(id, profile_picture, firstname, surname, phone_number, adress, post_number, city, email, password_hash, user_id) {
    this.id = id;
    this.profile_picture = profile_picture;
    this.firstname = firstname;
    this.surname = surname;
    this.phone_number = phone_number;
    this.adress = adress;
    this.post_number = post_number;
    this.city = city;
    this.email = email;
    this.password_hash = password_hash;
    this.user_id = user_id;
  }

  // Skapar ett konto-objekt från inkommande request-data
  static async fromRequest(body) {
    const {
      profile_picture, firstname, surname, phone_number,
      adress, post_number, city, email, password
    } = body;

    const user_id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);

    return new Account(
      null, // id sätts av databasen
      profile_picture,
      firstname,
      surname,
      phone_number,
      adress,
      post_number,
      city,
      email,
      password_hash,
      user_id
    );
  }

  // Jämför lösenord mot det hashede värdet
  async verifyPassword(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password_hash);
  }

    // Returnerar endast säker och publik data för frontend
    toPublic() {
        return {
            firstname: this.firstname,
            surname: this.surname,
            email: this.email,
        };
    }
}

export default Account;
