import { all, call } from "redux-saga/effects";
import { authSaga } from "./auth/auth.sagas";
// import { categoriesSaga } from "./categories/categories.sagas";
// import { blogsSagas } from "./blogs/blogs.sagas";
// import { innovationsSagas } from "./innovations/innovations.sagas";


export function* rootSaga(){
    yield all([call(authSaga)])
}