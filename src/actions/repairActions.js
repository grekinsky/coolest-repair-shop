// Repair actions

const repairActions = {
  changeState: (id, action) =>
    async (dispatch, getState, getFirebase) => {
      const firebase = getFirebase();
      const actionStatus = {
        assign: 'assigned',
        complete: 'done',
        incomplete: 'incomplete',
        approve: 'approved',
        reject: 'rejected',
      };
      try {
        await firebase.update(`repairs/${id}`, {
          status: actionStatus[action],
        });
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
  assign: (repairId, user, date) =>
    async (dispatch, getState, getFirebase) => {
      const firebase = getFirebase();
      try {
        await firebase.update(`repairs/${repairId}`, {
          status: 'assigned',
          user,
        });
        await firebase.update(`assignments/${user}/${repairId}`, {
          date,
        });
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
  complete: id =>
    async (dispatch) => {
      try {
        dispatch(await repairActions.changeState(id, 'complete'));
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
  incomplete: id =>
    async (dispatch) => {
      try {
        dispatch(await repairActions.changeState(id, 'incomplete'));
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
  approve: id =>
    async (dispatch) => {
      try {
        dispatch(await repairActions.changeState(id, 'approve'));
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
  reject: id =>
    async (dispatch) => {
      try {
        dispatch(await repairActions.changeState(id, 'reject'));
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
  add: description =>
    async (dispatch, getState, getFirebase) => {
      const firebase = getFirebase();
      try {
        console.log('paso aqui'); // eslint-disable-line
        await firebase.push('repairs', {
          description,
          status: 'created',
          timestamp: firebase.database.ServerValue.TIMESTAMP,
        });
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
};

export default repairActions;
