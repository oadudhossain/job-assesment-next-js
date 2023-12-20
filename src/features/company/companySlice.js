import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 1,
  data: JSON.parse(localStorage.getItem("items")) ?? [],
  lastPage: 1,
};

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    getCompanyData: (state, payload) => {
      state.data = payload.payload.companys.data;
      state.lastPage = payload.payload.companys.last_page;
      console.log("payload", payload);
      localStorage.setItem("items", JSON.stringify(state.data));
    },

    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount, getCompanyData } =
  companySlice.actions;

export default companySlice.reducer;
