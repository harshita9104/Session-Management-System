class SessionService {
  static async createSession(userId = null) {
    const session = new Session({
      userId,
      isGuest: !userId,
    });
    await session.save();
    return session;
  }

  static async logPageVisit(sessionId, page) {
    const session = await Session.findById(sessionId);
    if (!session) throw new Error("Session not found");

    session.pageVisits.push({ page });
    session.lastActivity = new Date();
    await session.save();
    return session;
  }

  static async getSessionDetails(sessionId, page = 1, limit = 10) {
    const session = await Session.findById(sessionId).populate(
      "userId",
      "email preferences"
    );

    if (!session) throw new Error("Session not found");

    const startIdx = (page - 1) * limit;
    const paginatedVisits = session.pageVisits.slice(
      startIdx,
      startIdx + limit
    );

    return {
      startTime: session.startTime,
      duration: new Date() - session.startTime,
      pageVisits: paginatedVisits,
      totalPages: Math.ceil(session.pageVisits.length / limit),
      currentPage: page,
    };
  }
}

module.exports = SessionService;
