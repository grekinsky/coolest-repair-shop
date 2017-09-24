// Comment actions

const commentActions = {
  add: (repairId, user, comment) =>
    async (dispatch, getState, getFirebase) => {
      const firebase = getFirebase();
      try {
        await firebase.push(`comments/${repairId}`, {
          user,
          comment,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
        });
      } catch (e) {
        throw new Error(e);
      }
    },
};

export default commentActions;
