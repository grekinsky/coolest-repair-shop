// Repair actions

const repairActions = {
  setState: (id, action) =>
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
  assign: (repairId, user) =>
    async (dispatch, getState, getFirebase) => {
      const firebase = getFirebase();
      try {
        await firebase.update(`repairs/${repairId}`, {
          status: 'assigned',
          user,
        });
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
  complete: id =>
    async (dispatch) => {
      try {
        dispatch(await repairActions.setState(id, 'complete'));
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
  incomplete: id =>
    async (dispatch) => {
      try {
        dispatch(await repairActions.setState(id, 'incomplete'));
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
  approve: id =>
    async (dispatch) => {
      try {
        dispatch(await repairActions.setState(id, 'approve'));
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
  reject: id =>
    async (dispatch) => {
      try {
        dispatch(await repairActions.setState(id, 'reject'));
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    },
};

export default repairActions;
