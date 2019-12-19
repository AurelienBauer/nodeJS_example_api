class UserModel {
  static async getUserByEmail(userEmail) {
    return {
      id: 'an_id',
      email: userEmail,
    };
  }
}

export default UserModel;
