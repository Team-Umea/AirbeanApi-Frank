class Account {
    constructor(id,profile_picture, firstname, surname, phone_number, address, post_number, city, email, password_hash, user_id){
        this.id = id;
        this.profile_picture = profile_picture;
        this.firstname = firstname;
        this.surname = surname;
        this.phone_number = phone_number;
        this.address = address;
        this.post_number = post_number;
        this.city = city;
        this.email = email;
        this.password_hash = password_hash;
        this.user_id = user_id;
    }
}