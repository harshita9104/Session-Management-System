class PreferencesService {
  static setCookiePreferences(res, preferences) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    };

    res.cookie("userPreferences", JSON.stringify(preferences), cookieOptions);
  }

  static async savePreferences(user, preferences) {
    user.preferences = { ...user.preferences, ...preferences };
    await user.save();
    return user.preferences;
  }
}

module.exports = PreferencesService;
