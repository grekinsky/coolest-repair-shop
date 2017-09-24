// User actions

const userActions = {
  add: (displayName, email, password, role) =>
    async (dispatch, getState, getFirebase) => {
      const firebase = getFirebase();
      try {
        await firebase.createUser({
          email,
          password,
        });
        await firebase.updateProfile({
          displayName,
          role,
        });
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
  modify: (displayName, email, password, role) =>
    async (dispatch, getState, getFirebase) => {
      const firebase = getFirebase();
      try {
        await firebase.resetPassword({
          email,
          password,
        });
        await firebase.updateProfile({
          displayName,
          role,
        });
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
  remove: userId =>
    async (dispatch, getState, getFirebase) => {
      const firebase = getFirebase();
      try {
        // Remove related assignments
        await firebase.remove(`assignments/${userId}`);

        // Remove related comments
        const usersRef = firebase.ref('comments');
        await usersRef.once('value', snapshot =>
          snapshot.forEach(repair =>
            repair.forEach((comment) => {
              const userField = comment.child('user');
              if (userField.val() === userId) {
                const cRef = comment.getRef();
                return cRef.remove();
              }
              return false;
            }),
          ),
        );

        // Remove user ref from repairs
        const repairsRef = firebase.ref('repairs');
        await repairsRef.once('value', snapshot =>
          snapshot.forEach((repair) => {
            const userField = repair.child('user');
            if (userField.val() === userId) {
              const rRef = userField.getRef();
              return rRef.remove();
            }
            return false;
          }),
        );

        // Remove user
        await firebase.remove(`users/${userId}`);
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
};

export default userActions;
