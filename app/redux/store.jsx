import { configureStore } from "@reduxjs/toolkit";
import showLibraryReducer from "./slices/showLibrary";
import userIdReducer from "./slices/userId";

const store = configureStore({
    reducer: {
        showLibrary: showLibraryReducer,
        userId: userIdReducer
    }
});

export default store;