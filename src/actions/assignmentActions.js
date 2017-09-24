// Assignment actions

const assignmentActions = {
  isDateAvailable: date =>
    async (dispatch, getState, getFirebase) => {
      const firebase = getFirebase();
      try {
        const repairsRef = firebase.ref('assignments');
        let res = false;
        await repairsRef.once('value', (snapshot) => {
          res = !snapshot.forEach(user =>
            user.forEach(repair =>
              repair.child('date').val() === date));
        });
        if (!res) throw new Error('This date is unavailable');
        return true;
      } catch (e) {
        throw new Error(e);
      }
    },
};

export default assignmentActions;
