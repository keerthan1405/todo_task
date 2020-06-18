import { TASK_LIST } from '../actions/actionTypes';
import { updateObject } from '../utility';

let initialState = {
  taskList: [],
}

const taskListArray = (state, action) => {
  return updateObject(state, { taskList: action.taskList });
}

// const updateLifeEvent = (state, action) => {
//   return updateObject(state, { customerLifeEvents: action.customerLifeEvents });
// }

const userAccountReducer = (state = initialState, action) => {
  switch (action.type) {
    case TASK_LIST: return taskListArray(state, action)
    // case MANAGE_USER_INFO: return updateUserInfo(state, action)
    // // case SAVE_ACCOUNT_INFO:
    // case MANAGE_HOUSE_HOLD_INFO: return updateHouseHoldInfo(state, action)
    // case MANAGE_LIFE_EVENTS: return updateLifeEvents(state, action)
    // case APR_INTEREST: return updateAPRInterest(state, action)
    // case SAVE_LIFE_EVENT: return updateLifeEvent(state, action)
    default:
      return state;
  }
};

export default userAccountReducer;


