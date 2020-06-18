import { TASK_LIST } from './actionTypes';

export const taskListArray = (task) => {
  return {
    type: TASK_LIST,
    task,
  }
}


// export const createUserAccount = (title, description, imageUrl, price) => {
//   return async dispatch => {
//     // any async code you want!
//     const response = await fetch(
//       'https://rn-complete-guide.firebaseio.com/products.json',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           title,
//           description,
//           imageUrl,
//           price
//         })
//       }
//     );

//     const resData = await response.json();

//     dispatch({
//       type: SAVE_ACCOUNT_INFO,
//       productData: {
//         id: resData.name,
//         title,
//         description,
//         imageUrl,
//         price
//       }
//     });
//   };
// };