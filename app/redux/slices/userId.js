import { createSlice } from "@reduxjs/toolkit";

const userIdSlice = createSlice({
    name: "userId",
    initialState: [],
    reducers: {
        addUserId: (state, action) => {
            return state = action.payload;
        }
    }
});

export const { addUserId } = userIdSlice.actions;

export default userIdSlice.reducer;