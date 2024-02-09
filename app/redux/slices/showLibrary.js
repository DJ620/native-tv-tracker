import { createSlice } from "@reduxjs/toolkit";

const showLibrarySlice = createSlice({
    name: "show",
    initialState: [],
    reducers: {
        addLibrary: (state, action) => {
            return state = action.payload;
        }
    }
});

export const { addLibrary } = showLibrarySlice.actions;

export default showLibrarySlice.reducer;